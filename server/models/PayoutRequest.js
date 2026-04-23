import mongoose from "mongoose";

const payoutRequestSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["pending", "approved", "paid", "rejected"],
      default: "pending",
    },
    purchaseIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Purchase" }],
    payoutMethod: { type: String, default: "manual" },
    notes: { type: String, default: "" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("PayoutRequest", payoutRequestSchema);
