import axios from 'axios';
import { createContext, useState, ReactNode, useEffect } from 'react';
import { applyMode, Mode } from '@cloudscape-design/global-styles';

// --- IMPORTANTE: ESTO DEBE ESTAR EXPORTADO ---
export type ThemeMode = 'light' | 'dark' | 'system';

// Interfaz que coincide con la respuesta de tu backend (userController.js)
export interface UserData {
  id: number | string;
  name: string;
  email: string;
  isAccountVerified: boolean;

  // IDs internos
  role: number;
  area: number;

  // Nombres para mostrar (Navbar)
  roleName: string;
  areaName: string;
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
      // ✅ CORRECCIÓN CRÍTICA: Ruta en singular '/api/user/data'
      // Coincide con app.use('/api/user', userRouter) en server.js
      const { data } = await axios.get(`${backendUrl}/api/user/data`);

      if (data.success) {
        setUserData(data.userData);
        setIsLoggedin(true);
      } else {
        // Si el backend responde success: false explícitamente
        setUserData(null);
        // Opcional: setIsLoggedin(false) solo si es error crítico
      }
    } catch (error: any) {
      console.error('Error obteniendo datos del usuario:', error);

      // ✅ PROTECCIÓN CONTRA LOOP INFINITO:
      // Solo cerramos sesión si el error es de autenticación (401 No autorizado / 403 Prohibido)
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        setUserData(null);
        setIsLoggedin(false);
      }
      // Si es 404 (Ruta mal) o 500 (Server error), NO deslogueamos para evitar parpadeo/loop,
      // pero el usuario verá que no cargaron sus datos.
    }
  };

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedin(true);
        // Ya autenticados, pedimos los datos
        await getUserData();
      } else {
        setIsLoggedin(false);
        setUserData(null);
      }
    } catch (error: any) {
      setIsLoggedin(false);
      setUserData(null);
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
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};
