import { Suggestion } from "./Cv.types";
import { Job } from "./Job.types";
import { PaymentHistory } from "./PaymentHistory.types";

export interface CompletedChallenge {
  challengeId: string;
  completedAt: Date;
  rewardClaimed: boolean;
}

export interface UserProgress {
  coverLettersGenerated: number;
  companyInsightsGenerated: number;
  salaryInsightsGenerated: number;
  interviewPrepsGenerated: number;
  cvSuggestionsGenerated: number;
  jobsAdded: number;
  completedChallenges: CompletedChallenge[];
}

export interface User {
  name: string;
  email: string;
  image: string;
  cv_full_text?: string;
  cv_file_name?: string;
  cv_suggestions?: Suggestion[];
  jobs?: Job[];
  tokens: number;

  // Gamification fields
  experience: number;
  level: number;
  progress: UserProgress;

  stripeCustomerId?: string;
  password?: string;
  emailVerified?: boolean;
  paymentHistory?: PaymentHistory[];
}
