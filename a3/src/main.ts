import { Model } from "./model";
import { MiddleAreaView } from "./views/middleAreaView";
import { ModeBarView } from "./views/modeBarView";
import { StatusBarView } from "./views/statusBarView";

const model = new Model();

const root = document.querySelector("div#app") as HTMLDivElement;

const content = document.createElement("div");
content.className = "container";

content.appendChild(new ModeBarView(model).root);
content.appendChild(new MiddleAreaView(model).root);
content.appendChild(new StatusBarView(model).root);

root.appendChild(content);

addEventListener("keydown", (event) => {
  if (event.type === "keydown") {
    const me = event as KeyboardEvent;
    if (me.key === "?") {
      model.toggleCheating();
    }
  }
});
