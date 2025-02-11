import { JobStatus } from "@/types/Job.types";
import { createId } from "@/utils";
import mongoose from "mongoose";

const InterviewQuestionSchema = new mongoose.Schema({
  question: String,
  choices: [String],
  correctAnswer: Number,
  explanation: String,
});

const CompanyInsightSchema = new mongoose.Schema({
  rating: Number,
  overview: String,
  culture: String,
  benefits: String,
  interviewProcess: String,
  salaryRange: {
    min: Number,
    max: Number,
    currency: String,
  },
  prosAndCons: {
    pros: [String],
    cons: [String],
  },
});

const JobSchema = new mongoose.Schema({
  id: { type: String, default: createId() },
  jobTitle: String,
  company: String,
  jobDescription: String,
  status: { type: String, enum: Object.values(JobStatus), default: JobStatus.ADDED },
  coverLetter: String,
  interviewQuestions: [InterviewQuestionSchema],
  companyInsights: CompanyInsightSchema,
  createdAt: { type: Date, default: Date.now },
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
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
