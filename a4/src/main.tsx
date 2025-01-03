import { render } from "preact";
import { App } from "./app.tsx";

import "./style.css";

render(<App />, document.querySelector("div#app") as Element);
