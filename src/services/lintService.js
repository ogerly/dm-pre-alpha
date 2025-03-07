import errorLogger from './errorLogger';

/**
 * Simple service to manage lint status in development environment
 */
class LintService {
  constructor() {
    this.lintErrors = [];
    this.lintWarnings = [];
    this.lintStatus = 'unknown'; // 'unknown', 'running', 'pass', 'fail', 'error'
    this.lastRunTime = null;
  }

  /**
   * Run a manual lint check by executing the ESLint CLI via the development server
   * This only works in development mode with the Vite dev server
   */
  async runLintCheck() {
    if (import.meta.env.PROD) {
      return { success: false, message: 'Lint checks only available in development mode' };
    }

    this.lintStatus = 'running';
    this.notifySubscribers();

    try {
      const response = await fetch('/__lint_check__');
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText.substring(0, 100)}...`);
      }
      
      let result;
      try {
        const text = await response.text();
        result = JSON.parse(text);
      } catch (parseError) {
        throw new Error(`Failed to parse response as JSON: ${parseError.message}`);
      }

      this.processlintResults(result);
      return { success: true, result };
    } catch (error) {
      this.lintStatus = 'error';
      this.lintErrors = [];
      this.lintWarnings = [];
      errorLogger.error('Lint check failed', error);
      return { success: false, message: error.message };
    } finally {
      this.lastRunTime = new Date();
      this.notifySubscribers();
    }
  }

  /**
   * Process the lint results from the server
   */
  processlintResults(result) {
    if (!result) {
      this.lintStatus = 'error';
      return;
    }
    
    this.lintErrors = result.errors || [];
    this.lintWarnings = result.warnings || [];
    this.lintStatus = this.lintErrors.length > 0 ? 'fail' : 'pass';
    
    // Log to errorLogger for historical tracking
    if (this.lintErrors.length > 0) {
      errorLogger.warn(`ESLint found ${this.lintErrors.length} errors`, { 
        category: 'lint',
        errorCount: this.lintErrors.length,
        warningCount: this.lintWarnings.length,
        sample: this.lintErrors.slice(0, 3)
      });
    } else if (this.lintWarnings.length > 0) {
      errorLogger.info(`ESLint found ${this.lintWarnings.length} warnings`, { 
        category: 'lint',
        warningCount: this.lintWarnings.length,
        sample: this.lintWarnings.slice(0, 3)
      });
    } else {
      errorLogger.debug('ESLint check passed with no issues', {
        category: 'lint'
      });
    }
  }

  /**
   * Subscribers for lint status changes
   */
  subscribers = [];

  /**
   * Subscribe to lint status changes
   * @param {Function} callback Function to call when lint status changes
   */
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all subscribers of lint status changes
   */
  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback({
          status: this.lintStatus,
          errors: this.lintErrors,
          warnings: this.lintWarnings,
          lastRunTime: this.lastRunTime
        });
      } catch (error) {
        errorLogger.error('Error in lint status subscriber', error);
      }
    });
  }

  /**
   * Set lint results from external source (e.g. Vite plugin)
   */
  setResults(results) {
    this.processlintResults(results);
    this.lastRunTime = new Date();
    this.notifySubscribers();
  }
}

export default new LintService();
