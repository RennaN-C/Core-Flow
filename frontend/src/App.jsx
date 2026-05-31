import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout/Layout';
import Dashboard from './components/pages/Dashboard';
import ActivateLicense from './components/pages/ActivateLicense'; 
import Customers from './components/pages/Customers';
import Finance from './components/pages/Finance';
import Users from './components/pages/Users';
import AuditLogs from './components/pages/AuditLogs';
import Profile from './components/pages/Profile';
import Settings from './components/pages/Settings';
import Operations from './components/pages/Operations';

const ProtectedRoute = ({ children, requireActive = true }) => {
 
  const token = localStorage.getItem("@CoreFlow:token");
  const userStr = localStorage.getItem("@CoreFlow:user");
  
  if (!token || !userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);

  
  if (requireActive && user.Tenant && user.Tenant.isActive === false) {
    return <Navigate to="/ativar-licenca" replace />;
  }

  return children;
};

function App() {
  const user = JSON.parse(localStorage.getItem('@CoreFlow:user') || '{}');
  const page = (children) => <ProtectedRoute><Layout>{children}</Layout></ProtectedRoute>;
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {}
        <Route 
          path="/ativar-licenca" 
          element={
            <ProtectedRoute requireActive={false}>
              <ActivateLicense />
            </ProtectedRoute>
          } 
        />

        {}
        <Route 
          path="/" 
          element={page(user.role === 'staff' ? <Navigate to="/clientes" replace /> : <Dashboard />)}
        />
        <Route path="/clientes" element={page(<Customers />)} />
        <Route path="/financeiro" element={page(<Finance />)} />
        <Route path="/usuarios" element={page(<Users />)} />
        <Route path="/auditoria" element={page(<AuditLogs />)} />
        <Route path="/perfil" element={page(<Profile />)} />
        <Route path="/configuracoes" element={page(<Settings />)} />
        <Route path="/operacao" element={page(<Operations />)} />

        {}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
