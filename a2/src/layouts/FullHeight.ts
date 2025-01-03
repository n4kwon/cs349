import { SKElement, LayoutMethod, Size } from "simplekit/imperative-mode";

export class FullHeightLayout implements LayoutMethod {
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

    const [modeBarView, middleAreaView, testView2, statusBarView] = elements;
    console.log(elements);

    modeBarView.x = 0;
    modeBarView.y = 0;
    modeBarView.layout(width, modeBarView.intrinsicHeight);

    const statusBarHeight = statusBarView.intrinsicHeight;
    statusBarView.x = 0;
    statusBarView.y = height - statusBarHeight;
    statusBarView.layout(width, statusBarHeight);

    const middleAreaHeight =
      height - modeBarView.layoutHeight - statusBarHeight;
    middleAreaView.x = 0;
    middleAreaView.y = modeBarView.layoutHeight;
    middleAreaView.layout(width, middleAreaHeight);

    testView2.x = width / 2 - testView2.intrinsicWidth / 2;
    testView2.y = middleAreaView.y + testView2.intrinsicHeight;
    const w = testView2.fillWidth ? width : testView2.intrinsicWidth;
    const h = testView2.fillHeight ? height : testView2.intrinsicHeight;
    testView2.layout(w / 2, h);

    newBounds.width = width;
    newBounds.height = height;

    return newBounds;
  }
}
