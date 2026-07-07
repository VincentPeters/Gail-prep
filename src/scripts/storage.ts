/**
 * Client-side progress store, backed by localStorage.
 * Everything the learner does (quiz answers, exams, flashcard confidence)
 * is persisted locally in the browser — no backend, no account.
 */

const NS = "gail:v1:";

export interface QuestionStat {
  seen: number;
  correct: number;
  lastCorrect: boolean;
  lastSeen: number;
  domain: string;
}
export type QuestionStats = Record<string, QuestionStat>;

export interface ExamResult {
  id: string;
  date: number;
  score: number; // percent 0-100
  correct: number;
  total: number;
  durationSec: number;
  passed: boolean;
  perDomain: Record<string, { correct: number; total: number }>;
}

export type CardRating = "unknown" | "known";
export type FlashcardRatings = Record<string, CardRating>;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(NS + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    /* storage full or blocked — degrade silently */
  }
}

/* ---------------------------- Questions ---------------------------- */

export function getQuestionStats(): QuestionStats {
  return read<QuestionStats>("questionStats", {});
}

export function recordAnswer(
  questionId: string,
  domain: string,
  correct: boolean,
): void {
  const stats = getQuestionStats();
  const prev = stats[questionId] ?? {
    seen: 0,
    correct: 0,
    lastCorrect: false,
    lastSeen: 0,
    domain,
  };
  stats[questionId] = {
    seen: prev.seen + 1,
    correct: prev.correct + (correct ? 1 : 0),
    lastCorrect: correct,
    lastSeen: Date.now(),
    domain,
  };
  write("questionStats", stats);
}

/* ------------------------------ Exams ------------------------------ */

export function getExams(): ExamResult[] {
  return read<ExamResult[]>("exams", []);
}

export function recordExam(result: ExamResult): void {
  const exams = getExams();
  exams.push(result);
  // keep the most recent 25
  write("exams", exams.slice(-25));
}

/* ---------------------------- Flashcards ---------------------------- */

export function getFlashcardRatings(): FlashcardRatings {
  return read<FlashcardRatings>("flashcards", {});
}

export function setFlashcardRating(cardId: string, rating: CardRating): void {
  const ratings = getFlashcardRatings();
  ratings[cardId] = rating;
  write("flashcards", ratings);
}

/* ------------------------------ Reset ------------------------------ */

export function resetAll(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(NS))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* ignore */
  }
}

export function resetKey(
  key: "questionStats" | "exams" | "flashcards",
): void {
  try {
    localStorage.removeItem(NS + key);
  } catch {
    /* ignore */
  }
}
