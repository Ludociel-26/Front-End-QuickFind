import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import axios from 'axios';
import { applyMode, Mode } from '@cloudscape-design/global-styles';
import {
  Modal,
  Box,
  SpaceBetween,
  Button,
  Alert,
  Spinner,
} from '@cloudscape-design/components';

// 🚩 FIX DEL CORS: Permite que las cookies viajen en todas las peticiones globales
axios.defaults.withCredentials = true;

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserData {
  id: number | string;
  name: string;
  email: string;
  isAccountVerified: boolean;
  role: number;
  area: number;
  roleName: string;
  areaName: string;
}

export interface AlertItem {
  type: 'success' | 'warning' | 'info' | 'error';
  content: React.ReactNode;
  header?: React.ReactNode;
  id?: string;
  loading?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
}

interface AppContextType {
  backendUrl: string;
  isLoggedin: boolean;
  setIsLoggedin: (value: boolean) => void;
  userData: UserData | null;
  setUserData: (value: UserData | null) => void;
  getUserData: () => Promise<void>;

  executeGlobalLogout: () => Promise<void>;
  executeGlobalLoginSync: () => void;

  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  isLoading: boolean;
  pageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
  loadingText: string;
  setLoadingText: (text: string) => void;

  alerts: AlertItem[];
  addAlert: (
    type: AlertItem['type'],
    content: string,
    header?: string,
    existingId?: string,
    loading?: boolean,
  ) => string;
}

