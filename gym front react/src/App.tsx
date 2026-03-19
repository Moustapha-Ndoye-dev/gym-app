/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { NotificationProvider } from './context/NotificationContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Activities } from './pages/Activities';
import { Subscriptions } from './pages/Subscriptions';
import { Members } from './pages/Members';
import { Tickets } from './pages/Tickets';
import { AccessControl } from './pages/AccessControl';
import { CashRegister } from './pages/CashRegister';
import { Users } from './pages/Users';
import { Shop } from './pages/Shop';
// Page Register supprimée car fusionnée avec Login

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles) {
    const allowedRoles = roles.map(r => r.toLowerCase());
    const userRole = String(user.role).toLowerCase();
    if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <NotificationProvider>
      <ConfirmProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="activities" element={<ProtectedRoute roles={['admin', 'member']}><Activities /></ProtectedRoute>} />
                <Route path="shop" element={<ProtectedRoute roles={['admin', 'cashier', 'controller', 'member']}><Shop /></ProtectedRoute>} />
                <Route path="subscriptions" element={<ProtectedRoute roles={['admin', 'cashier', 'member']}><Subscriptions /></ProtectedRoute>} />
                <Route path="members" element={<ProtectedRoute roles={['admin', 'cashier', 'member']}><Members /></ProtectedRoute>} />
                <Route path="tickets" element={<ProtectedRoute roles={['admin', 'cashier', 'member']}><Tickets /></ProtectedRoute>} />
                <Route path="access" element={<ProtectedRoute roles={['admin', 'controller', 'member']}><AccessControl /></ProtectedRoute>} />
                <Route path="cash-register" element={<ProtectedRoute roles={['admin', 'cashier', 'member']}><CashRegister /></ProtectedRoute>} />
                <Route path="users" element={<ProtectedRoute roles={['admin']}><Users /></ProtectedRoute>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ConfirmProvider>
    </NotificationProvider>
  );
}

