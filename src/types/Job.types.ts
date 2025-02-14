export type InterviewQuestion = {
  question: string;
  choices: string[];
  correctAnswer: number;
  explanation: string;
};

export type CompanyInsight = {
  rating: number;
  overview: string;
  culture: string;
  benefits: string;
  interviewProcess: string;
  salaryRange: {
    min: number;
    max: number;
    currency: string;
    country: string;
  };
  prosAndCons: {
    pros: string[];
    cons: string[];
  };
};

export enum JobStatus {
  ADDED = "ADDED",
  APPLIED = "APPLIED",
  REJECTED = "REJECTED",
  INTERVIEWING = "INTERVIEWING",
  OFFER_RECEIVED = "OFFER_RECEIVED",
}

export type Job = {
  _id: string;
  id: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  status: JobStatus;
  coverLetter?: string;
  interviewQuestions?: InterviewQuestion[];
  companyInsights?: CompanyInsight;
  createdAt: Date;
};
