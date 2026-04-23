import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/dalle", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const HF_API_KEY = process.env.HF_API_KEY;

    const response = await axios.post(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
          Accept: "image/png"             
        },
        responseType: "arraybuffer",       // 👈 Required to get image data
      }
    );

    const base64 = Buffer.from(response.data).toString("base64");
    res.status(200).json({
      image: `data:image/png;base64,${base64}`,
    });

  } catch (err) {
    let message = "Error generating image";

    try {
      message = JSON.parse(err.response?.data?.toString()).error;
    } catch {}

    console.error("HuggingFace Error:", message);
    console.log("HF ERROR FULL:", err?.response?.data?.toString());

    return res.status(500).json({ error: message });
  }
});

export default router;
