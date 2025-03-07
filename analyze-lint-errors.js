#!/usr/bin/env node

import { ESLint } from 'eslint';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function analyzeErrors() {
  try {
    // Create ESLint instance
    const eslint = new ESLint({
      useEslintrc: false,
      overrideConfigFile: path.join(__dirname, '.eslintrc.cjs')
    });

    // Run ESLint
    console.log('Analyzing ESLint errors...');
    const results = await eslint.lintFiles(['src/**/*.{vue,js,jsx,ts,tsx}']);

    // Collect errors by rule
    const errorsByRule = {};
    let totalErrors = 0;
    let totalWarnings = 0;
    const fileErrors = {};

    for (const result of results) {
      const filePath = path.relative(process.cwd(), result.filePath);
      
      if (result.errorCount > 0 || result.warningCount > 0) {
        fileErrors[filePath] = {
          errorCount: result.errorCount,
          warningCount: result.warningCount,
          messages: result.messages
        };
      }
      
      for (const message of result.messages) {
        const ruleId = message.ruleId || 'parsing-error';
        
        if (!errorsByRule[ruleId]) {
          errorsByRule[ruleId] = {
            count: 0,
            severity: message.severity,
            examples: []
          };
        }
        
        errorsByRule[ruleId].count++;
        
        if (errorsByRule[ruleId].examples.length < 3) {
          errorsByRule[ruleId].examples.push({
            message: message.message,
            filePath,
            line: message.line,
            column: message.column
          });
        }
        
        if (message.severity === 2) totalErrors++;
        else if (message.severity === 1) totalWarnings++;
      }
    }

    // Sort rules by count
    const sortedRules = Object.entries(errorsByRule)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([rule, data]) => ({ rule, ...data }));

    // Generate report
    const report = {
      summary: {
        totalErrors,
        totalWarnings,
        fileCount: Object.keys(fileErrors).length,
        totalFiles: results.length,
        ruleCount: sortedRules.length
      },
      mostCommonRules: sortedRules.slice(0, 10),
      filesByErrorCount: Object.entries(fileErrors)
        .sort((a, b) => b[1].errorCount - a[1].errorCount)
        .slice(0, 10)
        .map(([file, data]) => ({ file, errorCount: data.errorCount }))
    };

    // Print summary
    console.log('\n=== LINT ERROR ANALYSIS ===');
    console.log(`Total: ${totalErrors} errors, ${totalWarnings} warnings in ${report.summary.fileCount}/${report.summary.totalFiles} files`);
    
    console.log('\nMost common rules broken:');
    report.mostCommonRules.forEach((item, i) => {
      const severityLabel = item.severity === 2 ? 'error' : 'warning';
      console.log(`${i+1}. ${item.rule} (${item.count} ${severityLabel}s)`);
      if (item.examples.length > 0) {
        console.log(`   Example: ${item.examples[0].message}`);
        console.log(`   at ${item.examples[0].filePath}:${item.examples[0].line}`);
      }
    });
    
    console.log('\nFiles with most errors:');
    report.filesByErrorCount.forEach((item, i) => {
      console.log(`${i+1}. ${item.file} (${item.errorCount} errors)`);
    });
    
    // Save report to file
    fs.writeFileSync('lint-report.json', JSON.stringify(report, null, 2));
    console.log('\nDetailed report saved to: lint-report.json');
    
  } catch (error) {
    console.error('Error analyzing ESLint errors:', error);
    process.exit(1);
  }
}

analyzeErrors();
