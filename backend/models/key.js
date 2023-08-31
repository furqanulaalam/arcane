import mongoose from "mongoose";

const keySchema = new mongoose.Schema({
  key: { type: String, required: true },
  url: { type: String, required: true },
});

const Key = new mongoose.model("Key", keySchema);

export default Key;
