
import AppRoutes from './app/routing/AppRoutes';
import { BrowserRouter as Router } from "react-router-dom";
import './assets/styles/app.css';

/**
 * Root App component
 * Provides routing context for the entire application
 */
function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

