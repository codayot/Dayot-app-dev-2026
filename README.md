# Weekend To-Do List

A To-Do List web app made with plain HTML, CSS, and JavaScript for the
Prelim Exam (Applications Development and Emerging Technologies).

The design is inspired by the iOS Notes checklist look — a white note card
with a wavy peach-and-lavender background, a bold title, and round
orange checkmarks for each item.

No frameworks, no libraries — just three files.

## Files

- `index.html` — page layout (the note card, the add-task row, the list)
- `style.css` — styling (the Notes-app look and the blob background)
- `script.js` — all the logic (adding, checking off, deleting, saving)

## How to run it

Double-click `index.html` to open it in your browser. That's it.

(Or run a local server: `python3 -m http.server`, then open
`http://localhost:8000`.)

## How each requirement was done

**Create Task**
The row above the list (dashed circle + input + orange "+" button) is a
real `<form>`. Submitting it is caught with `event.preventDefault()`, so
the page never reloads. The new task is turned into an object and pushed
into the `tasks` array, the list re-renders immediately, and the input is
cleared.

**Input Validation**
Before a task is added, the code checks `taskInput.value.trim() === ""`.
If the field is empty, nothing is added or shown, and a small red message
("Please type a to-do before adding it.") appears under the input.

**View Tasks in a List**
`renderTasks()` clears the `<ul>` and rebuilds it from the `tasks` array
every time something changes. That array is the single source of
truth — the page only ever shows what's inside it. Each row has the task
name, a round button to mark it done, and an "✕" button to delete it.

**Mark Task as Done**
Clicking the round checkbox toggles that task's `done` value. When
`done` is `true`, the circle fills orange with a checkmark and the text
gets a strikethrough. Since it's saved to Local Storage, this state
survives a page reload.

**Delete Task**
The "✕" button on each row removes that task from the `tasks` array with
`.filter()`, then re-saves and re-renders.

**Form Submission Handling**
A `submit` event listener is used, default browser behavior is prevented,
and the input value is collected and converted into a plain object:
`{ id, text, done }`.

**Data Persistence**
`localStorage.setItem()` / `localStorage.getItem()` save and load the
`tasks` array as a JSON string under the key `"weekendTodoTasks"`. The
first time the app is opened (nothing saved yet), it seeds itself with the
sample checklist from the design inspiration, all marked done.

**Asynchronous JavaScript**
The "Clear All" link below the list calls an `async` function. It disables
itself, shows "Clearing...", then `await`s a `Promise` that only resolves
after a `setTimeout` of 2000ms (2 seconds) — only then is the `tasks`
array (and Local Storage) actually wiped.

## Notes on the design

The back arrow / "All iCloud" label, share icon, "..." icon, the timestamp,
and the four bottom toolbar icons are decorative — they recreate the look
of the iOS Notes app but aren't wired to anything, since they weren't part
of the required functionality. Every element that the exam asks for (add,
validate, view, complete, delete, delete all, persist) is fully working.

## Submitting to GitHub

```bash
git checkout -b Prelim-Exam
git add index.html style.css script.js README.md
git commit -m "Prelim Exam: To-Do List app (iOS Notes style)"
git push -u origin Prelim-Exam
```

Then share your repository link with the `Prelim-Exam` branch pushed.
