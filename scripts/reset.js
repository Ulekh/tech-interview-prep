import { execSync } from 'child_process';
import path from 'path';

/**
 * Script to reset exercise files to their initial state (from the last commit).
 * Ignores test files, README, and SOLUTION files.
 */

try {
  // Get the list of modified files in the exercises folder
  const status = execSync('git ls-files -m exercises/').toString().split('\n').filter(Boolean);

  // Filter only code files (ts, tsx), excluding tests
  const filesToReset = status.filter(file => {
    const isCode = file.endsWith('.ts') || file.endsWith('.tsx');
    const isTest = file.includes('.test.');
    const isDoc = file.endsWith('.md');
    return isCode && !isTest && !isDoc;
  });

  if (filesToReset.length === 0) {
    console.log('✅ All exercises are already in their initial state (no changes).');
    process.exit(0);
  }

  console.log('🔄 Resetting the following exercises:');
  filesToReset.forEach(file => console.log(`  - ${file}`));

  // Restore files to the state from HEAD
  execSync(`git checkout HEAD -- ${filesToReset.join(' ')}`);

  console.log('\n✨ Exercises have been reset! Good luck solving them again.');
} catch (error) {
  console.error('❌ Error resetting exercises:', error.message);
  console.log('\nMake sure Git is installed and that changes were previously committed.');
}
