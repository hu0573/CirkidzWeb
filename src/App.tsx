import { useMemo, useState } from 'react';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/Dashboard';
import FreeTrials from './pages/FreeTrials';
import Enrolments from './pages/Enrolments';
import ClassScheduling from './pages/ClassScheduling';
import ToastProvider from './components/ToastProvider';
import TrialScheduling from './pages/TrialScheduling';
import Internships from './pages/Internships';
import { DemoDataProvider } from './hooks/useDemoData';

export type PageKey =
  | 'dashboard'
  | 'freeTrials'
  | 'trialScheduling'
  | 'enrolments'
  | 'classScheduling'
  | 'internships';

function App() {
  const [activePage, setActivePage] = useState<PageKey>('dashboard');

  const pageContent = useMemo(() => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'freeTrials':
        return <FreeTrials />;
      case 'trialScheduling':
        return <TrialScheduling />;
      case 'enrolments':
        return <Enrolments />;
      case 'classScheduling':
        return <ClassScheduling />;
      case 'internships':
        return <Internships />;
      default:
        return null;
    }
  }, [activePage]);

  return (
    <ToastProvider>
      <DemoDataProvider>
        <AdminLayout activePage={activePage} onNavigate={setActivePage}>
          {pageContent}
        </AdminLayout>
      </DemoDataProvider>
    </ToastProvider>
  );
}

export default App;
