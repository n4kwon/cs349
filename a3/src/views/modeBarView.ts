import { Model } from "../model";
import View from "../view";

import "./modeBarView.css";

export class ModeBarView implements View {
  update(): void {
    this.quizButton.disabled = this.model.numSelectedQuestions === 0;
    this.undoButton.disabled = !this.model.undosPossible;
    this.redoButton.disabled = !this.model.redosPossible;
    if (!this.model.updatedBecauseCheat) {
      if (this.model.modeType === "quiz") {
        this.undoButton.style.display = "none";
        this.redoButton.style.display = "none";
        this.container.style.backgroundColor = "lightblue";
        this.quizButton.textContent = "Exit";
        if (this.model.quizQuestions === 0) {
          this.questionCount.innerText = "Quiz Completed";
          console.log(this.model.numCorrect, this.model.numIncorrect);
        } else {
          this.questionCount.innerText = `Question ${this.model.answeredQuestions} of ${this.model.numSelectedQuestions}`;
        }
      } else {
        this.undoButton.style.display = "flex";
        this.redoButton.style.display = "flex";
        this.container.style.backgroundColor = "lightgrey";
        this.quizButton.textContent = "Quiz";
        this.questionCount.innerText = "";
      }
    }
  }

  private container: HTMLDivElement;
  private statusContainer: HTMLDivElement;
  private questionCount: HTMLDivElement;
  private quizButton: HTMLButtonElement;

  private undoButton: HTMLButtonElement;
  private redoButton: HTMLButtonElement;

  get root(): HTMLDivElement {
    return this.container;
  }

  constructor(private model: Model) {
    this.container = document.createElement("div");
    this.container.id = "modeBar";

    this.statusContainer = document.createElement("div");
    this.statusContainer.id = "statusContainer";

    this.questionCount = document.createElement("div");
    this.questionCount.id = "questionCount";

    this.undoButton = document.createElement("button");
    this.undoButton.id = "undoButton";
    this.undoButton.innerText = "Undo";
    this.undoButton.addEventListener("click", () => {
      this.model.undo();
    });

    this.redoButton = document.createElement("button");
    this.redoButton.id = "redoButton";
    this.redoButton.innerText = "Redo";
    this.redoButton.addEventListener("click", () => {
      this.model.redo();
    });

    this.quizButton = document.createElement("button");
    this.quizButton.innerText = "Quiz";
    this.quizButton.addEventListener("click", () => {
      // using setter from model
      if (this.model.modeType === "list") {
        this.model.createSelectedSnapshot();
        this.model.modeType = "quiz";
      } else {
        this.model.resetQuestionCount();
        this.model.modeType = "list";
      }
    });

    this.statusContainer.append(this.questionCount);
    this.statusContainer.append(this.undoButton);
    this.statusContainer.append(this.redoButton);

    this.container.append(this.statusContainer);
    this.container.append(this.quizButton);
    this.model.addObserver(this);
  }
}
