import { Layout, SKContainer, SKLabel } from "simplekit/imperative-mode";
import { Observer } from "../observer";
import { SKCheckbox } from "../widgets/checkbox";
import { Model } from "../model";

// this is view for each singular question rectangle
export class QuestionView extends SKContainer implements Observer {
  update() {
    const question = this.model.getQuestion(this.questionId);
    if (question) {
      this.checkbox.checked = question.selected;
    }
  }

  checkbox = new SKCheckbox({});
  questionLabel = new SKLabel({
    fillWidth: 1,
    align: "left",
  });
  questionContainer = new SKContainer({
    fill: "lightblue",
    padding: 10,
    margin: 10,
    layoutMethod: new Layout.FillRowLayout({ gap: 5 }),
  });

  constructor(
    private model: Model,
    questionText: string,
    protected questionId: number
  ) {
    super();

    this.id = `todo #${questionId} (created ${performance.now().toFixed(0)})`;

    this.questionContainer.addChild(this.checkbox);
    this.questionContainer.addChild(this.questionLabel);
    this.questionLabel.font = "10pt sans-serif";
    this.questionLabel.text = questionText;
    this.addChild(this.questionContainer);

    this.checkbox.addEventListener("action", () => {
      model.toggleCheckbox(questionId - 1);
    });
    this.questionContainer.addEventListener("dblclick", () => {
      model.toggleShowEditPanel();
      model.setSelectedQuestion(this.model.getQuestion(this.questionId));
      // model.setMode("editQuestion");
    });
    this.model.addObserver(this);
  }
}
