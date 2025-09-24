import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './assets/styles/global.css';


async function enableMocking() {
  const { worker } = await import('./lib/database/browser');
  const { seedDatabase } = await import('./lib/database/seed');

  // Seeding the IndexedDB with initial data if it's empty
  await seedDatabase();
  
  // start the MSW worker with the 'bypass' option for unhandled requests
  return worker.start({
    onUnhandledRequest: 'bypass',
  });
}


enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});