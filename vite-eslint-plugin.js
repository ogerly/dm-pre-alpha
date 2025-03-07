import { ESLint } from 'eslint';
import path from 'path';
import fs from 'fs';

/**
 * Vite plugin for ESLint integration with the error console
 * @param {Object} options Plugin options
 * @returns {Object} Vite plugin
 */
export default function viteEslintPlugin(options = {}) {
  const defaultOptions = {
    include: ['src/**/*.{vue,js,jsx,ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**', 'public/**', 'docs/**'],
    eslintOptions: {}
  };

  const resolvedOptions = { ...defaultOptions, ...options };
  let eslint;
  
  return {
    name: 'vite-eslint-checker',
    
    configureServer(server) {
      // Initialize ESLint instance
      eslint = new ESLint(resolvedOptions.eslintOptions);
      
      // Add custom endpoint for on-demand lint checks
      server.middlewares.use('/__lint_check__', async (req, res) => {
        try {
          const results = await runLint();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(results));
        } catch (error) {
          console.error('Error running ESLint:', error);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    },
    
    async handleHotUpdate({ file, server }) {
      // Check if the file should be linted
      const shouldLint = 
        resolvedOptions.include.some(glob => minimatch(file, glob)) &&
        !resolvedOptions.exclude.some(glob => minimatch(file, glob));
      
      if (shouldLint) {
        // Run lint on the changed file
        try {
          const results = await eslint.lintFiles([file]);
          const formatted = formatResults(results);
          
          // Send the results to all clients
          server.ws.send({
            type: 'custom',
            event: 'eslint-results',
            data: formatted
          });
        } catch (error) {
          console.error('Error linting file:', error);
        }
      }
    }
  };
}

// Helper to run ESLint on all files
async function runLint() {
  try {
    const eslint = new ESLint();
    const results = await eslint.lintFiles(['src/**/*.{vue,js,jsx,ts,tsx}']);
    return formatResults(results);
  } catch (error) {
    console.error('Error running ESLint:', error);
    return {
      errors: [{ message: error.message, filePath: '', severity: 2 }],
      errorCount: 1,
      warningCount: 0
    };
  }
}

// Format ESLint results for the UI
function formatResults(results) {
  const errors = [];
  const warnings = [];
  
  let errorCount = 0;
  let warningCount = 0;
  
  for (const result of results) {
    const filePath = path.relative(process.cwd(), result.filePath);
    
    for (const message of result.messages) {
      const item = {
        filePath,
        line: message.line || 0,
        column: message.column || 0,
        message: message.message,
        ruleId: message.ruleId,
        severity: message.severity
      };
      
      if (message.severity === 2) {
        errors.push(item);
        errorCount++;
      } else if (message.severity === 1) {
        warnings.push(item);
        warningCount++;
      }
    }
  }
  
  return { errors, warnings, errorCount, warningCount };
}

// Simple minimatch implementation for file matching
function minimatch(filePath, pattern) {
  // Convert glob pattern to regex
  const regex = new RegExp(pattern
    .replace(/\./g, '\\.')
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '.'));
  
  return regex.test(filePath);
}
