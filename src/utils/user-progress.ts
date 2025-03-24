import { Challenge, getEligibleChallenges } from "@/constants/challenges";
import { User, UserProgress } from "@/types/User.types";
import QueryKeys from "./queryKeys";

export type ProgressAction =
  | { type: "COVER_LETTER_GENERATED" }
  | { type: "COMPANY_INSIGHT_GENERATED" }
  | { type: "SALARY_INSIGHT_GENERATED" }
  | { type: "INTERVIEW_PREP_GENERATED" }
  | { type: "CV_SUGGESTION_GENERATED" }
  | { type: "JOB_ADDED" }
  | { type: "LEVEL_REACHED"; level: number };

export async function updateUserProgress(
  userId: string,
  action: ProgressAction,
): Promise<{
  updatedUser: User;
  completedChallenges: Challenge[];
  experienceGained: number;
  tokensAwarded: number;
  leveledUp: boolean;
  newLevel?: number;
}> {
  // Fetch the current user
  const response = await fetch(`/api/user/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  const user: User = await response.json();

  // Create a copy of the user's progress to work with
  const updatedProgress: UserProgress = { ...user.progress };

  // Base experience for each action
  let baseExperienceGained = 0;

  // Update the appropriate counter based on the action
  switch (action.type) {
    case "COVER_LETTER_GENERATED":
      updatedProgress.coverLettersGenerated = (updatedProgress.coverLettersGenerated || 0) + 1;
      baseExperienceGained = 10;
      break;
    case "COMPANY_INSIGHT_GENERATED":
      updatedProgress.companyInsightsGenerated =
        (updatedProgress.companyInsightsGenerated || 0) + 1;
      baseExperienceGained = 10;
      break;
    case "SALARY_INSIGHT_GENERATED":
      updatedProgress.salaryInsightsGenerated = (updatedProgress.salaryInsightsGenerated || 0) + 1;
      baseExperienceGained = 10;
      break;
    case "INTERVIEW_PREP_GENERATED":
      updatedProgress.interviewPrepsGenerated = (updatedProgress.interviewPrepsGenerated || 0) + 1;
      baseExperienceGained = 10;
      break;
    case "CV_SUGGESTION_GENERATED":
      updatedProgress.cvSuggestionsGenerated = (updatedProgress.cvSuggestionsGenerated || 0) + 1;
      baseExperienceGained = 10;
      break;
    case "JOB_ADDED":
      updatedProgress.jobsAdded = (updatedProgress.jobsAdded || 0) + 1;
      baseExperienceGained = 0;
      break;
    case "LEVEL_REACHED":
      // No counter to update for level reached
      break;
  }

  // Check for newly completed challenges
  const eligibleChallenges = getEligibleChallenges(updatedProgress, user.level);
  const completedChallengeIds = updatedProgress.completedChallenges.map((c) => c.challengeId);

  const newlyCompletedChallenges = eligibleChallenges.filter(
    (challenge) => !completedChallengeIds.includes(challenge.id),
  );

  // Calculate rewards
  let experienceGained = baseExperienceGained;
  let tokensAwarded = 0;

  // Mark challenges as completed and calculate rewards
  for (const challenge of newlyCompletedChallenges) {
    updatedProgress.completedChallenges.push({
      challengeId: challenge.id,
      completedAt: new Date(),
      rewardClaimed: true,
    });

    experienceGained += challenge.experienceReward;
    tokensAwarded += challenge.tokenReward;
  }

  // Calculate new experience and level
  const newExperience = user.experience + experienceGained;
  let newLevel = user.level;
  let leveledUp = false;

  // Simple level calculation (can be replaced with the more complex one from challenges.ts)
  const expPerLevel = 100; // Base XP per level
  const newLevelCalc = Math.floor(newExperience / expPerLevel) + 1;

  if (newLevelCalc > user.level) {
    newLevel = newLevelCalc;
    leveledUp = true;

    // Check for level-up challenges
    if (action.type !== "LEVEL_REACHED") {
      // Recursively call with LEVEL_REACHED action to check for level-based challenges
      const levelUpResult = await updateUserProgress(userId, {
        type: "LEVEL_REACHED",
        level: newLevel,
      });

      // Add any additional rewards from level-up challenges
      experienceGained += levelUpResult.experienceGained;
      tokensAwarded += levelUpResult.tokensAwarded;

      // Add any level-up challenges to our completed list
      newlyCompletedChallenges.push(...levelUpResult.completedChallenges);
    }
  }

  // Update the user in the database
  const updateResponse = await fetch(`/api/user/${userId}/progress`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      progress: updatedProgress,
      experience: newExperience,
      level: newLevel,
      tokens: user.tokens + tokensAwarded,
    }),
  });

  if (!updateResponse.ok) {
    throw new Error("Failed to update user progress");
  }

  const updatedUser = await updateResponse.json();

  // Invalidate relevant queries to refresh the UI
  if (typeof window !== "undefined" && window.queryClient) {
    window.queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USER] });
  }

  return {
    updatedUser,
    completedChallenges: newlyCompletedChallenges,
    experienceGained,
    tokensAwarded,
    leveledUp,
    newLevel: leveledUp ? newLevel : undefined,
  };
}
