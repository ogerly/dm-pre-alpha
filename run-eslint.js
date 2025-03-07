#!/usr/bin/env node

import { ESLint } from 'eslint';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  try {
    // Create an instance of ESLint with specified options
    // Explicitly use .eslintrc.cjs
    const eslint = new ESLint({
      useEslintrc: false,
      overrideConfigFile: path.join(__dirname, '.eslintrc.cjs')
    });

    // Lint files
    console.log('Running ESLint...');
    const results = await eslint.lintFiles(['src/**/*.{vue,js,jsx,ts,tsx}']);

    // Format the results
    const formatter = await eslint.loadFormatter('stylish');
    const resultText = formatter.format(results);

    // Output the results
    console.log(resultText);

    // Count errors and warnings
    let errorCount = 0;
    let warningCount = 0;

    for (const result of results) {
      errorCount += result.errorCount;
      warningCount += result.warningCount;
    }

    console.log(`Found ${errorCount} errors and ${warningCount} warnings.`);

    // Exit with a non-zero code if there are errors
    process.exit(errorCount > 0 ? 1 : 0);
  } catch (error) {
    console.error('Error running ESLint:', error);
    process.exit(1);
  }
}

main();
