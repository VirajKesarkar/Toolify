import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // load environment variables

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const toolSchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  category: String,
  url: String,
  isActive: Boolean,
});

const Tool = mongoose.model("Tool", toolSchema);

async function addResumeTool() {
  const exists = await Tool.findOne({ slug: "resume-generator" });
  if (exists) {
    console.log("Resume Generator already exists!");
    process.exit();
  }

  const resumeTool = new Tool({
    name: "Resume Generator",
    slug: "resume-generator",
    description: "Generate AI resumes quickly",
    category: "productivity",
    url: "/resume",
    isActive: true,
  });

  await resumeTool.save();
  console.log("✅ Resume Generator tool added successfully!");
  process.exit();
}

addResumeTool().catch((err) => {
  console.error(err);
  process.exit(1);
});
