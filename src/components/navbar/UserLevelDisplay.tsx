"use client";

import { Progress } from "@/components/ui/progress";
import { getCurrentLevelProgress } from "@/constants/challenges";
import { User } from "@/types/User.types";

interface UserLevelDisplayProps {
  user: User;
  compact?: boolean;
}

export default function UserLevelDisplay({ user, compact = false }: UserLevelDisplayProps) {
  const { currentLevel, currentExp, requiredExp, badge } = getCurrentLevelProgress(user.experience);
  const progressPercentage = Math.min(100, Math.floor((currentExp / requiredExp) * 100));

  const BadgeIcon = badge.icon;

  if (compact) {
    return (
      <div className="flex items-center gap-2 py-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900">
          <BadgeIcon className="w-4 h-4 text-blue-600 dark:text-blue-300" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium">Level {currentLevel}</span>
            <span className="text-xs text-muted-foreground">
              {currentExp}/{requiredExp} XP
            </span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-1.5"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900">
          <BadgeIcon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
        </div>
        <div>
          <h3 className="font-bold">{badge.name}</h3>
          <p className="text-sm text-muted-foreground">Level {currentLevel}</p>
        </div>
      </div>

      <div className="mb-1 flex justify-between items-center">
        <span className="text-sm font-medium">Experience</span>
        <span className="text-sm text-muted-foreground">
          {currentExp}/{requiredExp} XP
        </span>
      </div>
      <Progress
        value={progressPercentage}
        className="h-2 mb-4"
      />

      <p className="text-xs text-muted-foreground">
        {requiredExp - currentExp} XP needed for Level {currentLevel + 1}
      </p>
    </div>
  );
}
