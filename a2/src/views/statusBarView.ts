import { Layout, SKContainer, SKLabel } from "simplekit/imperative-mode";
import { Observer } from "../observer";
import { Model } from "../model";

export class StatusBarView extends SKContainer implements Observer {
  update(): void {
    const count = `${this.model.getCount()}`;
    const modelCount = this.model.getCount();
    const numQuestions = this.model.getQuestions().length;
    // check case when there is only 1 question
    if (numQuestions === 1) {
      this.message.text = `${
        modelCount > 0
          ? `${numQuestions} question (${count} selected)`
          : `${numQuestions} question`
      }`;
    } else if (numQuestions === 0) {
      this.message.text = "";
    } else if (modelCount != 0) {
      this.message.text = `${numQuestions} questions (${count} selected)`;
    } else {
      this.message.text = `${numQuestions} questions`;
    }

    if (this.model.getCheating()) {
      this.cheatingText.text = "CHEATING";
    } else {
      this.cheatingText.text = "";
    }
  }

  statusbarContainer = new SKContainer({
    fillWidth: 1,
    layoutMethod: new Layout.FillRowLayout(),
  });

  message = new SKLabel({
    text: "4 questions",
    fillWidth: 1,
    align: "left",
    padding: 10,
  });

  cheatingText = new SKLabel({
    text: "",
    align: "right",
  });

  constructor(private model: Model) {
    super();

    // setup the view
    this.id = "statusbar";
    this.fill = "lightgrey";
    this.padding = 10;
    this.fillWidth = 1;
    this.statusbarContainer.addChild(this.message);
    this.statusbarContainer.addChild(this.cheatingText);
    this.layoutMethod = new Layout.FillRowLayout({ gap: 10 });
    this.addChild(this.statusbarContainer);

    this.model.addObserver(this);
  }
}
