export const REQUIRED_SESSIONS_FOR_TEST = 5;

export function canUserTakeTest(completedSessionCount: number): boolean {
  return completedSessionCount >= REQUIRED_SESSIONS_FOR_TEST;
}