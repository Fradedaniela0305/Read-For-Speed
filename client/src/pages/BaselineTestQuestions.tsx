import { useState, useEffect, useRef } from "react";
import { apiRequest } from "../api/client";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import QuestionCard from "../components/QuestionCard";
import { useProfile } from "../context/ProfileContext";

type BaselineLocationState = {
    baselineTestId?: number | string;
    readingTimeSeconds?: number;
    wordCount?: number;
};

type Question = {
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
};

type SubmitBaselineResponse = {
    success: boolean;
    wpm: number;
    accuracy: number;
    efficientWPM: number;
};

type SubmitBaselineRequest = {
    baselineTestId: number | string;
    answers: string[];
    correctAnswers: string[];
    readingTimeSeconds: number;
    wordCount: number;
}

export default function BaselineTestQuestions() {
    const navigate = useNavigate();

    const location = useLocation();
    const state = location.state as BaselineLocationState | null;

    const baselineTestId = state?.baselineTestId;
    const readingTimeSeconds = state?.readingTimeSeconds;
    const wordCount = state?.wordCount;

    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLocked, setIsLocked] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const answersRef = useRef<string[]>([]);
    const correctAnswersRef = useRef<string[]>([]);
    const [isFinished, setIsFinished] = useState<boolean>(false);

    const { refreshProfile } = useProfile();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const questions = (await apiRequest(
                    `/baseline/questions/${baselineTestId}`
                )) as Question[];

                setQuestions(questions);
            } catch (err) {
                console.error(err);
            }
        };

        fetchQuestions();
    }, [baselineTestId]);


    useEffect(() => {
        if (isFinished) {
            handleFinish();
        }
    }, [isFinished]);

    const handleAnswer = (selectedAnswer: string) => {
        if (isLocked) return;

        setIsLocked(true);

        correctAnswersRef.current.push(currentQuestion.correct_answer)
        answersRef.current.push(selectedAnswer);

        const nextIndex: number = currentQuestionIndex + 1;

        if (nextIndex >= questions.length) {
            setIsFinished(true);
            return;
        }

        setCurrentQuestionIndex(nextIndex);
        setIsLocked(false);
    };

    const handleFinish = async () => {

        const payload: SubmitBaselineRequest = {
            baselineTestId,
            correctAnswers: correctAnswersRef.current,
            answers: answersRef.current,
            readingTimeSeconds,
            wordCount
        };




        try {
            const data = await apiRequest<SubmitBaselineResponse>(
                "/baseline/submit", {
                method: "POST",
                body: JSON.stringify(payload)
            });

            console.log(data);

            navigate("/baselineresults", {
                replace: true,
                state: data,
            });

        } catch (err) {
            console.error(err)

        }
    }


    if (isFinished) {
        return <p>Rederecting...</p>;
    }


    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) {
        return <p>Loading...</p>;
    }
    const answersArray = [
        currentQuestion.option_a,
        currentQuestion.option_b,
        currentQuestion.option_c,
        currentQuestion.option_d,
    ];

    const answer = currentQuestion.correct_answer;


    return (
        <>
            <QuestionCard
                question_text={currentQuestion.question_text}
                options={answersArray}
                isLocked={isLocked}
                onAnswer={handleAnswer}
            />
        </>
    );
}