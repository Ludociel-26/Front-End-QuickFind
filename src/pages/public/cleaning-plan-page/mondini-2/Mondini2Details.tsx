import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { AppContent } from '@/context/AppContext';

import {
  TopNavigation,
  Header,
  SpaceBetween,
  Grid,
  Cards,
  Box,
  Icon,
  Button,
  Flashbar,
  Table,
  Container,
} from '@cloudscape-design/components';

// ==========================================
// IMPORTACIÓN DE IMÁGENES - MONDINI 2
// Descomenta estas líneas y agrega tus rutas.
// ==========================================

// --- SECCIÓN 1 ---
// import imgMedidorDeAire_Fisico from '@/assets/...';
// import imgMedidorDeAire_Protegido from '@/assets/...';
// import imgChumaseras2_Fisico from '@/assets/...';
// import imgChumaseras2_Protegido from '@/assets/...';
// import imgSelector_Fisico from '@/assets/...';
// import imgSelector_Protegido from '@/assets/...';
// import imgMotorLadoSelector_Fisico from '@/assets/...';
// import imgMotorLadoSelector_Protegido from '@/assets/...';
// import imgSensorAmarillo_Fisico from '@/assets/...';
// import imgSensorAmarillo_Protegido from '@/assets/...';
// import imgSensoresAmarillos_Fisico from '@/assets/...';
// import imgSensoresAmarillos_Protegido from '@/assets/...';
// import imgManguerasAzules_Fisico from '@/assets/...';
// import imgManguerasAzules_Protegido from '@/assets/...';
// import imgSensorDeJaula_Fisico from '@/assets/...';
// import imgSensorDeJaula_Protegido from '@/assets/...';
// import imgManguerasJarabera_Fisico from '@/assets/...';
// import imgManguerasJarabera_Protegido from '@/assets/...';
// import imgTableroJarabe_Fisico from '@/assets/...';
// import imgTableroJarabe_Protegido from '@/assets/...';
// import imgTorreta_Fisico from '@/assets/...';
// import imgTorreta_Protegido from '@/assets/...';
// import imgBotoneraJarabe_Fisico from '@/assets/...';
// import imgBotoneraJarabe_Protegido from '@/assets/...';
// import imgCajaElectrica_Fisico from '@/assets/...';
// import imgCajaElectrica_Protegido from '@/assets/...';
// import imgCableadoJarabe_Fisico from '@/assets/...';
// import imgCableadoJarabe_Protegido from '@/assets/...';
// import imgMotoresDebajo_Fisico from '@/assets/...';
// import imgMotoresDebajo_Protegido from '@/assets/...';
// import imgMotorBandaDentada_Fisico from '@/assets/...';
// import imgMotorBandaDentada_Protegido from '@/assets/...';

// --- SECCIÓN 2 ---
// import imgBotonDeParo_Fisico from '@/assets/...';
// import imgBotonDeParo_Protegido from '@/assets/...';
// ... etc ...

// ==========================================
// DATOS MOCK: MONDINI 2
// ==========================================

