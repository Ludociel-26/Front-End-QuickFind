import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContent } from '@/context/AppContext';

interface ProtectedRouteProps {
  allowedRoles: number[];
  children: JSX.Element;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  // Obtenemos userData e isLoggedin.
  // NO necesitamos isLoading aquí porque AppRouter ya lo manejó.
  const { isLoggedin, userData } = useContext(AppContent)!;
  const location = useLocation();

  // 1. Si no está logueado, al login.
  // state={{ from: location }} es VITAL para que el Login sepa a donde regresarte (si implementas esa lógica allá)
  if (!isLoggedin || !userData) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Validación de Roles
  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to="/" replace />;
  }

  // 3. Todo correcto, mostrar componente
  return children;
};

export default ProtectedRoute;
