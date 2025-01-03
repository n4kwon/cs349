import { SKContainer, Layout, SKLabel } from "simplekit/imperative-mode";
import { Observer } from "../observer";
import { ExtendedSKButton } from "../widgets/extendedButton";
import { Model } from "../model";

export class ModeBarView extends SKContainer implements Observer {
  update(): void {
    console.log(this.model.getCheckboxSelected(true));

    if (this.model.areNoneSelected()) {
      this.button.disabled = true;
      this.button.border = "grey";
    } else {
      this.button.disabled = false;
      this.button.border = "black";
    }

    if (this.model.getMode() == "quiz") {
      if (!this.model.getQuizCompleted()) {
        this.emptyText.text = `Question ${this.model.getQuizCount()} of ${
          this.model.getCheckboxSelected(true).length
        }`;
      } else {
        this.emptyText.text = "Quiz Completed";
        this.model.setQuizCompleted(false);
      }
      this.fill = "lightblue";
      this.button.text = "Exit";
    } else {
      this.fill = "lightgrey";
      this.button.text = "Quiz";
      this.emptyText.text = "";
    }
  }

  // emptyText used to force button to be right aligned
  emptyText = new SKLabel({
    text: "",
    fillWidth: 1,
    align: "left",
  });
  button = new ExtendedSKButton({
    text: "Quiz",
    width: 100,
    padding: 10,
    disabled: true,
  });

  constructor(private model: Model) {
    super();

    // setup the view
    this.id = "modebar";
    this.fill = "lightgrey";
    this.padding = 10;
    this.fillWidth = 1;
    this.layoutMethod = new Layout.FillRowLayout({ gap: 10 });

    // add a button to the view
    this.addChild(this.emptyText);
    this.addChild(this.button);

    this.button.addEventListener("click", () => {
      // change list mode to quiz mode
      if (this.model.getMode() === "list") {
        this.model.setMode("quiz");
      } else {
        this.model.setMode("list");
        this.model.setBeginQuiz(false);
        this.model.setShallowCopy(true);
        // reset incorrect + correct question counts
        this.model.incrementOverall("", "", true);
      }
    });
    this.model.addObserver(this);
  }
}
