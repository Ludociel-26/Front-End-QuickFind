import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { AppContent } from '@/context/AppContext';

// FIX: Se eliminó 'Header' porque no se estaba utilizando
import {
  TopNavigation,
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
// IMPORTACIÓN DE IMÁGENES - MONDINI 6
// Descomenta estas líneas y agrega tus rutas.
// ==========================================

// --- SECCIÓN 1 ---
// import imgMedidorAire1_Fisico from '@/assets/...';
// import imgMedidorAire1_Protegido from '@/assets/...';
// import imgChumaseras2_Fisico from '@/assets/...';
// import imgChumaseras2_Protegido from '@/assets/...';
// import imgSensorEntrada_Fisico from '@/assets/...';
// import imgSensorEntrada_Protegido from '@/assets/...';
// import imgBotoneraS1_Fisico from '@/assets/...';
// import imgBotoneraS1_Protegido from '@/assets/...';
// import imgSelectorS1_Fisico from '@/assets/...';
// import imgSelectorS1_Protegido from '@/assets/...';
// import imgMotorS1_Fisico from '@/assets/...';
// import imgMotorS1_Protegido from '@/assets/...';
// import imgBotonParoS1_Fisico from '@/assets/...';
// import imgBotonParoS1_Protegido from '@/assets/...';
// import imgConectoresDebajoJaula_Fisico from '@/assets/...';
// import imgConectoresDebajoJaula_Protegido from '@/assets/...';
// import imgManguerasAzules_Fisico from '@/assets/...';
// import imgManguerasAzules_Protegido from '@/assets/...';
// import imgSensorJaula3_Fisico from '@/assets/...';
// import imgSensorJaula3_Protegido from '@/assets/...';
// import imgManguerasJarabe_Fisico from '@/assets/...';
// import imgManguerasJarabe_Protegido from '@/assets/...';
// import imgTableroJarabe_Fisico from '@/assets/...';
// import imgTableroJarabe_Protegido from '@/assets/...';
// import imgTorretaJarabe_Fisico from '@/assets/...';
// import imgTorretaJarabe_Protegido from '@/assets/...';
// import imgBotoneraJarabe_Fisico from '@/assets/...';
// import imgBotoneraJarabe_Protegido from '@/assets/...';
// import imgCajaElectricaJarabe_Fisico from '@/assets/...';
// import imgCajaElectricaJarabe_Protegido from '@/assets/...';
// import imgMedidorAire2_Fisico from '@/assets/...';
// import imgMedidorAire2_Protegido from '@/assets/...';
// import imgCableadoJarabeDosLados_Fisico from '@/assets/...';
// import imgCableadoJarabeDosLados_Protegido from '@/assets/...';
// import imgMotoresDebajo4_Fisico from '@/assets/...';
// import imgMotoresDebajo4_Protegido from '@/assets/...';

// --- SECCIÓN 2 ---
// import imgMotorBandaDentada_Fisico from '@/assets/...';
// import imgMotorBandaDentada_Protegido from '@/assets/...';
// import imgCajaCableadoMotor_Fisico from '@/assets/...';
// import imgCajaCableadoMotor_Protegido from '@/assets/...';
// import imgBarometroVacio_Fisico from '@/assets/...';
// import imgBarometroVacio_Protegido from '@/assets/...';
// import imgConectoresInfCorrienteVacio_Fisico from '@/assets/...';
// import imgConectoresInfCorrienteVacio_Protegido from '@/assets/...';
// import imgInterlockJaulaEntrada_Fisico from '@/assets/...';
// import imgInterlockJaulaEntrada_Protegido from '@/assets/...';
// import imgSensorMagnetico4_Fisico from '@/assets/...';
// import imgSensorMagnetico4_Protegido from '@/assets/...';
// import imgSensoresEntradaAma2_Fisico from '@/assets/...';
// import imgSensoresEntradaAma2_Protegido from '@/assets/...';
// import imgSensorEntradaArriba_Fisico from '@/assets/...';
// import imgSensorEntradaArriba_Protegido from '@/assets/...';
// import imgSensoresRodillos_Fisico from '@/assets/...';
// import imgSensoresRodillos_Protegido from '@/assets/...';
// import imgBotoneras2Arriba_Fisico from '@/assets/...';
// import imgBotoneras2Arriba_Protegido from '@/assets/...';
// import imgConectorSensorAma_Fisico from '@/assets/...';
// import imgConectorSensorAma_Protegido from '@/assets/...';
// import imgConectoresInfBotoneras_Fisico from '@/assets/...';
// import imgConectoresInfBotoneras_Protegido from '@/assets/...';
// import imgConectoresSensoresMag_Fisico from '@/assets/...';
// import imgConectoresSensoresMag_Protegido from '@/assets/...';
// import imgBotonesLadoArriba_Fisico from '@/assets/...';
// import imgBotonesLadoArriba_Protegido from '@/assets/...';
// import imgSwitchGeneral_Fisico from '@/assets/...';
// import imgSwitchGeneral_Protegido from '@/assets/...';
// import imgTorretaArriba_Fisico from '@/assets/...';
// import imgTorretaArriba_Protegido from '@/assets/...';
// import imgBotonerasBarometrosInf_Fisico from '@/assets/...';
// import imgBotonerasBarometrosInf_Protegido from '@/assets/...';
// import imgTableroGeneralM6_Fisico from '@/assets/...';
// import imgTableroGeneralM6_Protegido from '@/assets/...';
// import imgMangueraPresionRodillo_Fisico from '@/assets/...';
// import imgMangueraPresionRodillo_Protegido from '@/assets/...';
// import imgConectoresSupLuzAire_Fisico from '@/assets/...';
// import imgConectoresSupLuzAire_Protegido from '@/assets/...';

// ==========================================
// DATOS MOCK: MONDINI 6
// ==========================================

const m6Sec1Data = [
  {
    raw: '-Medidor de aire',
    tech: 'Manómetro Neumático (Principal)',
    desc: 'Cubrir carátula para evitar condensación interna.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Chumaseras 2',
    tech: 'Chumaceras Expuestas (2)',
    desc: 'No aplicar chorro directo sobre los sellos.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Sensor de entrada',
    tech: 'Sensor Fotoeléctrico de Entrada',
    desc: 'Aislar cuerpo y conector trasero.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Botonera',
    tech: 'Estación de Botones Principal',
    desc: 'Funda plástica asegurada para cuidar empaques.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Selector',
    tech: 'Selector Rotativo',
    desc: 'Sellar completamente con cincho.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Motor',
    tech: 'Motor de Accionamiento',
    desc: 'Aislar caja de bornes con bolsa plástica gruesa.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Botón de paro',
    tech: 'Paro de Emergencia (E-Stop)',
    desc: 'Riesgo eléctrico. Sellar herméticamente.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Conectores electricos debajo jaula',
    tech: 'Conectores Eléctricos Inferiores',
    desc: 'Aislamiento total en base de jaula.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: 'Mangueras azules de aire',
    tech: 'Líneas Neumáticas (Azules)',
    desc: 'Cuidar racores rápidos de la presión directa.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Sensor de la jaula 3',
    tech: 'Sensores de Enclavamiento (3)',
    desc: 'Uso obligatorio de fundas individuales.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Mangueras de jarabera',
    tech: 'Líneas de Dosificación',
    desc: 'Sellar uniones para evitar filtraciones capilares.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Tablero del jarabe',
    tech: 'Panel de Dosificación',
    desc: 'Lona o bolsa extensa sellando la puerta entera.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Torreta de tablero jarabe',
    tech: 'Baliza Luminosa (Jarabera)',
    desc: 'Cubrir de base a cúpula con bolsa plástica.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Botonera tablero jarabera',
    tech: 'Botonera de Dosificación',
    desc: 'Evitar ingreso de agua en selectores.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Caja electrica del tablero',
    tech: 'Gabinete de Distribución',
    desc: 'Verificar hermeticidad de bordes.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Medidor de aire',
    tech: 'Manómetro Secundario',
    desc: 'Cubrir indicador de presión de aire.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '-Cableado de caja jarabera dos lados',
    tech: 'Canalización Bilateral (Jarabera)',
    desc: 'Sellar entrada de arneses en ambos costados.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- 4 Motores debajo tablero',
    tech: 'Motores Inferiores Jarabera (4)',
    desc: 'Aislamiento en bolsa a los 4 equipos inferiores.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
];

const m6Sec2Data = [
  {
    raw: '-Motor de banda dentada',
    tech: 'Servomotor de Banda Dentada',
    desc: 'Proteger encóder y terminales expuestas.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- Caja de Cableado motor',
    tech: 'Caja de Conexiones del Motor',
    desc: 'Sellar tapa de empalmes eléctricos.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- Barómetro de presión vacío',
    tech: 'Vacuómetro (Medidor de Vacío)',
    desc: 'Aislar carátula de cristal y tubería base.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- Conectores inferiores corriente/vacio',
    tech: 'Múltiple de Suministro Inferior',
    desc: 'Riesgo alto. Lona gruesa y sellado de nudo.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- interlook de jaula entrada',
    tech: 'Interlock de Seguridad (Entrada)',
    desc: 'Prevenir entrada de agua en ranura de pestillo.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- senor magnetico de jaula 4',
    tech: 'Sensores Magnéticos de Jaula (4)',
    desc: 'Bolsas pequeñas individuales para los 4 sensores.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- Sensores de entrada amarillos 2',
    tech: 'Sensores Fotoeléctricos Amarillos (2)',
    desc: 'Cuidar lente para evitar opacidad.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- sensor de entraba arriba',
    tech: 'Sensor Superior de Entrada',
    desc: 'Evitar chorros de agua ascendentes directos.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- Sensores de rodillos',
    tech: 'Sensores Inductivos (Rodillos)',
    desc: 'Sellar cuerpo y base del cable en arnés.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- botoneras 2 arriba de jaula',
    tech: 'Estaciones de Botones Aéreas (2)',
    desc: 'Aislamiento total de botoneras superiores.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- Conector sensor inf/arriba amarillo',
    tech: 'Conector de Sensor Amarillo (Extremos)',
    desc: 'Aislar terminal del cable amariilo.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- Conectores inf Cableado botoneras',
    tech: 'Cajas de Empalme Inferiores',
    desc: 'Cerrar puntos de unión eléctrica.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- Conectores sensores y seguros mag.',
    tech: 'Arneses de Sensores y Magnéticos',
    desc: 'Evitar filtración capilar desde el cable al sensor.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- Botones al lado botoneras arriba',
    tech: 'Botoneras Auxiliares Superiores',
    desc: 'Protección para botonera lateral aérea.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- switch genral',
    tech: 'Interruptor General (Main Switch)',
    desc: 'Elemento Crítico LOTO. Aislar panel de switch completo.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- torreta de arriba',
    tech: 'Baliza Luminosa Principal (Superior)',
    desc: 'No lanzar agua hacia la cúpula, aislar base.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- botoneras y Barómetros inf.',
    tech: 'Interfaz y Neumática de Tablero Inferior',
    desc: 'Cobertura extensa que abarque pantalla y relojes.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- tablero general de mundini 6',
    tech: 'Gabinete de Control Principal (Mondini 6)',
    desc: 'Cobertura con lona plástica extensa a la medida.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- manguera presión de aire rodillo',
    tech: 'Línea Neumática de Rodillo',
    desc: 'Asegurar racor rápido neumático.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
  {
    raw: '- Conectores superiores luz y aire',
    tech: 'Acometidas Superiores (Eléctrica/Neumática)',
    desc: 'Bajar empaques en conectores suspendidos.',
    images: [
      { src: null, label: 'Físico' },
      { src: null, label: 'Aislamiento' },
    ],
  },
];

const allComponents = [
  ...m6Sec1Data.map((item) => ({ section: 'Sección 1', ...item })),
  ...m6Sec2Data.map((item) => ({ section: 'Sección 2', ...item })),
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

const CardCarousel = ({
  images,
  isDark,
}: {
  images: { src: string | null; label: string }[];
  isDark: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

export default function Mondini6Details() {
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
                      <strong>Normativa LOTO Crítica:</strong> Desconecte el
                      Interruptor General (Main Switch) de la Mondini 6 previo
                      al saneamiento.
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
              <span style={{ color: '#fbfbfb' }}>Línea Mondini 6</span>
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
                  Inventario de Protección: Mondini 6
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
                  Catálogo avanzado para la protección electromecánica de la
                  empacadora de alta capacidad Mondini 6.
                </p>
              </div>
              <Box float="right">
                <Button variant="primary">Descargar PDF de Línea 6</Button>
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
                subtitle="Aislamiento para equipos de alta capacidad de envasado."
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
                  El propósito de estas directrices preventivas es erradicar
                  completamente el riesgo de daño eléctrico o averías mecánicas
                  durante el proceso de lavado y sanitización. Asegurando cada
                  uno de los elementos mostrados con bolsas impermeables, lonas
                  y empaques, garantizamos la integridad del equipo y del
                  operador.
                </p>
                <p style={{ color: colors.textSecondary }}>
                  La <strong>Mondini 6</strong> es una línea de mayor capacidad
                  de producción. Su arquitectura incorpora instrumentos
                  adicionales como medidores de vacío, controles perimetrales
                  aéreos y un mayor volumen de sensores magnéticos y
                  fotoeléctricos que deben aislarse estrictamente.
                </p>
              </div>
            </div>

            {/* TABLA RESUMEN COMPLETA */}
            <div id="tabla" style={{ marginBottom: '100px' }}>
              <SectionTitle
                title="Inventario Completo"
                subtitle="Checklist tabular de componentes (Mondini 6)."
                isDark={isDark}
              />
              <Container>
                <Table
                  variant="embedded"
                  columnDefinitions={[
                    {
                      id: 'section',
                      header: 'Ubicación',
                      cell: (e) => <strong>{e.section}</strong>,
                      width: 150,
                    },
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
                  items={allComponents}
                  stripedRows
                />
              </Container>
            </div>

            {/* SECCIÓN 1: MONDINI 6 */}
            <div id="sec1" style={{ marginBottom: '100px' }}>
              <SectionTitle
                title="Mondini 6 - Sección 1"
                subtitle="Zona de Entrada, Motores Inferiores y Dosificación."
                isDark={isDark}
              />
              {renderCards(m6Sec1Data)}
            </div>

            {/* SECCIÓN 2: MONDINI 6 */}
            <div id="sec2" style={{ marginBottom: '100px' }}>
              <SectionTitle
                title="Mondini 6 - Sección 2"
                subtitle="Sellado, Sensores Magnéticos, Interfaz Superior y Tablero General."
                isDark={isDark}
              />
              {renderCards(m6Sec2Data)}
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
