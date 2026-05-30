import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout/Layout';
import Dashboard from './components/pages/Dashboard';
import ActivateLicense from './components/pages/ActivateLicense'; 

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
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />

        {}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;