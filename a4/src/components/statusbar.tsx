import { useContext } from "preact/hooks";
import { Question } from "../questions";
import "./statusbar.css";
import { QuestionsContext } from "../context";

interface StatusbarProps {
  displayQuestions: Question[];
}

export function Statusbar({ displayQuestions }: StatusbarProps) {
  const { isCheating } = useContext(QuestionsContext);
  const selected = displayQuestions.filter((q) => q.isSelected).length;

  const message =
    displayQuestions.length === 0
      ? ""
      : displayQuestions.length === 1
      ? `1 question${selected > 0 ? ` (${selected} selected)` : ""}`
      : `${displayQuestions.length} questions${
          selected > 0 ? ` (${selected} selected)` : ""
        }`;

  return (
    <div class="bg-gray-300" id="statusBar">
      <div class="statusbar-message" id="statusMessage">
        <span class="text-base">{message}</span>
      </div>
      <div class="statusbar-right">{isCheating && <span>CHEATING</span>}</div>
    </div>
  );
}
