import { useContext, useState } from 'react';
import { AppContent } from '@/context/AppContext';

// --- TUS COMPONENTES ---
import Navbar from '@/components/layouts/AppHeader';
import Slider from '@/components/layouts/AppSidebar';
import RouteNavbar from '@/components/layouts/RouteTracker';
import { Footer } from '@/components/layouts/AppFooter';

import {
  Button,
  Container,
  Header,
  SpaceBetween,
  Box,
  Grid,
  Icon,
  Flashbar,
  ColumnLayout,
  Badge,
  Tiles,
  ExpandableSection,
  AppLayout,
} from '@cloudscape-design/components';

// --- DATA ---
const SECTIONS = [
  { id: 'introduction', text: 'Introducción' },
  { id: 'capabilities', text: 'Capacidades' },
  { id: 'inventory-types', text: 'Tipos de Inventario' },
  { id: 'operational-flow', text: 'Flujo Operativo' },
  { id: 'visual-tech', text: 'Tecnología Visual (AI)' },
  { id: 'faq', text: 'Preguntas Frecuentes' },
];

// --- COMPONENTES UI INTERNOS ---
const FeatureCard = ({ icon, title, text, isDark }: any) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '24px',
      backgroundColor: isDark ? '#1d2c3f' : '#ffffff',
      border: `1px solid ${isDark ? '#414d5c' : '#eaeded'}`,
      borderRadius: '12px',
      boxShadow: isDark ? 'none' : '0 2px 5px rgba(0,0,0,0.05)',
    }}
  >
    <div
      style={{
        width: '48px',
        height: '48px',
        borderRadius: '8px',
        backgroundColor: isDark ? '#0972d3' : '#e1f0fa',
        color: isDark ? '#ffffff' : '#0972d3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
      }}
    >
      {/* FIX: Pasamos el icono como any para que TS no rechace nombres personalizados */}
      <Icon name={icon as any} size="medium" />
    </div>
    <Box fontSize="heading-s" fontWeight="bold" margin={{ bottom: 'xs' }}>
      {title}
    </Box>
    <Box color="text-body-secondary" fontSize="body-s">
      {text}
    </Box>
  </div>
);

const FlowStep = ({ number, title, desc, isLast, isDark }: any) => (
  <div style={{ display: 'flex', minHeight: '120px' }}>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: '20px',
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#0972d3',
          color: 'white',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        {number}
      </div>
      {!isLast && (
        <div
          style={{
            width: '2px',
            flexGrow: 1,
            backgroundColor: isDark ? '#414d5c' : '#d1d5db',
            margin: '5px 0',
          }}
        ></div>
      )}
    </div>
    <div style={{ paddingBottom: '30px' }}>
      <Box fontSize="heading-s" fontWeight="bold">
        {title}
      </Box>
      <Box color="text-body-secondary" margin={{ top: 'xs' }}>
        {desc}
      </Box>
    </div>
  </div>
);

