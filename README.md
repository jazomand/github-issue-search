# github-issue-search

## Task
Using Github’s API (https://developer.github.com/), build an application with an autocomplete input box for searching issues for React’s repo (https://github.com/facebook/react/issues). Input and results should be able to navigate via keyboard shortcuts. Each result should have but not limited to, the issue’s title and labels.

## Proposal
Typescript React App, using my proposed architecture (based on Uncle Bob's clean architecture).

## Features
- Application with an autocomplete input box for searching issues for React’s repo (filters by title & body).
- Input and results should be able to navigate via keyboard shortcuts (UP & DOWN arrow keys, ESC and ENTER).
- Each result have the the issue’s title body and labels.
- Custom hooks for key events & debounce.
- Implementation in both plain react & redux.
- Testing using testing-library.
- Used Material-UI library for material design look & feel.
- Added custom command for test coverage report: npm run test:coverage.
- Dependency Injection.

## Notes:
Autocompletion works on the premise of suggesting the rest of the word you are typing and the following words. 
This behavior has been mimicked by suggesting how to complete current word and most used next words using the issues data.
This strategy works better on "Local" search, because github's search API limited capabilities with incomplete words:
- https://api.github.com/search/issues?q=repo:facebook/react%20is:issue%20chro : "chro" (0 results)
- https://api.github.com/search/issues?q=repo:facebook/react%20is:issue%20chrome : "chrome" (1741 results)

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.

### `npm run test:coverage`

Launches the test runner to report test coverage.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
