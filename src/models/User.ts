import { createId } from "@/utils";
import mongoose from "mongoose";

const InterviewQuestionSchema = new mongoose.Schema({
  question: String,
  choices: [String],
  correctAnswer: Number,
  explanation: String,
});

const JobSchema = new mongoose.Schema({
  id: { type: String, default: createId() },
  jobTitle: String,
  company: String,
  jobDescription: String,
  coverLetter: String,
  interviewQuestions: [InterviewQuestionSchema],
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
  tokens: { type: Number, default: 0 },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
