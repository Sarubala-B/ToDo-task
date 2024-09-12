import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/Header.js';

describe('Root Rendering Test', () => {
  it('renders the App component into the root div', () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
    const mockRender = jest.fn();
    const mockCreateRoot = jest.spyOn(ReactDOM, 'createRoot').mockReturnValue({
      render: mockRender,
    });
    require('./index.js');
    expect(mockCreateRoot).toHaveBeenCalledWith(root);
    expect(mockRender).toHaveBeenCalledWith(<App />);
    mockCreateRoot.mockRestore();
  });
});