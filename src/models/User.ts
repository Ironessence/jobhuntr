import { createId } from "@/utils";
import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
  id: { type: String, default: createId() },
  jobTitle: String,
  company: String,
  jobDescription: String,
  coverLetter: String,
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  image: String,
  type: { type: String, default: "FREE", enum: ["FREE", "PRO", "PLATINUM"] },
  cv_full_text: String,
  cv_file_name: String,
  cv_suggestions: { type: [String], default: [] },
  jobs: [JobSchema],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
