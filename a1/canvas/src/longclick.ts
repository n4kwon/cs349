import { FundamentalEvent, SKMouseEvent } from "simplekit/canvas-mode";
import { distance } from "simplekit/utility";

export const longClickTranslator = {
  state: "IDLE",
  movementThreshold: 10,
  timeThreshold: 500,
  startX: 0,
  startY: 0,
  startTime: 0,

  update(fe: FundamentalEvent): SKMouseEvent | undefined {
    switch (this.state) {
      case "IDLE":
        if (fe.type === "mousedown") {
          this.state = "DOWN";
          this.startX = fe.x || 0;
          this.startY = fe.y || 0;
          this.startTime = fe.timeStamp;
        }
        break;

      case "DOWN":
        if (
          fe.x &&
          fe.y &&
          distance(fe.x, fe.y, this.startX, this.startY) >
            this.movementThreshold
        ) {
          this.state = "IDLE";
        } else if (fe.timeStamp - this.startTime >= this.timeThreshold) {
          if (fe.type === "mouseup") {
            this.state = "IDLE";
            return new SKMouseEvent(
              "longclick",
              fe.timeStamp,
              this.startX,
              this.startY
            );
          }
        } else if (fe.type === "mouseup") {
          this.state = "IDLE";
        }
        break;
    }
    return;
  },
};
