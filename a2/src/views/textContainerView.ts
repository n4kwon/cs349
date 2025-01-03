import { SKContainer, SKLabel, SKTextfield } from "simplekit/imperative-mode";
import { Observer } from "../observer";
import { Model } from "../model";

export class TextContainer extends SKContainer implements Observer {
  update(): void {}

  label = new SKLabel({});
  textField = new SKTextfield({});

  constructor(private model: Model, labelText: string, textField?: string) {
    super();
    this.label.text = labelText;
    this.textField.text = textField ?? "";

    this.model.addObserver(this);
  }
}
