import { UserProgress } from "@/types/User.types";
import {
  Award,
  BookOpen,
  Briefcase,
  Building,
  Crown,
  DollarSign,
  FileText,
  Medal,
  MessageSquare,
  Star,
  Trophy,
  Zap,
} from "lucide-react";

export type ChallengeType =
  | "coverLetter"
  | "companyInsight"
  | "salaryInsight"
  | "interviewPrep"
  | "cvSuggestion"
  | "jobAdded"
  | "levelReached"
  | "tokensPurchased";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: any; // Lucide icon component
  type: ChallengeType;
  requirement: number; // Number required to complete
  experienceReward: number;
  tokenReward: number;
  badgeImage?: string; // Optional badge image URL
}

export const LEVEL_BADGES = [
  { level: 1, name: "Apprentice", icon: BookOpen },
  { level: 5, name: "Beginner", icon: Star },
  { level: 10, name: "Ninja", icon: Zap },
  { level: 15, name: "Expert", icon: Trophy },
  { level: 20, name: "Master", icon: Medal },
  { level: 30, name: "Guru", icon: Crown },
];

export const EXPERIENCE_PER_LEVEL = 100; // Base XP needed per level
export const LEVEL_SCALING_FACTOR = 1; // How much more XP is needed for each level

export function getExperienceForLevel(level: number): number {
  return Math.floor(EXPERIENCE_PER_LEVEL * Math.pow(LEVEL_SCALING_FACTOR, level - 1));
}

export function getTotalExperienceForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getExperienceForLevel(i);
  }
  return total;
}

export function getCurrentLevelProgress(experience: number): {
  currentLevel: number;
  currentExp: number;
  requiredExp: number;
  totalExpForNextLevel: number;
  badge: { name: string; icon: any };
} {
  let level = 1;
  let expTotal = 0;
  let prevExpTotal = 0;

  while (true) {
    const expForThisLevel = getExperienceForLevel(level);
    expTotal += expForThisLevel;

    if (expTotal > experience) {
      break;
    }

    prevExpTotal = expTotal;
    level++;
  }

  // Find the appropriate badge
  let badge = LEVEL_BADGES[0]; // Default to first badge
  for (let i = LEVEL_BADGES.length - 1; i >= 0; i--) {
    if (level >= LEVEL_BADGES[i].level) {
      badge = LEVEL_BADGES[i];
      break;
    }
  }

  return {
    currentLevel: level,
    currentExp: experience - prevExpTotal,
    requiredExp: getExperienceForLevel(level),
    totalExpForNextLevel: expTotal,
    badge,
  };
}