export default function WarehouseServiceView() {
  const context = useContext(AppContent);
  if (!context) return null;
  const { isDark } = context;

  const [navigationOpen, setNavigationOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('introduction');

  // FIX: Parámetro e de tipo any para que no pida la importación de React
  const scrollToAnchor = (id: string, e: any) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 160;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
    setActiveSection(id);
  };

  const colors = {
    bgPage: isDark ? '#0f1b2a' : '#f2f3f3',
    bgHeader: '#0f1b2a',
    textMain: isDark ? '#fbfbfb' : '#16191f',
    textSecondary: isDark ? '#aab7b8' : '#545b64',
    border: isDark ? '#414d5c' : '#eaeded',
    cardBg: isDark ? '#1d2c3f' : '#ffffff',
    primaryBlue: '#0972d3',
    barBg: isDark ? '#1d2c3f' : '#ffffff',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: colors.bgPage,
      }}
    >
      {/* 1. HEADER CONTAINER (Sticky) */}
      <div
        id="sticky-nav-container"
        style={{ position: 'sticky', top: 0, zIndex: 1002, width: '100%' }}
      >
        <Navbar />

        <div
          style={{
            backgroundColor: colors.barBg,
            borderBottom: `1px solid ${colors.border}`,
            padding: '4px 20px',
            display: 'flex',
            alignItems: 'center',
            height: '50px',
          }}
        >
          <div style={{ marginRight: '16px' }}>
            <Button
              variant="icon"
              iconName={navigationOpen ? 'angle-left' : 'menu'}
              onClick={() => setNavigationOpen(!navigationOpen)}
              ariaLabel={navigationOpen ? 'Cerrar menú' : 'Abrir menú'}
            />
          </div>

          <div style={{ flexGrow: 1 }}>
            <RouteNavbar />
          </div>
        </div>
      </div>

      {/* 2. APP LAYOUT */}
      <AppLayout
        headerSelector="#sticky-nav-container"
        disableContentPaddings={true}
        navigationOpen={navigationOpen}
        onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
        navigation={<Slider />}
        tools={
          <div style={{ padding: '20px' }}>
            <Header variant="h3">En esta página</Header>
            <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0 0' }}>
              {SECTIONS.map((section) => (
                <li key={section.id} style={{ marginBottom: '8px' }}>
                  <a
                    href={`#${section.id}`}
                    onClick={(e) => scrollToAnchor(section.id, e)}
                    style={{
                      textDecoration: 'none',
                      display: 'block',
                      fontSize: '14px',
                      color:
                        activeSection === section.id
                          ? colors.primaryBlue
                          : colors.textSecondary,
                      fontWeight: activeSection === section.id ? '700' : '400',
                      borderLeft:
                        activeSection === section.id
                          ? `2px solid ${colors.primaryBlue}`
                          : '2px solid transparent',
                      paddingLeft: '10px',
                      transition: 'all 0.2s',
                    }}
                  >
                    {section.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        }
        content={
          <div style={{ paddingBottom: '0' }}>
            {/* HERO SECTION AZUL */}
            <div
              style={{
                backgroundColor: colors.bgHeader,
                borderBottom: `1px solid ${isDark ? '#414d5c' : '#232f3e'}`,
                padding: '40px 40px 60px 40px',
              }}
            >
              <Flashbar
                items={[
                  {
                    type: 'success',
                    content: 'Inventario sincronizado correctamente.',
                    dismissible: true,
                    id: 'alert-1',
                  } as any,
                ]}
              />

              <div style={{ marginTop: '20px' }}>
                <Box variant="small" margin={{ bottom: 'xs' }}>
                  <span style={{ color: '#879596' }}>Operaciones</span> /{' '}
                  <span style={{ color: '#fbfbfb' }}>Gestión de Almacén</span>
                </Box>
                <Grid
                  gridDefinition={[
                    { colspan: { default: 12, m: 8 } },
                    { colspan: { default: 12, m: 4 } },
                  ]}
                >
                  <div style={{ paddingRight: '40px' }}>
                    <h1
                      style={{
                        fontSize: '32px',
                        fontWeight: '800',
                        color: '#fff',
                        marginBottom: '12px',
                        lineHeight: '1.2',
                      }}
                    >
                      Servicio de Almacén Integral
                    </h1>
                    <p
                      style={{
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: '#d1d5db',
                        marginBottom: '20px',
                      }}
                    >
                      Plataforma unificada para el control total del ciclo de
                      vida de los productos. Garantice la trazabilidad y
                      exactitud de inventario.
                    </p>
                    <SpaceBetween size="m" direction="horizontal">
                      <Button variant="primary">Panel Principal</Button>
                      <Button iconName={'file-open' as any}>Reportes</Button>
                    </SpaceBetween>
                  </div>
                  {/* Tarjeta Flotante */}
                  <div>
                    <div
                      style={{
                        backgroundColor: colors.cardBg,
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: `1px solid ${colors.border}`,
                        color: isDark ? '#fff' : '#16191f',
                      }}
                    >
                      <Box
                        fontSize="heading-s"
                        fontWeight="bold"
                        margin={{ bottom: 'm' }}
                      >
                        Accesos Directos
                      </Box>
                      <SpaceBetween size="s">
                        <Button fullWidth iconName={'search' as any}>
                          Buscador Maestro
                        </Button>
                        <Button fullWidth iconName={'add-plus' as any}>
                          Nueva Recepción
                        </Button>
                      </SpaceBetween>
                      <div
                        style={{
                          marginTop: '16px',
                          paddingTop: '12px',
                          borderTop: `1px solid ${colors.border}`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                        }}
                      >
                        <span style={{ color: '#aab7b8' }}>Estado:</span>
                        <span style={{ color: '#0972d3', fontWeight: 'bold' }}>
                          En línea
                        </span>
                      </div>
                    </div>
                  </div>
                </Grid>
              </div>
            </div>

            {/* SECCIONES DE CONTENIDO */}
            <div style={{ padding: '40px', maxWidth: '100%' }}>
              <SpaceBetween size="xxl">
                <section id="introduction">
                  <Header variant="h2">Introducción al Servicio</Header>
                  <Container>
                    <SpaceBetween size="l">
                      <Box variant="p" fontSize="heading-xs">
                        El Servicio de Almacén OmniPart actúa como el "cerebro
                        logístico", eliminando la incertidumbre sobre
                        materiales.
                      </Box>
                      <ColumnLayout columns={2} variant="text-grid">
                        <div>
                          <Box variant="h3">Fuente Única de Verdad</Box>
                          <Box variant="p" color="text-body-secondary">
                            Centraliza datos de compras y ventas.
                          </Box>
                        </div>
                        <div>
                          <Box variant="h3">Orquestación</Box>
                          <Box variant="p" color="text-body-secondary">
                            Coordina tareas de picking.
                          </Box>
                        </div>
                      </ColumnLayout>
                    </SpaceBetween>
                  </Container>
                </section>

                <section id="capabilities">
                  <Header variant="h2">Capacidades Principales</Header>
                  <Box margin={{ top: 'm' }}>
                    <Grid
                      gridDefinition={[
                        { colspan: 4 },
                        { colspan: 4 },
                        { colspan: 4 },
                      ]}
                    >
                      <FeatureCard
                        isDark={isDark}
                        icon="location"
                        title="Ubicaciones"
                        text="Mapeo digital de pasillos."
                      />
                      <FeatureCard
                        isDark={isDark}
                        icon="settings"
                        title="Reglas de Stock"
                        text="Mínimos y máximos."
                      />
                      <FeatureCard
                        isDark={isDark}
                        icon="calendar"
                        title="Lotes y FEFO"
                        text="Seguimiento de caducidad."
                      />
                    </Grid>
                  </Box>
                </section>

                <section id="inventory-types">
                  <Header variant="h2">Clasificación de Inventarios</Header>
                  <Box margin={{ top: 'm' }}>
                    {/* FIX: Se añade value y onChange, y se asigna un value a cada ítem para que no de error el componente Tiles */}
                    <Tiles
                      value=""
                      onChange={() => {}}
                      items={
                        [
                          {
                            value: 'item-1',
                            label: 'Materia Prima',
                            description: 'Insumos base.',
                            iconName: 'database',
                          },
                          {
                            value: 'item-2',
                            label: 'Producto en Proceso',
                            description: 'En línea.',
                            iconName: 'status-in-progress',
                          },
                          {
                            value: 'item-3',
                            label: 'Producto Terminado',
                            description: 'Venta.',
                            iconName: 'check',
                          },
                          {
                            value: 'item-4',
                            label: 'Refacciones',
                            description: 'Interno.',
                            iconName: 'tools',
                          },
                        ] as any
                      }
                    />
                  </Box>
                </section>

                <section id="operational-flow">
                  <Header variant="h2">Flujo Operativo</Header>
                  <Container>
                    <Box
                      margin={{ top: 'l', bottom: 'l' }}
                      padding={{ left: 'l' }}
                    >
                      <FlowStep
                        number="1"
                        title="Recepción"
                        desc="Validación y escaneo."
                        isDark={isDark}
                      />
                      <FlowStep
                        number="2"
                        title="Inspección"
                        desc="Control de calidad."
                        isDark={isDark}
                      />
                      <FlowStep
                        number="3"
                        title="Acomodo"
                        desc="Asignación de ubicación."
                        isDark={isDark}
                      />
                      <FlowStep
                        number="4"
                        title="Surtido"
                        desc="Picking y salida."
                        isLast={true}
                        isDark={isDark}
                      />
                    </Box>
                  </Container>
                </section>

                <section id="visual-tech">
                  <Container
                    header={
                      <Header
                        variant="h2"
                        actions={<Badge color="blue">DinoV2</Badge>}
                      >
                        Tecnología Visual
                      </Header>
                    }
                  >
                    <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                      <SpaceBetween size="m">
                        <Box variant="p">
                          OmniPart integra visión por computadora para
                          identificar piezas sin código.
                        </Box>
                        <Button iconName={'camera' as any}>
                          Iniciar Escaneo Visual
                        </Button>
                      </SpaceBetween>
                      <div
                        style={{
                          backgroundColor: isDark ? '#0d121b' : '#f8f8f8',
                          height: '100%',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `1px solid ${colors.border}`,
                        }}
                      >
                        <div style={{ textAlign: 'center', opacity: 0.6 }}>
                          <Icon name={'image' as any} size="large" />
                        </div>
                      </div>
                    </Grid>
                  </Container>
                </section>

                <section id="faq">
                  <Header variant="h2">Preguntas Frecuentes</Header>
                  <SpaceBetween size="m">
                    <ExpandableSection headerText="¿Qué sucede si una ubicación no coincide?">
                      Marcar como 'En Cuarentena'.
                    </ExpandableSection>
                    <ExpandableSection headerText="¿Soporta Kits?">
                      Sí, permite agrupar SKUs.
                    </ExpandableSection>
                  </SpaceBetween>
                </section>
              </SpaceBetween>
            </div>
          </div>
        }
      />
      {/* 3. FOOTER */}
      <Footer />
    </div>
  );
}
