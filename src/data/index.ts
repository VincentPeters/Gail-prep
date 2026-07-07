import type { Question, Flashcard } from "./types";
import { DOMAINS } from "./domains";

// Auto-aggregate every per-domain JSON file so adding a domain bank is drop-in.
const questionModules = import.meta.glob<{ default: Question[] }>(
  "./questions/*.json",
  { eager: true },
);
const flashcardModules = import.meta.glob<{ default: Flashcard[] }>(
  "./flashcards/*.json",
  { eager: true },
);

export const QUESTIONS: Question[] = Object.values(questionModules)
  .flatMap((m) => m.default)
  .sort((a, b) => a.id.localeCompare(b.id));

export const FLASHCARDS: Flashcard[] = Object.values(flashcardModules)
  .flatMap((m) => m.default)
  .sort((a, b) => a.id.localeCompare(b.id));

export function questionsByDomain(domainId: string): Question[] {
  return QUESTIONS.filter((q) => q.domain === domainId);
}

export function flashcardsByDomain(domainId: string): Flashcard[] {
  return FLASHCARDS.filter((f) => f.domain === domainId);
}

export function questionCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const d of DOMAINS) counts[d.id] = 0;
  for (const q of QUESTIONS) counts[q.domain] = (counts[q.domain] ?? 0) + 1;
  return counts;
}

export { DOMAINS };
export type { Question, Flashcard };
