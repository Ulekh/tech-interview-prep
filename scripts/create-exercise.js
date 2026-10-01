import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const [category, name] = args;

if (!category || !name) {
  console.log('Usage: npm run create <category> <name>');
  console.log('Examples:');
  console.log('  npm run create typescript my-new-task');
  console.log('  npm run create react my-ui-component');
  console.log('  npm run create dom my-dom-widget');
  process.exit(1);
}

const exercisePath = path.join('exercises', category, name);

if (fs.existsSync(exercisePath)) {
  console.error(`❌ Exercise "${name}" already exists in "${category}".`);
  process.exit(1);
}

const isReact = category === 'react';
const isSystemDesign = category === 'system-design';
const isDom = category === 'dom' || category === 'vanilla';
const ext = isReact ? 'tsx' : 'ts';
const mainFile = isReact ? 'index.tsx' : 'index.ts';
const testFile = isReact ? 'index.test.tsx' : 'index.test.ts';
const styleFile = 'style.css';
const htmlFile = 'index.html';

const componentName = name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
const functionName = name.replace(/-([a-z])/g, g => g[1].toUpperCase());

const templates = {
  readme: isSystemDesign
    ? `# ${name}\n\n## Goal\nDescribe the system you need to design (e.g., "Design a URL Shortener like Bitly").\n\n## Requirements\n### Functional Requirements\n- Users should be able to...\n- System should...\n\n### Non-Functional Requirements\n- High availability\n- Low latency\n- Scalability\n\n## Constraints & Estimates\n- DAU (Daily Active Users): ...\n- Reads/Writes per second: ...\n- Storage estimates for 5 years: ...`
    : isDom
    ? `# ${name}\n\n## Task\nImplement the DOM manipulation component/widget for **${componentName}**.\n\n### Files:\n- \`index.html\`: HTML markup and structure.\n- \`index.ts\`: Interactivity, event listeners, and DOM updates.\n- \`style.css\`: Component styling.\n\n### Requirements:\n1. Add the required HTML structure in \`index.html\`.\n2. Handle user interactions and update the DOM in \`index.ts\`.\n3. Clean up any timers or event listeners if necessary.\n\n### Preview & Testing\n- **Interactive Preview**: Run \`npm run dev\` and open \`http://localhost:5173/?category=${category}&name=${name}\`.\n- **Run Tests**: \`npx vitest exercises/${category}/${name}\`.\n`
    : `# ${name}\n\n## Task\nDescribe the problem here.\n\n### Requirements:\n1. Requirement one.`,
  solution: isSystemDesign
    ? `# ${name} - Solution\n\n## 1. High-Level Design\nDescribe the core components (Load Balancer, API Gateway, Services, Databases).\n\n## 2. Database Schema\n| Field | Type | Description |\n| :--- | :--- | :--- |\n| id | UUID | Primary key |\n\n## 3. API Design\n### POST /api/v1/resource\nRequest:\n\`\`\`json\n{ "key": "value" }\n\`\`\`\n\n## 4. Scalability & Trade-offs\nDiscuss how the system scales and what are the bottlenecks.`
    : isDom
    ? `# ${name} - Solution\n\n## 1. HTML (\`index.html\`)\n\`\`\`html\n<!-- Your HTML solution here -->\n\`\`\`\n\n## 2. TypeScript (\`index.ts\`)\n\`\`\`typescript\n// Your TypeScript solution here\n\`\`\``
    : `# ${name} - Solution\n\n\`\`\`${isReact ? 'tsx' : 'typescript'}\n// Your solution here\n\`\`\``,
  html: `<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>${componentName}</title>\n    <link rel="stylesheet" href="./style.css" />\n  </head>\n  <body>\n    <div class="${name}-container">\n      <h1>${componentName}</h1>\n      <p>This is your new DOM exercise.</p>\n      <div class="card">\n        <button class="counter-btn" type="button">\n          count is <span class="count-value">0</span>\n        </button>\n      </div>\n    </div>\n\n    <script type="module" src="./index.ts"></script>\n  </body>\n</html>\n`,
  main: isReact 
    ? `import React, { useState } from 'react';\nimport './style.css';\n\nexport const ${componentName} = () => {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="${name}-container">\n      <h1>${componentName}</h1>\n      <p>This is your new React exercise.</p>\n      <div className="card">\n        <button onClick={() => setCount((count) => count + 1)}>\n          count is {count}\n        </button>\n      </div>\n    </div>\n  );\n};\n\nexport default ${componentName};`
    : isDom
    ? `import './style.css';\n\n/**\n * ${componentName} DOM Exercise\n */\nexport function init(): void {\n  const button = document.querySelector<HTMLButtonElement>('.counter-btn');\n  const countValue = document.querySelector<HTMLSpanElement>('.count-value');\n  let count = 0;\n\n  button?.addEventListener('click', () => {\n    count += 1;\n    if (countValue) {\n      countValue.textContent = String(count);\n    }\n  });\n}\n\n// Auto-run when loaded directly in the browser\nif (typeof window !== 'undefined' && !(window as any).__VITEST__) {\n  init();\n}\n\nexport default init;\n`
    : `export const ${functionName} = () => {\n  // Your code here\n};`,
  test: isReact
    ? `import React from 'react';\nimport { render, screen } from '@testing-library/react';\nimport { ${componentName} } from './index';\n\ndescribe('${name}', () => {\n  it('should render correctly', () => {\n    render(<${componentName} />);\n    expect(screen.getByText(/${componentName}/i)).toBeInTheDocument();\n  });\n});`
    : isDom
    ? `import html from './index.html?raw';\nimport { init } from './index';\n\ndescribe('${name}', () => {\n  beforeEach(() => {\n    document.body.innerHTML = html;\n    init();\n  });\n\n  afterEach(() => {\n    document.body.innerHTML = '';\n  });\n\n  it('should render initial structure', () => {\n    expect(document.querySelector('.${name}-container')).toBeInTheDocument();\n    expect(document.querySelector('.count-value')).toHaveTextContent('0');\n  });\n\n  it('should increment count when button is clicked', () => {\n    const button = document.querySelector<HTMLButtonElement>('.counter-btn')!;\n    const countValue = document.querySelector('.count-value')!;\n\n    button.click();\n    expect(countValue).toHaveTextContent('1');\n\n    button.click();\n    expect(countValue).toHaveTextContent('2');\n  });\n});\n`
    : `import { ${functionName} } from './index';\n\ndescribe('${name}', () => {\n  it('should work correctly', () => {\n    // expect(${functionName}()).toBe(...);\n  });\n});`,
  style: `.${name}-container {\n  padding: 2rem;\n  text-align: center;\n  font-family: sans-serif;\n}\n\n.card {\n  padding: 2em;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n  margin-top: 1rem;\n}\n\nbutton, .counter-btn {\n  border-radius: 8px;\n  border: 1px solid transparent;\n  padding: 0.6em 1.2em;\n  font-size: 1em;\n  font-weight: 500;\n  font-family: inherit;\n  background-color: #f9f9f9;\n  cursor: pointer;\n  transition: border-color 0.25s;\n}\n\nbutton:hover, .counter-btn:hover {\n  border-color: #646cff;\n}\n`
};

