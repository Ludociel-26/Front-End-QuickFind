import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { AppContent } from '@/context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Cloudscape Imports ---
import '@cloudscape-design/global-styles/index.css';
import { Button } from '@cloudscape-design/components';

// --- Icons & Assets ---
import { Sun, Moon, Monitor, ArrowLeft, ShieldCheck } from 'lucide-react';
import logo from '@/assets/icons/appiconf.png';
import backgroundImage from '@/assets/login/loginBg.png';

// ------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------------------------------------
const EmailVerify = () => {
  // Configuración de Axios
  axios.defaults.withCredentials = true;

  // --- CONSUMO DE CONTEXTO GLOBAL ---
  const context = useContext(AppContent);

  if (!context) {
    throw new Error('AppContent debe estar dentro de AppContextProvider');
  }

  // Extraemos datos de usuario Y datos del tema desde el contexto
  const {
    backendUrl,
    isLoggedin,
    userData,
    getUserData,
    theme, // Antes 'mode' local
    isDark, // Calculado globalmente
    toggleTheme, // Función global
  } = context;

  const navigate = useNavigate();

  // --- LÓGICA DE VALIDACIÓN (INTACTA) ---
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === 'Backspace' && e.currentTarget.value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index]!.value = char;
      }
    });
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => (e ? e.value : ''));
      const otp = otpArray.join('');

      const { data } = await axios.post(
        backendUrl + '/api/auth/verify-account',
        { otp },
      );

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/dashboard');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocurrió un error inesperado');
      }
    }
  };

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate('/');
  }, [isLoggedin, userData]);

  // --- ESTILOS DINÁMICOS (Basados en isDark global) ---
  const otpInputClass = `w-12 h-14 text-center text-xl rounded-xl border outline-none transition-all duration-300 ${
    isDark
      ? 'bg-black/20 border-white/10 text-white focus:border-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
      : 'bg-white/60 border-gray-300 text-gray-900 focus:border-blue-600 focus:shadow-md'
  }`;

  return (
    <div
      className={`min-h-screen w-full relative flex items-center justify-center p-4 transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-gray-200'}`}
    >
      {/* Fondo y Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center fixed"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div
          className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-black/60' : 'bg-white/10 backdrop-blur-[1px]'}`}
        ></div>
      </div>

      {/* Logo */}
      <img
        src={logo}
        alt="Logo"
        onClick={() => navigate('/')}
        className={`absolute z-50 cursor-pointer transition-all duration-700 top-8 left-1/2 -translate-x-1/2 w-24 drop-shadow-lg md:top-12 md:left-12 md:translate-x-0`}
      />

      {/* Tarjeta Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative z-10 w-full max-w-[420px] mt-20 md:mt-0 rounded-[2.5rem] backdrop-blur-xl border shadow-2xl overflow-hidden ${isDark ? 'bg-black/30 border-transparent' : 'bg-white/40 border-white/40'}`}
      >
        {/* Header con Botones */}
        <div
          className={`p-6 pb-0 flex justify-between items-center ${isDark ? 'text-white' : 'text-gray-800'}`}
        >
          <button
            onClick={() => navigate('/login')}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Botón de Tema (Conectado al Contexto Global) */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full border backdrop-blur-md transition-all ${isDark ? 'bg-white/5 border-white/10 text-zinc-300' : 'bg-white/50 border-gray-400 text-gray-800'}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === 'light' && <Sun size={16} />}
                {theme === 'dark' && <Moon size={16} />}
                {theme === 'system' && <Monitor size={16} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        <div className="p-8 pt-4">
          {/* Formulario con Lógica Original */}
          <form onSubmit={onSubmitHandler}>
            <div className="text-center mb-6">
              <div
                className={`inline-flex p-3 rounded-2xl mb-4 ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-800'}`}
              >
                <ShieldCheck size={28} />
              </div>
              {/* Textos Originales */}
              <h1
                className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
              >
                Email Verify OTP
              </h1>
              <p
                className={`text-sm mt-2 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}
              >
                Enter the 6-digit code sent to your email id.
              </p>
            </div>

            <div
              className="flex justify-between mb-8 gap-2"
              onPaste={handlePaste}
            >
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    maxLength={1}
                    key={index}
                    required
                    className={otpInputClass}
                    ref={(e) => {
                      inputRefs.current[index] = e;
                    }}
                    onChange={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
            </div>

            {/* Botón de Cloudscape actuando como submit */}
            <Button variant="primary" fullWidth formAction="submit">
              Verify Email
            </Button>
          </form>
        </div>

        <div
          className={`p-4 text-center text-[10px] border-t ${isDark ? 'border-white/10 text-zinc-500' : 'border-gray-300/30 text-gray-500'}`}
        >
          Secured by OmniPart Systems
        </div>
      </motion.div>
    </div>
  );
};

export default EmailVerify;
