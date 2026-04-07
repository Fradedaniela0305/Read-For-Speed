import { useLocation } from "react-router-dom";
import { TestLocationState } from "../types/tests";
import TestQuestions from "./ReadingTestQuestions";
import BaselineTestOutro from "../components/BaselineTestOutro";

export default function BaselineTestQuestions() {
  const location = useLocation();
  const state = location.state as TestLocationState | null;

  const baselineTestId = state?.testId;
  const readingTimeSeconds = state?.readingTimeSeconds;
  const wordCount = state?.wordCount;

  return (
    <TestQuestions
      testId={baselineTestId}
      readingTimeSeconds={readingTimeSeconds}
      wordCount={wordCount}
      fetchQuestionsEndpoint={"/baseline/questions"}
      submitEndpoint="/baseline/submit"
      OutroComponent={BaselineTestOutro}
    />
  );
}