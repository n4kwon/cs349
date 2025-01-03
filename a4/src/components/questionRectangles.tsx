import { Question } from "../questions";

interface QuestionRectangleProps {
  question: Question;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: () => void;
}

import "./questionRectangles.css";

export function QuestionRectangle({
  question,
  isSelected,
  onSelect,
  onDoubleClick,
}: QuestionRectangleProps) {
  return (
    <li
      class="bg-blue-200 text-black font-sans text-[10pt] flex items-center justify-center"
      onDblClick={onDoubleClick}
    >
      <label class="checkbox-container">
        <input
          type="checkbox"
          class="checkbox"
          checked={isSelected}
          onChange={onSelect}
        />
      </label>
      <span class="question-text">{question.question}</span>
    </li>
  );
}
