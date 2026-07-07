export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  domain: string; // Domain.id
  difficulty: Difficulty;
  question: string;
  options: string[];
  /** Index into `options` of the correct answer. */
  answer: number;
  explanation: string;
  /** Optional short topic label for review. */
  topic?: string;
}

export interface Flashcard {
  id: string;
  domain: string; // Domain.id
  front: string;
  back: string;
}
