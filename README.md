# Arkesia.todo

[Arkesia.todo Live Server](https://arkesiatodo.netlify.app/)

Arkesia.todo is an online checklist tool that tracks your daily and weekly progress of tasks for the MMORPG Lost Ark. Arkesia.todo can store multiple characters and allows the creation of custom tasks; resetting all task progress both daily and weekly!

![sample.jpg](https://i.postimg.cc/QNyBNg57/sample.jpg)

## Key Features

- Tracking of multiple characters as well as roster bound tasks
- Daily and Weekly task views to switch between
- Creation of new tasks for both dailies and weeklies
- Timers counting down until time of reset (10:00 UTC)
- Resetting of task progress daily and weekly
- Stored to LocalStorage on your browser

## How to Use

1.  On first visit, Arkesia.todo will generate you default "Account" card with some default tasks.
2.  You can click on the "+" symbol at the back of your cards whenever you want to add a new character.
    > :bulb: **Tip:** If your board becomes too full, you can scroll through the carousel with **SHIFT + Scroll Wheel**!
3.  Your new character will also come with some default tasks but don't worry, you can edit or remove any task by hovering over the profile image and clicking the "Edit" button at the top right!
4.  Add a new task by hovering over a card and clicking the "Add Task" button that appear at the bottom of the task list.
5.  Unchecking tasks in the "Edit" menu will delete the task when the "Apply" button is clicked.
    > :bulb: **Tip:** Left clicking tasks will progress them, **ALT + CLICK** will decrement the progress!
6.  Add characters and tasks and happy adventuring!

## Technologies Used

- HyperText Markup Language (HTML)
- Cascading Style Sheets (CSS)
- JavaScript (JS)

## Purpose

Arkesia.todo is a personal project I embarked on to expand my experience in web development. Although I have dipped my toes into web development previously, Arkesia.todo is probably the first fully fledged website I have developed and I am very excited to share it with the Lost Ark community! I have pursued this project as I wanted to create a more visually impressive and customizable todo list compared to other resources I have seen.

## Process

As this is a personal project, I will be detailing my journey through the design and development of Arkesia.todo as well as what I have learnt from this experience!

The initial design I had for Arkesia.todo was created using [Figma](https://www.figma.com/). This was my first experience with Figma and it was a joy to work with after figuring out the basics. Prototyping my design had a huge impact on the amount of time I spent when coding the frontend user interface and I will definitely be revisiting it for future projects! Although the design was incomplete, I had the core design concepts figured out and fine-tuned it when I began coding.
![figma-design.jpg](https://i.postimg.cc/L9g3MsGN/design.jpg)

From design, I went into HTML and CSS to design the frontend framework and making it as mobile friendly as I could with my experience by using Flexbox. (I hope it works well for you mobile users!) Once I had the layout ready, I began working through the JavaScript and there's a whole bunch to unpack here!

Prior to this project, I have not used much JavaScript however, with a programming background it was very natural to get into. There were a lot of new concepts and problems I had to work out, mostly pertaining to storing, loading, and interacting with LocalStorage elements. Most of the complications I had stemmed from linking LocalStorage elements with the HTML elements, grabbing updates when needed. The solution I started using near the end of my development was to use data attributes which are accessible from JavaScript after grabbing the HTML element from the DOM. This solution was a lot more elegant than my workaround when I began this project and I would very much like to update the rest of the code to use this method. However, that would entail structural changes to the core objects used throughout the entire project. This will definitely be something I keep in mind for future projects.

As someone who has not published a website before, I am very happy with what I have managed to accomplish with Arkesia.todo and wish all those that use it a wonderful experience! Happy adventuring, and I will see you all in the world of Arkesia!

## URL

[https://arkesiatodo.netlify.app/](https://arkesiatodo.netlify.app/)
