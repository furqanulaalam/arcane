import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
  ownerEmail: String,
  ownerName: String,
  serverURL: String,
  serverName: String,
});

export default mongoose.model("Friend", friendSchema);
