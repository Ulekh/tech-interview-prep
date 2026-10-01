# Architecture & How It Works: Classic HTML, DOM & Hot Reload

This document provides a technical overview of how HTML, TypeScript, CSS modules, and Hot Module Replacement (HMR) operate in this repository for DOM-based exercises.

---

## 1. Overview & Core Philosophy

The project provides an interactive sandbox for coding exercises (DOM manipulation, Vanilla JS/TS, React, and System Design) while remaining lightweight and test-driven.

For **DOM exercises** (`exercises/dom/<exercise-name>`):
- **HTML (`index.html`)**: A complete, standard HTML5 document (`<!DOCTYPE html>`, `<head>`, `<body>`) where you write your markup, forms, and attributes directly.
- **Styles (`style.css`)**: Standalone CSS linked via `<link rel="stylesheet" href="./style.css">`.
- **TypeScript / Logic (`index.ts`)**: Standalone TypeScript loaded via `<script type="module" src="./index.ts"></script>`.
- **Tests (`index.test.ts`)**: Automated verification with Vitest and `@testing-library/jest-dom` in JSDOM.
- **Browser Preview (`npm run dev`)**:
  - **Unified Dashboard**: `http://localhost:5173/?category=dom&name=<exercise-name>` (renders inside an isolated `<iframe>` with an action bar).
  - **Direct Standalone**: `http://localhost:5173/exercises/dom/<exercise-name>/index.html`.

*(Note: `react` and `typescript` exercises continue to use their respective component and function workflows without changes).*

---

## 2. Module System: How HTML, TS, and CSS Connect

```mermaid
flowchart TD
    subgraph Browser Preview ["npm run dev (Vite Dev Server)"]
        DirectURL["Direct URL: /exercises/dom/signup-form/index.html"] --> NativePage["Pure Standalone HTML5 Page"]
        DashboardURL["Dashboard: /?category=dom&name=signup-form"] --> MainReact["playground/react/main.tsx"]
        MainReact --> IframeContainer["Iframe Container (Toolbar & Standalone Link)"]
        IframeContainer --> NativePage
    end

    subgraph NativePage ["Standalone Exercise Sandbox (exercises/dom/<name>)"]
        IndexHTML["index.html"] -->|"<link rel='stylesheet'>"| StyleCSS["style.css (HMR)"]
        IndexHTML -->|"<script type='module'>"| IndexTS["index.ts (HMR)"]
    end

    subgraph TestEnvironment ["Vitest (Node.js + JSDOM)"]
        IndexTest["index.test.ts"] -->|import ?raw| IndexHTML
        IndexTest -->|import { init }| IndexTS
        IndexTest --> JSDOM["JSDOM document.body.innerHTML = html; init();"]
    end
```

### A. Classic Browser Execution
In `index.html`:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Signup Form</title>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <div class="signup-form-container">
      <form id="signup-form">
        <!-- Markup here -->
      </form>
    </div>

    <script type="module" src="./index.ts"></script>
  </body>
</html>
```

Vite serves this file as a first-class Multi-Page Application (MPA) entry:
1. `<link rel="stylesheet" href="./style.css">`: Vite compiles CSS and establishes hot reloading.
2. `<script type="module" src="./index.ts">`: Vite compiles TypeScript on the fly into native ES modules.

---

### B. Isolated Dashboard Preview (`<iframe>`)
In `playground/react/main.tsx`, when `category === 'dom'` is requested:
- The dashboard renders an `<iframe>` pointing to `/exercises/dom/${name}/index.html`.
- **Benefits**:
  - Complete DOM and CSS isolation (exercise styles cannot collide with the dashboard or other components).
  - Native browser environment with standard `window`, `document`, and lifecycle events.
  - Dedicated toolbar with an "Open standalone page ↗" button to test in a clean tab.

---

### C. Testing Bridge in Vitest (JSDOM)
Because Node.js does not execute `<script src="...">` tags inside HTML strings, `index.ts` exposes an `init()` function with an auto-run guard:

```typescript
// exercises/dom/<name>/index.ts
import './style.css';

export function init(): void {
  const form = document.querySelector<HTMLFormElement>('#signup-form');
  // Event listeners, validation, logic...
}

// Auto-run when running in a real browser:
if (typeof window !== 'undefined' && !(window as any).__VITEST__) {
  init();
}

export default init;
```

In `index.test.ts`, Vitest imports the HTML template using Vite's `?raw` import and initializes fresh DOM for every test:

```typescript
import html from './index.html?raw';
import { init } from './index';

describe('signup-form', () => {
  beforeEach(() => {
    document.body.innerHTML = html;
    init();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should render form structure', () => {
    expect(document.querySelector('#signup-form')).toBeInTheDocument();
  });
});
```

---

## 3. Hot Module Replacement (HMR)

| File Changed | Browser Action | Form / DOM State |
| :--- | :--- | :--- |
| **`style.css`** | Vite updates the styles in the page/iframe via HMR. | **Preserved!** Input text, checkboxes, and focus are not reset. |
| **`index.html`** or **`index.ts`** | Vite reloads the iframe/standalone page cleanly. | **Clean reload.** Starts from initial HTML state with fresh handlers. |

---

## 4. Workflows Summary

### Creating a new DOM exercise:
```bash
npm run create dom <exercise-name>
```

### Running live browser preview:
```bash
npm run dev
# Dashboard:  http://localhost:5173/?category=dom&name=<exercise-name>
# Standalone: http://localhost:5173/exercises/dom/<exercise-name>/index.html
```

### Running tests:
```bash
npx vitest exercises/dom/<exercise-name>
```

### Resetting exercise files to original state:
```bash
npm run reset
```
*(Restores modified `.ts`, `.tsx`, and `.html` files back to `HEAD`.)*
