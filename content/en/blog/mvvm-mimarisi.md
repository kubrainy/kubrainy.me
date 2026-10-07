---
title: "MVVM Architecture: Layers, Flow and Rationale"
description: MVVM's three layers, the data flow between them, and why it works.
date: '2026-10-06'
---

As an app grows, the question "Where should this code go?" gets harder. When the code that draws the screen, the code that fetches data and the business rules all pile up in the same file, even a small change breaks things in unexpected places. MVVM (Model–View–ViewModel) is an architectural pattern that solves this by splitting those responsibilities into three layers.

## Three layers

| Layer | Job | Question it answers |
|---|---|---|
| **Model** | Holds the data and access to it | What is the data and where does it live? |
| **View** | Shows things on screen, passes on user interaction | What does the user see? |
| **ViewModel** | Manages the screen's state and logic | What state is the screen in right now? |

### Model

The app's data. It has two parts:

- **Data classes:** Define the fields of entities such as a task, a user or an order.
- **Data access:** The layer that decides whether the data comes from a local database or the network. It's usually called a *repository*, and it hides the details of the data source from the layers above.

### View

Everything the user sees: pages, lists, cards, forms. The View has two jobs: draw the state the ViewModel gives it, and pass the user's taps on to the ViewModel. It knows no business rules and fetches no data.

### ViewModel

The middleman between the View and the Model. It has two responsibilities:

- **Holding state.** It keeps the screen's current condition: is it loading, is the list empty, is there an error, which filter is selected.
- **Running logic.** It handles things like adding, deleting, filtering and sorting through the repository, and hands the result to the View ready to use.

The ViewModel doesn't know what the screen looks like. It depends on no UI component.

## Data flow

```
User → View → ViewModel → Repository → Data source
                  ↑                         │
                  └────── state changes ────┘
```

The flow works in this order:

1. The user does something (say, deletes an item). The View passes it on to the ViewModel.
2. The ViewModel carries out the action through the repository.
3. Based on the result, the ViewModel updates its own state.
4. The View notices the change in the ViewModel and redraws itself.

The fourth step is the most important part of MVVM: **the View listens to the ViewModel.** The ViewModel doesn't call the View. When the state changes, the View fetches the current state and draws it itself. That's why the ViewModel never needs to know which screen is using it.

## The core rule

> **The View only knows the ViewModel; the ViewModel only knows the repository.**

When this rule is broken, the architecture falls apart:

- If the View reaches the database or the repository directly, logic has leaked into the view.
- If the ViewModel uses a UI component or screen context, it becomes hard to test and can't be reused on other screens.

## Screen state

Defining the state the ViewModel holds clearly keeps the View simple. A typical list screen is in one of four states:

| State | Meaning | What the View draws |
|---|---|---|
| `loading` | Data is loading | A loading indicator |
| `empty` | There is no data | A "Nothing here yet" message |
| `error` | Something went wrong | An error message and a retry button |
| `success` | Data arrived | The list |

The View looks at which of these states it's in and decides what to draw. The answer to "Is the list empty, or is it still loading?" isn't buried in screen code; it lives in the ViewModel.

## Why MVVM?

- **Easy to find things.** If the list is wrong, look at the ViewModel; if a card looks wrong, look at the View.
- **Easy to test.** Since the ViewModel doesn't draw anything, it can be tested with plain unit tests, without opening a screen.
- **Components stay simple.** View pieces like cards and forms hold no data; they get what they need from outside. So they can be reused elsewhere.
- **Changes are safe.** Changing the look doesn't break the logic, and changing the logic doesn't break the look.
- **It suits teamwork.** One person can work on the UI while another works on the logic at the same time.

## Compared with MVC and MVP

| Pattern | The middleman | Relationship with the View |
|---|---|---|
| **MVC** | Controller | The Controller takes input and directs the Model and the View. The View and the Model are usually tightly coupled. |
| **MVP** | Presenter | The Presenter gives the View direct commands ("Show this"). The View and the Presenter know each other. |
| **MVVM** | ViewModel | The ViewModel doesn't know the View. The View listens to the ViewModel's state. |

What sets MVVM apart is that the dependency goes one way: the View knows the ViewModel, not the other way around. That makes the ViewModel easier to test and reuse.

## When does it fit, and when doesn't it?

**When it fits:**
- When screens have complex state (loading, errors, filters, search).
- When the same logic is used on more than one screen.
- When writing tests matters.

**When it may be overkill:**
- Very small, single-screen apps with almost no logic.
- Quick experiments you'll throw away.

Architecture comes at a cost: more files and more layers. That cost pays itself back as readability and easier maintenance as the project grows.

## Conclusion

MVVM is more than splitting code into folders. The real gain is that every layer does its own job and stays out of the others': the View shows, the ViewModel manages, the Model stores. When that separation holds, making changes and finding bugs stays easy even as the app grows.

---

**If you'd like to look at the code of an app I built with this architecture:**

[https://github.com/kubrainy/StudyFlow](https://github.com/kubrainy/StudyFlow)
