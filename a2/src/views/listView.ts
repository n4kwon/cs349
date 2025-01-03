import { Layout, SKContainer } from "simplekit/imperative-mode";
import { Observer } from "../observer";
import { Model, Question } from "../model";
import { QuestionView } from "./questionView";
import { StackColLayout } from "../layouts/stackCol";

export class ListView extends SKContainer implements Observer {
  questions: Question[] = [];
  update() {
    // this.children.forEach((t) => {
    //   // type guard: QuestionView is an Observer
    //   if (t instanceof QuestionView) this.model.removeObserver(t);
    // });

    this.clearChildren();

    this.model.getQuestions().forEach((t) => {
      this.addChild(new QuestionView(this.model, t.question, t.id));
    });
  }

  //   questionListContainer = new SKContainer({
  //     border: "1px solid black",
  //     layoutMethod: new Layout.FillRowLayout(),
  //     fillWidth: 1,
  //     fillHeight: 1,
  //   });

  constructor(private model: Model) {
    super();
    this.questions = model.getQuestions();
    this.layoutMethod = new Layout.WrapRowLayout();
    this.questions.forEach((question, index) => {
      //   this.questionListContainer.addChild(
      //     new QuestionView(model, question.question, question.id)
      //   );
      this.addChild(new QuestionView(model, question.question, question.id));
    });
    this.fillWidth = 1;
    // this.fillHeight = 1;
    // this.addChild(this.questionListContainer);
    this.model.addObserver(this);
  }
}
