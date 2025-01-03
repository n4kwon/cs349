import { SKElement, LayoutMethod, Size } from "simplekit/imperative-mode";

// places elements in a vertical stack
export class StackColLayout implements LayoutMethod {
  measure(elements: SKElement[]) {
    // measure all children first
    elements.forEach((el) => {
      el.measure();
    });

    // width is width of widest element
    const totalWidth = elements.reduce(
      (acc, el) => Math.max(acc, el.intrinsicWidth),
      0
    );

    // height is sum of al element heights
    const totalHeight = elements.reduce(
      (acc, el) => acc + el.intrinsicHeight,
      0
    );

    // return minimum layout size
    console.log(totalWidth, totalHeight);
    return {
      width: totalWidth,
      height: totalHeight,
    };
  }

  layout(width: number, height: number, elements: SKElement[]) {
    const newBounds: Size = { width: 0, height: 0 };

    let y = 0;

    const totalIntrinsicHeight = elements.reduce(
      (acc, el) => acc + el.intrinsicHeight,
      0
    );

    const availableHeight = Math.min(height, totalIntrinsicHeight);

    elements.forEach((el, index) => {
      el.x = 0;
      el.y = y;

      // Fill width if required
      const w = el.fillWidth ? width : el.intrinsicWidth;

      // Layout each element, restrict height if needed
      let elHeight = el.intrinsicHeight;
      // Distribute height if necessary
      if (index === elements.length - 1 && y + elHeight > availableHeight) {
        elHeight = availableHeight - y; // Restrict the last element's height to fit
      }

      el.layout(w, elHeight);

      // Move to next row based on the laid-out element's height
      y += el.layoutHeight;

      // Update newBounds to track actual layout size used
      newBounds.width = Math.max(newBounds.width, el.layoutWidth);
      newBounds.height = Math.max(newBounds.height, y);
    });

    return newBounds;
  }
}
