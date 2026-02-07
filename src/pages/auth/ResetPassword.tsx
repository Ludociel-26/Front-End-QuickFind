import React, { useContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '@/context/AppContext'; // <--- CONTEXTO GLOBAL
import { useLanguage } from '@/context/LanguageContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

// --- Cloudscape Imports ---
import '@cloudscape-design/global-styles/index.css';
import { Button } from '@cloudscape-design/components';

// --- Icons & Assets ---
import {
  Sun,
  Moon,
  Monitor,
  ArrowLeft,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import logo from '@/assets/icons/appiconf.png';
import backgroundImage from '@/assets/login/loginBg.png';

// ------------------------------------------------------------------
// 1. INPUT ANIMADO (UI Component)
// ------------------------------------------------------------------
const AnimatedInput = ({
  type,
  placeholder,
  className,
  icon,
  isDarkMode,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  value,
  onChange,
  ...props
}: any) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (value) {
      setDisplayedText(placeholder);
      return;
    }
    let index = 0;
    setDisplayedText('');
    const typeChar = () => {
      if (placeholder && index < placeholder.length) {
        setDisplayedText((prev) => placeholder.slice(0, index + 1));
        index++;
        setTimeout(typeChar, 30 + Math.random() * 50);
      }
    };
    setTimeout(typeChar, 200);
  }, [placeholder, value]);

  const inputType = showPasswordToggle
    ? showPassword
      ? 'text'
      : 'password'
    : type;

  const baseColorClass = isDarkMode
    ? 'text-zinc-400 group-focus-within:text-white'
    : 'text-gray-500 group-focus-within:text-blue-600';

  return (
    <div className="relative group w-full shrink-0 mb-4 overflow-visible">
      {icon && (
        <div
          className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${baseColorClass} z-10 pointer-events-none`}
        >
          {icon}
        </div>
      )}
      <div
        className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
          isFocused
            ? isDarkMode
              ? 'opacity-100 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
              : 'opacity-100 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
            : 'opacity-0'
        }`}
      ></div>

      <input
        type={inputType}
        value={value}
        onChange={onChange}
        style={{ colorScheme: isDarkMode ? 'dark' : 'light' }}
        placeholder={value ? placeholder : displayedText}
        className={`${className} ${icon ? 'pl-11' : ''} ${showPasswordToggle ? 'pr-11' : ''}`}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {showPasswordToggle && (
        <button
          type="button"
          onClick={onTogglePassword}
          className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full ${isDarkMode ? 'text-zinc-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

// ------------------------------------------------------------------
// 2. COMPONENTE PRINCIPAL
// ------------------------------------------------------------------
function ResetPassword() {
  // --- CONSUMO DE CONTEXTOS ---
  const appContext = useContext(AppContent);
  const { t } = useLanguage();

  if (!appContext) {
    throw new Error('AppContent debe estar dentro de un AppContextProvider');
  }

  // Aquí extraemos todo del contexto global, eliminando la lógica local
  const { backendUrl, theme, isDark, toggleTheme } = appContext;

  axios.defaults.withCredentials = true;
  const navigate = useNavigate();

  // --- ESTADOS LOCALES (Formulario) ---
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>('');
  const [isOtpSubmited, setIsOtpSubmited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // --- MANEJADORES DE INPUT OTP (Intactos) ---
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

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasteArray = e.clipboardData.getData('text').split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index]!.value = char;
      }
    });
  };

  // --- MANEJADORES DE FORMULARIO (Intactos) ---
  const onSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email },
      );
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e?.value || '');
    const combinedOtp = otpArray.join('');
    setOtp(combinedOtp);

    if (combinedOtp.length < 6) {
      toast.warning(t('otpError'));
      return;
    }
    setIsOtpSubmited(true);
  };

  const onSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const otpValue =
      otp || inputRefs.current.map((e) => e?.value || '').join('');

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email,
          otp: otpValue,
          newPassword,
        },
      );
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // --- ESTILOS DINÁMICOS (Basados en isDark del Contexto) ---
  const inputClassName = `w-full px-4 py-3.5 rounded-xl text-sm transition-all duration-300 outline-none border backdrop-blur-sm ${
    isDark
      ? 'bg-black/10 border-white/10 text-white placeholder-zinc-500 focus:border-blue-500/80 focus:bg-black/30'
      : 'bg-white/60 border-gray-400 text-gray-900 placeholder-gray-600 focus:border-blue-600 focus:bg-white/80 focus:ring-2 focus:ring-blue-100/50'
  }`;

  const otpInputClass = `w-12 h-14 text-center text-xl rounded-xl border outline-none transition-all duration-300 ${
    isDark
      ? 'bg-black/20 border-white/10 text-white focus:border-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
      : 'bg-white/60 border-gray-300 text-gray-900 focus:border-blue-600 focus:shadow-md'
  }`;

  return (
    <div
      className={`min-h-screen w-full relative flex items-center justify-center p-4 transition-colors duration-500 ${isDark ? 'bg-[#050505]' : 'bg-gray-200'}`}
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center fixed"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div
          className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-black/60' : 'bg-white/10 backdrop-blur-[1px]'}`}
        ></div>
      </div>

      <img
        src={logo}
        alt="Logo"
        onClick={() => navigate('/')}
        className={`absolute z-50 cursor-pointer transition-all duration-700 top-8 left-1/2 -translate-x-1/2 w-24 drop-shadow-lg md:top-12 md:left-12 md:translate-x-0`}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`relative z-10 w-full max-w-[420px] mt-20 md:mt-0 rounded-[2.5rem] backdrop-blur-xl border shadow-2xl overflow-hidden ${isDark ? 'bg-black/30 border-transparent' : 'bg-white/40 border-white/40'}`}
      >
        <div
          className={`p-6 pb-0 flex justify-between items-center ${isDark ? 'text-white' : 'text-gray-800'}`}
        >
          <button
            onClick={() => navigate('/login')}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          {/* Botón de Tema usando Contexto Global */}
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
          {/* 1. EMAIL */}
          {!isEmailSent && (
            <form onSubmit={onSubmitEmail}>
              <div className="text-center mb-6">
                <div
                  className={`inline-flex p-3 rounded-2xl mb-4 ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-800'}`}
                >
                  <Mail size={28} />
                </div>
                <h1
                  className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {t('recoverTitle')}
                </h1>
                <p
                  className={`text-sm mt-2 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}
                >
                  {t('recoverDesc')}
                </p>
              </div>

              <AnimatedInput
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder={t('email')}
                className={inputClassName}
                icon={<Mail size={20} />}
                isDarkMode={isDark}
                required
              />

              <Button
                variant="primary"
                loading={loading}
                fullWidth
                formAction="submit"
              >
                {t('sendCode')}
              </Button>
            </form>
          )}

          {/* 2. OTP */}
          {!isOtpSubmited && isEmailSent && (
            <form onSubmit={onSubmitOTP}>
              <div className="text-center mb-6">
                <div
                  className={`inline-flex p-3 rounded-2xl mb-4 ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-800'}`}
                >
                  <ShieldCheck size={28} />
                </div>
                <h1
                  className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {t('verifyTitle')}
                </h1>
                <p
                  className={`text-sm mt-2 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}
                >
                  {t('verifyDesc')}
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

              <Button variant="primary" fullWidth formAction="submit">
                {t('verifyBtn')}
              </Button>

              <div className="mt-4 text-center">
                <Button
                  variant="inline-link"
                  onClick={() => setIsEmailSent(false)}
                >
                  {t('wrongEmail')}
                </Button>
              </div>
            </form>
          )}

          {/* 3. NEW PASSWORD */}
          {isOtpSubmited && isEmailSent && (
            <form onSubmit={onSubmitNewPassword}>
              <div className="text-center mb-6">
                <div
                  className={`inline-flex p-3 rounded-2xl mb-4 ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-800'}`}
                >
                  <Lock size={28} />
                </div>
                <h1
                  className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}
                >
                  {t('newPassTitle')}
                </h1>
                <p
                  className={`text-sm mt-2 ${isDark ? 'text-zinc-300' : 'text-gray-600'}`}
                >
                  {t('newPassDesc')}
                </p>
              </div>

              <AnimatedInput
                type="password"
                value={newPassword}
                onChange={(e: any) => setNewPassword(e.target.value)}
                placeholder={t('newPassTitle')}
                className={inputClassName}
                icon={<Lock size={20} />}
                isDarkMode={isDark}
                showPasswordToggle={true}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                required
              />

              <Button
                variant="primary"
                loading={loading}
                fullWidth
                formAction="submit"
              >
                {t('resetBtn')}
              </Button>
            </form>
          )}
        </div>

        <div
          className={`p-4 text-center text-[10px] border-t ${isDark ? 'border-white/10 text-zinc-500' : 'border-gray-300/30 text-gray-500'}`}
        >
          {t('securityFooter')}
        </div>
      </motion.div>
    </div>
  );
}

export default ResetPassword;
