import { useLocation } from "react-router-dom";
import { TestLocationState } from "../types/tests";
import TestQuestions from "./ReadingTestQuestions";
import ProgressTestOutro from "../components/ProgressTestOutro";

export default function ProgressTestQuestions() {
  const location = useLocation();
  const state = location.state as TestLocationState | null;

  const progressTestId = state?.testId;
  const readingTimeSeconds = state?.readingTimeSeconds;
  const wordCount = state?.wordCount;

  return (
    <TestQuestions
      testId={progressTestId}
      readingTimeSeconds={readingTimeSeconds}
      wordCount={wordCount}
      fetchQuestionsEndpoint={"/progress/questions/"}
      submitEndpoint="/progress/submit"
      OutroComponent={ProgressTestOutro}
    />
  );
}