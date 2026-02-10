import React, { useContext, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppContent } from '@/context/AppContext';

// Componentes Cloudscape
import Spinner from '@cloudscape-design/components/spinner';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';

// Componentes UI
import { TopLoadingBar } from '@/components/common/TopLoadingBar';
import ProtectedRoute from './ProtectedRoute';

// --- LAZY LOADING ---
const Dashboard = React.lazy(() => import('@/pages/auth/dashboard/index'));
const Inventory = React.lazy(
  () => import('@/pages/auth/table-inventory-items/index'),
);
const FolderView = React.lazy(() => import('@/pages/auth/folder-view/index'));
const ProductDetailPage = React.lazy(
  () => import('@/pages/auth/product-detail-page/index'),
);
const User = React.lazy(() => import('@/pages/auth/user-management/index'));
const UserReg = React.lazy(
  () => import(`@/pages/auth/user-management/form-register/form`),
);
const UserEdit = React.lazy(
  () => import(`@/pages/auth/user-management/form-register/EditUser`),
);
const CleaningPlanPage = React.lazy(
  () => import('@/pages/public/cleaning-plan-page/index'),
);

// Imports estáticos
import Login from '@/pages/auth/SignIn';
import Home from '@/pages/public/Home';
import Verify from '@/pages/auth/VerifyEmail';
import ResetPassword from '@/pages/auth/ResetPassword';
import NotFound from '@/pages/auth/NotFound';

const AppRouter = () => {
  // 1. Extraemos isLoggedin aquí también para proteger las rutas públicas
  const { isLoading, pageLoading, isLoggedin } = useContext(AppContent)!;

  // 2. BLOQUEO DE CARGA INICIAL (Full Screen)
  // Mantiene el usuario en espera hasta que el backend responda "Sí/No" sobre la sesión.
  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f2f3f3', // Color neutro Cloudscape para evitar flash blanco puro
        }}
      >
        <Container>
          <Box textAlign="center" padding="l">
            <Spinner size="large" variant="normal" />
            <Box variant="p" padding={{ top: 's' }} color="text-body-secondary">
              Verificando sesión...
            </Box>
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <>
      <TopLoadingBar visible={pageLoading} />

      <Suspense fallback={<TopLoadingBar visible={true} />}>
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* --- CORRECCIÓN CLAVE --- 
              Si ya está logueado, redirige a dashboard. 
              Si no, muestra Login. 
          */}
          <Route
            path="/login"
            element={
              isLoggedin ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />

          <Route path="/verify-email" element={<Verify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/cleaning-plan-page" element={<CleaningPlanPage />} />
          <Route path="/home" element={<Home />} />

          {/* RUTAS PROTEGIDAS */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/folder-view"
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
                <FolderView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product-detail-page"
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
                <ProductDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
                <User />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-reg"
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
                <UserReg />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-edit/:userId"
            element={
              <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
                <UserEdit />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRouter;
