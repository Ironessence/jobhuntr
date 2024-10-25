import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
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
  jobs: [JobSchema],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
