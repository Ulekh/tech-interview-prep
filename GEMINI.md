# Project Mandates: Technical Interview Prep

This file contains foundational instructions and conventions for the `tech-interview-prep` repository. All agents and developers must adhere to these guidelines.

## Architecture & Organization
- **Exercise Root**: All learning material must reside in the `exercises/` directory.
- **Flat Structure**: Exercises are categorized by technology (e.g., `react`, `typescript`) but should not be nested deeper than `exercises/<technology>/<exercise-name>`.
- **File Conventions**: Every exercise folder MUST contain:
  - `README.md`: Problem description and requirements.
  - `SOLUTION.md`: Reference implementation.
  - `index.ts` or `index.tsx`: Entry point for the user's solution.
  - `index.test.ts` or `index.test.tsx`: Unit tests.

## Development Workflows
- **Scaffolding**: Always use the provided generator to create new tasks:
  ```bash
  npm run create <category> <name>
  ```
- **Resetting**: To clear a user's progress and return to a "ready-to-solve" state, use:
  ```bash
  npm run reset
  ```
  Note: This script relies on `git checkout` to restore files to the state of the last commit.

## Testing Standards
- **Framework**: Vitest.
- **Environment**: `jsdom` for React components.
- **Global Types**: `describe`, `it`, `expect`, and `vi` are available globally. Do not add redundant imports from `vitest` in new test files.
- **Verification**: Changes are only considered complete if `npm test` passes (or fails as intended for unsolved tasks).

## Language Policy
- All documentation, READMEs, script messages, and code comments must be in **English**.

## Python Support
- **Tool**: Use [uv](https://docs.astral.sh/uv/) for environment and dependency management.
- **Dependencies**: Dependencies are managed via `pyproject.toml`.
- **Execution**: Use `uv run` or `npm run python:playground`.
