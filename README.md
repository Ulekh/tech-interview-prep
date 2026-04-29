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
4. Run tests to verify correctness:
   ```bash
   npm test
   ```
   You can also run tests for a specific task:
   ```bash
   npx vitest exercises/typescript/easy/two-sum/
   ```
5. After completion (or if you get stuck), check `SOLUTION.md`.

## Resetting Exercises
If you want to clear your code and start over after some time, use the reset script:
```bash
npm run reset
```
This will restore all exercise files to their initial state (based on the last commit).

## Adding New Tasks
Simply create a new folder in `exercises/` according to its category (e.g., `exercises/typescript/medium/some-task/`) and copy the file structure from existing examples.

## Other Programming Languages
The project is primarily set up for TS/React (Vitest), but you can easily add other languages:
1. Create a folder for the language, e.g., `exercises/python/`.
2. Add a task with a `.py` file and tests (e.g., `pytest`).
3. Run tests with the dedicated runner for that language.

We plan to add support for Svelte and other popular technologies in the future.
