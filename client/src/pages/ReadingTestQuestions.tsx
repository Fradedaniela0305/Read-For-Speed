import { useState, useEffect, useRef } from "react";
import { apiRequest } from "../api/client";
import QuestionCard from "../components/QuestionCard";
import { useProfile } from "../context/ProfileContext";
import { ComponentType } from "react";

type SubmitTestResponse = {
    success: boolean;
    wpm: number;
    accuracy: number;
    efficientWPM: number;
};

type TestQuestionsProps = {
    testId: number | string;
    readingTimeSeconds: number;
    wordCount: number;
    submitEndpoint: string;
    fetchQuestionsEndpoint: string;
    OutroComponent: ComponentType<{ data: SubmitTestResponse }>;
};

type Question = {
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
};

type SubmitTestRequest = {
    testId: number | string;
    answers: string[];
    correctAnswers: string[];
    readingTimeSeconds: number;
    wordCount: number;
};

export default function TestQuestions({
    testId,
    readingTimeSeconds,
    wordCount,
    submitEndpoint,
    fetchQuestionsEndpoint,
    OutroComponent,
}: TestQuestionsProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLocked, setIsLocked] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const answersRef = useRef<string[]>([]);
    const correctAnswersRef = useRef<string[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [data, setData] = useState<SubmitTestResponse | null>(null);

    const { refreshProfile } = useProfile();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const questions = (await apiRequest(
                    `${fetchQuestionsEndpoint}/${testId}`
                )) as Question[];

                setQuestions(questions);
            } catch (err) {
                console.error(err);
            }
        };

        fetchQuestions();
    }, [testId]);

    useEffect(() => {
        if (isFinished) {
            handleFinish();
        }
    }, [isFinished]);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswer = (selectedAnswer: string) => {
        if (isLocked || !currentQuestion) return;

        setIsLocked(true);

        correctAnswersRef.current.push(currentQuestion.correct_answer);
        answersRef.current.push(selectedAnswer);

        const nextIndex = currentQuestionIndex + 1;

        if (nextIndex >= questions.length) {
            setIsFinished(true);
            return;
        }

        setCurrentQuestionIndex(nextIndex);
        setIsLocked(false);
    };

    const handleFinish = async () => {
        const payload: SubmitTestRequest = {
            testId,
            correctAnswers: correctAnswersRef.current,
            answers: answersRef.current,
            readingTimeSeconds,
            wordCount,
        };

        try {
            const response = await apiRequest<SubmitTestResponse>(submitEndpoint, {
                method: "POST",
                body: JSON.stringify(payload),
            });

            setData(response);
            await refreshProfile();
        } catch (err) {
            console.error(err);
        }
    };

    if (isFinished) {
        if (!data) {
            return <div>Calculating metrics...</div>;
        }

        return <OutroComponent data={data} />;
    }

    if (!currentQuestion) {
        return <p>Loading...</p>;
    }

    const answersArray = [
        currentQuestion.option_a,
        currentQuestion.option_b,
        currentQuestion.option_c,
        currentQuestion.option_d,
    ];

    return (
        <QuestionCard
            question_text={currentQuestion.question_text}
            options={answersArray}
            isLocked={isLocked}
            onAnswer={handleAnswer}
        />
    );
}