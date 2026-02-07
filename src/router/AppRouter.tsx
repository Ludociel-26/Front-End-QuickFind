import React, { useContext, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppContent } from '@/context/AppContext';

// Componentes Cloudscape
import Spinner from '@cloudscape-design/components/spinner';
import Box from '@cloudscape-design/components/box';
import Container from '@cloudscape-design/components/container';

// IMPORTAMOS EL NUEVO COMPONENTE DE BARRA SUPERIOR
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
const CleaningPlanPage = React.lazy(
  () => import('@/pages/public/cleaning-plan-page/index'),
);

// Imports normales
import Login from '@/pages/auth/SignIn';
import Home from '@/pages/public/Home';
import Verify from '@/pages/auth/VerifyEmail';
import ResetPassword from '@/pages/auth/ResetPassword';
import NotFound from '@/pages/auth/NotFound';

const AppRouter = () => {
  const { isLoading, pageLoading } = useContext(AppContent)!;

  // 1. BLOQUEO DE SEGURIDAD (Carga Inicial - Pantalla completa)
  // Mantenemos esto porque cuando entras por primera vez, no quieres ver una barrita,
  // quieres esperar a saber si eres usuario o no.
  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container>
          <Box textAlign="center" padding="l">
            <Spinner size="large" variant="normal" />
            <Box variant="p" padding={{ top: 's' }}>
              Cargando sistema...
            </Box>
          </Box>
        </Container>
      </div>
    );
  }

  return (
    <>
      {/* BARRA SUPERIOR (AWS STYLE):
         Aparece arriba de todo cuando:
         1. pageLoading es true (activado manualmente en Login)
         2. O cuando React.Suspense está cargando una vista (fallback)
      */}
      <TopLoadingBar visible={pageLoading} />

      {/* El fallback del Suspense activa la barra visualmente */}
      <Suspense fallback={<TopLoadingBar visible={true} />}>
        <Routes>
          {/* RUTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<Verify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/cleaning-plan-page" element={<CleaningPlanPage />} />

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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRouter;
