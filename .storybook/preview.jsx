// .storybook/preview.js
import React, { useState } from 'react';

// Create a decorator to add a code toggle
export const decorators = [
  (Story, context) => {
    const [showCode, setShowCode] = useState(false);
    const sourceCode = context.parameters?.docs?.source?.code;

    return (
      <div style={{ marginBottom: '40px' }}>
        <Story />

        {sourceCode && (
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setShowCode(!showCode)}
              style={{
                background: '#0070f3',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
            >
              {showCode ? 'Hide Code' : 'Show Code'}
            </button>

            {showCode && (
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '14px',
                }}
              >
                <code>{sourceCode}</code>
              </pre>
            )}
          </div>
        )}
      </div>
    );
  },
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  // storysource: {
  //   loaderOptions: {
  //     prettierConfig: { printWidth: 80, singleQuote: true },
  //   },
  //   panel: {
  //     showToolbar: true,
  //   },
  // },
};
