"use client";

import { useEffect, useState } from "react";
import { quizQuestions } from "@/data/mock";
import { gradeQuiz } from "@/features/learning/scoring";

const STORAGE_KEY = "xuong-cong-nghe:demo-learning:v1";
const CHANGED_EVENT = "xuong-cong-nghe:demo-learning-changed";

export type DemoQuizAttempt = {
  id: string;
  submittedAt: string;
  answers: Record<string, number>;
  correct: number;
  total: number;
  score: number; // percent, 0–100
};

export type DemoLearningState = {
  completedLessons: Record<string, string>;
  quizDraft: Record<string, number>;
  attempts: DemoQuizAttempt[];
};

const emptyState: DemoLearningState = { completedLessons: {}, quizDraft: {}, attempts: [] };

function readState(): DemoLearningState {
  if (typeof window === "undefined") return emptyState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return emptyState;
    const data = parsed as Partial<DemoLearningState>;
    return {
      completedLessons: data.completedLessons && typeof data.completedLessons === "object" && !Array.isArray(data.completedLessons) ? data.completedLessons : {},
      quizDraft: data.quizDraft && typeof data.quizDraft === "object" && !Array.isArray(data.quizDraft) ? data.quizDraft : {},
      attempts: Array.isArray(data.attempts) ? data.attempts.slice(0, 30) : [],
    };
  } catch {
    return emptyState;
  }
}

function persistState(next: DemoLearningState): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGED_EVENT));
    return true;
  } catch {
    return false;
  }
}

/** Chỉ dùng cho bản demo không đăng nhập. Không dùng điểm client để cấp quyền hoặc chứng nhận. */
export function useDemoLearning() {
  const [state, setState] = useState<DemoLearningState>(emptyState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setState(readState());
    sync();
    setReady(true);
    window.addEventListener(CHANGED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function completeLesson(slug: string): boolean {
    const current = readState();
    return persistState({
      ...current,
      completedLessons: { ...current.completedLessons, [slug]: new Date().toISOString() },
    });
  }

  function setQuizAnswer(questionId: number, optionIndex: number | null): boolean {
    const current = readState();
    const quizDraft = { ...current.quizDraft };
    if (optionIndex === null) delete quizDraft[String(questionId)];
    else quizDraft[String(questionId)] = optionIndex;
    return persistState({ ...current, quizDraft });
  }

  function submitQuiz(): string | null {
    const current = readState();
    const answers = { ...current.quizDraft };
    const { total, correct, score } = gradeQuiz(quizQuestions, answers);
    const attempt: DemoQuizAttempt = {
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      answers,
      correct,
      total,
      score,
    };
    const saved = persistState({
      ...current,
      quizDraft: {},
      attempts: [attempt, ...current.attempts].slice(0, 30),
    });
    return saved ? attempt.id : null;
  }

  function clearQuizDraft(): boolean {
    const current = readState();
    return persistState({ ...current, quizDraft: {} });
  }

  return { state, ready, completeLesson, setQuizAnswer, submitQuiz, clearQuizDraft };
}
