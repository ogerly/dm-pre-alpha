// Standard console statement - will be flagged in production
console.log('This will show in dev but warn in prod');

// Specific line disable
// eslint-disable-next-line no-console
console.log('This console.log is explicitly allowed even in production');

// Block disable
/* eslint-disable no-console */
console.log('Multiple console statements');
console.info('That should remain in production');
console.warn('Can be grouped with a block disable');
/* eslint-enable no-console */

// Use the logger service for most logging needs
import errorLogger from '../services/errorLogger';

errorLogger.debug('Debug message - only appears in development');
errorLogger.info('Info message');
errorLogger.warn('Warning message');
errorLogger.error('Error message - always appears in all environments');
