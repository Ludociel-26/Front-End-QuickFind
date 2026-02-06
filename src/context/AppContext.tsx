import axios from 'axios';
import { createContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'react-toastify';
// --- Cloudscape Imports para manejo global de estilos ---
import { applyMode, Mode } from '@cloudscape-design/global-styles';

// Definir el tipo de tema
export type ThemeMode = 'light' | 'dark' | 'system';

// Definir el tipo de usuario con el rol incluido
interface UserData {
  id: string;
  name: string;
  email: string;
  isAccountVerified: boolean;
  role: number; // Aseguramos que el rol siempre está presente
}

// Definir el tipo de contexto
interface AppContextType {
  backendUrl: string;
  isLoggedin: boolean;
  setIsLoggedin: (value: boolean) => void;
  userData: UserData | null;
  setUserData: (value: UserData | null) => void;
  getUserData: () => Promise<void>;

  // --- Nuevas propiedades para el Tema Global ---
  theme: ThemeMode; // Usamos 'theme' o 'mode' según prefieras, aquí lo estandarizamos
  isDark: boolean; // Booleano calculado listo para usar en tus vistas (Login, Verify, etc)
  toggleTheme: () => void;
}

// Crear el contexto con un valor por defecto
export const AppContent = createContext<AppContextType | null>(null);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  axios.defaults.withCredentials = true;
  const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

  // --- Estados de Autenticación ---
  const [isLoggedin, setIsLoggedin] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  // --- Estados de Tema ---
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('theme') as ThemeMode) || 'system';
  });
  const [isDark, setIsDark] = useState(false);

  // Efecto para controlar el cambio de tema (Claro/Oscuro/Sistema)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let shouldBeDark = false;
      if (theme === 'system') {
        shouldBeDark = mediaQuery.matches;
      } else {
        shouldBeDark = theme === 'dark';
      }

      setIsDark(shouldBeDark);
      const root = window.document.documentElement;

      // Aplicar clases para Tailwind y Cloudscape
      if (shouldBeDark) {
        root.classList.add('dark');
        applyMode(Mode.Dark);
      } else {
        root.classList.remove('dark');
        applyMode(Mode.Light);
      }
    };

    applyTheme(); // Ejecutar al montar

    const listener = () => {
      if (theme === 'system') applyTheme();
    };
    mediaQuery.addEventListener('change', listener);

    localStorage.setItem('theme', theme);

    return () => mediaQuery.removeEventListener('change', listener);
  }, [theme]);

  // Función para alternar el tema (usada en el botón del header)
  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  // --- Lógica de Usuario (INTACTA) ---

  // Función para verificar si el usuario está autenticado y obtener sus datos
  const getAuthState = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      }
    } catch (error: any) {
      // toast.error(error.message); // Opcional silenciar en carga inicial
    }
  };

  // Función para obtener la información del usuario incluyendo el rol
  const getUserData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setUserData(data.userData);
        setIsLoggedin(true);
      } else {
        setUserData(null);
        setIsLoggedin(false);
        // toast.error(data.message);
      }
    } catch (error: any) {
      setUserData(null);
      setIsLoggedin(false);
      toast.error(error.message);
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
    // Exportamos el tema
    theme,
    isDark,
    toggleTheme,
  };

  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};
