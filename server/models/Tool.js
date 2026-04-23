// server/models/Tool.js
import mongoose from "mongoose";

const toolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    price: { type: Number, default: 0 },
    url: { type: String },
    approved: { type: Boolean, default: false },

    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Notifications stored
    notifications: {
      type: [
        {
          message: String,
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
    status: { type: String, default: "pending" } // pending | approved | rejected
  },
  { timestamps: true }
);

export default mongoose.model("Tool", toolSchema);
