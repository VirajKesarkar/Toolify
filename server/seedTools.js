// server/seedTools.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Tool from "./models/Tool.js";

dotenv.config();

const tools = [
  { name: "Resume Generator", description: "Generate professional resumes instantly.", url: "/tools/resume", category: "Productivity" },
  { name: "AI Chatbot", description: "Chat with AI and get instant answers.", url: "https://chat.openai.com/", category: "Chat" },
  { name: "AI Image Generator", description: "Create stunning images from text prompts.", url: "https://stability.ai/", category: "Image" }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Tool.deleteMany();
    await Tool.insertMany(tools);
    console.log("Tools seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
