import { Subject } from "./observer";
// Local import for array of random questions
import { questions as allQuestions } from "./questions";

type ReceivedQuestions = {
  question: string;
  answer: string;
  other1: string;
  other2: string;
};

export type Question = {
  id: number;
  question: string;
  answer: string;
  other1: string;
  other2: string;
  selected: boolean;
};

type ApplicationMode = "list" | "quiz" | "editQuestion";

let mode: ApplicationMode = "list";
let uniqueId = 1;
let showEditPanel = false;
let selectedQuestion: Question | undefined; // this for double click
let modeChanged = false;
let checkboxSelectedQuestions: Question[] = [];
let shallowCopy: Question[] = [];
let resetShallowCopy = true;
let beginQuiz = false;
let quizCompleted = false;
let quizCount = 1;

export class Model extends Subject {
  // model data (i.e. model state)
  private questions: Question[] = [];
  private count = 0;
  private correctQuizAnswers = 0;
  private incorrectQuizAnswers = 0;
  private cheating = false;
  private cheatingUpdate = false;

  constructor() {
    super();
    this.questions = this.getRandomQuestions(4).map((q) => ({
      ...q,
      selected: false,
      id: uniqueId++,
    }));
  }

  public getCheating() {
    return this.cheating;
  }

  public getCheatingUpdate() {
    return this.cheatingUpdate;
  }

  public updateQuestions(
    questionText: string,
    answerText: string,
    other1Text: string,
    other2Text: string
  ) {
    const outOfDateQuestion = this.getSelectedQuestion();
    for (let i = 0; i < this.questions.length; i++) {
      if (this.questions[i].id === outOfDateQuestion?.id) {
        this.questions[i].answer = answerText;
        this.questions[i].question = questionText;
        this.questions[i].other1 = other1Text;
        this.questions[i].other2 = other2Text;
      }
    }
  }

  public setCheatingUpdate(cheat: boolean) {
    this.cheatingUpdate = cheat;
  }

  public toggleCheating() {
    this.cheating = !this.cheating;
    this.setCheatingUpdate(true);
    this.notifyObservers();
  }

