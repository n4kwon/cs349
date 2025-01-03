import "./modebar.css";
import { QuestionsContext } from "../context";
import { useContext } from "preact/hooks";
import { UndoRedoOperations } from "../helper";

interface ModebarProps {
  handleModeChange: () => void;
  mode: "list" | "quiz";
  isQuizCompleted: boolean;
  undo: () => void;
  redo: () => void;
  undoStack: UndoRedoOperations[];
  redoStack: UndoRedoOperations[];
}

export function Modebar({
  handleModeChange,
  mode,
  isQuizCompleted,
  undo,
  undoStack,
  redo,
  redoStack,
}: ModebarProps) {
  const { questions, disableNone, questionsAnswered } =
    useContext(QuestionsContext);

  return (
    <div
      class={`w-full flex modebar ${
        mode === "quiz" ? "bg-blue-200" : "bg-gray-300"
      }`}
    >
      <div class="modebar-left">
        {mode === "list" && (
          <>
            <button
              class="undoButton bg-neutral-200 text-black border border-slate-950 rounded"
              onClick={undo}
              disabled={undoStack.length === 0}
            >
              Undo
            </button>
            <button
              class="redoButton bg-neutral-200 text-black border border-slate-950 rounded"
              onClick={redo}
              disabled={redoStack.length === 0}
            >
              Redo
            </button>
          </>
        )}
        {mode === "quiz" && isQuizCompleted ? (
          <span>Quiz Completed</span>
        ) : mode === "quiz" ? (
          <span>
            Question {questionsAnswered} of{" "}
            {questions.filter((q) => q.isSelected).length}
          </span>
        ) : null}
      </div>
      <button
        class="bg-neutral-200 text-black border border-slate-950 rounded modebar-button"
        onClick={() => handleModeChange()}
        disabled={disableNone}
      >
        {mode === "quiz" ? "Exit" : "Quiz"}
      </button>
    </div>
  );
}
