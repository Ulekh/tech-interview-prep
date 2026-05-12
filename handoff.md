# Handoff: Interactive React Exercises & Scaffolding

## Goal
The objective is to provide an interactive development environment for React exercises. Users should be able to create a new React exercise and immediately run it in a browser to see visual changes (CSS/UI) in real-time, similar to a "mini-app" experience.

## Current State
- **Dev Server**: Vite is now configured to serve the project. Running `npm run dev` starts a server at `http://localhost:5173/`.
- **Dynamic Preview (Visual Tasks)**: The `playground/react/main.tsx` (served via `index.html`) supports dynamic loading of any React exercise via URL parameters (e.g., `?category=react&name=counter`). This is ideal for UI/UX practice.
- **Non-Visual Tasks (Logic/Algorithms)**: TypeScript and generic logic exercises (e.g., `exercises/typescript/*`) continue to rely on **Unit Tests** (Vitest) as the primary indicator of success. The new setup does not interfere with `npm test`.
- **Scaffolding**: `npm run create` has been enhanced for React but remains fully functional for other categories. For React, it now generates:
    - An interactive `index.tsx` with default state/markup.
    - A `style.css` file with basic aesthetic styling.
    - A success message with a direct link to the preview.
- **Config**: `vitest.config.ts` has been renamed to `vite.config.ts` to support both Vite (server) and Vitest (tests).
- **Playground Support**: Existing playground functionality for TypeScript (`playground/typescript/`) and Python (`playground/python/`) remains unchanged and supported.
- **TypeScript Fix**: Added global declaration for `*.css` in `types/global.d.ts` to resolve import errors in `.tsx` files.

## Active Files
- `scripts/create-exercise.js`: The generator logic.
- `package.json`: Contains the new `"dev": "vite"` script.
- `vite.config.ts`: Shared configuration for Vite and Vitest.
- `playground/react/main.tsx`: The "shell" that loads exercises into the browser.
- `types/global.d.ts`: Global type definitions.

## What was tried and failed
- **Original Scaffolding**: Was too bare-bones (no styles, no default interactive elements), making it hard for users to start UI practice.
- **Config Isolation**: Initially, the project used `vitest.config.ts`. Renaming it was necessary because Vite looks for `vite.config.ts` by default, and Vitest is fully compatible with it.
- **Type Errors**: Side-effect imports of CSS files were failing TS validation; this was fixed by adding a wildcard module declaration.

## Next Steps
1. **Refine Playground Shell**: Improve `playground/react/main.tsx` to include a navigation menu or a list of available exercises so users don't have to manually type URL parameters.
2. **Resolve remaining Typecheck errors**: There are some lingering errors in `playground/react/main.tsx` related to `import.meta.glob` and `allowImportingTsExtensions` that should be addressed in `tsconfig.json`.
3. **Expand Templates**: Consider adding a "component" category that generates even more specific UI structures (e.g., a layout with header/footer).
