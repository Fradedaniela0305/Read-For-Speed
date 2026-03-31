import { useState, useEffect } from "react";
import { apiRequest } from "../api/client";
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom";
import QuestionCard from "../components/QuestionCard"

export default function BaselineTestQuestions() {

    const location = useLocation()

    const baselineTestId = location.state?.baselineTestId
    const readingTimeSeconds = location.state?.readingTimeSeconds
    const wordCount = location.state?.wordCount

    const [questions, setQuestions] = useState([])
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answers, setAnswers] = useState([])
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {

        const fetchQuestions = async () => {
            try {
                const questions = await apiRequest(`/baseline/questions/${baselineTestId}`)
                setQuestions(questions)

            } catch (err) {
                console.error(err)
            }
        }
        fetchQuestions()

    }, [])

    if (!currentQuestion) {
        return <p>Loading...</p>;
    }

    const currentQuestion = questions[currentQuestionIndex]
    const answersArray = [currentQuestion.option_a, currentQuestion.option_b, currentQuestion.option_c,currentQuestion.option_d]


    return (
        <>
            <QuestionCard question_text={currentQuestion.question_text}  />
        </>


    )


}