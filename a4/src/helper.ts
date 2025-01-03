import { Question } from "./questions";

export interface UndoRedoOperations {
  operation: "add" | "delete" | "edit";
  questions: Array<{ question: Question; index: number }>;
}

export function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}