  public shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array]; // Create a copy of the array to avoid mutating the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  }

  public getCorrectAnswers() {
    return this.correctQuizAnswers;
  }

  public incrementOverall(
    selected: string,
    solution: string,
    reset: boolean = false
  ) {
    if (selected === solution) {
      this.correctQuizAnswers++;
    } else {
      this.incorrectQuizAnswers++;
    }
    if (reset) {
      this.correctQuizAnswers = 0;
      this.incorrectQuizAnswers = 0;
    }
  }

  public getIncorrectAnswers() {
    return this.incorrectQuizAnswers;
  }

  public getQuizCount() {
    return quizCount;
  }

  public incrementQuizCount() {
    quizCount++;
    this.notifyObservers();
  }

  public getQuizCompleted(): boolean {
    return quizCompleted;
  }

  public setQuizCompleted(completed: boolean) {
    quizCompleted = completed;
  }

  public getBeginQuiz(): boolean {
    return beginQuiz;
  }

  public setBeginQuiz(quiz: boolean) {
    beginQuiz = quiz;
  }

  public getShallowCopy() {
    return resetShallowCopy;
  }

  public notify() {
    this.notifyObservers();
  }

  public setShallowCopy(bool: boolean) {
    resetShallowCopy = bool;
  }

  public getCheckboxSelected(actualValue?: boolean): Question[] {
    if (actualValue) {
      return checkboxSelectedQuestions;
    }
    shallowCopy = [...checkboxSelectedQuestions];
    return shallowCopy;
  }

  public getModeChanged(): boolean {
    return modeChanged;
  }

  public setModeChanged(modeChange: boolean) {
    modeChanged = modeChange;
    this.notifyObservers();
  }

  public getMode(): string {
    return mode;
  }

  public setMode(newMode: ApplicationMode): void {
    mode = newMode;
    modeChanged = true;
    this.notifyObservers();
  }

  // Information methods
  public getQuestions(): Question[] {
    return this.questions;
  }

  public getQuestion(id: number): Question | undefined {
    return this.questions.find((t) => t.id === id);
  }

  public toggleCheckbox(index: number): void {
    this.questions[index].selected = !this.questions[index].selected;
    if (this.questions[index].selected) {
      if (!checkboxSelectedQuestions.includes(this.questions[index])) {
        checkboxSelectedQuestions.push(this.questions[index]);
      }
      this.count++;
    } else {
      this.count--;
      const indexValue = checkboxSelectedQuestions.indexOf(
        this.questions[index]
      );
      if (indexValue !== -1) {
        checkboxSelectedQuestions.splice(indexValue, 1);
      }
    }
    this.notifyObservers();
  }

  public getShowEditPanel(): boolean {
    return showEditPanel;
  }

  // these functions are for the double clicking of a question
  public getSelectedQuestion(): Question | undefined {
    if (selectedQuestion) {
      return selectedQuestion;
    } else {
      return undefined;
    }
  }

  public setSelectedQuestion(currentlySelectedQ: Question | undefined): void {
    selectedQuestion = currentlySelectedQ;
    this.notifyObservers();
  }

  public toggleShowEditPanel(): void {
    showEditPanel = !showEditPanel;
    this.notifyObservers();
  }

  public setShowEditPanel(showing: boolean): void {
    showEditPanel = showing;
    this.notifyObservers();
  }

  public selectAll(): void {
    for (let i = 0; i < this.questions.length; i++) {
      this.questions[i].selected = true;
    }
    for (let i = 0; i < this.questions.length; i++) {
      if (!checkboxSelectedQuestions.includes(this.questions[i])) {
        checkboxSelectedQuestions.push(this.questions[i]);
      }
    }
    this.count = this.questions.length;
    this.notifyObservers();
  }

  public areAllSelected(): boolean {
    return this.questions.every((q) => q.selected);
  }

  public areNoneSelected(): boolean {
    return !this.questions.some((q) => q.selected);
  }

  public deselectAll(): void {
    for (let i = 0; i < this.questions.length; i++) {
      this.questions[i].selected = false;
    }
    for (let i = 0; i < this.questions.length; i++) {
      const index = checkboxSelectedQuestions.indexOf(this.questions[i]);
      if (index !== -1) {
        checkboxSelectedQuestions.splice(index, 1);
      }
    }
    this.count = 0;
    this.notifyObservers();
  }

  public addRandomQuestion(): void {
    const randomQuestion =
      allQuestions[Math.floor(allQuestions.length * Math.random())];
    if (this.questions.length < 10) {
      this.questions.push({
        ...randomQuestion,
        selected: false,
        id: uniqueId++,
      });
      this.notifyObservers();
    }
  }

  public getShallowCopyValue(): Question[] {
    return shallowCopy;
  }

  public getRandomCheckboxSelectedQuestion(): Question | undefined {
    if (resetShallowCopy) {
      this.getCheckboxSelected();
      quizCount = 1;
    }
    resetShallowCopy = false;
    console.log(shallowCopy);
    if (shallowCopy.length > 0) {
      const randomIndex = Math.floor(Math.random() * shallowCopy.length);
      const removedQuestion = shallowCopy.splice(randomIndex, 1)[0];
      return removedQuestion;
    }
    return undefined;
  }

  public deleteSelected(): void {
    for (let i = this.questions.length - 1; i >= 0; i--) {
      if (this.questions[i].selected) {
        this.questions.splice(i, 1);
        this.count--;
      }
    }
    for (let i = checkboxSelectedQuestions.length - 1; i >= 0; i--) {
      if (checkboxSelectedQuestions[i].selected) {
        checkboxSelectedQuestions.splice(i, 1);
      }
    }
    uniqueId = 1;

    for (let i = 0; i < this.questions.length; i++) {
      this.questions[i].id = uniqueId++;
    }
    this.notifyObservers();
  }

  public getCount() {
    return this.count;
  }

  private getRandomQuestions(count: number): ReceivedQuestions[] {
    const randomQuestions: ReceivedQuestions[] = [];
    const usedIndices: Set<number> = new Set();
    while (randomQuestions.length < count) {
      const randomIndex = Math.floor(allQuestions.length * Math.random());
      if (!usedIndices.has(randomIndex)) {
        randomQuestions.push(allQuestions[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }
    return randomQuestions;
  }

  public getCorrectAnswerIndex(correctAnswer: string, randomArray: string[]) {
    return randomArray.findIndex((answer) => answer === correctAnswer);
  }
}
