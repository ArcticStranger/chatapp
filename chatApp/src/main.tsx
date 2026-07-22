import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

import { RouterProvider } from './app/providers/RouterProvider';

const container = document.getElementById('root');

if (container) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider>
        <App />
      </RouterProvider>
    </StrictMode>,
  );
} else {
  throw new Error(
    "Root element with ID 'root' was not found blablabla perepisal s redux-toolkit.js.org",
  );
}
