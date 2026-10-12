import { QuizResult } from "@/features/learning/components/quiz-result";
import { LiveQuizResult } from "@/features/learning/components/live-quiz-result";
import { isLiveMode } from "@/lib/supabase/config";

export default async function QuizResultPage({ params }: { params: Promise<{ attemptId: string }> }) {
  const { attemptId } = await params;
  return isLiveMode() ? <LiveQuizResult attemptId={attemptId} /> : <QuizResult attemptId={attemptId} />;
}
