import { createContext } from "preact";
import { Question } from "./questions";

export const QuestionsContext = createContext<{
  questions: Question[];
  handleSelectAll: () => void;
  handleSelectNone: () => void;
  handleDeleteAll: () => void;
  handleAddQuestion: () => void;
  incrementAnswered: () => void;
  disableAll: boolean;
  disableNone: boolean;
  disableDelete: boolean;
  disableAdd: boolean;
  questionsAnswered: number;
  isCheating: boolean;
  updateDisplayQuestion: (question: Question) => void;
}>({
  questions: [],
  handleSelectAll: () => {},
  handleSelectNone: () => {},
  handleDeleteAll: () => {},
  handleAddQuestion: () => {},
  incrementAnswered: () => {},
  disableAll: false,
  disableNone: false,
  disableDelete: false,
  disableAdd: false,
  questionsAnswered: 0,
  isCheating: false,
  updateDisplayQuestion: () => {},
});
