import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  cid: String,
  likes: [String],
  comments: [{ username: String, comment: String }],
});

export default mongoose.model("Post", postSchema);
