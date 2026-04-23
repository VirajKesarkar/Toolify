import crypto from "crypto";
import express from "express";
import axios from "axios";
import Purchase from "../models/Purchase.js";
import Tool from "../models/Tool.js";
import { authMiddleware } from "../middleware/auth.js";
import User from "../models/User.js";
import PayoutRequest from "../models/PayoutRequest.js";

const router = express.Router();
const RAZORPAY_API_BASE = "https://api.razorpay.com/v1";
const DEFAULT_PLATFORM_FEE_RATE = Number(process.env.PLATFORM_FEE_RATE || 20);

function getRazorpayCredentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay credentials are missing");
  }

  return { keyId, keySecret };
}

router.post("/order", authMiddleware, async (req, res) => {
  try {
    const { toolId } = req.body;

    if (!toolId) {
      return res.status(400).json({ error: "Tool ID is required" });
    }

    const tool = await Tool.findById(toolId);
    if (!tool || !tool.approved) {
      return res.status(404).json({ error: "Tool not found" });
    }

    if (!tool.price || Number(tool.price) <= 0) {
      return res.status(400).json({ error: "This tool does not require payment" });
    }

    const existingPurchase = await Purchase.findOne({
      user: req.user.id,
      tool: tool._id,
      status: "paid",
    });

    if (existingPurchase) {
      return res.json({
        alreadyPurchased: true,
        purchase: existingPurchase,
      });
    }

    const { keyId, keySecret } = getRazorpayCredentials();
    const amountInPaise = Math.round(Number(tool.price) * 100);
const orderResponse = await axios.post(
  `${RAZORPAY_API_BASE}/orders`,
  {
    amount: amountInPaise,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`, 
    notes: {
      toolId: String(tool._id),
      userId: String(req.user.id),
      toolName: tool.name,
    },
  },
  {
    auth: {
      username: keyId,
      password: keySecret,
    },
  }
);

    return res.json({
      keyId,
      order: orderResponse.data,
      tool: {
        id: tool._id,
        name: tool.name,
        description: tool.description,
        price: tool.price,
      },
    });
  } catch (err) {
    console.error("Razorpay order error:", err.response?.data || err.message);
    return res.status(500).json({
      error: err.response?.data?.error?.description || err.message || "Could not create payment order",
    });
  }
});

router.post("/verify", authMiddleware, async (req, res) => {
  try {
    const {
      toolId,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    } = req.body;

    if (!toolId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ error: "Missing payment verification fields" });
    }

    const tool = await Tool.findById(toolId);
    if (!tool || !tool.approved) {
      return res.status(404).json({ error: "Tool not found" });
    }

    const { keySecret } = getRazorpayCredentials();
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ error: "Invalid Razorpay signature" });
    }

    const existingPurchase = await Purchase.findOne({
      user: req.user.id,
      tool: tool._id,
      status: "paid",
    });

    if (existingPurchase) {
      return res.json({
        message: "Payment already verified",
        purchase: existingPurchase,
      });
    }

    const purchase = await Purchase.create({
      user: req.user.id,
      tool: tool._id,
      creator: tool.submittedBy || null,
      price: Number(tool.price),
      currency: "INR",
      platformFeeRate: DEFAULT_PLATFORM_FEE_RATE,
      platformFeeAmount: Number(((Number(tool.price) * DEFAULT_PLATFORM_FEE_RATE) / 100).toFixed(2)),
      creatorEarningsAmount: Number((Number(tool.price) - ((Number(tool.price) * DEFAULT_PLATFORM_FEE_RATE) / 100)).toFixed(2)),
      earningsStatus: "available",
      status: "paid",
      razorpayOrderId,
      razorpayPaymentId,
    });

    return res.status(201).json({
      message: "Payment verified successfully",
      purchase,
    });
  } catch (err) {
    console.error("Razorpay verification error:", err.message);
    return res.status(500).json({ error: "Could not verify payment" });
  }
});

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const purchases = await Purchase.find({
      user: req.user.id,
      status: "paid",
    })
      .populate("tool")
      .sort({ createdAt: -1 });

    return res.json(purchases);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/creator/overview", authMiddleware, async (req, res) => {
  try {
    const tools = await Tool.find({ submittedBy: req.user.id });
    const toolIds = tools.map((tool) => tool._id);

    const sales = await Purchase.find({
      creator: req.user.id,
      status: "paid",
      tool: { $in: toolIds },
    }).populate("tool", "name");

    const payoutRequests = await PayoutRequest.find({ creator: req.user.id }).sort({ createdAt: -1 });

    const summary = sales.reduce(
      (acc, sale) => {
        acc.totalSales += 1;
        acc.grossRevenue += sale.price;
        acc.platformFees += sale.platformFeeAmount || 0;
        acc.netEarnings += sale.creatorEarningsAmount || 0;

        if (sale.earningsStatus === "available") {
          acc.availableBalance += sale.creatorEarningsAmount || 0;
        }
        if (sale.earningsStatus === "pending") {
          acc.pendingBalance += sale.creatorEarningsAmount || 0;
        }
        if (sale.earningsStatus === "paid") {
          acc.paidOut += sale.creatorEarningsAmount || 0;
        }
        return acc;
      },
      {
        totalSales: 0,
        grossRevenue: 0,
        platformFees: 0,
        netEarnings: 0,
        availableBalance: 0,
        pendingBalance: 0,
        paidOut: 0,
      }
    );

    const toolBreakdownMap = new Map();
    for (const sale of sales) {
      const key = String(sale.tool?._id || sale.tool);
      if (!toolBreakdownMap.has(key)) {
        toolBreakdownMap.set(key, {
          toolId: key,
          toolName: sale.tool?.name || "Unknown tool",
          salesCount: 0,
          grossRevenue: 0,
          netEarnings: 0,
        });
      }
      const bucket = toolBreakdownMap.get(key);
      bucket.salesCount += 1;
      bucket.grossRevenue += sale.price;
      bucket.netEarnings += sale.creatorEarningsAmount || 0;
    }

    const user = await User.findById(req.user.id).select("payoutDetails");

    res.json({
      summary,
      toolsCount: tools.length,
      recentSales: sales.slice(0, 10),
      payoutRequests,
      toolBreakdown: Array.from(toolBreakdownMap.values()).sort((a, b) => b.netEarnings - a.netEarnings),
      payoutDetails: user?.payoutDetails || {},
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/creator/payout-details", authMiddleware, async (req, res) => {
  try {
    const { upiId = "", accountName = "", bankName = "", accountNumber = "", ifscCode = "" } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        payoutDetails: {
          upiId,
          accountName,
          bankName,
          accountNumber,
          ifscCode,
        },
      },
      { new: true }
    ).select("payoutDetails");

    res.json({ message: "Payout details updated", payoutDetails: user.payoutDetails });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/creator/request-payout", authMiddleware, async (req, res) => {
  try {
    const creator = await User.findById(req.user.id);
    const hasPayoutDetails =
      creator?.payoutDetails?.upiId ||
      (creator?.payoutDetails?.accountName &&
        creator?.payoutDetails?.bankName &&
        creator?.payoutDetails?.accountNumber &&
        creator?.payoutDetails?.ifscCode);

    if (!hasPayoutDetails) {
      return res.status(400).json({ error: "Add payout details before requesting a payout" });
    }

    const availablePurchases = await Purchase.find({
      creator: req.user.id,
      status: "paid",
      earningsStatus: "available",
      payoutRequest: null,
    });

    if (!availablePurchases.length) {
      return res.status(400).json({ error: "No available earnings to request" });
    }

    const amount = availablePurchases.reduce((total, sale) => total + (sale.creatorEarningsAmount || 0), 0);
    const payoutRequest = await PayoutRequest.create({
      creator: req.user.id,
      amount: Number(amount.toFixed(2)),
      purchaseIds: availablePurchases.map((sale) => sale._id),
    });

    await Purchase.updateMany(
      { _id: { $in: availablePurchases.map((sale) => sale._id) } },
      { $set: { payoutRequest: payoutRequest._id, earningsStatus: "pending" } }
    );

    res.status(201).json({
      message: "Payout request submitted",
      payoutRequest,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/status/:toolId", authMiddleware, async (req, res) => {
  try {
    const purchase = await Purchase.findOne({
      user: req.user.id,
      tool: req.params.toolId,
      status: "paid",
    });

    return res.json({ purchased: Boolean(purchase), purchase });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;
