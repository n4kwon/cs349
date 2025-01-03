import { useContext } from "preact/hooks";
import { QuestionsContext } from "../context";
import "./toolbar.css";

interface ToolbarProps {}

export function Toolbar() {
  const {
    handleSelectAll,
    handleSelectNone,
    handleDeleteAll,
    handleAddQuestion,
    disableAll,
    disableNone,
    disableDelete,
    disableAdd,
  } = useContext(QuestionsContext);

  return (
    <div class="toolbar bg-slate-50">
      <button
        class="toolbar-button"
        onClick={handleSelectAll}
        disabled={disableAll}
      >
        All
      </button>
      <button
        class="toolbar-button"
        onClick={handleSelectNone}
        disabled={disableNone}
      >
        None
      </button>
      <button
        class="toolbar-button"
        onClick={handleDeleteAll}
        disabled={disableDelete}
      >
        Delete
      </button>
      <button
        class="toolbar-button"
        onClick={handleAddQuestion}
        disabled={disableAdd}
      >
        Add
      </button>
    </div>
  );
}
