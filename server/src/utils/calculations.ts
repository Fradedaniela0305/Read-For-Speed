export function calculateWPM(wordCount: number, readingTimeSeconds: number): number {
  if (readingTimeSeconds <= 0) return 0;

  const wpm = wordCount / (readingTimeSeconds / 60);
  return Math.round(wpm);
}

export function calculateAccuracy(correctAnswers: string[], userAnswers: string[]): number {
  if (correctAnswers.length !== userAnswers.length) {
    throw new Error(
      `Array length mismatch: correctAnswers (${correctAnswers.length}) and userAnswers (${userAnswers.length}) must be the same length.`
    );
  }

  if (correctAnswers.length === 0) {
    throw new Error("Correct Answers is Empty");
  }

  const score = correctAnswers.filter((answer, index) => answer === userAnswers[index]).length;
  return score / correctAnswers.length;
}

export function calculateEfficientWPM(wpm: number, accuracy: number): number {
  if (accuracy >= 0.85) return Math.round(wpm);
  if (accuracy >= 0.7) return Math.round(wpm * 0.9);
  if (accuracy >= 0.5) return Math.round(wpm * 0.8);
  return Math.round(wpm * 0.7);
}