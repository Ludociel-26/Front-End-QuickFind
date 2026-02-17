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
import { useNavigate } from 'react-router-dom';
import LOGO_IMAGE from '@/assets/icons/appiconf.png';
import './styles/header.css';

// --- Data Example ---

export const REFACCIONES_DATA = [
  {
    id: 1,
    title: 'Chumacera de Piso 5/8 SKF',
    category: 'Mecánico',
    img: 'https://placehold.co/100x100/333/FFF?text=Chumacera',
  },
  {
    id: 2,
    title: 'Balero 6204-2RS',
    category: 'Rodamientos',
    img: 'https://placehold.co/100x100/333/FFF?text=Balero',
  },
  {
    id: 3,
    title: 'Sensor Inductivo M12 24VDC',
    category: 'Sensores',
    img: 'https://placehold.co/100x100/333/FFF?text=Sensor',
  },
  {
    id: 4,
    title: 'Sensor Fotoeléctrico Reflex',
    category: 'Sensores',
    img: 'https://placehold.co/100x100/333/FFF?text=Sensor',
  },
  {
    id: 5,
    title: 'Banda Transportadora PVC',
    category: 'Bandas',
    img: 'https://placehold.co/100x100/333/FFF?text=Banda',
  },
  {
    id: 6,
    title: 'Variador de Frecuencia 3HP',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=VFD',
  },
  {
    id: 7,
    title: 'Motor Eléctrico Trifásico 2HP',
    category: 'Motores',
    img: 'https://placehold.co/100x100/333/FFF?text=Motor',
  },
  {
    id: 8,
    title: 'Retén 30x40x7',
    category: 'Sellos',
    img: 'https://placehold.co/100x100/333/FFF?text=Reten',
  },
  {
    id: 9,
    title: 'Polea Tipo A 4"',
    category: 'Transmisión',
    img: 'https://placehold.co/100x100/333/FFF?text=Polea',
  },
  {
    id: 10,
    title: 'Cadena Industrial #40',
    category: 'Transmisión',
    img: 'https://placehold.co/100x100/333/FFF?text=Cadena',
  },

  {
    id: 11,
    title: 'Caja de Velocidades Industrial',
    category: 'Transmisión',
    img: 'https://placehold.co/100x100/333/FFF?text=Gearbox',
  },
  {
    id: 12,
    title: 'Clutch Electromagnético',
    category: 'Mecánico',
    img: 'https://placehold.co/100x100/333/FFF?text=Clutch',
  },
  {
    id: 13,
    title: 'Freno Electromagnético',
    category: 'Mecánico',
    img: 'https://placehold.co/100x100/333/FFF?text=Freno',
  },
  {
    id: 14,
    title: 'Manguera Industrial 20mm',
    category: 'Neumática',
    img: 'https://placehold.co/100x100/333/FFF?text=Manguera',
  },
  {
    id: 15,
    title: 'Válvula Neumática 5/2',
    category: 'Neumática',
    img: 'https://placehold.co/100x100/333/FFF?text=Valvula',
  },
  {
    id: 16,
    title: 'Pistón Neumático 50mm',
    category: 'Neumática',
    img: 'https://placehold.co/100x100/333/FFF?text=Piston',
  },
  {
    id: 17,
    title: 'Cilindro Neumático SMC',
    category: 'Neumática',
    img: 'https://placehold.co/100x100/333/FFF?text=Cilindro',
  },
  {
    id: 18,
    title: 'Fuente de Poder 24VDC',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=Fuente',
  },
  {
    id: 19,
    title: 'Contactor 3 Polos 220V',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=Contactor',
  },
  {
    id: 20,
    title: 'Relevador 24VDC 4PDT',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=Relevador',
  },

  {
    id: 21,
    title: 'Sensor de Proximidad 18mm',
    category: 'Sensores',
    img: 'https://placehold.co/100x100/333/FFF?text=Prox',
  },
  {
    id: 22,
    title: 'Encoder Incremental 1024 PPR',
    category: 'Sensores',
    img: 'https://placehold.co/100x100/333/FFF?text=Encoder',
  },
  {
    id: 23,
    title: 'Panel HMI 7 Pulgadas',
    category: 'Automatización',
    img: 'https://placehold.co/100x100/333/FFF?text=HMI',
  },
  {
    id: 24,
    title: 'PLC Compacto 24 I/O',
    category: 'Automatización',
    img: 'https://placehold.co/100x100/333/FFF?text=PLC',
  },
  {
    id: 25,
    title: 'Interruptor Termomagnético 30A',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=Breaker',
  },
  {
    id: 26,
    title: 'Fusible 5A Industrial',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=Fusible',
  },
  {
    id: 27,
    title: 'Terminal Eléctrica Tipo Ojal',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=Terminal',
  },
  {
    id: 28,
    title: 'Cable de Control 4 Hilos',
    category: 'Cableado',
    img: 'https://placehold.co/100x100/333/FFF?text=Cable',
  },
  {
    id: 29,
    title: 'Cable de Fibra Óptica Industrial',
    category: 'Cableado',
    img: 'https://placehold.co/100x100/333/FFF?text=Fibra',
  },
  {
    id: 30,
    title: 'Conector M12 Industrial',
    category: 'Conectores',
    img: 'https://placehold.co/100x100/333/FFF?text=Conector',
  },

  {
    id: 31,
    title: 'Rodillo de Presión de Goma',
    category: 'Mecánico',
    img: 'https://placehold.co/100x100/333/FFF?text=Rodillo',
  },
  {
    id: 32,
    title: 'Rueda Dentada #40',
    category: 'Transmisión',
    img: 'https://placehold.co/100x100/333/FFF?text=Sprocket',
  },
  {
    id: 33,
    title: 'Cople Flexible Industrial',
    category: 'Transmisión',
    img: 'https://placehold.co/100x100/333/FFF?text=Cople',
  },
  {
    id: 34,
    title: 'Resorte Industrial Compresión',
    category: 'Mecánico',
    img: 'https://placehold.co/100x100/333/FFF?text=Resorte',
  },
  {
    id: 35,
    title: 'Arandela Industrial Acero',
    category: 'Herrajes',
    img: 'https://placehold.co/100x100/333/FFF?text=Arandela',
  },
  {
    id: 36,
    title: 'Tornillo Allen M8',
    category: 'Herrajes',
    img: 'https://placehold.co/100x100/333/FFF?text=Tornillo',
  },
  {
    id: 37,
    title: 'Pasador Metálico Industrial',
    category: 'Herrajes',
    img: 'https://placehold.co/100x100/333/FFF?text=Pasador',
  },
  {
    id: 38,
    title: 'Navaja Circular Industrial',
    category: 'Corte',
    img: 'https://placehold.co/100x100/333/FFF?text=Navaja',
  },
  {
    id: 39,
    title: 'Filtro Hidráulico 10 Micras',
    category: 'Hidráulico',
    img: 'https://placehold.co/100x100/333/FFF?text=Filtro',
  },
  {
    id: 40,
    title: 'Bomba Hidráulica Industrial',
    category: 'Hidráulico',
    img: 'https://placehold.co/100x100/333/FFF?text=Bomba',
  },

  {
    id: 41,
    title: 'Electroválvula 24VDC',
    category: 'Neumática',
    img: 'https://placehold.co/100x100/333/FFF?text=Electrovalv',
  },
  {
    id: 42,
    title: 'Regulador de Presión Neumático',
    category: 'Neumática',
    img: 'https://placehold.co/100x100/333/FFF?text=Regulador',
  },
  {
    id: 43,
    title: 'Lubricador Neumático',
    category: 'Neumática',
    img: 'https://placehold.co/100x100/333/FFF?text=Lubricador',
  },
  {
    id: 44,
    title: 'Unidad FRL Neumática',
    category: 'Neumática',
    img: 'https://placehold.co/100x100/333/FFF?text=FRL',
  },
  {
    id: 45,
    title: 'Sensor de Nivel Capacitivo',
    category: 'Sensores',
    img: 'https://placehold.co/100x100/333/FFF?text=Nivel',
  },
  {
    id: 46,
    title: 'Sensor de Temperatura PT100',
    category: 'Sensores',
    img: 'https://placehold.co/100x100/333/FFF?text=Temp',
  },
  {
    id: 47,
    title: 'Botón de Paro de Emergencia',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=E-Stop',
  },
  {
    id: 48,
    title: 'Selector Rotativo 3 Posiciones',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=Selector',
  },
  {
    id: 49,
    title: 'Lámpara Piloto LED 24V',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=LED',
  },
  {
    id: 50,
    title: 'Gabinete Eléctrico NEMA 12',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=Gabinete',
  },

  {
    id: 51,
    title: 'Variador de Frecuencia 5HP',
    category: 'Automatización',
    img: 'https://placehold.co/100x100/333/FFF?text=VFD',
  },
  {
    id: 52,
    title: 'Servo Motor Industrial',
    category: 'Motores',
    img: 'https://placehold.co/100x100/333/FFF?text=Servo',
  },
  {
    id: 53,
    title: 'Reductor de Velocidad',
    category: 'Transmisión',
    img: 'https://placehold.co/100x100/333/FFF?text=Reductor',
  },
  {
    id: 54,
    title: 'Flecha Metálica Maquinada',
    category: 'Mecánico',
    img: 'https://placehold.co/100x100/333/FFF?text=Flecha',
  },
  {
    id: 55,
    title: 'Guía Lineal Industrial',
    category: 'Mecánico',
    img: 'https://placehold.co/100x100/333/FFF?text=Guia',
  },
  {
    id: 56,
    title: 'Carro Lineal de Precisión',
    category: 'Mecánico',
    img: 'https://placehold.co/100x100/333/FFF?text=Carro',
  },
  {
    id: 57,
    title: 'Cadena Transportadora Inoxidable',
    category: 'Bandas',
    img: 'https://placehold.co/100x100/333/FFF?text=Cadena',
  },
  {
    id: 58,
    title: 'Rodamiento de Rodillos Cónicos',
    category: 'Rodamientos',
    img: 'https://placehold.co/100x100/333/FFF?text=Rodillo',
  },
  {
    id: 59,
    title: 'Chumacera de Pared FYTB20',
    category: 'Rodamientos',
    img: 'https://placehold.co/100x100/333/FFF?text=Chumacera',
  },
  {
    id: 60,
    title: 'Polea Dentada HTD',
    category: 'Transmisión',
    img: 'https://placehold.co/100x100/333/FFF?text=Polea',
  },

  {
    id: 61,
    title: 'Banda Sincrónica HTD',
    category: 'Bandas',
    img: 'https://placehold.co/100x100/333/FFF?text=Banda',
  },
  {
    id: 62,
    title: 'Sensor Ultrasónico Industrial',
    category: 'Sensores',
    img: 'https://placehold.co/100x100/333/FFF?text=Ultrasonic',
  },
  {
    id: 63,
    title: 'Switch de Seguridad Industrial',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=Switch',
  },
  {
    id: 64,
    title: 'Interruptor de Proximidad 24V',
    category: 'Sensores',
    img: 'https://placehold.co/100x100/333/FFF?text=Prox',
  },
  {
    id: 65,
    title: 'Transformador de Control 220/24V',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=Trafo',
  },
  {
    id: 66,
    title: 'Fuente Switching 10A',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=PSU',
  },
  {
    id: 67,
    title: 'Panel View HMI 10"',
    category: 'Automatización',
    img: 'https://placehold.co/100x100/333/FFF?text=HMI',
  },
  {
    id: 68,
    title: 'Módulo de Entradas Digitales PLC',
    category: 'Automatización',
    img: 'https://placehold.co/100x100/333/FFF?text=I/O',
  },
  {
    id: 69,
    title: 'Módulo de Salidas Digitales PLC',
    category: 'Automatización',
    img: 'https://placehold.co/100x100/333/FFF?text=I/O',
  },
  {
    id: 70,
    title: 'Tarjeta de Control Industrial',
    category: 'Electrónica',
    img: 'https://placehold.co/100x100/333/FFF?text=PCB',
  },

  {
    id: 71,
    title: 'Ventilador Industrial 120mm',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=Fan',
  },
  {
    id: 72,
    title: 'Disipador de Calor Industrial',
    category: 'Electrónica',
    img: 'https://placehold.co/100x100/333/FFF?text=Heatsink',
  },
  {
    id: 73,
    title: 'Conector Rápido Neumático',
    category: 'Neumática',
    img: 'https://placehold.co/100x100/333/FFF?text=Conector',
  },
  {
    id: 74,
    title: 'Silenciador Neumático',
    category: 'Neumática',
    img: 'https://placehold.co/100x100/333/FFF?text=Silencer',
  },
  {
    id: 75,
    title: 'Manómetro Industrial 0-150 PSI',
    category: 'Neumática',
    img: 'https://placehold.co/100x100/333/FFF?text=Manometro',
  },
  {
    id: 76,
    title: 'Interruptor de Presión 100 PSI',
    category: 'Sensores',
    img: 'https://placehold.co/100x100/333/FFF?text=Pressure',
  },
  {
    id: 77,
    title: 'Sensor Magnético para Cilindro',
    category: 'Sensores',
    img: 'https://placehold.co/100x100/333/FFF?text=Magnet',
  },
  {
    id: 78,
    title: 'Regleta de Conexión Industrial',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=Regleta',
  },
  {
    id: 79,
    title: 'Canaleta Porta Cables',
    category: 'Cableado',
    img: 'https://placehold.co/100x100/333/FFF?text=Canaleta',
  },
  {
    id: 80,
    title: 'Cable Uso Rudo 12 AWG',
    category: 'Cableado',
    img: 'https://placehold.co/100x100/333/FFF?text=Cable',
  },

  {
    id: 81,
    title: 'Sensor Óptico de Contraste',
    category: 'Sensores',
    img: 'https://placehold.co/100x100/333/FFF?text=Optico',
  },
  {
    id: 82,
    title: 'Rodillo Transportador Metálico',
    category: 'Mecánico',
    img: 'https://placehold.co/100x100/333/FFF?text=Rodillo',
  },
  {
    id: 83,
    title: 'Guía de Cadena UHMW',
    category: 'Mecánico',
    img: 'https://placehold.co/100x100/333/FFF?text=Guia',
  },
  {
    id: 84,
    title: 'Placa de Desgaste UHMW',
    category: 'Mecánico',
    img: 'https://placehold.co/100x100/333/FFF?text=Placa',
  },
  {
    id: 85,
    title: 'Tensiónador de Cadena Industrial',
    category: 'Transmisión',
    img: 'https://placehold.co/100x100/333/FFF?text=Tension',
  },
  {
    id: 86,
    title: 'Amortiguador Industrial',
    category: 'Mecánico',
    img: 'https://placehold.co/100x100/333/FFF?text=Amort',
  },
  {
    id: 87,
    title: 'Sensor de Color Industrial',
    category: 'Sensores',
    img: 'https://placehold.co/100x100/333/FFF?text=Color',
  },
  {
    id: 88,
    title: 'PLC CompactLogix',
    category: 'Automatización',
    img: 'https://placehold.co/100x100/333/FFF?text=PLC',
  },
  {
    id: 89,
    title: 'Variador PowerFlex Industrial',
    category: 'Automatización',
    img: 'https://placehold.co/100x100/333/FFF?text=VFD',
  },
  {
    id: 90,
    title: 'Servo Drive Industrial',
    category: 'Automatización',
    img: 'https://placehold.co/100x100/333/FFF?text=Drive',
  },

  {
    id: 91,
    title: 'Módulo Ethernet Industrial',
    category: 'Redes',
    img: 'https://placehold.co/100x100/333/FFF?text=Ethernet',
  },
  {
    id: 92,
    title: 'Switch Industrial 8 Puertos',
    category: 'Redes',
    img: 'https://placehold.co/100x100/333/FFF?text=Switch',
  },
  {
    id: 93,
    title: 'Antena WiFi Industrial',
    category: 'Redes',
    img: 'https://placehold.co/100x100/333/FFF?text=Antena',
  },
  {
    id: 94,
    title: 'UPS Industrial 1500VA',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=UPS',
  },
  {
    id: 95,
    title: 'Transformador Aislador',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=Trafo',
  },
  {
    id: 96,
    title: 'Disyuntor Diferencial',
    category: 'Eléctrico',
    img: 'https://placehold.co/100x100/333/FFF?text=Breaker',
  },
  {
    id: 97,
    title: 'Sensor de Vibración Industrial',
    category: 'Sensores',
    img: 'https://placehold.co/100x100/333/FFF?text=Vibracion',
  },
  {
    id: 98,
    title: 'Medidor de Flujo Industrial',
    category: 'Instrumentación',
    img: 'https://placehold.co/100x100/333/FFF?text=Flujo',
  },
  {
    id: 99,
    title: 'Válvula de Bola Inoxidable',
    category: 'Hidráulico',
    img: 'https://placehold.co/100x100/333/FFF?text=Valvula',
  },
  {
    id: 100,
    title: 'Actuador Neumático Rotativo',
    category: 'Neumática',
    img: 'https://placehold.co/100x100/333/FFF?text=Actuador',
  },
];

