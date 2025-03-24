"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface SimpleXPNotificationProps {
  show: boolean;
  xp: number;
  onClose: () => void;
}

export default function SimpleXPNotification({ show, xp, onClose }: SimpleXPNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      // Auto-close after 2 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Allow exit animation to complete
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 right-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [0.8, 1.1, 1] }}
            transition={{ duration: 0.4, times: [0, 0.6, 1] }}
            className="bg-gradient-to-r from-blue-500/90 to-purple-500/90 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold shadow-lg"
          >
            +{xp} XP
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
