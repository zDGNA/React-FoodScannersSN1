/**
 * @format
 */

import React from 'react';
import renderer from 'react-test-renderer'; // Library untuk testing
import App from '../src/App'; // Mengimpor komponen App

test('renders correctly', async () => {
  await renderer.act(() => {
    renderer.create(<App />);
  });
});
