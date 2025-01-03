import { Model } from "../model";
import View from "../view";

import "./middleAreaView.css";

export class MiddleAreaView implements View {
  update(): void {
    if (this.model.modeType === "list") {
      this.listMode.style.display = "flex";
      this.quizMode.style.display = "none";
      if (this.questionList) {
        this.questionList.innerHTML = "";
      }
      this.model.getQuestionState().forEach((question, index) => {
        const questionItem = document.createElement("div");
        questionItem.classList.add("questionItem");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("questionCheckbox");
        checkbox.checked = question.selected;

        checkbox.addEventListener("change", () => {
          question.selected = checkbox.checked;
          this.model.callObservers();
        });
        const text = document.createElement("span");
        text.textContent = question.questionText;

        if (this.questionList) {
          questionItem.appendChild(checkbox);
          questionItem.appendChild(text);
          this.questionList.appendChild(questionItem);
        }
      });
      const selectedCount = this.model.numSelectedQuestions;
      this.allButton.disabled =
        selectedCount === this.model.getQuestionState().length;
      this.noneButton.disabled = selectedCount === 0;
      this.deleteButton.disabled = selectedCount === 0;
      this.addButton.disabled = this.model.getQuestionState().length >= 10;
    } else {
      this.option1Button.style.backgroundColor = "white";
      this.option2Button.style.backgroundColor = "white";
      this.option3Button.style.backgroundColor = "white";

      if (!this.model.updatedBecauseCheat) {
        this.listMode.style.display = "none";
        this.quizMode.style.display = "flex";
        this.answerButtons.style.display = "flex";
        if (this.model.quizQuestions) {
          const randomSelected = this.model.chooseRandomSelected();
          this.questionMessage.innerText = randomSelected.questionText;
          this.questionMessage.style.fontWeight = "bold";
          this.option1Button.innerText = randomSelected.option1Text;
          this.option2Button.innerText = randomSelected.option2Text;
          this.option3Button.innerText = randomSelected.option3Text;
          if (this.model.isCheating) {
            // need to show yellow fill around correct answer
            const correctOption = this.model.getCorrectOption(randomSelected);
            if (correctOption === "option1") {
              this.option1Button.style.backgroundColor = "lightyellow";
            } else if (correctOption === "option2") {
              this.option2Button.style.backgroundColor = "lightyellow";
            } else if (correctOption === "option3") {
              this.option3Button.style.backgroundColor = "lightyellow";
            }
          }
        } else {
          this.answerButtons.style.display = "none";
          this.questionMessage.innerText = `${this.model.numCorrect} Correct, ${this.model.numIncorrect} Incorrect`;
        }
      }
    }
    this.model.cheatUpdate = false;
  }

  private middleAreaContainer: HTMLDivElement;
  private toolbarContainer: HTMLDivElement;
  private allButton: HTMLButtonElement;
  private deleteButton: HTMLButtonElement;
  private noneButton: HTMLButtonElement;
  private addButton: HTMLButtonElement;
  private questionList: HTMLDivElement;
  private listMode: HTMLDivElement;

  private quizMode: HTMLDivElement;
  private questionDisplay: HTMLDivElement;
  private questionMessage: HTMLSpanElement;
  private answerButtons: HTMLDivElement;
  private option1Button: HTMLButtonElement;
  private option2Button: HTMLButtonElement;
  private option3Button: HTMLButtonElement;

  get root(): HTMLDivElement {
    return this.middleAreaContainer;
  }

  constructor(private model: Model) {
    this.middleAreaContainer = document.createElement("div");
    this.middleAreaContainer.id = "middleArea";
    this.middleAreaContainer.className = "middle-area";

    this.toolbarContainer = document.createElement("div");
    this.toolbarContainer.className = "toolbar";

    this.allButton = document.createElement("button");
    this.allButton.innerText = "All";
    this.allButton.className = "toolbarButton";
    this.allButton.addEventListener("click", () => {
      this.model.setSelected(true);
    });

    this.deleteButton = document.createElement("button");
    this.deleteButton.innerText = "Delete";
    this.deleteButton.className = "toolbarButton";
    this.deleteButton.disabled = true;
    this.deleteButton.addEventListener("click", () => {
      this.model.updateQuestionState();
    });

    this.noneButton = document.createElement("button");
    this.noneButton.innerText = "None";
    this.noneButton.className = "toolbarButton";
    this.noneButton.disabled = true;
    this.noneButton.addEventListener("click", () => {
      this.model.setSelected(false);
    });

    this.addButton = document.createElement("button");
    this.addButton.innerText = "Add";
    this.addButton.className = "toolbarButton";
    this.addButton.addEventListener("click", () => {
      this.model.addQuestion();
    });

    this.questionList = document.createElement("div");
    this.questionList.id = "questionList";

    this.listMode = document.createElement("div");
    this.listMode.id = "listMode";
    this.listMode.className = "mode-container";

    this.quizMode = document.createElement("div");
    this.quizMode.id = "quizMode";

    this.questionDisplay = document.createElement("div");
    this.questionDisplay.className = "questionDisplay";

    this.questionMessage = document.createElement("span");
    this.questionMessage.id = "questionMessage";

    this.answerButtons = document.createElement("div");
    this.answerButtons.id = "answerButtons";

    this.option1Button = document.createElement("button");
    this.option1Button.id = "option1";
    this.option1Button.className = "answerButton";
    this.option1Button.addEventListener("click", () => {
      this.model.questionAnswerSelected(
        this.questionMessage.innerText,
        this.option1Button.innerText
      );
    });

    this.option2Button = document.createElement("button");
    this.option2Button.id = "option2";
    this.option2Button.className = "answerButton";
    this.option2Button.addEventListener("click", () => {
      this.model.questionAnswerSelected(
        this.questionMessage.innerText,
        this.option2Button.innerText
      );
    });

    this.option3Button = document.createElement("button");
    this.option3Button.id = "option3";
    this.option3Button.className = "answerButton";
    this.option3Button.addEventListener("click", () => {
      this.model.questionAnswerSelected(
        this.questionMessage.innerText,
        this.option3Button.innerText
      );
    });

    this.model.getInitialQuestions();

    this.toolbarContainer.append(this.allButton);
    this.toolbarContainer.append(this.noneButton);
    this.toolbarContainer.append(this.deleteButton);
    this.toolbarContainer.append(this.addButton);

    this.answerButtons.append(this.option1Button);
    this.answerButtons.append(this.option2Button);
    this.answerButtons.append(this.option3Button);

    this.questionDisplay.append(this.questionMessage);
    this.questionDisplay.append(this.answerButtons);

    this.listMode.append(this.toolbarContainer);
    this.listMode.append(this.questionList);

    this.quizMode.append(this.questionDisplay);

    this.middleAreaContainer.append(this.listMode);
    this.middleAreaContainer.append(this.quizMode);

    this.model.addObserver(this);
  }
}
