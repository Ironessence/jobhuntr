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
  prosAndCons: {
    pros: string[];
    cons: string[];
  };
};

export type Job = {
  _id: string;
  id: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  coverLetter?: string;
  interviewQuestions?: InterviewQuestion[];
  companyInsights?: CompanyInsight;
};
