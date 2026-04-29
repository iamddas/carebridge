import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../layout/Layout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import RequestList from '../pages/RequestList';
import RequestDetails from '../pages/RequestDetails';
import CreateRequest from '../pages/CreateRequest';
import MyRequests from '../pages/MyRequests';
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagement from '../pages/admin/UserManagement';
import UserDetails from '../pages/admin/UserDetails';
import Broadcast from '../pages/admin/Broadcast';
import Emergency from '../pages/admin/Emergency';
import AdminMessages from '../pages/admin/AdminMessages';
import AdminNotifications from '../pages/admin/AdminNotifications';
import ChatPage from '../pages/chat/ChatPage';
import { ROLES } from '../utils/constants';

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* All authenticated users */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/requests" element={<RequestList />} />
                    <Route path="/requests/:id" element={<RequestDetails />} />
                    <Route path="/my-requests" element={<MyRequests />} />
                    <Route path="/chat" element={<ChatPage />} />
                </Route>
            </Route>

            {/* USER and ADMIN only */}
            <Route element={<ProtectedRoute roles={[ROLES.USER, ROLES.ADMIN]} />}>
                <Route element={<Layout />}>
                    <Route path="/requests/new" element={<CreateRequest />} />
                </Route>
            </Route>

            {/* ADMIN only */}
            <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
                <Route element={<Layout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UserManagement />} />
                    <Route path="/admin/users/:id" element={<UserDetails />} />
                    <Route path="/admin/broadcast" element={<Broadcast />} />
                    <Route path="/admin/emergency" element={<Emergency />} />
                    <Route path="/admin/messages" element={<AdminMessages />} />
                    <Route path="/admin/notifications" element={<AdminNotifications />} />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}