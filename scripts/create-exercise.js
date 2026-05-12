import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const [category, name] = args;

if (!category || !name) {
  console.log('Usage: npm run create <category> <name>');
  console.log('Example: npm run create typescript my-new-task');
  process.exit(1);
}

const exercisePath = path.join('exercises', category, name);

if (fs.existsSync(exercisePath)) {
  console.error(`❌ Exercise "${name}" already exists in "${category}".`);
  process.exit(1);
}

const isReact = category === 'react';
const ext = isReact ? 'tsx' : 'ts';
const mainFile = isReact ? 'index.tsx' : 'index.ts';
const testFile = isReact ? 'index.test.tsx' : 'index.test.ts';
const styleFile = 'style.css';

const componentName = name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
const functionName = name.replace(/-([a-z])/g, g => g[1].toUpperCase());

const templates = {
  readme: `# ${name}\n\n## Task\nDescribe the problem here.\n\n### Requirements:\n1. Requirement one.`,
  solution: `# ${name} - Solution\n\n\`\`\`${isReact ? 'tsx' : 'typescript'}\n// Your solution here\n\`\`\``,
  main: isReact 
    ? `import React, { useState } from 'react';\nimport './style.css';\n\nexport const ${componentName} = () => {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div className="${name}-container">\n      <h1>${componentName}</h1>\n      <p>This is your new React exercise.</p>\n      <div className="card">\n        <button onClick={() => setCount((count) => count + 1)}>\n          count is {count}\n        </button>\n      </div>\n    </div>\n  );\n};\n\nexport default ${componentName};`
    : `export const ${functionName} = () => {\n  // Your code here\n};`,
  test: isReact
    ? `import React from 'react';\nimport { render, screen } from '@testing-library/react';\nimport { ${componentName} } from './index';\n\ndescribe('${name}', () => {\n  it('should render correctly', () => {\n    render(<${componentName} />);\n    expect(screen.getByText(/${componentName}/i)).toBeInTheDocument();\n  });\n});`
    : `import { ${functionName} } from './index';\n\ndescribe('${name}', () => {\n  it('should work correctly', () => {\n    // expect(${functionName}()).toBe(...);\n  });\n});`,
  style: `.${name}-container {\n  padding: 2rem;\n  text-align: center;\n  font-family: sans-serif;\n}\n\n.card {\n  padding: 2em;\n  border: 1px solid #ccc;\n  border-radius: 8px;\n  margin-top: 1rem;\n}\n\nbutton {\n  border-radius: 8px;\n  border: 1px solid transparent;\n  padding: 0.6em 1.2em;\n  font-size: 1em;\n  font-weight: 500;\n  font-family: inherit;\n  background-color: #f9f9f9;\n  cursor: pointer;\n  transition: border-color 0.25s;\n}\n\nbutton:hover {\n  border-color: #646cff;\n}\n`
};

try {
  fs.mkdirSync(exercisePath, { recursive: true });
  fs.writeFileSync(path.join(exercisePath, 'README.md'), templates.readme);
  fs.writeFileSync(path.join(exercisePath, 'SOLUTION.md'), templates.solution);
  fs.writeFileSync(path.join(exercisePath, mainFile), templates.main);
  fs.writeFileSync(path.join(exercisePath, testFile), templates.test);
  if (isReact) {
    fs.writeFileSync(path.join(exercisePath, styleFile), templates.style);
  }

  console.log(`\n✨ Exercise "${name}" created successfully at ${exercisePath}`);
  
  if (isReact) {
    console.log(`\n🚀 To run this exercise interactivey:`);
    console.log(`   1. Run: npm run dev`);
    console.log(`   2. Open: http://localhost:5173/?category=react&name=${name}`);
  }
} catch (error) {
  console.error('❌ Error creating exercise:', error.message);
}
