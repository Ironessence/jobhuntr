"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface Question {
  question: string;
  choices: string[];
  correctAnswer: number;
  explanation: string;
}

interface Props {
  questions: Question[];
  onClose: () => void;
}

export function InterviewQuiz({ questions, onClose }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (choiceIndex: number) => {
    setSelectedAnswer(choiceIndex);
    if (choiceIndex === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="text-sm text-muted-foreground">
          Score: {score}/{questions.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">{questions[currentQuestion].question}</h3>

            <div className="space-y-2">
              {questions[currentQuestion].choices.map((choice, index) => (
                <Button
                  key={index}
                  variant={
                    selectedAnswer === null
                      ? "outline"
                      : index === questions[currentQuestion].correctAnswer
                        ? "success"
                        : selectedAnswer === index
                          ? "destructive"
                          : "outline"
                  }
                  className="w-full justify-start text-left"
                  onClick={() => !selectedAnswer && handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                >
                  {choice}
                </Button>
              ))}
            </div>

            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-muted rounded-lg"
              >
                <p className="text-sm">{questions[currentQuestion].explanation}</p>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-4">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Exit Quiz
        </Button>
        {showExplanation && !isLastQuestion && <Button onClick={handleNext}>Next Question</Button>}
        {isLastQuestion && showExplanation && (
          <Button onClick={onClose}>
            Finish Quiz (Score: {score}/{questions.length})
          </Button>
        )}
      </div>
    </div>
  );
}