export const challenges: Challenge[] = [
  // Cover Letter Challenges
  {
    id: "first_cover_letter",
    title: "First Cover Letter",
    description: "Generate your first AI cover letter",
    icon: FileText,
    type: "coverLetter",
    requirement: 1,
    experienceReward: 50,
    tokenReward: 10,
  },
  {
    id: "cover_letter_master",
    title: "Cover Letter Master",
    description: "Generate 10 AI cover letters",
    icon: FileText,
    type: "coverLetter",
    requirement: 10,
    experienceReward: 100,
    tokenReward: 20,
  },
  {
    id: "cover_letter_expert",
    title: "Cover Letter Expert",
    description: "Generate 25 AI cover letters",
    icon: FileText,
    type: "coverLetter",
    requirement: 25,
    experienceReward: 200,
    tokenReward: 50,
  },

  // Company Insights Challenges
  {
    id: "first_company_insight",
    title: "Company Explorer",
    description: "Get your first company insight",
    icon: Building,
    type: "companyInsight",
    requirement: 1,
    experienceReward: 50,
    tokenReward: 10,
  },
  {
    id: "company_insight_master",
    title: "Company Insider",
    description: "Get 10 company insights",
    icon: Building,
    type: "companyInsight",
    requirement: 10,
    experienceReward: 100,
    tokenReward: 20,
  },

  // Salary Insights Challenges
  {
    id: "first_salary_insight",
    title: "Salary Seeker",
    description: "Get your first salary insight",
    icon: DollarSign,
    type: "salaryInsight",
    requirement: 1,
    experienceReward: 50,
    tokenReward: 10,
  },
  {
    id: "salary_insight_master",
    title: "Negotiation Expert",
    description: "Get 10 salary insights",
    icon: DollarSign,
    type: "salaryInsight",
    requirement: 10,
    experienceReward: 100,
    tokenReward: 20,
  },

  // Interview Prep Challenges
  {
    id: "first_interview_prep",
    title: "Interview Ready",
    description: "Generate your first interview prep",
    icon: MessageSquare,
    type: "interviewPrep",
    requirement: 1,
    experienceReward: 50,
    tokenReward: 10,
  },
  {
    id: "interview_prep_master",
    title: "Interview Ace",
    description: "Generate 10 interview preps",
    icon: MessageSquare,
    type: "interviewPrep",
    requirement: 10,
    experienceReward: 100,
    tokenReward: 20,
  },

  // CV Suggestion Challenges
  {
    id: "first_cv_suggestion",
    title: "CV Improver",
    description: "Get your first CV suggestion",
    icon: FileText,
    type: "cvSuggestion",
    requirement: 1,
    experienceReward: 50,
    tokenReward: 10,
  },
  {
    id: "cv_suggestion_master",
    title: "CV Optimizer",
    description: "Get 10 CV suggestions",
    icon: FileText,
    type: "cvSuggestion",
    requirement: 10,
    experienceReward: 100,
    tokenReward: 20,
  },

  // Job Added Challenges
  {
    id: "first_job_added",
    title: "Job Hunter",
    description: "Add your first job to track",
    icon: Briefcase,
    type: "jobAdded",
    requirement: 1,
    experienceReward: 30,
    tokenReward: 5,
  },
  {
    id: "job_added_master",
    title: "Job Seeker Pro",
    description: "Add 10 jobs to track",
    icon: Briefcase,
    type: "jobAdded",
    requirement: 10,
    experienceReward: 80,
    tokenReward: 15,
  },

  // Level Reached Challenges
  {
    id: "reach_level_5",
    title: "Rising Star",
    description: "Reach level 5",
    icon: Award,
    type: "levelReached",
    requirement: 5,
    experienceReward: 0, // No XP reward as reaching the level itself is the challenge
    tokenReward: 50,
  },
  {
    id: "reach_level_10",
    title: "Ninja Status",
    description: "Reach level 10",
    icon: Award,
    type: "levelReached",
    requirement: 10,
    experienceReward: 0,
    tokenReward: 100,
  },
  {
    id: "reach_level_20",
    title: "Master Achiever",
    description: "Reach level 20",
    icon: Award,
    type: "levelReached",
    requirement: 20,
    experienceReward: 0,
    tokenReward: 200,
  },
];

export function getChallengeById(id: string): Challenge | undefined {
  return challenges.find((challenge) => challenge.id === id);
}

export function getCompletedChallenges(userProgress: UserProgress): string[] {
  return userProgress.completedChallenges.map((challenge) => challenge.challengeId);
}

export function getEligibleChallenges(userProgress: UserProgress, userLevel: number): Challenge[] {
  const completedChallengeIds = getCompletedChallenges(userProgress);

  return challenges.filter((challenge) => {
    // Skip already completed challenges
    if (completedChallengeIds.includes(challenge.id)) {
      return false;
    }

    // Check if the user meets the requirement for this challenge
    switch (challenge.type) {
      case "coverLetter":
        return userProgress.coverLettersGenerated >= challenge.requirement;
      case "companyInsight":
        return userProgress.companyInsightsGenerated >= challenge.requirement;
      case "salaryInsight":
        return userProgress.salaryInsightsGenerated >= challenge.requirement;
      case "interviewPrep":
        return userProgress.interviewPrepsGenerated >= challenge.requirement;
      case "cvSuggestion":
        return userProgress.cvSuggestionsGenerated >= challenge.requirement;
      case "jobAdded":
        return userProgress.jobsAdded >= challenge.requirement;
      case "levelReached":
        return userLevel >= challenge.requirement;
      default:
        return false;
    }
  });
}
