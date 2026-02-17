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

// --- DATA ADAPTADA PARA ADMINISTRACIÓN DEL SISTEMA ---
const SECTIONS = [
  { id: 'introduction', text: 'Visión General' },
  { id: 'capabilities', text: 'Gestión de Accesos' },
  { id: 'admin-modules', text: 'Módulos de Configuración' },
  { id: 'provisioning-flow', text: 'Flujo de Aprovisionamiento' },
  { id: 'monitoring-tech', text: 'Monitoreo y Auditoría' },
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

export default function SystemAdminOverview() {
  const context = useContext(AppContent);
  if (!context) return null;
  const { isDark } = context;

  const [navigationOpen, setNavigationOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('introduction');

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
                      'Alerta de Seguridad: Hay 3 solicitudes de acceso de nuevos usuarios pendientes de aprobación.',
                    dismissible: true,
                    id: 'alert-1',
                  } as any,
                ]}
              />

              <div style={{ marginTop: '20px' }}>
                <Box variant="small" margin={{ bottom: 'xs' }}>
                  <span style={{ color: '#879596' }}>Configuración</span> /{' '}
                  <span style={{ color: '#fbfbfb' }}>
                    Administración del Sistema
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
                      Centro de Administración Global
                    </h1>
                    <p
                      style={{
                        fontSize: '16px',
                        lineHeight: '24px',
                        color: '#d1d5db',
                        marginBottom: '20px',
                      }}
                    >
                      Gestione de forma centralizada identidades, permisos,
                      políticas de seguridad y audite la actividad de la
                      plataforma. Mantenga el control total sobre la
                      infraestructura y accesos.
                    </p>
                    <SpaceBetween size="m" direction="horizontal">
                      <Button variant="primary">Gestionar Usuarios</Button>
                      <Button iconName={'view-full' as any}>
                        Ver Logs de Auditoría
                      </Button>
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
                        <Button fullWidth iconName={'user-profile' as any}>
                          Invitar Nuevo Usuario
                        </Button>
                        <Button fullWidth iconName={'security' as any}>
                          Revisar Alertas de Red
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
                          Estado de Servicios:
                        </span>
                        <span style={{ color: '#18aa44', fontWeight: 'bold' }}>
                          {' '}
                          Óptimo (100%)
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
                  <Header variant="h2">Visión General de la Plataforma</Header>
                  <Container>
                    <SpaceBetween size="l">
                      <Box variant="p" fontSize="heading-xs">
                        Este panel centraliza la configuración global del
                        sistema, permitiendo a los administradores gobernar el
                        acceso, supervisar el uso de recursos y asegurar el
                        cumplimiento de las normativas internas.
                      </Box>
                      <ColumnLayout columns={2} variant="text-grid">
                        <div>
                          <Box variant="h3">Gestión Basada en Roles (RBAC)</Box>
                          <Box variant="p" color="text-body-secondary">
                            Defina permisos granulares y limite el acceso a
                            módulos críticos según el departamento y el cargo
                            del empleado.
                          </Box>
                        </div>
                        <div>
                          <Box variant="h3">Cumplimiento y Trazabilidad</Box>
                          <Box variant="p" color="text-body-secondary">
                            Todos los cambios en la configuración y accesos
                            quedan registrados en logs inmutables para futuras
                            auditorías.
                          </Box>
                        </div>
                      </ColumnLayout>
                    </SpaceBetween>
                  </Container>
                </section>

                <section id="capabilities">
                  <Header variant="h2">
                    Capacidades de Seguridad y Acceso
                  </Header>
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
                        icon="user-profile-active"
                        title="Directorio Activo"
                        text="Sincronización con proveedores de identidad (SSO), gestión de grupos y ciclos de vida de credenciales."
                      />
                      <FeatureCard
                        isDark={isDark}
                        icon="security"
                        title="Políticas de Seguridad"
                        text="Requisitos de complejidad de contraseñas, MFA obligatorio y listas de IP permitidas."
                      />
                      <FeatureCard
                        isDark={isDark}
                        icon="list"
                        title="Auditoría Continua"
                        text="Registro de eventos (CloudTrail interno) detallando quién hizo qué, cuándo y desde dónde."
                      />
                    </Grid>
                  </Box>
                </section>

                <section id="admin-modules">
                  <Header variant="h2">Módulos de Configuración</Header>
                  <Box margin={{ top: 'm' }}>
                    {/* FIX: Agregada propiedad 'value' en cada ítem y en el componente principal */}
                    <Tiles
                      value=""
                      onChange={() => {}}
                      items={
                        [
                          {
                            value: 'mod-1',
                            label: 'Usuarios y Permisos',
                            description:
                              'Cree usuarios, asigne grupos y gestione políticas IAM.',
                            iconName: 'user-profile',
                          },
                          {
                            value: 'mod-2',
                            label: 'Integraciones (API / Webhooks)',
                            description:
                              'Gestione tokens de API y conexiones con ERPs o servicios externos.',
                            iconName: 'share',
                          },
                          {
                            value: 'mod-3',
                            label: 'Configuración del Entorno',
                            description:
                              'Variables globales, límites de almacenamiento y parámetros del sistema.',
                            iconName: 'settings',
                          },
                          {
                            value: 'mod-4',
                            label: 'Notificaciones y Alertas',
                            description:
                              'Reglas de enrutamiento para alertas de sistema (Email, SMS, Slack).',
                            iconName: 'notification',
                          },
                        ] as any
                      }
                    />
                  </Box>
                </section>

                <section id="provisioning-flow">
                  <Header variant="h2">
                    Flujo de Aprovisionamiento de Usuarios
                  </Header>
                  <Container>
                    <Box
                      margin={{ top: 'l', bottom: 'l' }}
                      padding={{ left: 'l' }}
                    >
                      <FlowStep
                        number="1"
                        title="Creación de Identidad"
                        desc="Alta del usuario en el sistema mediante formulario o sincronización con SSO empresarial."
                        isDark={isDark}
                      />
                      <FlowStep
                        number="2"
                        title="Asignación de Políticas (RBAC)"
                        desc="Asociación del usuario a grupos específicos (ej. 'Auditores', 'Operadores de Planta')."
                        isDark={isDark}
                      />
                      <FlowStep
                        number="3"
                        title="Forzado de Factores de Autenticación (MFA)"
                        desc="El usuario configura su aplicación autenticadora durante su primer inicio de sesión."
                        isDark={isDark}
                      />
                      <FlowStep
                        number="4"
                        title="Habilitación y Auditoría"
                        desc="El usuario obtiene acceso y todas sus acciones comienzan a ser trazadas por el sistema de logs."
                        isLast={true}
                        isDark={isDark}
                      />
                    </Box>
                  </Container>
                </section>

                <section id="monitoring-tech">
                  <Container
                    header={
                      <Header
                        variant="h2"
                        actions={<Badge color="red">Alerta Activa</Badge>}
                      >
                        Monitoreo y Salud del Sistema
                      </Header>
                    }
                  >
                    <Grid gridDefinition={[{ colspan: 8 }, { colspan: 4 }]}>
                      <SpaceBetween size="m">
                        <Box variant="p">
                          Supervise en tiempo real el consumo de recursos de la
                          plataforma, tasas de error en integraciones API y
                          detecte anomalías de acceso (como múltiples intentos
                          fallidos de inicio de sesión).
                        </Box>
                        <Button iconName={'insert-chart' as any}>
                          Ver Dashboard de Métricas
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
                        <div
                          style={{
                            textAlign: 'center',
                            opacity: 0.8,
                            color: '#0972d3',
                          }}
                        >
                          <Icon name="status-info" size="large" />
                          <div
                            style={{
                              marginTop: '8px',
                              fontSize: '14px',
                              fontWeight: 'bold',
                            }}
                          >
                            Análisis Activo
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </Container>
                </section>

                <section id="faq">
                  <Header variant="h2">Preguntas Frecuentes</Header>
                  <SpaceBetween size="m">
                    <ExpandableSection headerText="¿Cómo reseteo el MFA (Múltiple Factor de Autenticación) de un usuario?">
                      Navegue al módulo de 'Usuarios y Permisos', seleccione el
                      usuario afectado y en la pestaña 'Seguridad' haga clic en
                      'Revocar y Requerir MFA'. En su próximo inicio de sesión,
                      se le pedirá configurar un nuevo dispositivo.
                    </ExpandableSection>
                    <ExpandableSection headerText="¿Por cuánto tiempo se retienen los logs de auditoría?">
                      Por defecto, los logs del sistema se retienen durante 365
                      días en almacenamiento caliente, y posteriormente son
                      archivados en almacenamiento en frío (Glacier) para
                      cumplimiento normativo por hasta 7 años.
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
