import './style.css';

/**
 * Signup Form DOM Exercise
 */
export function init(): void {
  const form = document.querySelector<HTMLFormElement>('#signup-form');
  const usernameInput = document.querySelector<HTMLInputElement>('#username');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    // Submission / validation logic
  });
}

// Auto-run when loaded directly in browser
if (typeof window !== 'undefined' && !(window as any).__VITEST__) {
  init();
}

export default init;

