import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  TopNavigation,
  Input,
  Icon,
  Select,
} from '@cloudscape-design/components';
import type { SelectProps } from '@cloudscape-design/components';
import { applyDensity, Density } from '@cloudscape-design/global-styles';
import { AppContent } from '@/context/AppContext';
import type { ThemeMode } from '@/context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import LOGO_IMAGE from '@/assets/icons/appiconf.png';
import './navbar.css';

const REFACCIONES_DATA = [
  {
    id: 1,
    title: 'Balatas Delanteras Ceramica',
    category: 'Frenos',
    img: 'https://placehold.co/100x100/333/FFF?text=Frenos',
  },
  {
    id: 2,
    title: 'Aceite Sintético 5W-30',
    category: 'Motor',
    img: 'https://placehold.co/100x100/333/FFF?text=Aceite',
  },
  {
    id: 3,
    title: 'Amortiguador Trasero Gas',
    category: 'Suspensión',
    img: 'https://placehold.co/100x100/333/FFF?text=Susp',
  },
  {
    id: 4,
    title: 'Bujía Iridium IX',
    category: 'Encendido',
    img: 'https://placehold.co/100x100/333/FFF?text=Bujia',
  },
];

const LANGUAGE_OPTIONS = [
  { label: 'Español', value: 'es' },
  { label: 'English (US)', value: 'en' },
  { label: 'Português', value: 'pt' },
];

// --- LÓGICA DE COLOR DE ÁREA ---
const getAreaClass = (areaName: string | undefined): string => {
  if (!areaName) return 'area-general';
  const normalized = areaName.toLowerCase().trim();
  if (normalized.includes('mantenimiento')) return 'area-mantenimiento';
  if (normalized.includes('electricidad')) return 'area-electricidad';
  if (normalized.includes('sanidad') || normalized.includes('salud'))
    return 'area-sanidad';
  if (normalized.includes('sistema') || normalized.includes('dev'))
    return 'area-sistemas';
  if (normalized.includes('almacen')) return 'area-almacen';
  return 'area-general';
};

const useIsMac = () => {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);
  return isMac;
};

