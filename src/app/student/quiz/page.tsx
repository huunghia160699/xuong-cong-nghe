import DemoQuiz from "@/features/learning/components/demo-quiz";
import { LiveQuiz } from "@/features/learning/components/live-quiz";
import { isLiveMode } from "@/lib/supabase/config";

export default function QuizPage() {
  return isLiveMode() ? <LiveQuiz /> : <DemoQuiz />;
}
