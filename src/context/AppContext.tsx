import axios from 'axios';
import {
  createContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { applyMode, Mode } from '@cloudscape-design/global-styles';

// --- IMPORTANTE: ESTO DEBE ESTAR EXPORTADO ---
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

// Interfaz manual para evitar dependencias conflictivas de tipos en Vite
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

  // Tema
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;

  // Carga
  isLoading: boolean;
  pageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
  loadingText: string;
  setLoadingText: (text: string) => void;

  // NUEVO: ESTADO GLOBAL DE NOTIFICACIONES (Renderizado Local)
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

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Estados visuales
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>('Cargando...');

  // --- SISTEMA GLOBAL DE ALERTAS ---
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  // Envolvemos con useCallback para mantener la misma referencia en memoria y evitar infinite loops
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
        setTimeout(() => {
          setAlerts((current) => current.filter((a) => a.id !== id));
        }, 5000);
      }

      return id;
    },
    [], // <-- El arreglo vacío asegura que la función jamás se recree
  );

  // --- TEMA ---
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

    const listener = (e: MediaQueryListEvent) => {
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

  // --- AUTH ---
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);

      if (data.success) {
        setUserData(data.userData);
        setIsLoggedin(true);
      } else {
        setUserData(null);
        addAlert(
          'warning',
          'No se pudieron recuperar los datos de tu perfil.',
          'Error de sincronización',
        );
      }
    } catch (error: any) {
      console.error('Error obteniendo datos del usuario:', error);

      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        setUserData(null);
        setIsLoggedin(false);
        addAlert(
          'info',
          'Tu sesión ha expirado por inactividad o razones de seguridad.',
          'Sesión terminada',
        );
      } else if (error.message !== 'canceled') {
        addAlert(
          'error',
          'Se perdió la conexión con el servidor de base de datos.',
          'Error de Red #500',
        );
      }
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error: any) {
      setIsLoggedin(false);
      setUserData(null);
      if (error.response && error.response.status >= 500) {
        addAlert(
          'error',
          'El servicio no está disponible en este momento.',
          'Servicio Caído',
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  const value: AppContextType = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
    theme,
    isDark,
    setTheme,
    toggleTheme,
    isLoading,
    pageLoading,
    setPageLoading,
    loadingText,
    setLoadingText,
    alerts, // <-- Exportamos la data
    addAlert, // <-- Exportamos la función protegida por useCallback
  };

  return (
    <AppContent.Provider value={value}>
      {/* ELIMINAMOS el <Flashbar /> global de aquí.
        Ahora cada componente (Login.tsx, Dashboard.tsx) decidirá dónde renderizar 'alerts' 
      */}
      {children}
    </AppContent.Provider>
  );
};
