import * as React from 'react';
import { useContext, useEffect, useState, useRef } from 'react';

// Imports de Cloudscape Design System
// FIX: Se eliminó 'Box' de los imports porque no se utiliza en el código
import {
  Button,
  Container,
  Header,
  SpaceBetween,
  Link,
  Grid,
  Icon,
  Flashbar,
  Table,
  Badge,
  AppLayout,
} from '@cloudscape-design/components';

// Contexto Global
import { AppContent } from '@/context/AppContext';

// Imports Locales (Tus Layouts)
import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import { Footer } from '@/components/layouts/AppFooter';
import SecondaryHeader from '@/components/layouts/BreadcrumbNavBar';

// --- DATOS MOCK ---
const updatesHistory = [
  {
    version: 'v2.4.1 (Current)',
    date: 'March 05, 2026',
    type: 'Feature & Fixes',
    description:
      'Added advanced global search filters and resolved latency issues in the dashboard.',
  },
  {
    version: 'v2.3.0',
    date: 'February 15, 2026',
    type: 'Security Update',
    description:
      'Patched vulnerabilities in the authentication module and updated dependencies.',
  },
];

const systemModules = [
  {
    name: 'QuickFind Core Engine',
    category: 'Search & Indexing',
    desc: 'The primary indexing engine responsible for parsing and structuring incoming operational data in real-time.',
  },
  {
    name: 'Identity & Access (IAM)',
    category: 'Security',
    desc: 'Manages user roles, permissions, and session tokens across the QuickFind platform.',
  },
];

const SECTIONS = [
  { id: 'overview', text: 'System overview' },
  { id: 'updates', text: 'Latest updates' },
  { id: 'modules', text: 'Active modules' },
  { id: 'support', text: 'Support & Docs' },
];

// --- COMPONENTES UI REUTILIZABLES ---
const DetailRow = ({
  label,
  value,
  textColor,
  labelColor,
  borderColor,
}: any) => (
  <div style={{ marginBottom: '16px' }}>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        alignItems: 'start',
        paddingBottom: '16px',
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      <div style={{ fontWeight: 500, color: labelColor, fontSize: '14px' }}>
        {label}
      </div>
      <div style={{ color: textColor, fontSize: '14px' }}>{value}</div>
    </div>
  </div>
);

const ModuleCard = ({ title, category, desc, isDark }: any) => (
  <div
    style={{
      border: `1px solid ${isDark ? '#414d5c' : '#eaeded'}`,
      borderRadius: '8px',
      padding: '20px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: isDark ? '#1d2c3f' : '#fff',
      transition: 'all 0.2s ease',
    }}
  >
    <div style={{ marginBottom: '15px' }}>
      <div
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: isDark ? '#2c3e50' : '#f2f3f3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
          color: '#879596',
          marginBottom: '10px',
        }}
      >
        {/* FIX: as any preventivo en Icon */}
        <Icon name={'settings' as any} size="medium" />
      </div>
      <Link href="#" fontSize="heading-s">
        {title}
      </Link>
      <div
        style={{
          fontSize: '12px',
          color: isDark ? '#aab7b8' : '#545b64',
          marginTop: '4px',
        }}
      >
        Subsystem &bull; {category}
      </div>
      <div style={{ marginTop: '8px' }}>
        <Badge color="green">Operational</Badge>
      </div>
    </div>
    <div
      style={{
        fontSize: '14px',
        color: isDark ? '#d1d5db' : '#16191f',
        marginBottom: '20px',
        flexGrow: 1,
      }}
    >
      {desc}
    </div>
    {/* FIX: as any preventivo en Icon */}
    <Button iconName={'external' as any}>View logs</Button>
  </div>
);

