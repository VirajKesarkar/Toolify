import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
});

const User = mongoose.model("User", userSchema);

async function createAdmin() {
  const passwordPlain = "admin123"; // <-- your admin password
  const hashedPassword = await bcrypt.hash(passwordPlain, 10); // hash password

  const admin = new User({
    name: "Admin",
    email: "admin@example.com",
    password: hashedPassword,
    role: "admin"
  });

  await admin.save();
  console.log("Admin user created!");
  process.exit();
}

createAdmin();
