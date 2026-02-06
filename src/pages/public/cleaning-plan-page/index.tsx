import * as React from 'react';
import { useContext, useState, useEffect } from 'react';
import { AppContent } from '@/context/AppContext';

import {
  Button,
  Container,
  Header,
  SpaceBetween,
  Link,
  Box,
  Grid,
  Icon,
  TopNavigation,
  Flashbar,
  Table,
  Badge,
} from '@cloudscape-design/components';

// --- DATOS MOCK ---

// Datos para Tablas
const motorsData = [
  {
    location: 'Línea de Envasado A',
    type: 'Motor Trifásico 5HP',
    protection: 'Bolsa plástica calibre 6 + Cinta industrial',
  },
  {
    location: 'Banda Transportadora 2',
    type: 'Servomotor',
    protection: 'Película estirable (Playo) 3 capas',
  },
  {
    location: 'Mezcladora Principal',
    type: 'Motor 10HP',
    protection: 'Cubierta de lona impermeable a medida',
  },
];

const sensorsData = [
  {
    location: 'Tolva de Entrada',
    type: 'Sensor de Proximidad',
    protection: 'Cinta aislante + Capuchón plástico',
  },
  {
    location: 'Salida de Producto',
    type: 'Fotocelda',
    protection: 'Limpieza en seco únicamente (Aire comprimido)',
  },
  {
    location: 'Tanque de Agua',
    type: 'Sensor de Nivel',
    protection: 'Sellado hermético con silicón en juntas',
  },
];

const tvsData = [
  {
    location: 'Sala de Control',
    type: 'Pantalla 50"',
    protection: 'Funda acolchada anti-polvo',
  },
  {
    location: 'Pasillo de Producción',
    type: 'Monitor HMI',
    protection: 'Gabinete IP65 cerrado durante limpieza',
  },
];

// Datos para Carruseles
const motorImages = [
  {
    src: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=1000&auto=format&fit=crop',
    title: 'Protección de Motores',
    desc: 'Cubrir totalmente la carcasa y ventilas antes de aplicar agua.',
  },
  {
    src: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=1000&auto=format&fit=crop',
    title: 'Sellado de Cables',
    desc: 'Asegurar que las conexiones eléctricas no queden expuestas.',
  },
  {
    src: 'https://plus.unsplash.com/premium_photo-1661963212517-830bbb12e31e?q=80&w=1000&auto=format&fit=crop',
    title: 'Inspección Final',
    desc: 'Verificar sellado antes de iniciar el lavado a presión.',
  },
];

const sensorImages = [
  {
    src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
    title: 'Sensores Ópticos',
    desc: 'Limpiar lentes con paño de microfibra, no usar chorro directo.',
  },
  {
    src: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1000&auto=format&fit=crop',
    title: 'Cableado Delicado',
    desc: 'Organizar y proteger cables sueltos con cinchos.',
  },
];

const tvImages = [
  {
    src: 'https://images.unsplash.com/photo-1593784697956-141c03410c58?q=80&w=1000&auto=format&fit=crop',
    title: 'Monitores HMI',
    desc: 'Utilizar cubiertas rígidas si están expuestos a salpicaduras.',
  },
  {
    src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    title: 'Pantallas Informativas',
    desc: 'Desconectar energía antes de limpiar alrededores.',
  },
];

const SECTIONS = [
  { id: 'overview', text: 'Overview' },
  { id: 'motors', text: 'Motores' },
  { id: 'sensors', text: 'Sensores' },
  { id: 'televisions', text: 'Televisores' },
];

// --- COMPONENTES UI PERSONALIZADOS ---

