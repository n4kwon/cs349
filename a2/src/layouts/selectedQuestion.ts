import { SKElement, LayoutMethod, Size } from "simplekit/imperative-mode";

export class SelectedQuestionLayout implements LayoutMethod {
  measure(elements: SKElement[]) {
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
    return {
      width: totalWidth,
      height: totalHeight,
    };
  }

  layout(width: number, height: number, elements: SKElement[]) {
    const newBounds: Size = { width: 0, height: 0 };

    const [selectedQuestionContainer] = elements;

    selectedQuestionContainer.x = 0;
    selectedQuestionContainer.y = 0;
    selectedQuestionContainer.layout(
      selectedQuestionContainer.intrinsicWidth,
      selectedQuestionContainer.intrinsicHeight
    );

    console.log(elements);

    newBounds.width = width;
    newBounds.height = height;

    return newBounds;
  }
}
