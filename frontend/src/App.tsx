import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import arEG from 'antd/locale/ar_EG';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CustomersPage from './pages/CustomersPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import SalesPage from './pages/SalesPage';
import InventoryPage from './pages/InventoryPage';
import ProductionPage from './pages/ProductionPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import BranchesPage from './pages/BranchesPage';
import BranchDashboardPage from './pages/BranchDashboardPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import CreateOrderPage from './pages/CreateOrderPage';
import UsersPage from './pages/UsersPage';
import MainLayout from './layouts/MainLayout';
import { authService } from './services/auth.service';
import { useAppStore } from './store';
import { useEffect } from 'react';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = authService.isAuthenticated();
  return isAuth ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  const setUser = useAppStore((state) => state.setUser);

  useEffect(() => {
    // Load user from localStorage on app start
    const user = authService.getCurrentUser();
    if (user) {
      setUser(user);
    }
  }, [setUser]);

  return (
    <ConfigProvider
      locale={arEG}
      direction="rtl"
      theme={{
        token: {
          colorPrimary: '#1890ff',
          colorSuccess: '#52c41a',
          colorWarning: '#faad14',
          colorError: '#ff4d4f',
          colorInfo: '#1890ff',
          borderRadius: 8,
          fontFamily: 'Tajawal, -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: 14,
        },
        components: {
          Button: {
            borderRadius: 6,
            controlHeight: 36,
          },
          Card: {
            borderRadiusLG: 12,
          },
          Table: {
            borderRadius: 8,
          },
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="customers/:id" element={<CustomerProfilePage />} />
              <Route path="sales" element={<SalesPage />} />
              <Route path="sales/new" element={<CreateOrderPage />} />
              <Route path="sales/:id" element={<OrderDetailsPage />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="production" element={<ProductionPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="branches" element={<BranchesPage />} />
              <Route path="branches/:id/dashboard" element={<BranchDashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
