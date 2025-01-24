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
}

export function InterviewQuiz({ questions }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  if (!questions) {
    return <div>Loading...</div>;
  }

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
    <div className="space-y-4 overflow-x-hidden">
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
          <Card className="p-6 w-full flex flex-col gap-4">
            <h3 className="text-lg font-semibold mb-4 whitespace-pre-wrap break-words w-full">
              {questions[currentQuestion].question}
            </h3>

            <div className="flex flex-col gap-2 py-2">
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
                  className="w-full justify-start text-left text-wrap h-auto"
                  onClick={() => !selectedAnswer && handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                >
                  {choice}
                </Button>
              ))}
            </div>

            <div className="mt-4">
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-muted rounded-lg"
                >
                  <p className="text-sm">{questions[currentQuestion].explanation}</p>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-4">
        <Button
          onClick={handleNext}
          disabled={(showExplanation && isLastQuestion) || !showExplanation}
        >
          Next Question
        </Button>
        {isLastQuestion && showExplanation && (
          <span>
            Final Score: {score}/{questions.length}
          </span>
        )}
      </div>
    </div>
  );
}