export default function QuickFindSystemInfo() {
  const { isDark, alerts, setPageLoading } = useContext(AppContent) || {
    isDark: false,
  };

  const [navigationOpen, setNavigationOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Estado para manejar la notificación de bienvenida/versión
  const [showVersionAlert, setShowVersionAlert] = useState(true);

  const isMounted = useRef(true);

  // Paleta de colores
  const colors = {
    bgPage: isDark ? '#0f1b2a' : '#ffffff',
    bgHeader: '#0f1b2a', // Fondo oscuro estilo AWS
    textMain: isDark ? '#fbfbfb' : '#16191f',
    textSecondary: isDark ? '#aab7b8' : '#545b64',
    border: isDark ? '#414d5c' : '#eaeded',
    activeLink: '#0972d3',
  };

  useEffect(() => {
    isMounted.current = true;
    if (setPageLoading) setPageLoading(false);

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
      isMounted.current = false;
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setPageLoading]);

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

  // --- CONFIGURACIÓN DE NOTIFICACIONES ---
  const notificationsItems = [];

  if (alerts && alerts.length > 0) {
    notificationsItems.push(...alerts);
  } else if (showVersionAlert) {
    notificationsItems.push({
      type: 'success',
      dismissible: true,
      onDismiss: () => setShowVersionAlert(false),
      content: (
        <strong>
          QuickFind v2.4.1 está ejecutándose correctamente. Todos los módulos
          operativos.
        </strong>
      ),
      id: 'version_info_alert',
    });
  }

  // --- CONTENIDO PRINCIPAL ---
  const pageContent = (
    <div
      style={{
        backgroundColor: colors.bgPage,
        transition: 'background-color 0.3s',
        paddingBottom: '40px',
      }}
    >
      {/* 🔹 HERO BANNER FULL WIDTH (FONDO OSCURO CONTINUO) 🔹 */}
      <div style={{ backgroundColor: colors.bgHeader, color: '#ffffff' }}>
        {/* 1. RANURA DE NOTIFICACIONES */}
        {notificationsItems.length > 0 && (
          <div style={{ padding: '30px 40px 0 40px' }}>
            {' '}
            {/* 👈 Un poco más de aire arriba a la notificación */}
            <Flashbar items={notificationsItems as any} stackItems={true} />
          </div>
        )}

        {/* 2. ENCABEZADO Y BOTONES */}
        {/* 👈 Aumentamos a 60px el padding superior para que siempre haya aire, haya o no notificaciones */}
        <div style={{ padding: '60px 40px 80px 40px' }}>
          <Grid
            gridDefinition={[
              { colspan: { default: 12, s: 8 } },
              { colspan: { default: 12, s: 4 } },
            ]}
          >
            {/* Textos alineados a la izquierda */}
            <div>
              <h1
                style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  margin: '0 0 16px 0',
                  color: '#ffffff',
                }}
              >
                QuickFind System Information
              </h1>
              <p
                style={{
                  fontSize: '16px',
                  lineHeight: '24px',
                  color: '#d1d5db',
                  maxWidth: '700px',
                  margin: '0 0 24px 0',
                }}
              >
                Comprehensive overview of your QuickFind deployment. Review
                current version details, system health, active modules, and the
                latest platform improvements.
              </p>
              <div
                style={{
                  fontSize: '14px',
                  color: '#d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Tags:</span>
                <Badge color="green">v2.4.1</Badge>
                <span style={{ color: '#545b64' }}>|</span>
                <span>Stable</span>
                <span style={{ color: '#545b64' }}>|</span>
                <span>Production Environment</span>
              </div>
            </div>

            {/* Botones alineados a la derecha y anclados arriba */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
              }}
            >
              <div style={{ width: '100%', maxWidth: '250px' }}>
                <SpaceBetween size="m" direction="vertical">
                  {/* FIX: as any preventivo en Icon */}
                  <Button
                    variant="primary"
                    iconName={'download' as any}
                    fullWidth
                  >
                    Download System Logs
                  </Button>
                  <button
                    style={{
                      width: '100%',
                      padding: '6px 16px',
                      backgroundColor: 'transparent',
                      border: '1px solid #ffffff',
                      borderRadius: '20px',
                      color: '#ffffff',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '14px',
                      transition: 'background-color 0.2s ease',
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        'rgba(255, 255, 255, 0.1)')
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = 'transparent')
                    }
                  >
                    Check for Updates
                  </button>
                </SpaceBetween>
              </div>
            </div>
          </Grid>
        </div>
      </div>

      {/* Grid de Contenido y Sticky Nav Local */}
      <div style={{ padding: '40px 40px 0 40px', color: colors.textMain }}>
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 8, m: 9 } },
            { colspan: { default: 12, s: 4, m: 3 } },
          ]}
        >
          <SpaceBetween size="xxl">
            <div id="overview">
              <Header variant="h2">System overview</Header>
              <div
                style={{
                  marginTop: '10px',
                  fontSize: '14px',
                  lineHeight: '22px',
                }}
              >
                QuickFind is currently operating on the latest stable release.
                The platform is configured to automatically scale resources.
              </div>
              <div style={{ marginTop: '30px' }}>
                <Container
                  header={<Header variant="h3">Technical Details</Header>}
                >
                  <DetailRow
                    label="Current Version"
                    value={<Badge color="blue">v2.4.1</Badge>}
                    textColor={colors.textMain}
                    labelColor={colors.textSecondary}
                    borderColor={colors.border}
                  />
                  <DetailRow
                    label="Last Updated"
                    value="March 05, 2026 at 03:00 AM UTC"
                    textColor={colors.textMain}
                    labelColor={colors.textSecondary}
                    borderColor={colors.border}
                  />
                  <DetailRow
                    label="Database Status"
                    value={
                      <span style={{ color: '#1d8102', fontWeight: 600 }}>
                        Healthy (Replication Active)
                      </span>
                    }
                    textColor={colors.textMain}
                    labelColor={colors.textSecondary}
                    borderColor={colors.border}
                  />
                </Container>
              </div>
            </div>

            <div id="updates">
              <Header
                variant="h2"
                description="A log of recent feature additions and fixes."
              >
                Latest updates
              </Header>
              <div style={{ marginTop: '20px' }}>
                <Table
                  variant="embedded"
                  columnDefinitions={[
                    {
                      id: 'version',
                      header: 'Version',
                      cell: (e) => <strong>{e.version}</strong>,
                      width: 150,
                    },
                    {
                      id: 'date',
                      header: 'Date',
                      cell: (e) => e.date,
                      width: 150,
                    },
                    {
                      id: 'type',
                      header: 'Type',
                      cell: (e) => (
                        <Badge
                          color={e.type.includes('Security') ? 'red' : 'grey'}
                        >
                          {e.type}
                        </Badge>
                      ),
                      width: 150,
                    },
                    {
                      id: 'description',
                      header: 'Description',
                      cell: (e) => e.description,
                    },
                  ]}
                  items={updatesHistory}
                />
              </div>
            </div>

            <div id="modules">
              <Header
                variant="h2"
                description="Core microservices running in your environment."
              >
                Active modules
              </Header>
              <div style={{ marginTop: '20px' }}>
                <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                  {systemModules.map((p, i) => (
                    <ModuleCard key={i} {...p} isDark={isDark} />
                  ))}
                </Grid>
              </div>
            </div>

            <div id="support">
              <Header variant="h2">Support & Documentation</Header>
              <p style={{ marginTop: '10px', fontSize: '14px' }}>
                If you are experiencing system failures, please open a ticket.{' '}
                <Link external href="#">
                  Open Support Ticket
                </Link>
              </p>
            </div>
          </SpaceBetween>

          {/* Columna Derecha (Navegación local) */}
          <div style={{ position: 'sticky', top: '20px' }}>
            <SpaceBetween size="l">
              <div>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '700',
                    marginBottom: '10px',
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
            </SpaceBetween>
          </div>
        </Grid>
      </div>
    </div>
  );

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      {/* Contenedor del Navbar y el Breadcrumb */}
      <div
        id="sticky-nav-container"
        style={{ position: 'sticky', top: 0, zIndex: 1002 }}
      >
        <Navbar />
        {/* FIX: Ignoramos advertencias de prop types en SecondaryHeader */}
        {/* @ts-ignore */}
        <SecondaryHeader
          breadcrumbs={[
            { text: 'Sistema', href: '#' },
            { text: 'Configuración', href: '#' },
            { text: 'Información del Sistema', href: '/system-info' },
          ]}
          isMenuOpen={navigationOpen}
          onMenuClick={() => setNavigationOpen(!navigationOpen)}
          isInfoOpen={toolsOpen}
          onInfoClick={() => setToolsOpen(!toolsOpen)}
        />
      </div>

      <AppLayout
        headerSelector="#sticky-nav-container"
        navigation={<GlobalSidebar />}
        navigationOpen={navigationOpen}
        onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        disableContentPaddings={true}
        // Dejamos las notificaciones del AppLayout vacías para evitar el hueco blanco
        content={pageContent}
      />

      <Footer />
    </div>
  );
}
