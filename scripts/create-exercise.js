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

const templates = {
  readme: `# ${name}\n\n## Task\nDescribe the problem here.\n\n### Requirements:\n1. Requirement one.`,
  solution: `# ${name} - Solution\n\n\`\`\`${isReact ? 'tsx' : 'typescript'}\n// Your solution here\n\`\`\``,
  main: isReact 
    ? `import React from 'react';\n\nexport const ${name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')} = () => {\n  // Your code here\n  return <div>{/* Implementation */}</div>;\n};`
    : `export const ${name.replace(/-([a-z])/g, g => g[1].toUpperCase())} = () => {\n  // Your code here\n};`,
  test: isReact
    ? `import React from 'react';\nimport { render, screen } from '@testing-library/react';\nimport { ${name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')} } from './index';\n\ndescribe('${name}', () => {\n  it('should render correctly', () => {\n    // render(<${name.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')} />);\n  });\n});`
    : `import { ${name.replace(/-([a-z])/g, g => g[1].toUpperCase())} } from './index';\n\ndescribe('${name}', () => {\n  it('should work correctly', () => {\n    // expect(${name.replace(/-([a-z])/g, g => g[1].toUpperCase())}()).toBe(...);\n  });\n});`
};

try {
  fs.mkdirSync(exercisePath, { recursive: true });
  fs.writeFileSync(path.join(exercisePath, 'README.md'), templates.readme);
  fs.writeFileSync(path.join(exercisePath, 'SOLUTION.md'), templates.solution);
  fs.writeFileSync(path.join(exercisePath, mainFile), templates.main);
  fs.writeFileSync(path.join(exercisePath, testFile), templates.test);

  console.log(`\n✨ Exercise "${name}" created successfully at ${exercisePath}`);
} catch (error) {
  console.error('❌ Error creating exercise:', error.message);
}
