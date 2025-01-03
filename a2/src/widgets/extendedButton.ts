import {
  requestMouseFocus,
  SKButton,
  SKButtonProps,
  SKElementProps,
  SKEvent,
  SKMouseEvent,
} from "simplekit/imperative-mode";

export type ExtendedSKButtonProps = SKElementProps & {
  text?: string;
  disabled: boolean;
};

export class ExtendedSKButton extends SKButton {
  disabled: boolean;
  // set border to grey if disabled
  constructor(props: ExtendedSKButtonProps) {
    super(props);
    this.disabled = props.disabled;
    if (this.disabled) {
      this.border = "grey";
    }
  }

  handleMouseEvent(me: SKMouseEvent) {
    if (this.disabled) {
      return false;
    } else {
      switch (me.type) {
        case "mousedown":
          this.state = "down";
          requestMouseFocus(this);
          // return true;
          break;
        case "mouseup":
          this.state = "hover";
          // return true if a listener was registered
          if (
            this.sendEvent({
              source: this,
              timeStamp: me.timeStamp,
              type: "action",
            } as SKEvent)
          )
            return true;
          break;
        case "mouseenter":
          this.state = "hover";
          break;
        case "mouseexit":
          this.state = "idle";
          break;
      }

      if (super.handleMouseEvent(me)) return true;

      return false;
    }
  }
}
