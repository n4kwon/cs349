import {
  SKElement,
  SKElementProps,
  SKEvent,
  SKMouseEvent,
  Style,
} from "simplekit/imperative-mode";

export type SKCheckboxProps = SKElementProps & { checked?: boolean };

export class SKCheckbox extends SKElement {
  constructor({ checked = false, ...elementProps }: SKCheckboxProps = {}) {
    super(elementProps);
    this.checked = checked;
    this.width = Style.minElementSize - 10;
    this.height = Style.minElementSize - 10;
  }

  state: "idle" | "hover" | "down" = "idle";

  checked: boolean;

  handleMouseEvent(me: SKMouseEvent) {
    switch (me.type) {
      case "mousedown":
        this.state = "down";
        return true;
        break;
      case "mouseup":
        this.state = "hover";
        this.checked = !this.checked;
        return this.sendEvent({
          source: this,
          timeStamp: me.timeStamp,
          type: "action",
        } as SKEvent);
        break;
      case "mouseenter":
        this.state = "hover";
        return true;
        break;
      case "mouseexit":
        this.state = "idle";
        return true;
        break;
    }
    return false;
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save();

    const w = this.paddingBox.width;
    const h = this.paddingBox.height;

    gc.translate(this.margin, this.margin);

    // thick highlight rect
    if (this.state == "hover" || this.state == "down") {
      gc.beginPath();
      gc.rect(this.x, this.y, w, h);
      gc.strokeStyle = Style.highlightColour;
      gc.lineWidth = 8;
      gc.stroke();
    }

    // normal background
    gc.beginPath();
    gc.rect(this.x, this.y, w, h);
    gc.fillStyle = this.state == "down" ? Style.highlightColour : "whitesmoke";
    gc.strokeStyle = "black";
    // change fill to show down state
    gc.lineWidth = this.state == "down" ? 4 : 2;
    gc.fill();
    gc.stroke();
    gc.clip(); // clip text if it's wider than text area

    // checked state
    if (this.checked === true) {
      gc.beginPath();
      gc.moveTo(this.x + 5, this.y + 5);
      gc.lineTo(this.x + w - 5, this.y + h - 5);
      gc.moveTo(this.x + w - 5, this.y + 5);
      gc.lineTo(this.x + 5, this.y + h - 5);
      gc.strokeStyle = "black";
      gc.lineWidth = 2;
      gc.stroke();
    }

    gc.restore();

    // element draws debug viz if flag is set
    super.draw(gc);
  }

  public toString(): string {
    return `SKCheckbox`;
  }
}
