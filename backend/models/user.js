import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  birthDate: Date,
  email: String,
  password: String,
  followers: [String],
  following: [String],
  posts: [String],
  blocked: [String],
});

export default mongoose.model("User", userSchema);
