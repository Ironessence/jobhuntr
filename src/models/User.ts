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
    type: {
      min: Number,
      max: Number,
      currency: String,
      country: String,
    },
    required: false,
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

const PaymentHistorySchema = new mongoose.Schema({
  amount: Number,
  tokens: Number,
  date: Date,
  stripePaymentId: String,
  status: String,
  errorMessage: String, // This is optional
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  image: String,
  cv_full_text: String,
  cv_file_name: String,
  cv_suggestions: [String],
  jobs: [JobSchema],
  tokens: { type: Number, default: 0 },
  paymentHistory: [PaymentHistorySchema],

  stripeCustomerId: String,

  createdAt: { type: Date, default: Date.now },
  password: { type: String, required: false },
  emailVerified: { type: Boolean, default: false },
  verificationTokenExpiry: Date,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