// 1. CARRUSEL ESTILO "WRITER" (Actualizado para visibilidad)
const CustomCarousel = ({
  images,
  isDark,
}: {
  images: any[];
  isDark: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  // Estilos dinámicos para la barra de control según el tema
  const controlBarStyle = {
    backgroundColor: isDark
      ? 'rgba(22, 25, 31, 0.9)'
      : 'rgba(255, 255, 255, 0.95)',
    color: isDark ? '#ffffff' : '#16191f',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        marginBottom: '24px',
      }}
    >
      {/* Imagen de Fondo */}
      {images.map((img, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: index === currentIndex ? 1 : 0,
            transition: 'opacity 0.8s ease-in-out',
            zIndex: 1,
          }}
        >
          <img
            src={img.src}
            alt={img.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Gradiente Overlay para texto */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
            }}
          ></div>
        </div>
      ))}

      {/* Contenido de Texto (Izquierda Abajo) */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          zIndex: 10,
          color: '#fff',
          maxWidth: '500px',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(4px)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'monospace',
            display: 'inline-block',
            marginBottom: '16px',
          }}
        >
          PROCEDIMIENTO {currentIndex + 1}
        </div>

        <h2
          style={{
            fontSize: '48px',
            fontWeight: '900',
            margin: '0 0 16px 0',
            textTransform: 'uppercase',
            fontFamily: 'Impact, sans-serif',
            lineHeight: '0.9',
          }}
        >
          {images[currentIndex].title}
        </h2>

        <p
          style={{
            fontSize: '18px',
            lineHeight: '1.4',
            margin: '0 0 24px 0',
            fontWeight: '500',
          }}
        >
          {images[currentIndex].desc}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Ver detalle <Icon name="arrow-right" variant="inverted" />
        </div>
      </div>

      {/* Controles de Navegación (Abajo Centro/Derecha) - ACTUALIZADO */}
      <div
        style={{
          position: 'absolute',
          bottom: '30px',
          right: '40px',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          borderRadius: '30px',
          ...controlBarStyle, // Aplica estilos dinámicos
        }}
      >
        {/* Usamos variant="normal" para que Cloudscape use el color de texto heredado del contenedor */}
        <button
          onClick={prevSlide}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            display: 'flex',
          }}
        >
          <Icon name="angle-left" variant="normal" />
        </button>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={nextSlide}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            display: 'flex',
          }}
        >
          <Icon name="angle-right" variant="normal" />
        </button>
      </div>
    </div>
  );
};

// 2. CONTENEDOR DE OBSERVACIONES (Elegante)
const ObservationContainer = ({
  title,
  content,
  isDark,
}: {
  title: string;
  content: string;
  isDark: boolean;
}) => (
  <div
    style={{
      borderLeft: `4px solid ${isDark ? '#44b9d6' : '#0073bb'}`,
      backgroundColor: isDark ? 'rgba(68, 185, 214, 0.1)' : '#f1faff',
      padding: '20px',
      borderRadius: '0 8px 8px 0',
      marginTop: '20px',
    }}
  >
    <h4
      style={{
        margin: '0 0 8px 0',
        color: isDark ? '#fff' : '#16191f',
        fontSize: '16px',
        fontWeight: 'bold',
      }}
    >
      <Icon name="status-info" variant={isDark ? 'inverted' : 'normal'} />{' '}
      {title}
    </h4>
    <p
      style={{
        margin: 0,
        color: isDark ? '#d1d5db' : '#545b64',
        fontSize: '14px',
        lineHeight: '1.5',
      }}
    >
      {content}
    </p>
  </div>
);

