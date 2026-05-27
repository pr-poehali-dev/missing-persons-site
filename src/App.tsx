import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useAppStore } from '@/store/appStore';
import AuthPage from '@/pages/AuthPage';
import Layout from '@/components/Layout';
import AdminDashboard from '@/pages/dashboards/AdminDashboard';
import InspectorDashboard from '@/pages/dashboards/InspectorDashboard';
import OfficerDashboard from '@/pages/dashboards/OfficerDashboard';
import RequestDetailModal from '@/components/RequestDetailModal';
import { MissingRequest } from '@/types';

const DEFAULT_SECTION: Record<string, string> = {
  admin: 'dashboard',
  inspector: 'dashboard',
  officer: 'dashboard',
};

const App = () => {
  const store = useAppStore();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [viewRequest, setViewRequest] = useState<MissingRequest | null>(null);

  const handleLogin = (login: string, password: string) => {
    const result = store.login(login, password);
    if (result.success && store.currentUser === null) {
      // will be set on next render
    }
    return result;
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const handleLogout = () => {
    store.logout();
    setActiveSection('dashboard');
    setViewRequest(null);
  };

  if (!store.currentUser) {
    return (
      <TooltipProvider>
        <AuthPage onLogin={store.login} />
        <Toaster />
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Layout
        currentUser={store.currentUser}
        onLogout={handleLogout}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      >
        {store.currentUser.role === 'admin' && (
          <AdminDashboard
            requests={store.requests}
            users={store.users}
            logs={store.logs}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            onToggleUser={store.toggleUserActive}
            onDeleteUser={store.deleteUser}
            onAddUser={store.addUser}
            onViewRequest={setViewRequest}
          />
        )}

        {store.currentUser.role === 'inspector' && (
          <InspectorDashboard
            currentUser={store.currentUser}
            requests={store.requests}
            activeSection={activeSection}
            onUpdateStatus={store.updateRequestStatus}
            onViewRequest={setViewRequest}
          />
        )}

        {store.currentUser.role === 'officer' && (
          <OfficerDashboard
            currentUser={store.currentUser}
            requests={store.requests}
            activeSection={activeSection}
            onCreateRequest={store.createRequest}
            onViewRequest={setViewRequest}
          />
        )}
      </Layout>

      {viewRequest && (
        <RequestDetailModal
          request={viewRequest}
          onClose={() => setViewRequest(null)}
        />
      )}

      <Toaster />
    </TooltipProvider>
  );
};

export default App;
