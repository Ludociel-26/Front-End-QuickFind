import React, { useState, useEffect, useRef, useContext } from 'react';
import { TopNavigation, Input } from '@cloudscape-design/components';
import { applyDensity, Density } from '@cloudscape-design/global-styles';

// CORRECCIÓN: Importamos AppContent Y ThemeMode
import { AppContent } from '@/context/AppContext';
import type { ThemeMode } from '@/context/AppContext'; // Importación de tipo segura

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

  // Solo control de Densidad (El tema lo maneja AppContext)
  useEffect(() => {
    const savedDensity = localStorage.getItem('density');
    if (savedDensity === 'comfortable') applyDensity(Density.Comfortable);
    else applyDensity(Density.Compact);
  }, []);

  const handleThemeSelect = (id: string) => {
    if (setTheme && ['light', 'dark', 'system'].includes(id)) {
      setTheme(id as ThemeMode);
    }
  };

  const handleDensitySelect = (id: string) => {
    if (id === 'compact') applyDensity(Density.Compact);
    if (id === 'comfortable') applyDensity(Density.Comfortable);
    localStorage.setItem('density', id);
  };

  const userMenuItems = [
    { id: 'profile', text: 'Mi Perfil', iconName: 'user-profile' },
  ];

  if (userData && !userData.isAccountVerified) {
    userMenuItems.push({
      id: 'verify-email',
      text: 'Verificar cuenta',
      iconName: 'status-warning',
    });
  }

  userMenuItems.push({
    id: 'signout',
    text: 'Cerrar sesión',
    iconName: 'angle-right-double',
  });

  return (
    <div id="h" style={{ position: 'sticky', top: 0, zIndex: 1002 }}>
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
                if (searchValue) setShowSuggestions(true);
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
                    placeholder="Buscar refacciones (ej. Sensores, Motores)..."
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
            type: 'menu-dropdown',
            iconName: 'settings',
            ariaLabel: 'Ajustes',
            title: 'Configuración',
            onItemClick: (e) => {
              const id = e.detail.id;
              if (['light', 'dark', 'system'].includes(id))
                handleThemeSelect(id);
              if (['compact', 'comfortable'].includes(id))
                handleDensitySelect(id);
            },
            items: [
              {
                id: 'theme',
                text: 'Tema',
                items: [
                  { id: 'light', text: 'Claro', iconName: 'gen-ai' },
                  { id: 'dark', text: 'Oscuro', iconName: 'star' },
                  { id: 'system', text: 'Sistema', iconName: 'monitor' },
                ],
              },
              {
                id: 'density',
                text: 'Densidad',
                items: [
                  { id: 'comfortable', text: 'Cómoda', iconName: 'view-full' },
                  {
                    id: 'compact',
                    text: 'Compacta',
                    iconName: 'view-vertical',
                  },
                ],
              },
            ],
          },
          {
            type: 'menu-dropdown',
            text: isLoggedin && userData ? userData.name : 'Invitado',
            description:
              isLoggedin && userData ? userData.email : 'Iniciar sesión',
            iconName: 'user-profile',
            onItemClick: (e) => {
              if (e.detail.id === 'signout') handleLogout();
              if (e.detail.id === 'verify-email') handleSendVerification();
              if (e.detail.id === 'login') navigate('/login');
            },
            items: isLoggedin
              ? userMenuItems
              : [
                  {
                    id: 'login',
                    text: 'Entrar',
                    iconName: 'user-profile-active-filled',
                  },
                ],
          },
        ]}
      />
    </div>
  );
}