try {
  fs.mkdirSync(exercisePath, { recursive: true });
  fs.writeFileSync(path.join(exercisePath, 'README.md'), templates.readme);
  fs.writeFileSync(path.join(exercisePath, 'SOLUTION.md'), templates.solution);
  
  if (!isSystemDesign) {
    fs.writeFileSync(path.join(exercisePath, mainFile), templates.main);
    fs.writeFileSync(path.join(exercisePath, testFile), templates.test);
    if (isDom) {
      fs.writeFileSync(path.join(exercisePath, htmlFile), templates.html);
    }
    if (isReact || isDom) {
      fs.writeFileSync(path.join(exercisePath, styleFile), templates.style);
    }
  } else {
    fs.mkdirSync(path.join(exercisePath, 'assets'), { recursive: true });
    fs.writeFileSync(path.join(exercisePath, 'assets/.gitkeep'), '');
  }

  console.log(`\n✨ Exercise "${name}" created successfully at ${exercisePath}`);
  
  if (isReact) {
    console.log(`\n🚀 To run this exercise interactively:`);
    console.log(`   1. Run: npm run dev`);
    console.log(`   2. Open: http://localhost:5173/?category=react&name=${name}`);
  } else if (isDom) {
    console.log(`\n🚀 To run this exercise interactively:`);
    console.log(`   1. Run: npm run dev`);
    console.log(`   2. Dashboard: http://localhost:5173/?category=dom&name=${name}`);
    console.log(`   3. Standalone: http://localhost:5173/exercises/dom/${name}/index.html`);
  }
} catch (error) {
  console.error('❌ Error creating exercise:', error.message);
}
