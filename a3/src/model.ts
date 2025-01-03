import { Subject } from "./observer";
import { questions } from "./questions";

export interface Question {
  questionText: string;
  option1Text: string;
  option2Text: string;
  option3Text: string;
  selected: boolean;
}

export class Model extends Subject {
  private questionState: Question[] = [];
  private mode: "list" | "quiz" = "list";
  private selectedSnapshot: Question[] = [];
  private answeredCount = 1;
  private correct = 0;
  private incorrect = 0;
  private cheating = false;
  private cheatingUpdate = false;
  private undoStack: Array<{
    operation: "add" | "delete";
    questions: Array<{ question: Question; index: number }>;
  }> = [];
  private redoStack: Array<{
    operation: "add" | "delete";
    questions: Array<{ question: Question; index: number }>;
  }> = [];

  get numQuestions() {
    return this.questionState.length;
  }

  get numCorrect() {
    return this.correct;
  }

  get numIncorrect() {
    return this.incorrect;
  }

  get quizQuestions() {
    return this.selectedSnapshot.length;
  }

  get answeredQuestions() {
    return this.answeredCount;
  }

  get undosPossible() {
    return this.undoStack.length > 0;
  }

  get redosPossible() {
    return this.redoStack.length > 0;
  }

  get isCheating() {
    return this.cheating;
  }

  get updatedBecauseCheat() {
    return this.cheatingUpdate;
  }

  set cheatUpdate(update: boolean) {
    this.cheatingUpdate = update;
  }

  get numSelectedQuestions() {
    return this.questionState.filter((q) => q.selected).length;
  }

  get modeType() {
    return this.mode;
  }

  set modeType(newType: "list" | "quiz") {
    this.mode = newType;
    this.notifyObservers();
  }

  resetQuestionCount() {
    this.correct = 0;
    this.incorrect = 0;
  }

  getQuestionState() {
    return this.questionState;
  }

  callObservers() {
    this.notifyObservers();
  }

  getRandomQuestion() {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  }

  getInitialQuestions() {
    for (let i = 0; i < 4; i++) {
      const questionSelected = this.getRandomQuestion();
      this.questionState.push({
        questionText: questionSelected.question,
        option1Text: questionSelected.answer,
        option2Text: questionSelected.other1,
        option3Text: questionSelected.other2,
        selected: false,
      });
    }
    this.notifyObservers();
  }

  getCorrectOption(randomSelected: Question) {
    const originalQuestion = this.questionState.find(
      (q) => q.questionText === randomSelected.questionText
    );
    if (randomSelected.option1Text === originalQuestion?.option1Text) {
      return "option1";
    } else if (randomSelected.option2Text === originalQuestion?.option1Text) {
      return "option2";
    } else if (randomSelected.option3Text === originalQuestion?.option1Text) {
      return "option3";
    }
    return "";
  }

  updateQuestionState() {
    const deletedQuestions = this.questionState
      .map((question, index) => ({ question, index }))
      .filter(({ question }) => question.selected);
    this.questionState = this.questionState.filter(
      (question) => !question.selected
    );
    this.undoStack.push({ operation: "delete", questions: deletedQuestions });
    this.redoStack = [];
    this.notifyObservers();
  }

  undo() {
    const lastAction = this.undoStack.pop();
    if (lastAction) {
      if (lastAction.operation === "add") {
        // remove added questions
        lastAction.questions.forEach(({ question }) => {
          const index = this.questionState.indexOf(question);
          if (index !== -1) {
            this.questionState.splice(index, 1);
          }
        });
      } else if (lastAction.operation === "delete") {
        this.questionState.forEach((question) => {
          question.selected = false;
        });
        lastAction.questions.forEach(({ question, index }) => {
          question.selected = true;
          this.questionState.splice(index, 0, question);
        });
      }
      this.redoStack.push(lastAction);
      this.notifyObservers();
    }
  }

  redo() {
    const lastUndone = this.redoStack.pop();
    if (lastUndone) {
      if (lastUndone.operation === "add") {
        lastUndone.questions.forEach(({ question }) => {
          this.questionState.push(question);
        });
      } else if (lastUndone.operation === "delete") {
        // lastUndone.questions.forEach((question) => {
        //   const index = this.questionState.indexOf(question);
        //   if (index !== -1) {
        //     this.questionState.splice(index, 1);
        //   }
        // });
        lastUndone.questions
          .slice()
          .sort((a, b) => b.index - a.index)
          .forEach(({ index }) => {
            this.questionState.splice(index, 1);
          });
      }
      this.undoStack.push(lastUndone);
      this.notifyObservers();
    }
  }

  setSelected(all: boolean) {
    this.questionState.forEach((question, index) => {
      question.selected = all;
    });
    this.notifyObservers();
  }

  createSelectedSnapshot() {
    this.selectedSnapshot = this.questionState.filter(
      (question) => question.selected
    );
    this.answeredCount = 1;
  }

  questionAnswerSelected(question: string, selectedOption: string) {
    this.answeredCount++;
    const quizQuestion = this.questionState.find((q) => {
      return q.questionText === question;
    });
    if (quizQuestion?.option1Text === selectedOption) {
      this.correct++;
    } else {
      this.incorrect++;
    }
    this.notifyObservers();
  }

  chooseRandomSelected() {
    const randomIndex = Math.floor(
      Math.random() * this.selectedSnapshot.length
    );

    const originalQuestion = this.selectedSnapshot.splice(randomIndex, 1)[0];
    const randomQuestion = { ...originalQuestion };

    const options = [
      randomQuestion.option1Text,
      randomQuestion.option2Text,
      randomQuestion.option3Text,
    ];

    options.sort(() => Math.random() - 0.5);
    randomQuestion.option1Text = options[0];
    randomQuestion.option2Text = options[1];
    randomQuestion.option3Text = options[2];

    return randomQuestion;
  }

  toggleCheating() {
    this.cheating = !this.cheating;
    this.cheatingUpdate = true;
    this.notifyObservers();
  }

  addQuestion() {
    if (this.questionState.length < 10) {
      const selectedQuestion = this.getRandomQuestion();
      const formattedQuestion: Question = {
        questionText: selectedQuestion.question,
        option1Text: selectedQuestion.answer,
        option2Text: selectedQuestion.other1,
        option3Text: selectedQuestion.other2,
        selected: false,
      };
      const index = this.questionState.length;
      this.questionState.push(formattedQuestion);
      this.undoStack.push({
        operation: "add",
        questions: [{ question: formattedQuestion, index }],
      });
      this.redoStack = [];
      this.notifyObservers();
    }
  }
}
