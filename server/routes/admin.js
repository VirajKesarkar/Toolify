import express from "express";
import Tool from "../models/Tool.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";
import Purchase from "../models/Purchase.js";
import PayoutRequest from "../models/PayoutRequest.js";

const router = express.Router();

/* 📌 GET all tools */
router.get("/tools", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const tools = await Tool.find()
      .populate("submittedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✔ Approve Tool */
router.patch("/tools/:id/approve", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ message: "Tool not found" });

    tool.approved = true;
    tool.status = "approved";
    tool.notifications.push({ message: "Your tool has been approved ✔️" });

    await tool.save();
    res.json({ message: "Tool approved!", tool });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ❌ Reject Tool */
router.patch("/tools/:id/reject", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ message: "Tool not found" });

    tool.approved = false;
    tool.status = "rejected";
    tool.notifications.push({ message: "Your tool was rejected ❌" });

    await tool.save();
    res.json({ message: "Tool rejected", tool });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* 🗑 Delete Tool (Admin Only) */
router.delete("/tools/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) return res.status(404).json({ message: "Tool not found" });

    await tool.deleteOne();
    res.json({ message: "Tool deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/earnings", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const purchases = await Purchase.find({ status: "paid" })
      .populate("tool", "name")
      .populate("creator", "name email")
      .sort({ createdAt: -1 });

    const payoutRequests = await PayoutRequest.find()
      .populate("creator", "name email")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });

    const summary = purchases.reduce(
      (acc, purchase) => {
        acc.totalSales += 1;
        acc.grossRevenue += purchase.price;
        acc.platformRevenue += purchase.platformFeeAmount || 0;
        acc.creatorRevenue += purchase.creatorEarningsAmount || 0;
        return acc;
      },
      { totalSales: 0, grossRevenue: 0, platformRevenue: 0, creatorRevenue: 0 }
    );

    res.json({ summary, purchases: purchases.slice(0, 20), payoutRequests });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/payouts/:id/approve", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const payout = await PayoutRequest.findById(req.params.id);
    if (!payout) {
      return res.status(404).json({ error: "Payout request not found" });
    }

    payout.status = "approved";
    payout.reviewedBy = req.user.id;
    payout.reviewedAt = new Date();
    await payout.save();

    res.json({ message: "Payout request approved", payout });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/payouts/:id/pay", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const payout = await PayoutRequest.findById(req.params.id);
    if (!payout) {
      return res.status(404).json({ error: "Payout request not found" });
    }

    payout.status = "paid";
    payout.reviewedBy = req.user.id;
    payout.reviewedAt = new Date();
    await payout.save();

    await Purchase.updateMany(
      { _id: { $in: payout.purchaseIds } },
      { $set: { earningsStatus: "paid" } }
    );

    res.json({ message: "Payout marked as paid", payout });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/payouts/:id/reject", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const payout = await PayoutRequest.findById(req.params.id);
    if (!payout) {
      return res.status(404).json({ error: "Payout request not found" });
    }

    payout.status = "rejected";
    payout.reviewedBy = req.user.id;
    payout.reviewedAt = new Date();
    await payout.save();

    await Purchase.updateMany(
      { _id: { $in: payout.purchaseIds } },
      { $set: { earningsStatus: "available", payoutRequest: null } }
    );

    res.json({ message: "Payout request rejected", payout });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
