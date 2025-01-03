# CS 349 A2 - Nathan Kwon, n4kwon (20934403)

I tried to follow the MVC pattern as best as possible. I split up the view into 3 primary views - ModeBarView, middleAreaView, and StatusBarView, which would try to represent the 3 main parts of the page. I split up some of these views further and nested smaller views to try and keep code clean. I used model.ts as my Model along with an observer pattern so that when data was changed/modified, my views would update accordingly to display the latest data. I also tightly coupled my controller and views as demonstrated in the MVC2 pattern from lecture.

## Known Bugs and Workarounds:

- I skipped steps 27 and 28 entirely so when the edit panel shows up by clicking one of the questions, the overlay and widgets not receiving mouse events part of the assignment does not work.

- I failed to meet some of the layout requirements on the edit panel and the quiz mode panel. For the quiz mode panel and the original main view, the layout can look okay depending on the size of the window while the edit panel layout is very ugly. If it exceeds a certain height (i.e. 400px) for the first 2, the layout will still visually look okay but will fail to meet some padding/formatting requirements of the assignment.

- I couldn't figure out how to fix the edit panel layout because I messed up my initial custom layout. Typing in it will shift the box horizontally and make it annoying to work with. However, the save and cancel buttons and the overall functionality of the panel should still work.

## Use of AI Tools:

**Note:** I used ChatGPT to generate some functions that involved some Array index searches and also for this README to look a little nicer.

- getRandomQuestions(), getRandomCheckboxSelectedQuestion(), addRandomQuestion(), shuffleArray() functions in the model.ts file were created by ChatGPT. I mainly wanted to make the code a little cleaner in terms of iterating over an array and finding a matching value or using template functions.
