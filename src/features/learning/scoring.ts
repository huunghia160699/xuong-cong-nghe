/** Chấm điểm cho bản quiz demo. Bản có tài khoản thật phải chấm tại server. */
export type ScorableQuestion = { id: number; correctIndex: number };

export function gradeQuiz(
  questions: readonly ScorableQuestion[],
  answers: Readonly<Record<string, number>>,
): { correct: number; total: number; score: number } {
  const total = questions.length;
  const correct = questions.reduce((count, question) =>
    count + (answers[String(question.id)] === question.correctIndex ? 1 : 0), 0);
  return { correct, total, score: total === 0 ? 0 : Math.round(correct / total * 100) };
}
