import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './app/routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';

import { NotificationProvider } from './context/NotificationContext';
import NotificationSystem from './components/ui/NotificationSystem';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppRoutes />
        </Router>
        <NotificationSystem />
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
