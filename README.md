# Technical Interview Prep - Practice Environment

This project was created to help you prepare for technical recruiting interviews in the "kata-machine" style.

## Project Structure
Each task is located in the `exercises/` folder and has the following structure:
- `README.md`: Task description and requirements.
- `SOLUTION.md`: Example solution with discussion.
- `index.ts` or `Exercise.tsx`: The file where you write your code.
- `index.test.ts` or `Exercise.test.tsx`: Unit tests verifying the solution.

## How to Practice
1. Choose a task from the `exercises/` folder.
2. Read the instructions in `README.md`.
3. Implement your solution in the code file.
4. Verify your solution using one of the following methods:

### Running Tests
- **All tests**: `npm test`
- **Single task**: `npx vitest exercises/path/to/task`
- **By test name**: `npx vitest -t "name of the test"`
- **Watch mode**: `npm run test:watch` (automatically reruns on save)

### Visual Interface (Recommended)
Run the Vitest UI for a beautiful, interactive dashboard to manage and debug your tests:
```bash
npm run test:ui
```

### Pro Debugging Tips
- **VS Code Extension**: Install the [Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) extension to run and debug tests directly from your editor sidebar.
- **Focusing tests**: Use `it.only(...)` or `describe.only(...)` in your code to run only specific tests while working on a solution.

5. After completion (or if you get stuck), check `SOLUTION.md`.

## Resetting Exercises
If you want to clear your code and start over after some time, use the reset script:
```bash
npm run reset
```
This will restore all exercise files to their initial state (based on the last commit).

## Adding New Tasks
You can use the built-in generator to quickly create a new exercise:
```bash
npm run create <category> <name>
```
Example:
```bash
npm run create typescript my-new-task
# or
npm run create react my-ui-component
```
This will automatically create a folder with `README.md`, `SOLUTION.md`, a code file, and a test file with boilerplate code.

## Other Programming Languages
The project is primarily set up for TS/React (Vitest), but you can easily add other languages:
1. Create a folder for the language, e.g., `exercises/python/`.
2. Add a task with a `.py` file and tests (e.g., `pytest`).
3. Run tests with the dedicated runner for that language.

We plan to add support for Svelte and other popular technologies in the future.