export default function CleaningPlanPage() {
  const context = useContext(AppContent);
  if (!context) return null;
  const { isDark } = context;

  const [activeSection, setActiveSection] = React.useState('overview');

  // Paleta de colores dinámica
  const colors = {
    bgPage: isDark ? '#0f1b2a' : '#ffffff',
    bgHeader: '#16191f',
    textMain: isDark ? '#fbfbfb' : '#16191f',
    textSecondary: isDark ? '#aab7b8' : '#545b64',
    border: isDark ? '#414d5c' : '#eaeded',
    activeLink: '#0972d3',
  };

  React.useEffect(() => {
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 180;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bgPage,
        color: colors.textMain,
        fontFamily:
          '"Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* 1. TOP NAVIGATION */}
      <div style={{ position: 'sticky', top: 0, zIndex: 1002, width: '100%' }}>
        <TopNavigation
          identity={{
            href: '#',
            title: 'Sistema de Mantenimiento',
            logo: {
              src: 'https://d1.awsstatic.com/webteam/nav/global-nav-logos/aws-logo-white.png', // O tu logo
              alt: 'Logo',
            },
          }}
          utilities={[]}
        />
      </div>

      {/* 2. HEADER: PLAN DE LIMPIEZA */}
      <div style={{ backgroundColor: colors.bgHeader, width: '100%' }}>
        <div
          style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 40px' }}
        >
          <div style={{ paddingTop: '20px' }}>
            <Flashbar
              items={[
                {
                  type: 'warning',
                  dismissible: true,
                  content: (
                    <Box fontSize="body-s">
                      <strong>Precaución:</strong> Asegúrese de desconectar la
                      energía eléctrica (Lockout/Tagout) antes de iniciar
                      cualquier procedimiento de limpieza con agua.
                    </Box>
                  ),
                  id: 'message_safety',
                },
              ]}
            />
          </div>

          <div style={{ padding: '20px 0 40px 0', color: '#ffffff' }}>
            <nav
              aria-label="Breadcrumb"
              style={{ marginBottom: '10px', fontSize: '14px' }}
            >
              <span style={{ color: '#879596' }}>Mantenimiento</span>
              <span style={{ margin: '0 8px', color: '#879596' }}>/</span>
              <span style={{ color: '#fbfbfb' }}>Protocolos de Limpieza</span>
            </nav>

            <Grid
              gridDefinition={[
                { colspan: { default: 12, s: 8 } },
                { colspan: { default: 12, s: 4 } },
              ]}
            >
              <div>
                {/* TÍTULO ACTUALIZADO */}
                <h1
                  style={{
                    fontSize: '32px',
                    fontWeight: '800',
                    margin: '0 0 10px 0',
                    color: '#ffffff',
                  }}
                >
                  Plan de Limpieza: Puntos Críticos
                </h1>
                <p
                  style={{
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#d1d5db',
                    maxWidth: '700px',
                    marginBottom: '20px',
                  }}
                >
                  Guía estandarizada para el cubrimiento y protección de
                  componentes sensibles (motores, sensores, pantallas) durante
                  las actividades de saneamiento para prevenir fallas por
                  humedad.
                </p>

                <div style={{ fontSize: '14px', color: '#d1d5db' }}>
                  Responsable:{' '}
                  <span style={{ color: '#44b9d6', fontWeight: 'bold' }}>
                    Equipo de Mantenimiento
                  </span>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#d1d5db',
                    marginTop: '4px',
                  }}
                >
                  Tags: IP65 | Seguridad | Mantenimiento Preventivo
                </div>
              </div>

              <Box float="right">
                <div style={{ width: '100%', maxWidth: '300px' }}>
                  <SpaceBetween size="s" direction="vertical">
                    <Button variant="primary" fullWidth>
                      Descargar Checklist PDF
                    </Button>
                    <button
                      style={{
                        width: '100%',
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        border: '1px solid #ffffff',
                        borderRadius: '20px',
                        color: '#ffffff',
                        fontWeight: '700',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Reportar Incidencia
                    </button>
                  </SpaceBetween>
                </div>
              </Box>
            </Grid>
          </div>
        </div>
      </div>

      {/* 3. CONTENIDO PRINCIPAL */}
      <div
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '40px',
          color: colors.textMain,
        }}
      >
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 8, m: 9 } },
            { colspan: { default: 12, s: 4, m: 3 } },
          ]}
        >
          {/* --- COLUMNA IZQUIERDA (CONTENIDO) --- */}
          <div>
            <SpaceBetween size="xxl">
              {/* SECCIÓN 1: OVERVIEW */}
              <div id="overview">
                <Header variant="h2">Overview</Header>
                <div
                  style={{
                    marginTop: '10px',
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: colors.textMain,
                  }}
                >
                  <p>
                    La limpieza profunda de los equipos industriales conlleva el
                    uso de agua a presión y químicos desengrasantes. Sin
                    embargo, la principal causa de paros no programados
                    post-limpieza es la entrada de agua en componentes
                    electrónicos.
                  </p>
                  <p>
                    Este plan detalla{' '}
                    <strong>
                      la forma correcta de cubrir todos los componentes
                      eléctricos
                    </strong>{' '}
                    (sensores, televisores, motores, gabinetes) evitando que se
                    mojen. El objetivo es garantizar la integridad del equipo y
                    la seguridad del personal, asegurando un arranque vertical
                    sin fallas después del saneamiento.
                  </p>
                </div>
              </div>

              {/* SECCIÓN 2: MOTORES */}
              <div id="motors">
                <Header variant="h2">Motores</Header>
                <p
                  style={{ marginBottom: '16px', color: colors.textSecondary }}
                >
                  Los motores eléctricos deben ser aislados completamente,
                  protegiendo especialmente la caja de conexiones y las ventilas
                  de enfriamiento.
                </p>

                {/* Tabla de Ubicaciones */}
                <div style={{ marginBottom: '24px' }}>
                  <Container
                    header={
                      <Header variant="h3">
                        Ubicación y Protección Requerida
                      </Header>
                    }
                  >
                    <Table
                      variant="embedded"
                      columnDefinitions={[
                        {
                          id: 'location',
                          header: 'Ubicación',
                          cell: (e) => e.location,
                          width: 200,
                          isRowHeader: true,
                        },
                        {
                          id: 'type',
                          header: 'Tipo de Equipo',
                          cell: (e) => e.type,
                        },
                        {
                          id: 'protection',
                          header: 'Método de Protección',
                          cell: (e) => e.protection,
                        },
                      ]}
                      items={motorsData}
                    />
                  </Container>
                </div>

                {/* Carrusel Visual */}
                <CustomCarousel images={motorImages} isDark={isDark} />

                {/* Info Box */}
                <ObservationContainer
                  title="Procedimiento Crítico - Motores"
                  content="Nunca utilice bolsas rotas. Asegúrese de hacer un 'nudo ciego' en la parte inferior del motor para evitar que el agua escurra hacia adentro. Si el motor tiene ventilador externo, cubra las rejillas con doble capa de plástico."
                  isDark={isDark}
                />
              </div>

              {/* SECCIÓN 3: SENSORES */}
              <div id="sensors">
                <Header variant="h2">Sensores</Header>
                <p
                  style={{ marginBottom: '16px', color: colors.textSecondary }}
                >
                  Los sensores ópticos, inductivos y capacitivos son
                  extremadamente sensibles. Un chorro directo puede
                  desalinearlos o dañar sus sellos internos.
                </p>

                {/* Tabla Sensores */}
                <div style={{ marginBottom: '24px' }}>
                  <Container
                    header={
                      <Header variant="h3">Inventario de Sensores</Header>
                    }
                  >
                    <Table
                      variant="embedded"
                      columnDefinitions={[
                        {
                          id: 'location',
                          header: 'Ubicación',
                          cell: (e) => e.location,
                          width: 200,
                        },
                        { id: 'type', header: 'Tipo', cell: (e) => e.type },
                        {
                          id: 'protection',
                          header: 'Cuidados Específicos',
                          cell: (e) => e.protection,
                        },
                      ]}
                      items={sensorsData}
                    />
                  </Container>
                </div>

                {/* Carrusel Sensores */}
                <CustomCarousel images={sensorImages} isDark={isDark} />

                {/* Info Box */}
                <ObservationContainer
                  title="Nota Técnica - Sensores"
                  content="No utilice cinta adhesiva directamente sobre el lente del sensor, ya que el residuo de pegamento afectará la lectura. Utilice siempre un capuchón o una bolsa pequeña fijada al cuerpo del sensor, no al lente."
                  isDark={isDark}
                />
              </div>

              {/* SECCIÓN 4: TELEVISORES / HMI */}
              <div id="televisions">
                <Header variant="h2">Televisores y HMI</Header>
                <p
                  style={{ marginBottom: '16px', color: colors.textSecondary }}
                >
                  Las pantallas y monitores de visualización son los componentes
                  más costosos y frágiles. Requieren protección rígida.
                </p>

                {/* Tabla TVs */}
                <div style={{ marginBottom: '24px' }}>
                  <Container
                    header={<Header variant="h3">Pantallas y Paneles</Header>}
                  >
                    <Table
                      variant="embedded"
                      columnDefinitions={[
                        {
                          id: 'location',
                          header: 'Área',
                          cell: (e) => e.location,
                          width: 200,
                        },
                        {
                          id: 'type',
                          header: 'Dispositivo',
                          cell: (e) => e.type,
                        },
                        {
                          id: 'protection',
                          header: 'Protección',
                          cell: (e) => e.protection,
                        },
                      ]}
                      items={tvsData}
                    />
                  </Container>
                </div>

                {/* Carrusel TVs */}
                <CustomCarousel images={tvImages} isDark={isDark} />

                {/* Info Box */}
                <ObservationContainer
                  title="Protocolo HMI"
                  content="Verifique que el gabinete esté perfectamente cerrado. Si el sello de goma de la puerta está dañado, no aplique agua en esa zona y reporte inmediatamente a mantenimiento. Use paños anti-estáticos."
                  isDark={isDark}
                />
              </div>
            </SpaceBetween>
          </div>

          {/* --- COLUMNA DERECHA (STICKY NAV) --- */}
          <div
            style={{ height: '100%', borderLeft: `0px solid ${colors.border}` }}
          >
            <div
              style={{ position: 'sticky', top: '20px', paddingLeft: '0px' }}
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
                    On this page
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
                    ¿Fue útil este plan?
                  </h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button iconName="thumbs-up">Sí</Button>
                    <Button iconName="thumbs-down">No</Button>
                  </div>
                </div>
              </SpaceBetween>
            </div>
          </div>
        </Grid>
      </div>
    </div>
  );
}
