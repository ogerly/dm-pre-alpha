/**
 * Mock implementation of Inspira UI plugins setup since the actual package doesn't exist
 */
export function setupInspiraUI(tailwindConfig) {
  // This is a placeholder function that mimics what the real plugin would do
  return {
    handler: function(addComponents) {
      // Add some base component classes
      addComponents({
        '.inspira-btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '0.375rem',
          fontWeight: '500',
          transition: 'all 0.2s',
        }
      });
    }
  };
}
