import axios from 'axios';
import { createContext, useState, ReactNode, useEffect } from 'react';
import { applyMode, Mode } from '@cloudscape-design/global-styles';

// --- IMPORTANTE: ESTO DEBE ESTAR EXPORTADO ---
export type ThemeMode = 'light' | 'dark' | 'system';

interface UserData {
  id: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
  role: number;
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
  setTheme: (theme: ThemeMode) => void; // Función para cambiar tema
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
        // Sincronizar colores de fondo para evitar parpadeos
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
        setIsLoggedin(false);
      }
    } catch (error: any) {
      setUserData(null);
      setIsLoggedin(false);
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
