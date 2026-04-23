import express from "express";
import * as dotenv from "dotenv";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/Post.js";

dotenv.config();
const router = express.Router();

// ⚠️ REQUIRED for uploading images
router.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./tmp",
  })
);

// 🔐 Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// 📌 Upload Post
router.post("/post", async (req, res) => {
  try {
    const { name, prompt, model } = req.body;

    if (!req.files || !req.files.photoFile) {
      return res.status(400).json({ success: false, msg: "No image file uploaded" });
    }

    const photoFile = req.files.photoFile;

    const upload = await cloudinary.uploader.upload(photoFile.tempFilePath, {
      folder: process.env.FOLDER_NAME,
      resource_type: "auto",
    });

    const newPost = await Post.create({
      name,
      prompt,
      model,
      photo: upload.secure_url,
    });

    res.status(200).json({ success: true, data: newPost });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: err.message });
  }
});

export default router;
