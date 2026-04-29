import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { USER_ROLES } from '../utils/constants';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import OAuthSuccess from '../pages/auth/OAuthSuccess';
import Dashboard from '../pages/dashboard/Dashboard';
import RequestList from '../pages/requests/RequestList';
import RequestDetails from '../pages/requests/RequestDetails';
import CreateRequest from '../pages/requests/CreateRequest';
import MyRequests from '../pages/requests/MyRequests';
import AdminDashboard from '../pages/admin/AdminDashboard';
import NotFound from '../pages/NotFound';

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/requests" element={<RequestList />} />
                <Route path="/requests/:id" element={<RequestDetails />} />

                <Route
                  path="/requests/create"
                  element={
                    <ProtectedRoute requiredRoles={[USER_ROLES.USER]}>
                      <CreateRequest />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/my-requests"
                  element={
                    <ProtectedRoute requiredRoles={[USER_ROLES.USER]}>
                      <MyRequests />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRoles={[USER_ROLES.ADMIN]}>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
