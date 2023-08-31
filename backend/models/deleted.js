import mongoose from "mongoose";

const deletedSchema = new mongoose.Schema({
  email: String,
  username: String,
});

export default mongoose.model("Deleted", deletedSchema);