const m2Sec1Data = [
  {
    raw: '*Medidor de aire',
    tech: 'Manómetro / Regulador Neumático',
    desc: 'Cubrir carátula para evitar condensación interna.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Chumaseras 2',
    tech: 'Chumaceras Expuestas (2)',
    desc: 'Evitar inyección directa de agua a presión en el sello.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Selector',
    tech: 'Selector Rotativo de Control',
    desc: 'Aislar completamente con bolsa y asegurar con cincho.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Motor (lado selector)',
    tech: 'Motorreductor (Zona Panel)',
    desc: 'Sellar caja de conexiones eléctricas con nudo ciego.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Sensor amarillo',
    tech: 'Sensor Fotoeléctrico Principal',
    desc: 'Color amarillo. Sellar lente y arnés trasero.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Sensores amarillos',
    tech: 'Banco de Sensores (Amarillos)',
    desc: 'Agrupar cableado y colocar funda protectora global.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Mangueras azules',
    tech: 'Líneas Neumáticas (Azules)',
    desc: 'Revisar racores; no aplicar agua a alta presión.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Sensor de la jaula',
    tech: 'Sensor de Enclavamiento',
    desc: 'Altamente sensible. Uso obligatorio de funda plástica.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Mangueras de jarabera',
    tech: 'Líneas de Dosificación',
    desc: 'Asegurar conectores para evitar ingreso de agua.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Tablero del jarabe',
    tech: 'Panel de Control de Dosificación',
    desc: 'Sellar bordes de puerta del gabinete o usar lona.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Torreta tablero jarabe',
    tech: 'Baliza Luminosa (Torreta)',
    desc: 'Cubrir desde la base de la torreta hacia arriba.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Botonera tablero jarabera',
    tech: 'Estación de Botones (Jarabera)',
    desc: 'Cubrir botonera entera para proteger empaques.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Caja electrica jarabera',
    tech: 'Gabinete de Distribución',
    desc: 'Verificar cierre hermético y prensacables.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: 'Cableado de caja jarabera',
    tech: 'Canalización y Arneses',
    desc: 'Sellar entrada de cables a la caja principal.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Motores debajo tablero',
    tech: 'Motores de Accionamiento',
    desc: 'Validar aislamiento inferior total (bolsa/cincho).',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Motor de banda dentada',
    tech: 'Servomotor de Banda',
    desc: 'Proteger encóder y conectores expuestos.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
];

const m2Sec2Data = [
  {
    raw: '*-Botón de paro',
    tech: 'Paro de Emergencia (E-Stop)',
    desc: 'Riesgo de corto circuito. Sellar herméticamente.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*-Boquilla de aire',
    tech: 'Boquilla de Soplado',
    desc: 'Evitar ingreso de agua en la línea neumática.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- Motores bandas entrada',
    tech: 'Motores Transportador Entrada',
    desc: 'Hacer nudo ciego en bolsa protectora en base.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*-Sensores entrada sellado',
    tech: 'Sensores de Presencia',
    desc: 'Muy delicados, cubrir lente y cuerpo completo.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*-Terminacion cables',
    tech: 'Conectores Sensores Inferiores',
    desc: 'Aislar terminales amarillas expuestas.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*-Conexiones aire y cables',
    tech: 'Múltiple de Válvulas y Clemas',
    desc: 'No aplicar chorro directo. Usar cubierta/lona.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*-Sensores rodillos',
    tech: 'Sensores Inductivos de Rodillos',
    desc: 'Fijar bolsa protectora firmemente en el arnés.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*-Sensores jaula naranja',
    tech: 'Cortinas Perimetrales (Naranjas)',
    desc: 'Cubrir ambos costados completos de los lentes.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- Terminación sable negro',
    tech: 'Arneses de Seguridad (Negros)',
    desc: 'Sellar conector de final de carrera.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- conexiones inferiores res.',
    tech: 'Bloques Conexión Resistencias',
    desc: 'Alto riesgo eléctrico. Aislamiento total.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- conexiones motores sup.',
    tech: 'Cajas de Empalme Aéreas',
    desc: 'Asegurar tapas de conexión ciegas.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- Motores inferiores',
    tech: 'Motores Tracción (2 Verdes/1 Gris)',
    desc: 'Aislar por completo cajas de terminales.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- Barómetro inferior',
    tech: 'Manómetro Inferior de Línea',
    desc: 'Cubrir carátula de cristal y racores.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- Tablero completo final',
    tech: 'Gabinete de Control Principal',
    desc: 'Uso de lona plástica industrial extensa.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- Conexiones inf. tablero',
    tech: 'Acometida Inferior del Gabinete',
    desc: 'Sellar la base donde ingresan los cables.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- botoneras de tablero',
    tech: 'Interfaz de Operador (Stop)',
    desc: 'Evitar humedad en los selectores.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- Botonera trasera',
    tech: 'Panel de Control Secundario',
    desc: 'Aislar botonera de respaldo.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '- Conexión final rodillo',
    tech: 'Conector Alimentación Rodillo',
    desc: 'Sellar terminal de cableado móvil.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '- tapones chumaseras',
    tech: 'Chumaceras Cerradas (Tapones)',
    desc: 'Verificar integridad del tapón de goma.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '- impresora',
    tech: 'Módulo de Impresión Térmica',
    desc: 'Componente sumamente frágil. Funda especial rígida.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
];

const SECTIONS = [
  { id: 'intro', text: 'Propósito del Protocolo' },
  { id: 'tabla', text: 'Inventario Completo' },
  { id: 'sec1', text: 'Sección 1 (Entrada)' },
  { id: 'sec2', text: 'Sección 2 (Sellado)' },
];

// ==========================================
// COMPONENTES UI PERSONALIZADOS
// ==========================================

const SectionTitle = ({
  title,
  subtitle,
  isDark,
}: {
  title: string;
  subtitle?: string;
  isDark: boolean;
}) => (
  <div
    style={{
      marginBottom: '32px',
      borderBottom: `2px solid ${isDark ? '#414d5c' : '#eaeded'}`,
      paddingBottom: '16px',
    }}
  >
    <h2
      style={{
        fontSize: '38px',
        fontWeight: '900',
        color: isDark ? '#ffffff' : '#16191f',
        margin: '0 0 12px 0',
        letterSpacing: '-0.5px',
        fontFamily: '"Amazon Ember Display", "Helvetica Neue", sans-serif',
      }}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        style={{
          fontSize: '18px',
          color: isDark ? '#aab7b8' : '#545b64',
          margin: 0,
          lineHeight: '1.5',
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

// Mini-Carrusel exclusivo para las Tarjetas (Cards)
const CardCarousel = ({
  images,
  isDark,
}: {
  images: { src: string | null; label: string }[];
  isDark: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '200px',
        backgroundColor: isDark ? '#232f3e' : '#f8f8f8',
        overflow: 'hidden',
        borderBottom: `1px solid ${isDark ? '#414d5c' : '#eaeded'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Imagen o Placeholder */}
      {currentImage.src ? (
        <img
          key={currentIndex}
          src={currentImage.src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            animation: 'fadeIn 0.5s',
          }}
          alt={currentImage.label}
        />
      ) : (
        <SpaceBetween
          key={currentIndex}
          size="xs"
          direction="vertical"
          alignItems="center"
        >
          <Icon
            name={'camera' as any}
            size="large"
            variant={isDark ? 'subtle' : 'normal'}
          />
          <span
            style={{
              fontSize: '13px',
              color: isDark ? '#687078' : '#879596',
              animation: 'fadeIn 0.5s',
            }}
          >
            Añadir Foto ({currentImage.label})
          </span>
        </SpaceBetween>
      )}

      {/* Etiqueta superior izquierda (Físico / Protegido) */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0,0,0,0.65)',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 'bold',
          letterSpacing: '0.5px',
          backdropFilter: 'blur(2px)',
        }}
      >
        {currentImage.label}
      </div>

      {/* Controles de Navegación del Mini-Carrusel */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          display: 'flex',
          gap: '4px',
          backgroundColor: isDark
            ? 'rgba(22, 25, 31, 0.8)'
            : 'rgba(255, 255, 255, 0.9)',
          padding: '4px 8px',
          borderRadius: '16px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
        }}
      >
        <button
          onClick={prevSlide}
          style={{
            background: 'transparent',
            border: 'none',
            color: isDark ? '#fff' : '#16191f',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
          }}
        >
          <Icon name={'angle-left' as any} size="small" variant="normal" />
        </button>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#16191f',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {currentIndex + 1}/{images.length}
        </span>
        <button
          onClick={nextSlide}
          style={{
            background: 'transparent',
            border: 'none',
            color: isDark ? '#fff' : '#16191f',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
          }}
        >
          <Icon name={'angle-right' as any} size="small" variant="normal" />
        </button>
      </div>
    </div>
  );
};

export default function Mondini2Details() {
  const context = useContext(AppContent);
  if (!context) return null;
  const { isDark } = context;

  const [activeSection, setActiveSection] = useState('intro');

  const colors = {
    bgPage: isDark ? '#0f1b2a' : '#ffffff',
    bgHeader: '#16191f',
    textMain: isDark ? '#fbfbfb' : '#16191f',
    textSecondary: isDark ? '#aab7b8' : '#545b64',
    border: isDark ? '#414d5c' : '#eaeded',
    activeLink: '#0972d3',
  };

  useEffect(() => {
    // Para la animación de FadeIn de las imágenes del carrusel
    const style = document.createElement('style');
    style.innerHTML = `@keyframes fadeIn { from { opacity: 0.4; } to { opacity: 1; } }`;
    document.head.appendChild(style);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      let currentSection = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = section.id;
        }
      }
      setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.head.removeChild(style);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 180;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const renderCards = (data: any[]) => (
    <Cards
      cardsPerRow={[
        { cards: 1 },
        { minWidth: 600, cards: 2 },
        { minWidth: 900, cards: 3 },
      ]}
      cardDefinition={{
        header: (item) => (
          <div style={{ fontSize: '16px', fontWeight: '800' }}>{item.tech}</div>
        ),
        sections: [
          {
            id: 'carousel',
            content: (item) => (
              <CardCarousel images={item.images} isDark={isDark} />
            ),
          },
          {
            id: 'desc',
            content: (item) => (
              <span
                style={{
                  fontSize: '14px',
                  lineHeight: '1.4',
                  display: 'block',
                  marginTop: '4px',
                }}
              >
                {item.desc}
              </span>
            ),
          },
          {
            id: 'raw',
            content: (item) => (
              <span
                style={{
                  fontSize: '12px',
                  color: '#879596',
                  fontFamily: 'monospace',
                }}
              >
                Físico: {item.raw}
              </span>
            ),
          },
        ],
      }}
      items={data}
    />
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bgPage,
        color: colors.textMain,
        fontFamily:
          '"Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif',
      }}
    >
      {/* 1. TOP NAVIGATION */}
      <div style={{ position: 'sticky', top: 0, zIndex: 1002, width: '100%' }}>
        <TopNavigation
          identity={{ href: '/cleaning-plan', title: 'Atrás: Menú Principal' }}
          utilities={[]}
        />
      </div>

      {/* 2. HEADER */}
      <div style={{ backgroundColor: colors.bgHeader, width: '100%' }}>
        <div
          style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}
        >
          <div style={{ paddingTop: '20px' }}>
            <Flashbar
              items={[
                {
                  type: 'warning',
                  dismissible: true,
                  content: (
                    <Box fontSize="body-s">
                      <strong>Normativa LOTO:</strong> Desconecte la energía
                      eléctrica general de la Mondini 2 antes de iniciar lavado.
                    </Box>
                  ),
                  id: 'msg_loto',
                },
              ]}
            />
          </div>

          <div style={{ padding: '30px 0 50px 0', color: '#ffffff' }}>
            <nav
              aria-label="Breadcrumb"
              style={{ marginBottom: '16px', fontSize: '14px' }}
            >
              <span style={{ color: '#879596' }}>Plan de Limpieza</span>{' '}
              <span style={{ margin: '0 8px', color: '#879596' }}>/</span>{' '}
              <span style={{ color: '#fbfbfb' }}>Línea Mondini 2</span>
            </nav>

            <Grid
              gridDefinition={[
                { colspan: { default: 12, s: 8 } },
                { colspan: { default: 12, s: 4 } },
              ]}
            >
              <div>
                <h1
                  style={{
                    fontSize: '40px',
                    fontWeight: '900',
                    margin: '0 0 16px 0',
                    color: '#ffffff',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Inventario de Protección: Mondini 2
                </h1>
                <p
                  style={{
                    fontSize: '18px',
                    lineHeight: '28px',
                    color: '#d1d5db',
                    maxWidth: '800px',
                    marginBottom: '24px',
                  }}
                >
                  Catálogo visual detallado. Compare el estado físico de cada
                  componente con su correcto aislamiento antes de inyectar agua.
                </p>
              </div>
              <Box float="right">
                <Button variant="primary">Descargar PDF de Línea 2</Button>
              </Box>
            </Grid>
          </div>
        </div>
      </div>

      {/* 3. CONTENIDO PRINCIPAL */}
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '60px 40px',
          color: colors.textMain,
        }}
      >
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 9, m: 10 } },
            { colspan: { default: 12, s: 3, m: 2 } },
          ]}
        >
          {/* --- COLUMNA IZQUIERDA (CONTENIDO) --- */}
          <div style={{ paddingRight: '40px' }}>
            {/* INTRODUCCIÓN */}
            <div id="intro" style={{ marginBottom: '80px' }}>
              <SectionTitle
                title="Propósito de Intervención"
                subtitle="Minimización de riesgos operativos y eléctricos."
                isDark={isDark}
              />
              <div
                style={{
                  fontSize: '18px',
                  lineHeight: '1.6',
                  color: colors.textMain,
                }}
              >
                <p>
                  El saneamiento es un proceso agresivo para la instrumentación.
                  La correcta aplicación de bolsas, cinchos y lonas dictadas en
                  este catálogo asegura que el lavado no genere micro-cortos,
                  descalibración de sensores o paros en el momento de arrancar
                  la producción.
                </p>
                <p style={{ color: colors.textSecondary }}>
                  Utilice los <strong>carruseles dentro de cada tarjeta</strong>{' '}
                  para visualizar el componente desnudo y cómo debe lucir una
                  vez aplicado el aislamiento. A continuación, se presenta la
                  tabla resumen de todos los elementos a proteger en la Mondini
                  2.
                </p>
              </div>
            </div>

            {/* TABLA RESUMEN DIVIDIDA */}
            <div id="tabla" style={{ marginBottom: '100px' }}>
              <SectionTitle
                title="Inventario Completo"
                subtitle="Checklist tabular de componentes divididos por sección operativa."
                isDark={isDark}
              />
              <SpaceBetween size="xl">
                {/* TABLA SECCIÓN 1 */}
                <Container
                  header={
                    <Header variant="h2">
                      Sección 1: Entrada y Dosificación
                    </Header>
                  }
                >
                  <Table
                    variant="embedded"
                    columnDefinitions={[
                      {
                        id: 'tech',
                        header: 'Componente Técnico',
                        cell: (e) => e.tech,
                      },
                      {
                        id: 'raw',
                        header: 'Nombre Físico/Planta',
                        cell: (e) => (
                          <span style={{ color: '#879596' }}>{e.raw}</span>
                        ),
                      },
                      {
                        id: 'desc',
                        header: 'Instrucción de Aislamiento',
                        cell: (e) => e.desc,
                      },
                    ]}
                    items={m2Sec1Data}
                    stripedRows
                  />
                </Container>

                {/* TABLA SECCIÓN 2 */}
                <Container
                  header={
                    <Header variant="h2">Sección 2: Sellado y Salida</Header>
                  }
                >
                  <Table
                    variant="embedded"
                    columnDefinitions={[
                      {
                        id: 'tech',
                        header: 'Componente Técnico',
                        cell: (e) => e.tech,
                      },
                      {
                        id: 'raw',
                        header: 'Nombre Físico/Planta',
                        cell: (e) => (
                          <span style={{ color: '#879596' }}>{e.raw}</span>
                        ),
                      },
                      {
                        id: 'desc',
                        header: 'Instrucción de Aislamiento',
                        cell: (e) => e.desc,
                      },
                    ]}
                    items={m2Sec2Data}
                    stripedRows
                  />
                </Container>
              </SpaceBetween>
            </div>

            {/* SECCIÓN 1: MONDINI 2 */}
            <div id="sec1" style={{ marginBottom: '100px' }}>
              <SectionTitle
                title="Mondini 2 - Sección 1"
                subtitle="Componentes de Entrada y Dosificación de Jarabe."
                isDark={isDark}
              />
              {renderCards(m2Sec1Data)}
            </div>

            {/* SECCIÓN 2: MONDINI 2 */}
            <div id="sec2" style={{ marginBottom: '100px' }}>
              <SectionTitle
                title="Mondini 2 - Sección 2"
                subtitle="Componentes de Zona de Sellado y Salida."
                isDark={isDark}
              />
              {renderCards(m2Sec2Data)}
            </div>
          </div>

          {/* --- COLUMNA DERECHA (STICKY NAV) --- */}
          <div
            style={{ height: '100%', borderLeft: `1px solid ${colors.border}` }}
          >
            <div
              style={{ position: 'sticky', top: '120px', paddingLeft: '20px' }}
            >
              <SpaceBetween size="l">
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      marginBottom: '10px',
                      color: colors.textMain,
                    }}
                  >
                    Navegación
                  </h3>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      borderLeft: `2px solid ${colors.border}`,
                    }}
                  >
                    {SECTIONS.map((section) => (
                      <li key={section.id} style={{ margin: 0 }}>
                        <a
                          href={`#${section.id}`}
                          onClick={(e) => scrollToSection(e, section.id)}
                          style={{
                            display: 'block',
                            padding: '6px 16px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            color:
                              activeSection === section.id
                                ? colors.activeLink
                                : colors.textSecondary,
                            fontWeight:
                              activeSection === section.id ? '700' : '400',
                            borderLeft:
                              activeSection === section.id
                                ? `2px solid ${colors.activeLink}`
                                : '2px solid transparent',
                            marginLeft: '-2px',
                            transition: 'all 0.1s',
                          }}
                        >
                          {section.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{ height: '1px', backgroundColor: colors.border }}
                ></div>

                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      marginBottom: '10px',
                      color: colors.textMain,
                    }}
                  >
                    ¿Reportar falla?
                  </h3>
                  <Button iconName={'status-warning' as any}>
                    Levantar Ticket
                  </Button>
                </div>
              </SpaceBetween>
            </div>
          </div>
        </Grid>
      </div>
    </div>
  );
}
