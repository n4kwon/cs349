import { useContext, useEffect, useState, useMemo } from "preact/hooks";
import { Question } from "../questions";
import { QuestionRectangle } from "./questionRectangles";
import { Toolbar } from "./toolbar";
import { QuestionsContext } from "../context";
import { shuffleArray } from "../helper";

import "./middlearea.css";
import { EditPanel } from "./editPanel";

interface MiddleAreaProps {
  mode: "list" | "quiz";
  questions: Question[];
  handleDisplayQuestions: (index: number) => void;
}

export function MiddleArea({
  mode,
  questions,
  handleDisplayQuestions,
}: MiddleAreaProps) {
  const [actualQuiz, setActualQuiz] = useState<Question[]>([]);
  const [currentQuizQuestion, setCurrentQuizQuestion] =
    useState<Question | null>(null);
  const [correctQuestions, setCorrectQuestions] = useState<number>(0);
  const [incorrectQuestions, setIncorrectQuestions] = useState<number>(0);
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [editPanelVisible, setEditPanelVisible] = useState<boolean>(false);

  const { incrementAnswered, isCheating } = useContext(QuestionsContext);

  useEffect(() => {
    const quizQuestions = questions.filter((q) => q.isSelected);
    setActualQuiz(quizQuestions);
    selectRandomQuestion(quizQuestions);
    setCorrectQuestions(0);
    setIncorrectQuestions(0);
    setIsQuizCompleted(false);
  }, [questions, mode]);

  const selectRandomQuestion = (quizQuestions: Question[]) => {
    const randomIndex = Math.floor(Math.random() * quizQuestions.length);
    const selectedQuestion = quizQuestions[randomIndex];

    setCurrentQuizQuestion(selectedQuestion);
    setActualQuiz((prev) => prev.filter((val, index) => index !== randomIndex));
  };

  const getRandomOptions = (question: Question) => {
    const options = [
      { text: question.answer, key: "Answer" },
      { text: question.other1, key: "Option 1" },
      { text: question.other2, key: "Option 2" },
    ];
    return shuffleArray(options);
  };

  const shuffledOptions = useMemo(() => {
    return currentQuizQuestion ? getRandomOptions(currentQuizQuestion) : [];
  }, [currentQuizQuestion]);

  const goToNextQuestion = () => {
    if (actualQuiz.length === 0) {
      setCurrentQuizQuestion(null);
      setIsQuizCompleted(true);
      console.log(correctQuestions);
      return;
    }
    selectRandomQuestion(actualQuiz);
  };

  const handleAnswerQuestion = (answer: string) => {
    if (answer === currentQuizQuestion?.answer) {
      setCorrectQuestions((q) => q + 1);
    } else {
      setIncorrectQuestions((q) => q + 1);
    }
    incrementAnswered();
    goToNextQuestion();
  };

  const handleDoubleClick = (question: Question) => {
    setEditQuestion(question);
    setEditPanelVisible(true);
  };

  const hideEditPanel = () => {
    setEditPanelVisible(false);
  };

  return (
    <>
      <div class="flex-grow bg-white overflow-y-auto middle-area">
        {mode === "list" ? (
          <div id="listMode" class="mode-container">
            <Toolbar></Toolbar>
            <div id="questionList">
              <ul class="question-boxes flex flex-wrap actualList">
                {questions.map((question, index) => (
                  <QuestionRectangle
                    key={index}
                    question={question}
                    isSelected={question.isSelected}
                    onSelect={() => handleDisplayQuestions(index)}
                    onDoubleClick={() => handleDoubleClick(question)}
                  ></QuestionRectangle>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div class="quiz-questions">
            {isQuizCompleted ? (
              <div class="results">
                <span>
                  {correctQuestions} Correct, {incorrectQuestions} Incorrect
                </span>
              </div>
            ) : (
              <div class="question-panel">
                <span class="text-question">
                  {currentQuizQuestion?.question}
                </span>
                <div class="answer-buttons">
                  {shuffledOptions.map((val, index) => (
                    <button
                      key={index}
                      class={`${
                        isCheating && val.text === currentQuizQuestion?.answer
                          ? "highlight-correct"
                          : ""
                      }`}
                      onClick={() => handleAnswerQuestion(val.text)}
                    >
                      {val.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {editPanelVisible && (
        <EditPanel
          editQuestion={editQuestion}
          hideEditPanel={hideEditPanel}
        ></EditPanel>
      )}
    </>
  );
}
