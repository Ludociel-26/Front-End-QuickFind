import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContent } from '@/context/AppContext';

interface ProtectedRouteProps {
  allowedRoles: number[]; // 1: User, 2: Operador, 3: Admin, 4: Supervisor
  children: JSX.Element;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { isLoggedin, userData } = useContext(AppContent)!;
  const location = useLocation();

  // 1. Si no está logueado o no hay datos, mandar al Login
  if (!isLoggedin || !userData) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Si el rol del usuario NO está en la lista de permitidos
  if (!allowedRoles.includes(userData.role)) {
    // Si intenta entrar a una zona prohibida, lo mandamos al home o dashboard según corresponda
    return <Navigate to="/" replace />;
  }

  // 3. Acceso concedido
  return children;
};

export default ProtectedRoute;
