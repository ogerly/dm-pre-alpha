import { ESLint } from 'eslint';

/**
 * Run ESLint check on project files
 * @returns {Promise<Object>} Lint results
 */
export async function runLintCheck() {
  try {
    const eslint = new ESLint();
    const results = await eslint.lintFiles(['src/**/*.{vue,js,jsx,ts,tsx}']);
    return formatResults(results);
  } catch (error) {
    console.error('Error running ESLint:', error);
    return {
      errors: [{ 
        message: `Error running ESLint: ${error.message}`, 
        filePath: '', 
        line: 0, 
        column: 0, 
        severity: 2 
      }],
      errorCount: 1,
      warningCount: 0
    };
  }
}

/**
 * Format ESLint results for the UI
 * @param {Array} results - ESLint results
 * @returns {Object} Formatted results
 */
function formatResults(results) {
  const errors = [];
  const warnings = [];
  
  let errorCount = 0;
  let warningCount = 0;
  
  for (const result of results) {
    const filePath = result.filePath.replace(process.cwd() + '/', '');
    
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
