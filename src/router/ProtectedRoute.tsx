import React, { useContext } from 'react'; // Importación directa
import { Navigate, useLocation } from 'react-router-dom';
import { AppContent } from '@/context/AppContext';

interface ProtectedRouteProps {
  allowedRoles: number[];
  // FIX DEFINITIVO: Usar React.ReactNode directamente evita cualquier error de módulos en Vite
  children: React.ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const context = useContext(AppContent);
  const location = useLocation();

  // FIX: Protección vital en caso de que el contexto aún no esté montado
  if (!context) return null;

  // FIX: Extraemos con as any para evitar conflictos de tipado estricto con el AppContext
  const { isLoggedin, userData } = context as any;

  // 1. Si no está logueado, al login.
  if (!isLoggedin || !userData) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 2. Validación de Roles
  // FIX: Forzamos el rol a Number() por si el backend lo envía como string ("1" vs 1)
  if (!allowedRoles.includes(Number(userData.role))) {
    return <Navigate to="/" replace />;
  }

  // 3. Todo correcto, mostrar componente
  // FIX: Lo envolvemos en un fragmento para cumplir con el retorno de ReactNode siempre
  return <>{children}</>;
};

export default ProtectedRoute;
