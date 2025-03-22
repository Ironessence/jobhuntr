"use client";

import LevelUpNotification from "@/components/notifications/LevelUpNotification";
import { Challenge } from "@/constants/challenges";
import QueryKeys from "@/utils/queryKeys";
import { ProgressAction, updateUserProgress } from "@/utils/user-progress";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";

interface ProgressContextType {
  trackProgress: (action: ProgressAction) => Promise<void>;
  isUpdating: boolean;
}

const ProgressContext = createContext<ProgressContextType>({
  trackProgress: async () => {},
  isUpdating: false,
});

export const useProgress = () => useContext(ProgressContext);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState<{
    show: boolean;
    challenge?: Challenge;
    experienceGained?: number;
    tokensAwarded?: number;
    newLevel?: number;
  }>({
    show: false,
  });

  const queryClient = useQueryClient();

  const trackProgress = async (action: ProgressAction) => {
    try {
      console.log("Tracking progress:", action);
      setIsUpdating(true);

      // Get the current user ID
      const response = await fetch("/api/user/current");
      if (!response.ok) {
        console.error("Failed to get current user:", await response.text());
        throw new Error("Failed to get current user");
      }

      const userData = await response.json();
      console.log("Current user data:", userData);

      // Update user progress
      const result = await updateUserProgress(userData.id, action);

      // Show notification if challenges were completed or level up
      if (result.completedChallenges.length > 0 || result.leveledUp) {
        setNotification({
          show: true,
          challenge: result.completedChallenges[0], // Show the first completed challenge
          experienceGained: result.experienceGained,
          tokensAwarded: result.tokensAwarded,
          newLevel: result.newLevel,
        });
      }

      // After successful update, invalidate user query to refresh UI
      queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_USER] });
    } catch (error) {
      console.error("Error tracking progress:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ProgressContext.Provider value={{ trackProgress, isUpdating }}>
      {children}

      <LevelUpNotification
        {...notification}
        onClose={() => setNotification({ show: false })}
      />
    </ProgressContext.Provider>
  );
}