export const AppContent = createContext<AppContextType | null>(null);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('Cargando...');
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  // =======================================================================
  // ESTADOS PARA LOS 3 MODALES DE SEGURIDAD
  // =======================================================================
  const [showDisabledModal, setShowDisabledModal] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [showExpiredModal, setShowExpiredModal] = useState<boolean>(false);

  // =======================================================================
  // REFERENCIAS (TIEMPO Y BROADCAST)
  // =======================================================================
  const lastActivityRef = useRef<number>(Date.now());
  const authChannel = useRef<BroadcastChannel | null>(null);

  const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutos para matar la sesión
  const WARNING_TIMEOUT = 13 * 60 * 1000; // 13 minutos para advertir

  const updateActivity = useCallback(() => {
    // Si hay un modal de bloqueo en pantalla, la actividad se ignora (AWS Trap)
    if (!showWarningModal && !showExpiredModal && !showDisabledModal) {
      lastActivityRef.current = Date.now();
    }
  }, [showWarningModal, showExpiredModal, showDisabledModal]);

  const addAlert = useCallback(
    (
      type: AlertItem['type'],
      content: string,
      header?: string,
      existingId?: string,
      loading: boolean = false,
    ): string => {
      const id =
        existingId ||
        Date.now().toString() + Math.random().toString(36).substring(7);
      setAlerts((prev) => {
        const existingIndex = prev.findIndex((a) => a.id === id);
        const newAlert: AlertItem = {
          type,
          content,
          header,
          id,
          loading,
          dismissible: !loading,
          onDismiss: () =>
            setAlerts((current) => current.filter((a) => a.id !== id)),
        };
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newAlert;
          return updated;
        }
        return [...prev, newAlert];
      });

      if (!loading && (type === 'success' || type === 'info')) {
        setTimeout(
          () => setAlerts((current) => current.filter((a) => a.id !== id)),
          5000,
        );
      }
      return id;
    },
    [],
  );

  // --- AUTH GETTERS ---
  const getUserData = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.userData);
        setIsLoggedin(true);
      }
    } catch (error: any) {}
  }, [backendUrl]);

  const getAuthState = useCallback(async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error) {
      setIsLoggedin(false);
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, [backendUrl, getUserData]);

  // =======================================================================
  // 0. BROADCAST CHANNEL: SINCRONIZACIÓN MULTI-PESTAÑA
  // =======================================================================
  useEffect(() => {
    authChannel.current = new BroadcastChannel('auth_sync_channel');

    authChannel.current.onmessage = (event) => {
      const { type, payload } = event.data;

      if (type === 'LOGOUT_SYNC') {
        setShowWarningModal(false);

        // 🚩 NO usamos setIsLoggedin(false) para no destruir la vista actual
        if (payload === 'DISABLED') {
          setShowDisabledModal(true);
        } else if (payload === 'EXPIRED' || payload === 'MANUAL') {
          setShowExpiredModal(true);
        }
      }

      if (type === 'LOGIN_SYNC') {
        getAuthState();
        setShowExpiredModal(false);
        setShowDisabledModal(false);
      }
    };

    return () => {
      authChannel.current?.close();
    };
  }, [getAuthState]);

  // Función manual (Botón de Cerrar Sesión)
  const executeGlobalLogout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`);
    } catch (err) {}
    setIsLoggedin(false);
    setUserData(null);
    authChannel.current?.postMessage({
      type: 'LOGOUT_SYNC',
      payload: 'MANUAL',
    });
    window.location.href = '/login'; // Esta pestaña sí redirige porque fue manual
  };

  const executeGlobalLoginSync = () => {
    authChannel.current?.postMessage({ type: 'LOGIN_SYNC' });
  };

  // =======================================================================
  // 1. EL INTERCEPTOR (CONGELA LA VISTA ANTE ERRORES 401/403)
  // =======================================================================
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 403) {
          if (error.response.data.message === 'ACCOUNT_DISABLED_FORCE_LOGOUT') {
            setShowDisabledModal(true);
            authChannel.current?.postMessage({
              type: 'LOGOUT_SYNC',
              payload: 'DISABLED',
            });
          }
        }
        if (error.response && error.response.status === 401) {
          if (error.response.data.message === 'SESSION_EXPIRED') {
            setShowExpiredModal(true);
            authChannel.current?.postMessage({
              type: 'LOGOUT_SYNC',
              payload: 'EXPIRED',
            });
          }
        }
        return Promise.reject(error);
      },
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // =======================================================================
  // 2. EL "HEARTBEAT" Y RELOJ DE INACTIVIDAD (SÚPER OPTIMIZADO)
  // =======================================================================
  useEffect(() => {
    let localTimerId: ReturnType<typeof setInterval>;
    let apiHeartbeatId: ReturnType<typeof setInterval>;
    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    const executeSilentLogout = async () => {
      try {
        await axios.post(`${backendUrl}/api/auth/logout`);
      } catch (err) {}
      setShowWarningModal(false);
      setShowExpiredModal(true);
      authChannel.current?.postMessage({
        type: 'LOGOUT_SYNC',
        payload: 'EXPIRED',
      });
    };

    if (isLoggedin && !showDisabledModal && !showExpiredModal) {
      events.forEach((event) => window.addEventListener(event, updateActivity));

      // 🕒 RELOJ LOCAL (Cada 5 segundos) - No consume internet, solo revisa memoria
      localTimerId = setInterval(() => {
        const timeIdle = Date.now() - lastActivityRef.current;

        if (timeIdle >= WARNING_TIMEOUT && timeIdle < IDLE_TIMEOUT) {
          setShowWarningModal(true);
        } else if (timeIdle >= IDLE_TIMEOUT) {
          executeSilentLogout();
        }
      }, 5000);

      // 🌐 RELOJ DE RED (Cada 2 minutos / 120,000 ms) - Avisa a la API que estás vivo
      apiHeartbeatId = setInterval(() => {
        const timeIdle = Date.now() - lastActivityRef.current;
        if (timeIdle < WARNING_TIMEOUT) {
          axios.get(`${backendUrl}/api/auth/is-auth`).catch(() => {});
        }
      }, 120000);
    }

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateActivity),
      );
      if (localTimerId) clearInterval(localTimerId);
      if (apiHeartbeatId) clearInterval(apiHeartbeatId);
    };
  }, [
    isLoggedin,
    showDisabledModal,
    showExpiredModal,
    backendUrl,
    updateActivity,
    WARNING_TIMEOUT,
    IDLE_TIMEOUT,
  ]);

  // =======================================================================
  // 3. ACCIONES DE MODALES Y REDIRECCIONES
  // =======================================================================
  const handleGoToHome = () => {
    window.location.href = '/';
  };

  const handleGoToLogin = () => {
    window.location.href = '/login';
  };

  const handleExtendSession = () => {
    lastActivityRef.current = Date.now();
    setShowWarningModal(false);
  };

  // --- GESTIÓN DE TEMA ---
  const [theme, setTheme] = useState<ThemeMode>(
    () => (localStorage.getItem('theme') as ThemeMode) || 'system',
  );
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      let shouldBeDark =
        theme === 'system' ? mediaQuery.matches : theme === 'dark';
      setIsDark(shouldBeDark);
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
        applyMode(Mode.Dark);
        document.documentElement.style.backgroundColor = '#161d26';
        document.body.style.backgroundColor = '#161d26';
      } else {
        document.documentElement.classList.remove('dark');
        applyMode(Mode.Light);
        document.documentElement.style.backgroundColor = '#ffffff';
        document.body.style.backgroundColor = '#ffffff';
      }
    };
    applyTheme();
    const listener = () => {
      if (theme === 'system') applyTheme();
    };
    mediaQuery.addEventListener('change', listener);
    localStorage.setItem('theme', theme);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  useEffect(() => {
    getAuthState();
  }, [getAuthState]);

  const value: AppContextType = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    executeGlobalLogout,
    executeGlobalLoginSync,
    theme,
    isDark,
    setTheme,
    toggleTheme,
    isLoading,
    pageLoading,
    setPageLoading,
    loadingText,
    setLoadingText,
    alerts,
    addAlert,
  };

  return (
    <AppContent.Provider value={value}>
      {/* 🛑 MODAL 1: CUENTA DESHABILITADA */}
      <Modal
        onDismiss={handleGoToHome}
        visible={showDisabledModal}
        closeAriaLabel="Cerrar modal y volver al inicio"
        header="Sesión finalizada"
        footer={
          <Box float="right">
            <Button variant="primary" onClick={handleGoToLogin}>
              Ir al inicio de sesión
            </Button>
          </Box>
        }
      >
        <SpaceBetween size="m">
          <Alert type="error" header="Acceso restringido">
            Tu cuenta ha sido deshabilitada por el administrador. Ya no tienes
            permiso para navegar en el sistema.
          </Alert>
          <Box variant="p">
            Cualquier cambio que no hayas guardado se perderá.
          </Box>
        </SpaceBetween>
      </Modal>

      {/* ⚠️ MODAL 2: ADVERTENCIA DE INACTIVIDAD (Minuto 13) */}
      <Modal
        onDismiss={() => {}}
        visible={showWarningModal}
        header="Tu sesión está a punto de caducar"
        footer={
          <Box float="right">
            <Button variant="primary" onClick={handleExtendSession}>
              Continuar trabajando
            </Button>
          </Box>
        }
      >
        <SpaceBetween size="m">
          <Alert type="warning" header="Inactividad detectada">
            Por tu seguridad, cerraremos tu sesión automáticamente en breve si
            no detectamos actividad.
          </Alert>
          <Box variant="p">
            Haz clic en el botón inferior para mantener tu sesión activa.
          </Box>
        </SpaceBetween>
      </Modal>

      {/* ❌ MODAL 3: SESIÓN CADUCADA (LA VISTA SE QUEDA DETRÁS) */}
      <Modal
        onDismiss={handleGoToHome}
        visible={showExpiredModal}
        closeAriaLabel="Cerrar modal"
        header="Sesión caducada"
        footer={
          <Box float="right">
            <Button variant="primary" onClick={handleGoToLogin}>
              Volver a iniciar sesión
            </Button>
          </Box>
        }
      >
        <SpaceBetween size="m">
          <Alert type="warning" header="Su sesión ha caducado">
            Por motivos de seguridad, se ha cerrado la sesión o ha expirado.
            Vuelva a iniciar sesión para continuar utilizando el sistema.
          </Alert>
        </SpaceBetween>
      </Modal>

      {/* 🚩 SPINNER INICIAL CENTRADO */}
      {isLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
          }}
        >
          <SpaceBetween size="m" alignItems="center">
            <Spinner size="large" />
            <Box variant="h3">Validando sesión...</Box>
          </SpaceBetween>
        </div>
      ) : (
        children
      )}
    </AppContent.Provider>
  );
};
