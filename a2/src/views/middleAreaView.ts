import {
  Layout,
  SKButton,
  SKContainer,
  SKLabel,
} from "simplekit/imperative-mode";
import { Observer } from "../observer";
import { Model, Question } from "../model";
import { StackColLayout } from "../layouts/stackCol";
import { ToolbarView } from "./toolBarView";
import { ListView } from "./listView";

export class MiddleAreaView extends SKContainer implements Observer {
  private toolbar: ToolbarView;
  private listView: ListView;
  private randomSelected: Question | undefined;

  update(): void {
    console.log(this.model.getShallowCopyValue());
    if (this.model.getCheatingUpdate()) {
      this.model.setCheatingUpdate(false);
      return;
    }
    if (this.model.getMode() === "quiz" && !this.model.getBeginQuiz()) {
      this.removeChild(this.toolbar);
      this.questionListContainer.removeChild(this.listView);
      this.removeChild(this.questionListContainer);
      this.randomSelected = this.model.getRandomCheckboxSelectedQuestion();
      let randomArray = [
        this.randomSelected?.answer ?? "",
        this.randomSelected?.other1 ?? "",
        this.randomSelected?.other2 ?? "",
      ];
      randomArray = this.model.shuffleArray(randomArray);

      this.selectedQuestionQuestion.text = this.randomSelected?.question ?? "";
      this.selectedQuestionAnswer.text = randomArray[0];
      this.selectedQuestionOption1.text = randomArray[1];
      this.selectedQuestionOption2.text = randomArray[2];
      if (this.model.getCheating()) {
        const correctIndex = this.model.getCorrectAnswerIndex(
          this.randomSelected?.answer ?? "",
          randomArray
        );
        this.selectedQuestionAnswer.fill =
          correctIndex === 0 ? "lightyellow" : "lightgrey";
        this.selectedQuestionOption1.fill =
          correctIndex === 1 ? "lightyellow" : "lightgrey";
        this.selectedQuestionOption2.fill =
          correctIndex === 2 ? "lightyellow" : "lightgrey";
      } else {
        this.selectedQuestionAnswer.fill = "lightgrey";
        this.selectedQuestionOption1.fill = "lightgrey";
        this.selectedQuestionOption2.fill = "lightgrey";
      }

      this.selectedQuestionAnswers.addChild(this.selectedQuestionAnswer);
      this.selectedQuestionAnswers.addChild(this.selectedQuestionOption1);
      this.selectedQuestionAnswers.addChild(this.selectedQuestionOption2);
      this.selectedQuestionAnswer.width = (this.contentWidth + 60) / 3;
      this.selectedQuestionOption1.width = (this.contentWidth + 60) / 3;
      this.selectedQuestionOption2.width = (this.contentWidth + 60) / 3;
      this.selectedQuestionContainer.addChild(this.selectedQuestionQuestion);
      this.selectedQuestionContainer.padding = 150;
      this.selectedQuestionContainer.height = this.contentHeight - 60;
      this.selectedQuestionAnswer.margin = 20;
      this.selectedQuestionOption1.margin = 20;
      this.selectedQuestionOption2.margin = 20;
      // this.selectedQuestionContainer.addChild(this.selectedQuestionAnswers);
      // this.addChild(this.selectedQuestionContainer);
      this.overallContainer.addChild(this.selectedQuestionContainer);
      this.overallContainer.addChild(this.selectedQuestionAnswers);
      this.addChild(this.overallContainer);
      this.model.setBeginQuiz(true);
    } else if (this.model.getMode() === "quiz" && this.model.getBeginQuiz()) {
      this.randomSelected = this.model.getRandomCheckboxSelectedQuestion();
      let randomArray = [
        this.randomSelected?.answer ?? "",
        this.randomSelected?.other1 ?? "",
        this.randomSelected?.other2 ?? "",
      ];
      randomArray = this.model.shuffleArray(randomArray);
      if (this.model.getCheating()) {
        const correctIndex = this.model.getCorrectAnswerIndex(
          this.randomSelected?.answer ?? "",
          randomArray
        );
        this.selectedQuestionAnswer.fill =
          correctIndex === 0 ? "lightyellow" : "lightgrey";
        this.selectedQuestionOption1.fill =
          correctIndex === 1 ? "lightyellow" : "lightgrey";
        this.selectedQuestionOption2.fill =
          correctIndex === 2 ? "lightyellow" : "lightgrey";
      } else {
        this.selectedQuestionAnswer.fill = "lightgrey";
        this.selectedQuestionOption1.fill = "lightgrey";
        this.selectedQuestionOption2.fill = "lightgrey";
      }

      this.selectedQuestionQuestion.text = this.randomSelected?.question ?? "";
      this.selectedQuestionAnswer.text = randomArray[0] ?? "";
      this.selectedQuestionOption1.text = randomArray[1] ?? "";
      this.selectedQuestionOption2.text = randomArray[2] ?? "";
      if (this.randomSelected === undefined) {
        this.selectedQuestionAnswers.removeChild(this.selectedQuestionAnswer);
        this.selectedQuestionAnswers.removeChild(this.selectedQuestionOption1);
        this.selectedQuestionAnswers.removeChild(this.selectedQuestionOption2);
        this.overallContainer.removeChild(this.selectedQuestionAnswers);
        this.quizSummary.text = `${this.model.getCorrectAnswers()} Correct, ${this.model.getIncorrectAnswers()} Incorrect`;
        this.quizSummaryContainer.addChild(this.quizSummary);
        this.overallContainer.addChild(this.quizSummaryContainer);
        this.model.setQuizCompleted(true);
      }
    } else if (this.model.getMode() === "list" && this.model.getModeChanged()) {
      this.quizSummaryContainer.removeChild(this.quizSummary);
      this.selectedQuestionContainer.removeChild(this.selectedQuestionQuestion);
      this.selectedQuestionAnswers.removeChild(this.selectedQuestionAnswer);
      this.selectedQuestionAnswers.removeChild(this.selectedQuestionOption1);
      this.selectedQuestionAnswers.removeChild(this.selectedQuestionOption2);
      this.selectedQuestionContainer.removeChild(this.selectedQuestionQuestion);
      this.overallContainer.removeChild(this.selectedQuestionContainer);
      this.overallContainer.removeChild(this.quizSummaryContainer);
      this.overallContainer.removeChild(this.selectedQuestionAnswers);

      this.removeChild(this.selectedQuestionContainer);
      this.removeChild(this.overallContainer);
      this.addChild(this.toolbar);
      this.questionListContainer.removeChild(this.listView);
      this.questionListContainer.addChild(this.listView);
      this.addChild(this.questionListContainer);

      this.model.setModeChanged(false);
    }
  }

