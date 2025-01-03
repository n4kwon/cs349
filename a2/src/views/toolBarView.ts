import { Layout, SKButton, SKContainer } from "simplekit/imperative-mode";
import { Model } from "../model";
import { StackColLayout } from "../layouts/stackCol";
import { ExtendedSKButton } from "../widgets/extendedButton";
import { Observer } from "../observer";

export class ToolbarView extends SKContainer implements Observer {
  update(): void {
    if (this.model.areAllSelected()) {
      this.allButton.border = "grey";
      this.allButton.state = "idle";
      this.allButton.disabled = true;
    } else {
      this.allButton.border = "black";
      this.allButton.disabled = false;
    }

    if (this.model.areNoneSelected()) {
      this.noneButton.border = "grey";
      this.noneButton.state = "idle";
      this.noneButton.disabled = true;
      this.deleteButton.border = "grey";
      this.deleteButton.state = "idle";
      this.deleteButton.disabled = true;
    } else {
      this.noneButton.border = "black";
      this.noneButton.disabled = false;
      this.deleteButton.border = "black";
      this.deleteButton.disabled = false;
    }

    if (this.model.getQuestions().length == 10) {
      this.addButton.border = "grey";
      this.addButton.state = "idle";
      this.addButton.disabled = true;
    } else {
      this.addButton.border = "black";
      this.addButton.disabled = false;
    }
  }
  allButton = new ExtendedSKButton({ text: "All", width: 80, disabled: false });
  noneButton = new ExtendedSKButton({
    text: "None",
    width: 80,
    disabled: false,
  });
  deleteButton = new ExtendedSKButton({
    text: "Delete",
    width: 80,
    disabled: false,
  });
  addButton = new ExtendedSKButton({ text: "Add", width: 80, disabled: false });

  constructor(private model: Model) {
    super();
    this.fill = "whitesmoke";
    this.border = "1px solid black";
    this.padding = 10;
    this.fillWidth = 1;
    this.layoutMethod = new Layout.FillRowLayout({ gap: 10 });

    this.addChild(this.allButton);
    this.addChild(this.noneButton);
    this.addChild(this.deleteButton);
    this.addChild(this.addButton);

    // Controllers:
    this.allButton.addEventListener("action", () => {
      this.model.selectAll();
    });
    this.noneButton.addEventListener("action", () => {
      this.model.deselectAll();
    });
    this.deleteButton.addEventListener("action", () => {
      this.model.deleteSelected();
    });
    this.addButton.addEventListener("mousedown", () => {
      this.model.addRandomQuestion();
    });

    this.model.addObserver(this);
  }
}
