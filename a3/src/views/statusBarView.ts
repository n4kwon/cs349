import { Model } from "../model";
import View from "../view";

import "./statusBarView.css";

export class StatusBarView implements View {
  update(): void {
    if (this.model.isCheating) {
      this.cheatingMessage.innerText = "CHEATING";
    } else {
      this.cheatingMessage.innerText = "";
    }
    const totalQuestions = this.model.getQuestionState().length;
    const selectedCount = this.model.numSelectedQuestions;
    if (totalQuestions === 0) {
      this.statusMessage.textContent = "";
    } else if (totalQuestions === 1) {
      if (selectedCount > 0) {
        this.statusMessage.textContent = `1 question (${selectedCount} selected)`;
      } else {
        this.statusMessage.textContent = `1 question`;
      }
    } else {
      if (selectedCount > 0) {
        this.statusMessage.textContent = `${totalQuestions} questions (${selectedCount} selected)`;
      } else {
        this.statusMessage.textContent = `${totalQuestions} questions`;
      }
    }
  }

  private statusBarContainer: HTMLDivElement;
  private statusMessage: HTMLSpanElement;
  private cheatingMessage: HTMLSpanElement;

  get root(): HTMLDivElement {
    return this.statusBarContainer;
  }

  constructor(private model: Model) {
    this.statusBarContainer = document.createElement("div");
    this.statusBarContainer.id = "statusBar";

    this.statusMessage = document.createElement("span");
    this.statusMessage.id = "statusMessage";

    this.cheatingMessage = document.createElement("span");
    this.cheatingMessage.id = "cheatingMessage";

    this.statusBarContainer.append(this.statusMessage);
    this.statusBarContainer.append(this.cheatingMessage);

    this.model.addObserver(this);
  }
}
