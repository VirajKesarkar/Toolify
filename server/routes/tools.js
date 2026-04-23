import express from "express";
import Tool from "../models/Tool.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

/* ==========================================
   ➤ POST: Add Tool (Requires Login)
========================================== */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description, category, price, apiUrl } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required" });
    }

    const tool = await Tool.create({
      name,
      description,
      category,
      price,
      url: apiUrl || "",
      approved: false,
      submittedBy: req.user.id,
    });

    res.status(201).json({ message: "Tool submitted for approval", tool });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================
   ➤ GET: Approved Tools For Public Tools Page
   Supports search and filtering
========================================== */
router.get("/", async (req, res) => {
  try {
    const { search, approved } = req.query;
    const query = {};

    if (approved === "true") query.approved = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const tools = await Tool.find(query)
      .populate("submittedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==========================================
   ➤ GET: Tools Submitted by Logged-in User
========================================== */
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const tools = await Tool.find({ submittedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(tools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id).populate("submittedBy", "name email");
    if (!tool) {
      return res.status(404).json({ error: "Tool not found" });
    }

    res.json(tool);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
