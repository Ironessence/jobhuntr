import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  image: String,
  cv: String,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
