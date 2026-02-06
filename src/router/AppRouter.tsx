import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// --- Importaciones de tus páginas (Copiadas de tu App.tsx) ---
import Login from '@/pages/auth/SignIn';
import Home from '@/pages/public/Home';
import Verify from '@/pages/auth/VerifyEmail';
import ResetPassword from '@/pages/auth/ResetPassword';
import NotFound from '@/pages/auth/NotFound';
import CleaningPlanPage from '@/pages/public/cleaning-plan-page/index';

// Páginas Protegidas
import Dashboard from '@/pages/auth/dashboard/index';
import User from '@/pages/auth/user-management/index';
import Inventory from '@/pages/auth/table-inventory-items/index';
import FolderView from '@/pages/auth/folder-view/index';
import ProductDetailPage from '@/pages/auth/product-detail-page/index';

const AppRouter = () => {
  return (
    <Routes>
      {/* 🟢 RUTAS PÚBLICAS (Accesibles sin login) */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email" element={<Verify />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/cleaning-plan-page" element={<CleaningPlanPage />} />

      {/* 🔒 RUTAS PROTEGIDAS */}

      {/* 1. Dashboard: Accesible para TODOS los roles (1, 2, 3, 4) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* 2. Folder View & Product Detail: Accesible para todos los internos */}
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

      {/* 3. Inventario: Operadores, Admins y Supervisores (2, 3, 4) - Ejemplo */}
      <Route
        path="/inventory"
        element={
          <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
            <Inventory />
          </ProtectedRoute>
        }
      />

      {/* 4. Gestión de Usuarios: SOLO ADMIN (3) - Ejemplo estricto */}
      <Route
        path="/user"
        element={
          <ProtectedRoute allowedRoles={[1, 2, 3, 4]}>
            <User />
          </ProtectedRoute>
        }
      />

      {/* 🔴 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
