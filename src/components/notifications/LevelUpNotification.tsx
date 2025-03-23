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
        setTimeout(onClose, 800); // Wait for exit animation to complete
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 z-50 pointer-events-none py-4"
        >
          <div className="relative w-64 sm:w-80 h-auto py-4">
            {/* Gaming-inspired background effect */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full -z-10"
            >
              <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.5)] overflow-hidden">
                {/* Hexagonal grid pattern */}
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NiIgaGVpZ2h0PSI0OSI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTAgMTJoMjZ2MjZIMHptMjkgMTFoMjh2MjZIMjl6bTI5LTExaDI4djI2SDU4eiI+PC9wYXRoPjwvc3ZnPg==')]"></div>

                {/* Animated energy lines */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-400/50 to-transparent animate-pulse"></div>
                  <div
                    className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-purple-400/50 to-transparent animate-pulse"
                    style={{ animationDelay: "0.5s" }}
                  ></div>
                  <div
                    className="absolute top-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent animate-pulse"
                    style={{ animationDelay: "0.25s" }}
                  ></div>
                  <div
                    className="absolute bottom-1/4 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent animate-pulse"
                    style={{ animationDelay: "0.75s" }}
                  ></div>
                </div>
              </div>
            </motion.div>

            {/* Level up text */}
            {newLevel && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center mb-2 pt-3"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ duration: 0.8, times: [0, 0.5, 1] }}
                  className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
                >
                  LEVEL UP!
                </motion.div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="text-xl sm:text-2xl font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]"
                >
                  Level {newLevel}
                </motion.div>
              </motion.div>
            )}

            {/* Challenge info */}
            {challenge && (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center gap-2 justify-center mb-3 bg-black/30 backdrop-blur-sm p-2 mx-3 rounded-lg"
              >
                <div className="p-1.5 rounded-full bg-blue-500/50">
                  {challenge.icon ? (
                    <challenge.icon className="h-4 w-4 text-white" />
                  ) : (
                    <Trophy className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="text-white text-sm">
                  <p className="font-medium">{challenge.title}</p>
                </div>
              </motion.div>
            )}

            {/* Experience gained */}
            {experienceGained > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="flex justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.1, 1] }}
                  transition={{ duration: 0.6, delay: 0.9, times: [0, 0.6, 1] }}
                  className="bg-gradient-to-r from-blue-500/70 to-purple-500/70 backdrop-blur-sm px-3 py-1 rounded-full text-white font-bold"
                >
                  +{experienceGained} XP
                </motion.div>
              </motion.div>
            )}

            {/* Tokens awarded */}
            {tokensAwarded > 0 && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 1 }}
                className="flex justify-center mt-2 mb-3"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.1, 1] }}
                  transition={{ duration: 0.6, delay: 1.1, times: [0, 0.6, 1] }}
                  className="bg-gradient-to-r from-amber-500/70 to-orange-500/70 backdrop-blur-sm px-3 py-1 rounded-full text-white font-bold"
                >
                  +{tokensAwarded} Tokens
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
