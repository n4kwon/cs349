import {
  Layout,
  SKButton,
  SKContainer,
  SKLabel,
  SKTextfield,
} from "simplekit/imperative-mode";
import { Model } from "../model";
// import { TestView } from "./editView";
import { StackColLayout } from "../layouts/stackCol";
import { Observer } from "../observer";

export class EditPanel extends SKContainer implements Observer {
  update(): void {
    if (this.model.getShowEditPanel()) {
      // this.editPanelContainer.addChild(this.test2);
      // this.addChild(this.editPanelContainer);
      const selectedQuestion = this.model.getSelectedQuestion();
      this.questionTextField.text = selectedQuestion?.question ?? "";
      this.answerTextField.text = selectedQuestion?.answer ?? "";
      this.other1TextField.text = selectedQuestion?.other1 ?? "";
      this.other2TextField.text = selectedQuestion?.other2 ?? "";

      this.questionContainer.addChild(this.questionLabel);
      this.questionContainer.addChild(this.questionTextField);

      this.answerContainer.addChild(this.answerLabel);
      this.answerContainer.addChild(this.answerTextField);

      this.other1Container.addChild(this.other1Label);
      this.other1Container.addChild(this.other1TextField);

      this.other2Container.addChild(this.other2Label);
      this.other2Container.addChild(this.other2TextField);
      // this.buttonContainer.addChild(this.emptyText);
      this.buttonContainer.addChild(this.save);
      this.buttonContainer.addChild(this.cancel);
      console.log(this.questionTextField);
      this.addChild(this.editPanelContainer);
    } else {
      this.removeChild(this.editPanelContainer);
      this.questionContainer.removeChild(this.questionLabel);
      this.questionContainer.removeChild(this.questionTextField);
      this.answerContainer.removeChild(this.answerLabel);
      this.answerContainer.removeChild(this.answerTextField);
      this.other1Container.removeChild(this.other1Label);
      this.other1Container.removeChild(this.other1TextField);
      this.other2Container.removeChild(this.other2Label);
      this.other2Container.removeChild(this.other2TextField);
      // this.buttonContainer.removeChild(this.emptyText);
      this.buttonContainer.removeChild(this.save);
      this.buttonContainer.removeChild(this.cancel);
    }
  }

  editPanelContainer = new SKContainer({
    id: "editPanel",
    border: "1px solid black",
    fill: "whitesmoke",
    layoutMethod: new StackColLayout(),
  });

  questionLabel = new SKLabel({
    text: "Question",
    id: "questionLabel",
  });
  questionTextField = new SKTextfield({ id: "questionTextField" });
  questionContainer = new SKContainer({
    id: "question",
    layoutMethod: new Layout.FillRowLayout(),

    // layoutMethod: new Layout.FixedLayout(),
  });

  answerContainer = new SKContainer({
    layoutMethod: new Layout.FillRowLayout(),
  });
  answerLabel = new SKLabel({ text: "Answer" });
  answerTextField = new SKTextfield({});

  other1Container = new SKContainer({
    layoutMethod: new Layout.FillRowLayout(),
  });
  other1Label = new SKLabel({ text: "Other 1" });
  other1TextField = new SKTextfield({});

  other2Container = new SKContainer({
    layoutMethod: new Layout.FillRowLayout(),
  });
  other2Label = new SKLabel({ text: "Other 2" });
  other2TextField = new SKTextfield({});

  buttonContainer = new SKContainer({
    layoutMethod: new Layout.FillRowLayout(),
    padding: 10,
  });
  save = new SKButton({
    text: "Save",
    margin: 5,
  });

  cancel = new SKButton({
    text: "Cancel",
    margin: 5,
  });

  constructor(private model: Model) {
    super();

    // this.fillHeight = 1;
    // this.fillWidth = 1;
    this.editPanelContainer.addChild(this.questionContainer);
    this.editPanelContainer.addChild(this.answerContainer);
    this.editPanelContainer.addChild(this.other1Container);
    this.editPanelContainer.addChild(this.other2Container);
    this.editPanelContainer.addChild(this.buttonContainer);
    // this.editPanelContainer.addChild(this.answerContainer);

    this.save.addEventListener("click", () => {
      this.model.setShowEditPanel(false);
      // need to update the selectedQuestion in questions with changed text
      this.model.updateQuestions(
        this.questionTextField.text,
        this.answerTextField.text,
        this.other1TextField.text,
        this.other2TextField.text
      );
    });
    this.cancel.addEventListener("click", () => {
      this.model.setShowEditPanel(false);
    });

    this.model.addObserver(this);
  }
}
