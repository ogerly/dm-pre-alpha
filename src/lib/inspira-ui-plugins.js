import * as components from './components';
import * as utilities from './utilities';

/**
 * Mock implementation of Inspira UI plugins setup since the actual package doesn't exist
 */
export default function inspiraPlugin(_tailwindConfig) {
  // Rename 'tailwindConfig' to '_tailwindConfig' since it's unused
  return {
    install(app) {
      // Register all components
      Object.entries(components).forEach(([key, component]) => {
        app.component(key, component);
      });

      // Register global utilities
      Object.entries(utilities).forEach(([key, utility]) => {
        app.config.globalProperties[`$${key}`] = utility;
      });
    }
  };
}
