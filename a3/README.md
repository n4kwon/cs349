# CS 349 A3 - Nathan Kwon, n4kwon (20934403)

I tried to adhere to an MVC pattern as closely as possible. The bulk of my application logic is stored in the model, which maintains and updates data pertaining to various things like the list of questions, number of questions correct, what mode the application is in, and the undo/redo stacks. I've separated the UI into 3 main views - modeBarView, middleAreaView, and statusBarView, which represent the 3 main parts of the interface. I've also made it so that the View is tightly coupled with the Controller as I have some event handlers as part of my views as well. I also used a reverse undo command pattern with the undo and redo stack as well (sort of more of a Memento pattern for my reverse change record).

## Assignment Requirement Decisions:

- As stated in the [assignment required functionality](https://student.cs.uwaterloo.ca/~cs349/1249/assignments/a3/), some of the questions randomly drawn can be duplicates. This means that some duplicate questions can show up in the list view and when taking the quiz.

- For step 29, if you press the ? in Quiz mode and enter cheating mode, the answer to the next question is highlighted after you answer the current question. This is in alignment with the wording of the requirement and also the same requirement clarification for Assignment 2, which can be seen in the Piazza post [here] (https://piazza.com/class/lz8lw885gw66ie/post/118)

- If you have several questions in the middle area container and make the window the minimum size, I have made it so that questions can overflow. Certain questions can initially appear off the screen and the bounding box will grow to fit the questions off screen so the bottom part of the box may initially not be visible. However, I also made it so that you can scroll down to view and select the questions. This wasn't explicitly talked about in the requirements so I decided to implement it this way rather than having a fixed maximum bounding box as it looked nicer and it's more interactive with the user.

## Known Bugs and Workarounds:

## Use of AI Tools:

**Note:** I used ChatGPT to debug and improve some functions that involved some Array index searching and logic involving stack manipulation and also for this README to look a little nicer.

- Part of the redo and some of the other stack operation functions were debugged/cleaned up using ChatGPT as some of the logic was overly complicated and had a few bugs.

- Some of the styling in the css file was fixed with ChatGPT as I was initially formatting some of the styling incorrectly.
