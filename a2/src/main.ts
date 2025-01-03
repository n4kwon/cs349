import {
  startSimpleKit,
  setSKRoot,
  SKContainer,
  setSKEventListener,
  SKKeyboardEvent,
} from "simplekit/imperative-mode";

// local imports
import { ModeBarView } from "./views/modeBarView";
import { Model } from "./model";
import { MiddleAreaView } from "./views/middleAreaView";
import { StatusBarView } from "./views/statusBarView";
import { FullHeightLayout } from "./layouts/FullHeight";
import { EditPanel } from "./views/editPanelView";

const model = new Model();

const root = new SKContainer({
  id: "root",
  layoutMethod: new FullHeightLayout(),
});

// add views to top (will be stacked vertically)
// need different views for different parts of the page
startSimpleKit();
// add views to root (will be left and right areas)
const middleAreaView = new MiddleAreaView(model);
root.addChild(new ModeBarView(model));
root.addChild(middleAreaView);
root.addChild(new EditPanel(model));
root.addChild(new StatusBarView(model));
// Settings.debugLayout = true;

setSKEventListener((event) => {
  if (event.type === "keydown") {
    const me = event as SKKeyboardEvent;
    if (me.key === "?" && !model.getShowEditPanel()) {
      model.toggleCheating();
    }
  }
});

setSKRoot(root);
