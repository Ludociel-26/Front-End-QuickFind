import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TopNavigation, Input } from '@cloudscape-design/components';
import {
  applyMode,
  applyDensity,
  Mode,
  Density,
} from '@cloudscape-design/global-styles';
import LOGO_IMAGE from '@/assets/icons/logo_del_monte.png';
import './navbar.css';

// DATOS DE EJEMPLO
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
  const isMac = useIsMac();
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);

  // BUSCADOR
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
    setTimeout(() => {
      setIsUserLoading(false);
      setUserAvatarUrl('');
    }, 3000);
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

  // --- LÓGICA DE TEMA Y DENSIDAD (CORREGIDA) ---
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedDensity = localStorage.getItem('density');

    // 1. DEFAULT A COMPACTO (Como pediste)
    if (savedDensity === 'comfortable') applyDensity(Density.Comfortable);
    else applyDensity(Density.Compact); // Default Compacto

    // 2. TEMA
    if (savedTheme === 'light') applyMode(Mode.Light);
    else if (savedTheme === 'dark') applyMode(Mode.Dark);
    else applyMode(Mode.Dark); // Default visual (puedes cambiar a System si prefieres)
  }, []);

  // Handlers directos
  const handleThemeSelect = (id: string) => {
    if (id === 'light') applyMode(Mode.Light);
    if (id === 'dark') applyMode(Mode.Dark);
    if (id === 'system') applyMode(Mode.Dark); // O usar lógica de sistema real
    localStorage.setItem('theme', id);
  };

  const handleDensitySelect = (id: string) => {
    if (id === 'compact') applyDensity(Density.Compact);
    if (id === 'comfortable') applyDensity(Density.Comfortable);
    localStorage.setItem('density', id);
  };

  return (
    <div id="h" style={{ position: 'sticky', top: 0, zIndex: 1002 }}>
      <TopNavigation
        identity={{
          href: '#',
          title: 'OmniPart',
          logo: { src: LOGO_IMAGE, alt: 'Logo' },
        }}
        search={
          // CONTENEDOR 850px CENTRADO
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
                    placeholder="Buscar refacciones (ej. Balatas, Filtros)..."
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

            {/* SUGERENCIAS */}
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
                {REFACCIONES_DATA.filter((i) =>
                  i.title.toLowerCase().includes(searchValue.toLowerCase()),
                ).length === 0 && (
                  <div className="no-results">
                    No encontrado "{searchValue}"
                  </div>
                )}
              </div>
            )}
          </div>
        }
        utilities={[
          {
            type: 'menu-dropdown',
            iconName: 'view-app',
            title: 'Apps',
            ariaLabel: 'Aplicaciones',
            items: [{ id: 'app1', text: 'Dashboard', href: '#' }],
          },
          {
            type: 'button',
            iconName: 'notification',
            title: 'Notificaciones',
            badge: true,
            onClick: () => {},
          },
          {
            type: 'menu-dropdown',
            iconName: 'settings',
            ariaLabel: 'Ajustes',
            title: 'Configuración',
            // --- FIX: DETECCIÓN DE CLICK ---
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
                  // ICONOS CORREGIDOS: Gen-ai (Sol/Brillo), Star (Noche), Monitor (Sistema)
                  { id: 'light', text: 'Claro', iconName: 'gen-ai' },
                  { id: 'dark', text: 'Oscuro', iconName: 'star' },
                  { id: 'system', text: 'Sistema', iconName: 'monitor' },
                ],
              },
              {
                id: 'density',
                text: 'Densidad',
                items: [
                  // ICONOS CORREGIDOS: Full (Cómoda), Vertical (Compacta)
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
            text: 'Carlos Ruiz',
            description: 'Admin',
            iconName: isUserLoading ? 'status-in-progress' : 'user-profile',
            items: [
              { id: 'profile', text: 'Mi Perfil', iconName: 'user-profile' },
              {
                id: 'signout',
                text: 'Cerrar sesión',
                iconName: 'angle-right-double',
              },
            ],
          },
        ]}
      />
    </div>
  );
}
