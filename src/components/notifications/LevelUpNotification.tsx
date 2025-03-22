"use client";

import { Challenge } from "@/constants/challenges";
import { AnimatePresence, motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";

interface LevelUpNotificationProps {
  show: boolean;
  onClose: () => void;
  challenge?: Challenge;
  experienceGained?: number;
  tokensAwarded?: number;
  newLevel?: number;
}

export default function LevelUpNotification({
  show,
  onClose,
  challenge,
  experienceGained = 0,
  tokensAwarded = 0,
  newLevel,
}: LevelUpNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 500); // Wait for exit animation to complete
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-card border rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white">
              {newLevel ? (
                <h3 className="font-bold text-lg">Level Up! You reached Level {newLevel}</h3>
              ) : (
                <h3 className="font-bold text-lg">Challenge Completed!</h3>
              )}
            </div>

            <div className="p-4">
              {challenge && (
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                    {challenge.icon ? (
                      <challenge.icon className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Trophy className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{challenge.title}</p>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {experienceGained > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Experience Gained</span>
                    <span className="font-bold text-blue-600">+{experienceGained} XP</span>
                  </div>
                )}

                {tokensAwarded > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tokens Awarded</span>
                    <span className="font-bold text-amber-600">+{tokensAwarded} Tokens</span>
                  </div>
                )}
              </div>

              <button
                onClick={onClose}
                className="mt-3 w-full py-2 px-4 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 rounded-md transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
