import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export default function StudentQuizViewer({ lessonId, onComplete }: { lessonId: string, onComplete: () => void }) {
    const { data: quizzes = [], isLoading } = trpc.admin.getCourseQuizzes.useQuery({ lessonId });

    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [quizFinished, setQuizFinished] = useState(false);

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>;
    }

    if (quizzes.length === 0) {
        return null; // No quizzes for this lesson
    }

    const currentQuiz = quizzes[currentQuestionIdx];

    const handleSubmit = () => {
        if (selectedOption === null) return toast.error("Please select an answer");

        setIsSubmitted(true);
        if (selectedOption === currentQuiz.correctIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIdx < quizzes.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
        } else {
            setQuizFinished(true);
            onComplete(); // Always mark complete if they finish the quiz for now. Could mandate passing score later.
        }
    };

    if (quizFinished) {
        return (
            <Card className="bg-slate-50 border-slate-200 mt-6 overflow-hidden">
                <CardContent className="p-8 text-center flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">Quiz Completed!</h3>
                    <p className="text-slate-600">You scored {score} out of {quizzes.length}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white border-slate-200 shadow-sm mt-6">
            <CardContent className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Knowledge Check</h3>
                    <span className="text-sm font-medium text-slate-500">
                        Question {currentQuestionIdx + 1} of {quizzes.length}
                    </span>
                </div>

                <div className="mb-8">
                    <p className="text-lg text-slate-900 font-medium leading-relaxed">
                        {currentQuiz.question}
                    </p>
                </div>

                <div className="space-y-3 mb-8">
                    {currentQuiz.options?.map((opt: string, idx: number) => {
                        let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 ";

                        if (!isSubmitted) {
                            btnClass += selectedOption === idx
                                ? "border-blue-500 bg-blue-50 text-blue-900"
                                : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700";
                        } else {
                            if (idx === currentQuiz.correctIndex) {
                                btnClass += "border-green-500 bg-green-50 text-green-900";
                            } else if (selectedOption === idx && idx !== currentQuiz.correctIndex) {
                                btnClass += "border-red-500 bg-red-50 text-red-900 opacity-70";
                            } else {
                                btnClass += "border-slate-200 opacity-50";
                            }
                        }

                        return (
                            <button
                                key={idx}
                                disabled={isSubmitted}
                                onClick={() => setSelectedOption(idx)}
                                className={btnClass}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{opt}</span>
                                    {isSubmitted && idx === currentQuiz.correctIndex && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                                    {isSubmitted && selectedOption === idx && idx !== currentQuiz.correctIndex && <XCircle className="w-5 h-5 text-red-600" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="flex justify-end">
                    {!isSubmitted ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={selectedOption === null}
                            className="bg-slate-900 text-white hover:bg-slate-800"
                        >
                            Check Answer
                        </Button>
                    ) : (
                        <Button
                            onClick={handleNext}
                            className="bg-blue-600 text-white hover:bg-blue-700 min-w-[120px]"
                        >
                            {currentQuestionIdx < quizzes.length - 1 ? "Next Question" : "Finish Quiz"}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
