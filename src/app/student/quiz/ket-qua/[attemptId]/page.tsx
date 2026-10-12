import { QuizResult } from "@/features/learning/components/quiz-result";

export default async function QuizResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  return <QuizResult attemptId={attemptId} />;
}
