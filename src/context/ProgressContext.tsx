"use client";

import LevelUpNotification from "@/components/notifications/LevelUpNotification";
import SimpleXPNotification from "@/components/notifications/SimpleXPNotification";
import { Challenge } from "@/constants/challenges";
import QueryKeys from "@/utils/queryKeys";
import { ProgressAction, updateUserProgress } from "@/utils/user-progress";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, ReactNode, useContext, useState } from "react";

interface ProgressContextType {
  trackProgress: (action: ProgressAction) => Promise<void>;
  isUpdating: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
}

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

  const [simpleXPNotification, setSimpleXPNotification] = useState<{
    show: boolean;
    xp: number;
  }>({
    show: false,
    xp: 0,
  });

  const queryClient = useQueryClient();

  const trackProgress = async (action: ProgressAction) => {
    try {
      setIsUpdating(true);

      // Get the current user ID
      const response = await fetch("/api/user/current");
      if (!response.ok) {
        console.error("Failed to get current user:", await response.text());
        throw new Error("Failed to get current user");
      }

      const userData = await response.json();

      // Update user progress
      const result = await updateUserProgress(userData.id, action);

      // Show notification based on what happened
      if (result.completedChallenges.length > 0 || result.leveledUp) {
        // Show the challenge/level up notification for significant achievements
        setNotification({
          show: true,
          challenge: result.completedChallenges[0], // Show the first completed challenge
          experienceGained: result.experienceGained,
          tokensAwarded: result.tokensAwarded,
          newLevel: result.newLevel,
        });
      } else if (result.experienceGained > 0) {
        // Show simple XP notification for basic actions
        setSimpleXPNotification({
          show: true,
          xp: result.experienceGained,
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

      <SimpleXPNotification
        show={simpleXPNotification.show}
        xp={simpleXPNotification.xp}
        onClose={() => setSimpleXPNotification({ show: false, xp: 0 })}
      />
    </ProgressContext.Provider>
  );
}
