import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";

// Import routes
import userRoutes from "./routes/users.js";
import toolRoutes from "./routes/tools.js";
import adminRoutes from "./routes/admin.js";
import resumeRouter from "./routes/resume.js";
import dalleRoute from "./routes/dalleRoute.js";    // ← NEW
import postRoute from "./routes/postRoute.js";      // ← NEW
import paymentRoutes from "./routes/payments.js";

dotenv.config();

const app = express();

// ----------------------
// Middleware
// ----------------------
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Required for Cloudinary upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// ----------------------
// API Routes
// ----------------------
app.use("/api/users", userRoutes);
app.use("/api/tools", toolRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/resume", resumeRouter);
app.use("/api/payments", paymentRoutes);

// AI Image Generator Routes
app.use("/api/v1", dalleRoute);   // → POST /api/v1/dalle
app.use("/api/v1", postRoute);    // → POST /api/v1/post

// ----------------------
// Test Route
// ----------------------
app.get("/", (req, res) => {
  res.send("AI-SaaS Backend Running");
});

// ----------------------
// MongoDB Connection
// ----------------------
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB Error:", err));

// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
