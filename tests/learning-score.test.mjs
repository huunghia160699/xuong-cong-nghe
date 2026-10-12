import test from "node:test";
import assert from "node:assert/strict";
import { gradeQuiz } from "../src/features/learning/scoring.ts";

const questions = [{ id: 1, correctIndex: 0 }, { id: 2, correctIndex: 2 }, { id: 3, correctIndex: 1 }];

test("all correct answers receive 100%", () => {
  assert.deepEqual(gradeQuiz(questions, { 1: 0, 2: 2, 3: 1 }), { correct: 3, total: 3, score: 100 });
});

test("incorrect and unanswered questions receive zero credit", () => {
  assert.deepEqual(gradeQuiz(questions, { 1: 0, 2: 1 }), { correct: 1, total: 3, score: 33 });
});

test("empty quiz does not divide by zero", () => {
  assert.deepEqual(gradeQuiz([], {}), { correct: 0, total: 0, score: 0 });
});