  quizSummaryContainer = new SKContainer({
    layoutMethod: new Layout.CentredLayout(),
    fillWidth: 1,
  });

  quizSummary = new SKLabel({});

  overallContainer = new SKContainer({
    layoutMethod: new Layout.CentredLayout(),
    fillWidth: 1,
  });

  selectedQuestionContainer = new SKContainer({
    layoutMethod: new Layout.FillRowLayout(),
    border: "1px solid black",
    fillWidth: 1,
    margin: 30,
  });

  selectedQuestionAnswers = new SKContainer({
    layoutMethod: new Layout.FillRowLayout(),
  });

  selectedQuestionQuestion = new SKLabel({});

  selectedQuestionAnswer = new SKButton({});

  selectedQuestionOption1 = new SKButton({});

  selectedQuestionOption2 = new SKButton({});

  // this is a question list container that keeps the questions themselves together but no border
  questionListContainer = new SKContainer({
    border: "1px solid black",
    id: "wy",
    layoutMethod: new Layout.FillRowLayout(),
    fillWidth: 1,
    // fillHeight: 1,
    // height: 1000,
    height: 400,
  });

  // maybe can play around with initialize function to restore this setup here
  constructor(private model: Model) {
    super();

    // setup the view
    this.padding = 10;
    this.id = "middlearea";
    this.fill = "white";
    this.fillWidth = 1;
    this.toolbar = new ToolbarView(model);
    this.addChild(this.toolbar);

    this.listView = new ListView(model);
    this.questionListContainer.addChild(this.listView);
    this.addChild(this.questionListContainer);

    this.layoutMethod = new StackColLayout();

    this.selectedQuestionAnswer.addEventListener("action", () => {
      this.model.incrementOverall(
        this.randomSelected?.answer ?? "",
        this.selectedQuestionAnswer.text
      );
      this.model.incrementQuizCount();
    });
    this.selectedQuestionOption1.addEventListener("action", () => {
      this.model.incrementOverall(
        this.randomSelected?.answer ?? "",
        this.selectedQuestionOption1.text
      );
      this.model.incrementQuizCount();
    });
    this.selectedQuestionOption2.addEventListener("action", () => {
      this.model.incrementOverall(
        this.randomSelected?.answer ?? "",
        this.selectedQuestionOption2.text
      );
      this.model.incrementQuizCount();
    });

    this.model.addObserver(this);
  }
}