// --- Data Example ---

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

  // EXTRAEMOS addAlert DE TU CONTEXTO GLOBAL
  const {
    userData,
    backendUrl,
    setIsLoggedin,
    setUserData,
    isLoggedin,
    setTheme,
    addAlert,
  } = useContext(AppContent) || {};

  const isMac = useIsMac();
  const [searchValue, setSearchValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Estados visuales extra
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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
  const tabText = userData?.areaName || 'General';

  const handleLogout = async () => {
    if (isLoggingOut) return; // Previene doble clic
    setIsLoggingOut(true);

    // 1. Mostrar estado de carga (Cloudscape spinner en el Flashbar)
    const alertId = addAlert
      ? addAlert(
          'info',
          'Cerrando sesión de forma segura...',
          'Cerrando sesión',
          undefined,
          true,
        )
      : undefined;

    try {
      if (backendUrl) {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(`${backendUrl}/api/auth/logout`);

        if (data.success && setIsLoggedin && setUserData) {
          // PAUSA ESTÉTICA DE 1 SEGUNDO (Permite ver el spinner de carga)
          await new Promise((resolve) => setTimeout(resolve, 1000));

          setIsLoggedin(false);
          setUserData(null);
          // 2. Transición a éxito (Checkmark)
          if (addAlert)
            addAlert(
              'success',
              'Sesión terminada. ¡Hasta pronto!',
              'Desconectado',
              alertId,
              false,
            );
          navigate('/');
        } else {
          if (addAlert)
            addAlert(
              'warning',
              'No se pudo cerrar la sesión completamente.',
              'Advertencia',
              alertId,
              false,
            );
        }
      }
    } catch (error: any) {
      if (addAlert)
        addAlert(
          'error',
          error.message || 'Error al conectar con el servidor',
          'Fallo al cerrar sesión',
          alertId,
          false,
        );
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSendVerification = async () => {
    const alertId = addAlert
      ? addAlert(
          'info',
          'Enviando código de verificación a tu correo...',
          'Procesando',
          undefined,
          true,
        )
      : undefined;

    try {
      if (backendUrl) {
        axios.defaults.withCredentials = true;
        const { data } = await axios.post(
          `${backendUrl}/api/auth/send-verify-otp`,
        );
        if (data.success) {
          if (addAlert)
            addAlert(
              'success',
              'Código enviado. Por favor verifica tu cuenta.',
              'Éxito',
              alertId,
              false,
            );
          navigate('/verify-email');
        } else {
          if (addAlert)
            addAlert(
              'error',
              data.message,
              'Error de Verificación',
              alertId,
              false,
            );
        }
      }
    } catch (error: any) {
      if (addAlert)
        addAlert(
          'error',
          error.message,
          'Fallo en la Solicitud',
          alertId,
          false,
        );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    if (addAlert)
      addAlert('success', 'El texto se ha copiado al portapapeles.', 'Copiado');
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
            <button
              className="um-btn-orange"
              onClick={handleLogout}
              disabled={isLoggingOut}
              style={{
                opacity: isLoggingOut ? 0.7 : 1,
                cursor: isLoggingOut ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoggingOut ? 'Cerrando...' : 'Cerrar sesión'}
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
