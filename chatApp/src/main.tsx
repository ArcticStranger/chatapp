import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { StoreProvider } from './app/providers/StoreProvider';
import { RouterProvider } from './app/providers/RouterProvider';

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <RouterProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </RouterProvider>
    </StrictMode>,
  );
} else {
  throw new Error("Root element with ID 'root' was not found");
}
