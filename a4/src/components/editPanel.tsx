import { useContext, useEffect, useState } from "preact/hooks";
import { Question } from "../questions";
import "./editPanel.css";
import { QuestionsContext } from "../context";

interface EditPanelProps {
  editQuestion: Question | null;
  hideEditPanel: () => void;
}

export function EditPanel({ editQuestion, hideEditPanel }: EditPanelProps) {
  const [editedQuestion, setEditedQuestion] = useState<Question>();
  const { updateDisplayQuestion } = useContext(QuestionsContext);

  useEffect(() => {
    if (editQuestion) {
      setEditedQuestion(editQuestion);
    }
  }, [editQuestion]);

  const handleInputChange = (field: keyof Question, value: string) => {
    setEditedQuestion(() => {
      return {
        ...editedQuestion,
        [field]: value,
      } as Question;
    });
  };

  return (
    <div class="editPanelOverlay">
      <div class="editPanel bg-slate-50">
        <form id="editForm">
          <div class="formGroup">
            <label for="questionText" class="labelText">
              Question
            </label>
            <input
              type="text"
              id="questionText"
              name="questionText"
              value={editedQuestion?.question || ""}
              onChange={(e) =>
                handleInputChange("question", e.currentTarget.value)
              }
            ></input>
          </div>
          <div class="formGroup">
            <label for="answerText" class="labelText answer">
              Answer
            </label>
            <input
              type="text"
              id="answerText"
              name="answerText"
              value={editedQuestion?.answer || ""}
              onChange={(e) =>
                handleInputChange("answer", e.currentTarget.value)
              }
            ></input>
          </div>
          <div class="formGroup">
            <label for="other1Text" class="labelText answer">
              Other 1
            </label>
            <input
              type="text"
              id="other1Text"
              name="other1Text"
              value={editedQuestion?.other1 || ""}
              onChange={(e) =>
                handleInputChange("other1", e.currentTarget.value)
              }
            ></input>
          </div>
          <div class="formGroup">
            <label for="other2Text" class="labelText answer">
              Other 2
            </label>
            <input
              type="text"
              id="other2Text"
              name="other2Text"
              value={editedQuestion?.other2 || ""}
              onChange={(e) =>
                handleInputChange("other2", e.currentTarget.value)
              }
            ></input>
          </div>
          <div class="buttonGroup">
            <button
              type="button"
              class="saveButton"
              onClick={() => {
                if (editedQuestion) {
                  updateDisplayQuestion(editedQuestion);
                }
                hideEditPanel();
              }}
            >
              Save
            </button>
            <button type="button" class="cancelButton" onClick={hideEditPanel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
