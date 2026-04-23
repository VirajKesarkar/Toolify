import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  tool: { type: mongoose.Schema.Types.ObjectId, ref: "Tool" },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  price: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  platformFeeRate: { type: Number, default: 20 },
  platformFeeAmount: { type: Number, default: 0 },
  creatorEarningsAmount: { type: Number, default: 0 },
  earningsStatus: {
    type: String,
    enum: ["pending", "available", "paid"],
    default: "available",
  },
  status: {
    type: String,
    enum: ["created", "paid", "failed"],
    default: "paid",
  },
  razorpayOrderId: { type: String, index: true },
  razorpayPaymentId: { type: String, index: true },
  payoutRequest: { type: mongoose.Schema.Types.ObjectId, ref: "PayoutRequest", default: null },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model("Purchase", purchaseSchema);
