import { useState } from "preact/hooks";
import { Modebar } from "./components/modebar";
import { MiddleArea } from "./components/middlearea";
import { Statusbar } from "./components/statusbar";
import { Question, questions } from "./questions";
import { useEffect } from "preact/hooks";
import { QuestionsContext } from "./context";
import { UndoRedoOperations } from "./helper";

import "./app.css";

function getRandomQuestions(
  allQuestions: Question[],
  count: number
): Question[] {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function App() {
  const [mode, setMode] = useState<"list" | "quiz">("list");
  const [displayQuestions, setDisplayQuestions] = useState<Question[]>([]);
  const [questionsAnswered, setQuestionsAnswered] = useState<number>(1);
  const [isCheating, setIsCheating] = useState<boolean>(false);
  const [undoStack, setUndoStack] = useState<UndoRedoOperations[]>([]);
  const [redoStack, setRedoStack] = useState<UndoRedoOperations[]>([]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "?") {
        setIsCheating((cheating) => !cheating);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  });

  useEffect(() => {
    const initializedQuestions = questions.map((q) => ({
      ...q,
      isSelected: false,
    }));
    setDisplayQuestions(getRandomQuestions(initializedQuestions, 4));
  }, [questions]);

  const handleDisplayQuestions = (index: number) => {
    setDisplayQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        isSelected: !updatedQuestions[index].isSelected,
      };
      return updatedQuestions;
    });
  };

  const updateDisplayQuestion = (question: Question) => {
    setDisplayQuestions((prev) =>
      prev.map((q) => (q.id === question.id ? question : q))
    );

    const index = displayQuestions.findIndex((q) => q.id === question.id);
    setUndoStack((prev) => [
      ...prev,
      {
        operation: "edit",
        questions: [
          {
            question: displayQuestions[index],
            index,
          },
        ],
      },
    ]);
    setRedoStack([]);
  };

  const handleSelectAll = () => {
    setDisplayQuestions((prev) =>
      prev.map((q) => ({ ...q, isSelected: true }))
    );
  };

  const handleSelectNone = () => {
    setDisplayQuestions((prev) =>
      prev.map((q) => ({ ...q, isSelected: false }))
    );
  };

  const handleDeleteAll = () => {
    setDisplayQuestions((prev) => {
      const deletedQuestions = prev
        .map((q, index) => ({ question: q, index }))
        .filter(({ question }) => question.isSelected);
      setUndoStack((prev) => [
        ...prev,
        {
          operation: "delete",
          questions: deletedQuestions,
        },
      ]);
      setRedoStack([]);
      return prev.filter((q) => !q.isSelected);
    });
    // setDisplayQuestions((prev) => prev.filter((q) => !q.isSelected));
  };

  const handleAddQuestion = () => {
    if (displayQuestions.length < 10) {
      const newQuestion = {
        ...questions[Math.floor(Math.random() * questions.length)],
        isSelected: false,
      };
      setDisplayQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions, newQuestion];
        setUndoStack((prev) => [
          ...prev,
          {
            operation: "add",
            questions: [
              {
                question: newQuestion,
                index: updatedQuestions.length - 1,
              },
            ],
          },
        ]);
        return updatedQuestions;
      });
      setRedoStack([]);
    }
  };

  const incrementAnswered = () => {
    setQuestionsAnswered((prevQuestions) => prevQuestions + 1);
  };

  const undo = () => {
    const lastOperation = undoStack.pop();
    if (!lastOperation) {
      return;
    }
    const { operation, questions } = lastOperation;

    if (operation === "add") {
      setDisplayQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        questions.forEach(({ index }) => {
          updatedQuestions.splice(index, 1);
        });
        return updatedQuestions;
      });
      setRedoStack((prev) => [lastOperation, ...prev]);
    } else if (operation === "delete") {
      setDisplayQuestions((prevQuestions) => {
        const updatedQuestions = prevQuestions.map((q) => ({
          ...q,
          isSelected: false,
        }));

        questions.forEach(({ question, index }) => {
          question.isSelected = true;
          updatedQuestions.splice(index, 0, question);
        });
        return updatedQuestions;
      });
      setRedoStack((prev) => [lastOperation, ...prev]);
    } else if (operation === "edit") {
      setDisplayQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        questions.forEach(({ question, index }) => {
          updatedQuestions[index] = question;
        });
        return updatedQuestions;
      });
      setRedoStack((prev) => [
        {
          operation: "edit",
          questions: questions.map(({ index }) => ({
            question: displayQuestions[index],
            index,
          })),
        },
        ...prev,
      ]);
    }
  };

  const redo = () => {
    const lastOperation = redoStack.shift();
    if (!lastOperation) {
      return;
    }
    const { operation, questions } = lastOperation;

    if (operation === "add") {
      setDisplayQuestions((prevQuestions) => [
        ...prevQuestions,
        ...questions.map((entry) => entry.question),
      ]);
      setUndoStack((prev) => [...prev, lastOperation]);
    } else if (operation === "delete") {
      setDisplayQuestions((prevQuestion) =>
        prevQuestion.filter(
          (q) => !questions.some((entry) => entry.question.id === q.id)
        )
      );
      setUndoStack((prev) => [...prev, lastOperation]);
    } else if (operation === "edit") {
      setDisplayQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];
        questions.forEach(({ question, index }) => {
          updatedQuestions[index] = question;
        });
        return updatedQuestions;
      });
      setUndoStack((prev) => [
        {
          operation: "edit",
          questions: questions.map(({ index }) => ({
            question: displayQuestions[index], // The original version of the question
            index,
          })),
        },
        ...prev,
      ]);
    }
  };

  const disableAll =
    displayQuestions.length === 0 ||
    (displayQuestions.length > 0 &&
      displayQuestions.every((q) => q.isSelected));
  const disableNone =
    displayQuestions.length === 0 ||
    (displayQuestions.length > 0 &&
      displayQuestions.every((q) => !q.isSelected));
  const disableDelete =
    displayQuestions.length === 0 ||
    displayQuestions.every((q) => !q.isSelected);
  const disableAdd = displayQuestions.length >= 10;

  const handleModeChange = () => {
    if (mode === "list") {
      setMode("quiz");
    } else {
      setMode("list");
      setQuestionsAnswered(1);
    }
  };

  return (
    <QuestionsContext.Provider
      value={{
        questions: displayQuestions,
        handleSelectAll,
        handleSelectNone,
        handleDeleteAll,
        handleAddQuestion,
        incrementAnswered,
        disableAll,
        disableNone,
        disableDelete,
        disableAdd,
        questionsAnswered,
        isCheating,
        updateDisplayQuestion,
      }}
    >
      <div class="appContainer">
        <Modebar
          handleModeChange={handleModeChange}
          mode={mode}
          isQuizCompleted={
            questionsAnswered - 1 ===
            displayQuestions.filter((q) => q.isSelected).length
          }
          undo={undo}
          undoStack={undoStack}
          redo={redo}
          redoStack={redoStack}
        ></Modebar>
        <MiddleArea
          mode={mode}
          questions={displayQuestions}
          handleDisplayQuestions={handleDisplayQuestions}
        ></MiddleArea>
        <Statusbar displayQuestions={displayQuestions}></Statusbar>
      </div>
    </QuestionsContext.Provider>
  );
}
