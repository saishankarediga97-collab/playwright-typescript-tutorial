import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award,
  ArrowRight
} from 'lucide-react';
import { quizQuestions } from '../data/quizQuestions';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentQ = quizQuestions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < quizQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <HelpCircle className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Knowledge Check & Quiz</h2>
              <span className="text-[11px] text-slate-400">
                TypeScript • DSA • Playwright POM Chaining
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isFinished ? (
            /* Results Screen */
            <div className="text-center py-6 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-blue-600 text-white shadow-xl shadow-purple-500/20">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Quiz Completed!</h3>
              <p className="text-sm text-slate-300">
                You scored <span className="font-bold text-emerald-400">{score}</span> out of{' '}
                <span className="font-bold">{quizQuestions.length}</span> ({Math.round((score / quizQuestions.length) * 100)}%)
              </p>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition-all shadow-md"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Retry Quiz</span>
                </button>
                <button
                  onClick={onClose}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Question Screen */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase text-purple-400">
                  Question {currentIndex + 1} of {quizQuestions.length}
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300 uppercase">
                  {currentQ.module}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
                {currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = isAnswerSubmitted && idx === currentQ.correctIndex;
                  const isWrong = isAnswerSubmitted && isSelected && idx !== currentQ.correctIndex;

                  return (
                    <div
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`flex items-start gap-3 rounded-xl p-3.5 text-xs sm:text-sm transition-all border cursor-pointer ${
                        isCorrect
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200'
                          : isWrong
                          ? 'border-rose-500 bg-rose-500/10 text-rose-200'
                          : isSelected
                          ? 'border-blue-500 bg-blue-500/10 text-blue-200 shadow-sm'
                          : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : isWrong ? (
                          <XCircle className="h-4 w-4 text-rose-400" />
                        ) : (
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                              isSelected
                                ? 'border-blue-500 bg-blue-500 text-white'
                                : 'border-slate-600 text-slate-400'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </div>
                        )}
                      </div>
                      <span className="leading-snug">{option}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanation on submit */}
              {isAnswerSubmitted && (
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-300 space-y-1">
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Explanation:
                  </div>
                  <p className="leading-relaxed text-slate-400">
                    {currentQ.explanation}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!isFinished && (
          <div className="border-t border-slate-800 px-6 py-3.5 bg-slate-950/70 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">
              Score: {score} / {quizQuestions.length}
            </span>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-all disabled:opacity-40"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 transition-all"
              >
                <span>{currentIndex < quizQuestions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
