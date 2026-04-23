// server/models/Post.js
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prompt: { type: String, required: true },
  model: { type: String, required: true },
  photo: { type: String, required: true }
});

// ⭐ Export default explicitly
const Post = mongoose.model("Post", PostSchema);
export default Post;