export default function GlobalHeader() {
  const navigate = useNavigate();
  const {
    userData,
    backendUrl,
    setIsLoggedin,
    setUserData,
    isLoggedin,
    setTheme,
  } = useContext(AppContent) || {};
  const isMac = useIsMac();
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Paneles
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Configuración
  const [selectedLang, setSelectedLang] = useState<SelectProps.Option>(
    LANGUAGE_OPTIONS[0],
  );
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('system');
  const [currentDensity, setCurrentDensity] = useState<
    'comfortable' | 'compact'
  >('compact');

  // Datos para la pestaña superior
  const areaClassName = getAreaClass(userData?.areaName);
  const tabText = userData?.areaName || 'General'; // Muestra el Área

  const handleLogout = async () => {
    try {
      if (backendUrl) {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
        if (data.success && setIsLoggedin && setUserData) {
          setIsLoggedin(false);
          setUserData(null);
          toast.info('Sesión cerrada correctamente');
          navigate('/');
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleSendVerification = async () => {
    try {
      if (backendUrl) {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(
          `${backendUrl}/api/auth/send-verify-otp`,
        );
        if (data.success) {
          toast.success('Código enviado. Por favor verifica tu cuenta.');
          navigate('/verify-email');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado al portapapeles', {
      autoClose: 1000,
      position: 'bottom-center',
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault();
        searchInputRef.current?.focus();
        setIsFocused(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const savedDensity = localStorage.getItem('density');
    if (savedDensity === 'comfortable') {
      applyDensity(Density.Comfortable);
      setCurrentDensity('comfortable');
    } else {
      applyDensity(Density.Compact);
      setCurrentDensity('compact');
    }
  }, []);

  const changeTheme = (mode: ThemeMode) => {
    setCurrentTheme(mode);
    if (setTheme) setTheme(mode);
  };

  const changeDensity = (density: 'comfortable' | 'compact') => {
    setCurrentDensity(density);
    localStorage.setItem('density', density);
    applyDensity(
      density === 'comfortable' ? Density.Comfortable : Density.Compact,
    );
  };

  // --- PANEL DE CONFIGURACIÓN ---
  const SettingsPanel = () => (
    <>
      <div
        className="settings-overlay"
        onClick={() => setIsSettingsOpen(false)}
      />
      <div className="settings-panel">
        <div className="settings-panel-header">
          Configuración actual del usuario
        </div>
        <div className="settings-panel-body">
          <div>
            <div className="sp-section-label">Idioma</div>
            <Select
              selectedOption={selectedLang}
              onChange={({ detail }) => setSelectedLang(detail.selectedOption)}
              options={LANGUAGE_OPTIONS}
            />
          </div>
          <div>
            <div className="sp-section-label">
              Modo visual <span className="beta-tag">- beta</span>
            </div>
            <div className="sp-radio-group">
              <div
                className={`sp-radio-option ${currentTheme === 'system' ? 'selected' : ''}`}
                onClick={() => changeTheme('system')}
              >
                <div className="sp-radio-left">
                  <div className="sp-radio-circle" />
                  <span>Predeterminado</span>
                </div>
                <div className="sp-icon-right">
                  <Icon name="monitor" />
                </div>
              </div>
              <div
                className={`sp-radio-option ${currentTheme === 'light' ? 'selected' : ''}`}
                onClick={() => changeTheme('light')}
              >
                <div className="sp-radio-left">
                  <div className="sp-radio-circle" />
                  <span>Claro</span>
                </div>
                <div className="sp-icon-right">
                  <Icon name="gen-ai" />
                </div>
              </div>
              <div
                className={`sp-radio-option ${currentTheme === 'dark' ? 'selected' : ''}`}
                onClick={() => changeTheme('dark')}
              >
                <div className="sp-radio-left">
                  <div className="sp-radio-circle" />
                  <span>Oscuro</span>
                </div>
                <div className="sp-icon-right">
                  <Icon name="star" />
                </div>
              </div>
            </div>
          </div>
          <div className="sp-divider"></div>
          <div>
            <div className="sp-radio-group">
              <div
                className={`sp-radio-option ${currentDensity === 'comfortable' ? 'selected' : ''}`}
                onClick={() => changeDensity('comfortable')}
              >
                <div className="sp-radio-left">
                  <div className="sp-radio-circle" />
                  <span>Densidad cómoda</span>
                </div>
                <div className="sp-icon-right">
                  <Icon name="view-full" />
                </div>
              </div>
              <div
                className={`sp-radio-option ${currentDensity === 'compact' ? 'selected' : ''}`}
                onClick={() => changeDensity('compact')}
              >
                <div className="sp-radio-left">
                  <div className="sp-radio-circle" />
                  <span>Densidad compacta</span>
                </div>
                <div className="sp-icon-right">
                  <Icon name="view-vertical" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // --- PANEL DE USUARIO ---
  const UserMenuPanel = () => {
    const displayId = userData?.id || '---';
    const displayName = userData?.name || 'Invitado';
    const displayRole = userData?.roleName || 'Sin Rol Asignado';
    const displayArea = userData?.areaName || 'Sin Área Asignada';

    // Helper para el color del punto
    const getHexColor = () => {
      if (areaClassName.includes('mantenimiento')) return '#6b7280';
      if (areaClassName.includes('electricidad')) return '#ef4444';
      if (areaClassName.includes('sanidad')) return '#0f172a';
      if (areaClassName.includes('sistemas')) return '#3b82f6';
      if (areaClassName.includes('almacen')) return '#f59e0b';
      return '#6b7280';
    };

    return (
      <>
        <div
          className="settings-overlay"
          onClick={() => setIsUserMenuOpen(false)}
        />
        <div className="user-menu-panel">
          <div className="um-header">
            <div className="um-header-row">
              <div className="um-label">ID de cuenta</div>
              <div className="um-value-row">
                <button
                  className="um-copy-btn"
                  onClick={() => copyToClipboard(String(displayId))}
                >
                  <Icon name="copy" />
                </button>
                <span>{displayId}</span>
              </div>
            </div>
            <div className="um-header-row">
              <div className="um-label">Nombre de la cuenta</div>
              <div className="um-value-row">
                <button
                  className="um-copy-btn"
                  onClick={() => copyToClipboard(displayName)}
                >
                  <Icon name="copy" />
                </button>
                <span>{displayName}</span>
              </div>
            </div>
            <div className="um-header-row">
              <div className="um-label">Rol del usuario</div>
              <div className="um-value-row">
                <Icon name="user-profile" variant="subtle" />
                <span style={{ marginLeft: 6 }}>{displayRole}</span>
              </div>
            </div>
            <div className="um-header-row">
              <div className="um-label">Área</div>
              <div className="um-value-row">
                <span
                  className="um-color-dot"
                  style={{ backgroundColor: getHexColor() }}
                ></span>
                <span>{displayArea}</span>
              </div>
            </div>
          </div>
          <div className="um-body">
            <div className="um-link-item" onClick={() => navigate('/profile')}>
              Cuenta
            </div>
            <div className="um-link-item">Organización</div>
            <div className="um-link-item">Credenciales de seguridad</div>
            {userData && !userData.isAccountVerified && (
              <div
                className="um-link-item um-link-warning"
                onClick={handleSendVerification}
              >
                <Icon name="status-warning" />
                <span style={{ marginLeft: 8 }}>Verificar cuenta</span>
              </div>
            )}
          </div>
          <div className="um-footer">
            <button className="um-btn-outline">Opciones</button>
            <button className="um-btn-orange" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>
        </div>
      </>
    );
  };

  const activeClass = isSettingsOpen
    ? 's-open'
    : isUserMenuOpen
      ? 'u-open'
      : '';

  return (
    <div
      id="navbar-wrapper"
      className={activeClass}
      style={{ position: 'sticky', top: 0, zIndex: 1002 }}
    >
      {/* 1. LÍNEA DE COLOR SUPERIOR */}
      <div className={`aws-strip-line ${areaClassName}`}></div>

      {/* 2. ETIQUETA DEL ÁREA (Nombre del Área) */}
      <div className={`aws-name-tag ${areaClassName}`}>
        <span className="aws-tag-content">{tabText}</span>
      </div>

      {/* PANELES FLOTANTES */}
      {isSettingsOpen && <SettingsPanel />}
      {isUserMenuOpen && <UserMenuPanel />}

      {/* NAVBAR */}
      <TopNavigation
        identity={{
          href: '#',
          title: 'QuickFind',
          logo: { src: LOGO_IMAGE, alt: 'Logo' },
        }}
        search={
          <div
            ref={containerRef}
            style={{
              width: '100%',
              maxWidth: '850px',
              margin: '0 auto',
              position: 'relative',
            }}
          >
            <div
              className={`big-search-wrapper shine ${isFocused ? 'focused' : ''}`}
              onClick={() => {
                searchInputRef.current?.focus();
                setIsFocused(true);
              }}
            >
              <div className="inner-mask"></div>
              <div className="search-content-wrapper">
                <div className="search-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <div className="cloudscape-input-override">
                  <Input
                    ref={searchInputRef}
                    value={searchValue}
                    onChange={({ detail }) => {
                      setSearchValue(detail.value);
                      setShowSuggestions(detail.value.length > 0);
                    }}
                    onFocus={() => {
                      setIsFocused(true);
                      if (searchValue) setShowSuggestions(true);
                    }}
                    placeholder="Buscar refacciones..."
                    type="text"
                    disableBrowserAutocorrect
                  />
                </div>
              </div>
              <div className="search-shortcuts">
                <span className="kbd-key">{isMac ? '⌘' : 'Ctrl'}</span>
                <span className="plus-char">+</span>
                <span className="kbd-key">S</span>
              </div>
            </div>
            {showSuggestions && (
              <div className="suggestions-menu">
                <div className="suggestions-header">Refacciones Sugeridas</div>
                {REFACCIONES_DATA.filter((item) =>
                  item.title.toLowerCase().includes(searchValue.toLowerCase()),
                ).map((part) => (
                  <div key={part.id} className="suggestion-row">
                    <div className="sugg-text">
                      <span className="sugg-title">{part.title}</span>
                      <span className="sugg-cat">{part.category}</span>
                    </div>
                    <img
                      src={part.img}
                      alt={part.title}
                      className="sugg-thumbnail"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        }
        utilities={[
          {
            type: 'button',
            iconName: 'settings',
            ariaLabel: 'Ajustes',
            title: 'Configuración',
            onClick: () => {
              setIsUserMenuOpen(false);
              setIsSettingsOpen(!isSettingsOpen);
            },
          },
          {
            type: 'button',
            text: userData ? userData.name : 'Invitado',
            description:
              isLoggedin && userData ? userData.email : 'Iniciar sesión',
            iconName: 'user-profile',
            ariaLabel: 'Menú de usuario',
            onClick: () => {
              if (!isLoggedin) {
                navigate('/login');
              } else {
                setIsSettingsOpen(false);
                setIsUserMenuOpen(!isUserMenuOpen);
              }
            },
          },
        ]}
      />
    </div>
  );
}
