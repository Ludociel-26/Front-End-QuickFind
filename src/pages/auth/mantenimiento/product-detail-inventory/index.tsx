import * as React from 'react';
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

// --- DATA ADAPTADA PARA MANTENIMIENTO ---
const SECTIONS = [
  { id: 'introduction', text: 'Visión General' },
  { id: 'capabilities', text: 'Capacidades Core' },
  { id: 'asset-modules', text: 'Módulos de Planta' },
  { id: 'operational-flow', text: 'Flujo de Rutinas' },
  { id: 'predictive-tech', text: 'Analítica y Mantenimiento Predictivo' },
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
      <Icon name={icon} size="medium" />
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

export default function MaintenanceServiceOverview() {
  const context = useContext(AppContent);
  if (!context) return null;
  const { isDark } = context;

  const [navigationOpen, setNavigationOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('introduction');

  const scrollToAnchor = (id: string, e: React.MouseEvent) => {
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
                    type: 'info',
                    content:
                      'Turno actual: A (06:00 - 14:00). Hay 3 rutinas pendientes.',
                    dismissible: true,
                    id: 'alert-1',
                  },
                ]}
              />

              <div style={{ marginTop: '20px' }}>
                <Box variant="small" margin={{ bottom: 'xs' }}>
                  <span style={{ color: '#879596' }}>Operaciones</span> /{' '}
                  <span style={{ color: '#fbfbfb' }}>
                    Gestión de Mantenimiento
                  </span>
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
                      Plataforma CMMS Integral
                    </h1>
                    <p
                      style={{
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: '#d1d5db',
                        marginBottom: '20px',
                      }}
                    >
                      Control total sobre los activos de la planta. Capture
                      telemetría por turnos, gestione checklists pre-operativos
                      y digitalice las bitácoras del departamento.
                    </p>
                    <SpaceBetween size="m" direction="horizontal">
                      <Button variant="primary">Ver Mis Rutinas</Button>
                      <Button iconName="file-open">Generar PDFs</Button>
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
                        Acciones Rápidas
                      </Box>
                      <SpaceBetween size="s">
                        <Button fullWidth iconName="search">
                          Buscar Activo / Equipo
                        </Button>
                        <Button fullWidth iconName="add-plus">
                          Reportar Falla Inmediata
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
                        <span style={{ color: '#aab7b8' }}>
                          Estado del Sistema:
                        </span>
                        <span style={{ color: '#0972d3', fontWeight: 'bold' }}>
                          Sincronizado
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
                  <Header variant="h2">Visión General del Sistema</Header>
                  <Container>
                    <SpaceBetween size="l">
                      <Box variant="p" fontSize="heading-xs">
                        Este CMMS elimina las bitácoras de papel, consolidando
                        la información de cada equipo en una única fuente de
                        verdad, orientada a activos y series de tiempo.
                      </Box>
                      <ColumnLayout columns={2} variant="text-grid">
                        <div>
                          <Box variant="h3">Gestión Centrada en Activos</Box>
                          <Box variant="p" color="text-body-secondary">
                            Historial completo de calderas, compresores y
                            cuartos fríos.
                          </Box>
                        </div>
                        <div>
                          <Box variant="h3">Trazabilidad por Turno</Box>
                          <Box variant="p" color="text-body-secondary">
                            Firmas digitales y auditoría de operadores en Turnos
                            A, B y C.
                          </Box>
                        </div>
                      </ColumnLayout>
                    </SpaceBetween>
                  </Container>
                </section>

                <section id="capabilities">
                  <Header variant="h2">Capacidades Core</Header>
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
                        icon="settings"
                        title="Telemetría Dinámica"
                        text="Captura de presiones, amperajes y temperaturas validadas en rango."
                      />
                      <FeatureCard
                        isDark={isDark}
                        icon="status-in-progress"
                        title="Checklists y Estados"
                        text="Inspecciones pre-operativas con estados: Normal, Anormal o Falla."
                      />
                      <FeatureCard
                        isDark={isDark}
                        icon="file"
                        title="Reportes Automatizados"
                        text="Generación de formatos departamentales en PDF listos para auditoría."
                      />
                    </Grid>
                  </Box>
                </section>

                <section id="asset-modules">
                  <Header variant="h2">Módulos de Planta Integrados</Header>
                  <Box margin={{ top: 'm' }}>
                    <Tiles
                      items={[
                        {
                          label: 'Central de Vapor y Agua',
                          description:
                            'Bitácoras de calderas y análisis químicos.',
                          iconName: 'menu',
                        },
                        {
                          label: 'Aire Comprimido',
                          description:
                            'Lecturas de temperatura, fugas y nivel de purga.',
                          iconName: 'settings',
                        },
                        {
                          label: 'Refrigeración (Congelados)',
                          description:
                            'Control de cuartos fríos, compresores Frick y torres.',
                          iconName: 'calendar',
                        },
                        {
                          label: 'Refrigeración (Refrigerados)',
                          description:
                            'Manejo de amoníaco, chillers y cuartos de conservación.',
                          iconName: 'dashboard',
                        },
                      ]}
                    />
                  </Box>
                </section>

                <section id="operational-flow">
                  <Header variant="h2">Flujo de Ejecución Diaria</Header>
                  <Container>
                    <Box
                      margin={{ top: 'l', bottom: 'l' }}
                      padding={{ left: 'l' }}
                    >
                      <FlowStep
                        number="1"
                        title="Asignación de Turno"
                        desc="El sistema detecta automáticamente el turno en curso (A, B o C)."
                        isDark={isDark}
                      />
                      <FlowStep
                        number="2"
                        title="Checklist Pre-operativo"
                        desc="Validación visual de válvulas, niveles de aceite y fugas."
                        isDark={isDark}
                      />
                      <FlowStep
                        number="3"
                        title="Captura de Telemetría (Por Hora)"
                        desc="Registro de parámetros operativos en la tabla de series de tiempo."
                        isDark={isDark}
                      />
                      <FlowStep
                        number="4"
                        title="Cierre de Bitácora y Consolidación"
                        desc="Firma del operador y disponibilidad inmediata para exportación PDF."
                        isLast={true}
                        isDark={isDark}
                      />
                    </Box>
                  </Container>
                </section>

                <section id="predictive-tech">
                  <Container
                    header={
                      <Header
                        variant="h2"
                        actions={<Badge color="blue">Machine Learning</Badge>}
                      >
                        Analítica y Predicción
                      </Header>
                    }
                  >
                    <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                      <SpaceBetween size="m">
                        <Box variant="p">
                          Al estructurar los datos por series de tiempo, el
                          sistema está preparado para implementar algoritmos de
                          predicción. Identifique caídas anómalas de presión en
                          succión antes de que el equipo falle.
                        </Box>
                        <Button iconName="line-chart">
                          Ver Gráficas Históricas
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
                          <Icon name="status-positive" size="large" />
                        </div>
                      </div>
                    </Grid>
                  </Container>
                </section>

                <section id="faq">
                  <Header variant="h2">Preguntas Frecuentes</Header>
                  <SpaceBetween size="m">
                    <ExpandableSection headerText="¿Qué pasa si capturo un valor fuera del rango esperado?">
                      El sistema pintará el registro de color rojo y solicitará
                      una breve observación obligatoria (Ej. 'Reparación
                      inmediata en Mondinis').
                    </ExpandableSection>
                    <ExpandableSection headerText="¿Cómo se generan los formatos impresos antiguos?">
                      En la sección de Reportes, puedes seleccionar una fecha y
                      el sistema llenará automáticamente una plantilla PDF
                      idéntica al formato físico de calidad.
                    </ExpandableSection>
                  </SpaceBetween>
                </section>
              </SpaceBetween>
            </div>
          </div>
        }
      />
      <Footer />
    </div>
  );
}
