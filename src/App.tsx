import { useMemo, useState } from 'react';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import FreeTrials from './pages/FreeTrials';
import Enrolments from './pages/Enrolments';
import ClassScheduling from './pages/ClassScheduling';
import ToastProvider from './components/ToastProvider';

export type PageKey =
  | 'dashboard'
  | 'freeTrials'
  | 'enrolments'
  | 'classScheduling';

function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');

  const pageContent = useMemo(() => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'freeTrials':
        return <FreeTrials />;
      case 'enrolments':
        return <Enrolments />;
      case 'classScheduling':
        return <ClassScheduling />;
      default:
        return null;
    }
  }, [activePage]);

  return (
    <ToastProvider>
      <AdminLayout activePage={activePage} onNavigate={setActivePage}>
        {pageContent}
      </AdminLayout>
    </ToastProvider>
  );
}

export default App;
