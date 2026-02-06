import * as React from 'react';
import { useContext } from 'react';
// Importamos tu contexto
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
const pricingItems = [
  {
    item: 'Mini package',
    description: '50 users, each user can backup up to 20 devices',
    m12: '$1,200',
    m24: '$2,400',
    m36: '$3,600',
  },
  {
    item: 'Premium package',
    description: '30 users, each user can backup up to 10 devices',
    m12: '$4,800',
    m24: '$9,000',
    m36: '$13,000',
  },
  {
    item: 'Enterprise package',
    description: '10 users, each user can backup up to 2 devices',
    m12: '$12,000',
    m24: '$22,000',
    m36: '$32,000',
  },
];

const vendorProducts = [
  {
    name: 'Cloud Data Operating System',
    category: 'Operating Systems',
    desc: 'An operating system that is tailored for the cloud. This offering includes a free...',
  },
  {
    name: 'Cloud Data Deep Security',
    category: 'Security',
    desc: 'Security built for all your cloud services. Apply rules and policies to your services...',
  },
];

const relatedProducts = [
  {
    name: 'Cloud Data Warehouse',
    category: 'Data Analytics',
    desc: 'Data warehousing services that allows you to run queries on petabytes of data...',
  },
  {
    name: 'Cloud Data Endpoint Protection',
    category: 'Security',
    desc: 'Protect your end-users from threats like malware and ransomware with our endpoint...',
  },
];

const SECTIONS = [
  { id: 'overview', text: 'Product overview' },
  { id: 'pricing', text: 'Pricing' },
  { id: 'details', text: 'Details' },
  { id: 'support', text: 'Support' },
  { id: 'related', text: 'Related products and services' },
];

// --- COMPONENTES UI ---

const DetailRow = ({
  label,
  value,
  textColor,
  labelColor,
  borderColor,
}: {
  label: string;
  value: React.ReactNode;
  textColor: string;
  labelColor: string;
  borderColor: string;
}) => (
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

const ProductCard = ({
  title,
  category,
  desc,
  isDark,
}: {
  title: string;
  category: string;
  desc: string;
  isDark: boolean;
}) => (
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
          fontWeight: 'bold',
          marginBottom: '10px',
        }}
      >
        X
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
        Sold by Cloud Data
      </div>
      <div style={{ marginTop: '8px' }}>
        <Badge color="green">Free trial</Badge>
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
    <Button>View details</Button>
  </div>
);

export default function ProductDetailPage() {
  const context = useContext(AppContent);
  // Manejo defensivo por si el contexto es null
  if (!context) return null;
  const { isDark } = context;

  const [activeSection, setActiveSection] = React.useState('overview');

  // Paleta de colores dinámica
  const colors = {
    bgPage: isDark ? '#0f1b2a' : '#ffffff',
    bgHeader: '#16191f', // Header siempre oscuro estilo AWS
    textMain: isDark ? '#fbfbfb' : '#16191f',
    textSecondary: isDark ? '#aab7b8' : '#545b64',
    border: isDark ? '#414d5c' : '#eaeded',
    cardBg: isDark ? '#1d2c3f' : '#ffffff',
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
            title: 'AWS Marketplace',
            logo: {
              src: 'https://d1.awsstatic.com/webteam/nav/global-nav-logos/aws-logo-white.png',
              alt: 'AWS Logo',
            },
          }}
          utilities={[]}
        />
      </div>

      {/* 2. HEADER WRAPPER (Fondo oscuro FULL WIDTH) */}
      <div style={{ backgroundColor: colors.bgHeader, width: '100%' }}>
        {/* Contenedor CENTRADO para Flashbar y Header Content */}
        {/* Usamos el mismo padding y max-width que el contenido principal para alinear */}
        <div
          style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 40px' }}
        >
          {/* FLASHBAR con margen superior para separarlo un poco del TopNav */}
          <div style={{ paddingTop: '20px' }}>
            <Flashbar
              items={[
                {
                  type: 'info',
                  dismissible: true,
                  content: (
                    <Box fontSize="body-s">
                      This demo is an example of Cloudscape Design System
                      patterns and components.
                    </Box>
                  ),
                  id: 'message_1',
                },
              ]}
            />
          </div>

          {/* CONTENIDO DEL HEADER */}
          <div style={{ padding: '20px 0 40px 0', color: '#ffffff' }}>
            <nav
              aria-label="Breadcrumb"
              style={{ marginBottom: '10px', fontSize: '14px' }}
            >
              <span style={{ color: '#879596' }}>Marketplace</span>
              <span style={{ margin: '0 8px', color: '#879596' }}>/</span>
              <span style={{ color: '#879596' }}>Data solutions</span>
              <span style={{ margin: '0 8px', color: '#879596' }}>/</span>
              <span style={{ color: '#fbfbfb' }}>Cloud Data Solution</span>
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
                    fontSize: '32px',
                    fontWeight: '800',
                    margin: '0 0 10px 0',
                    color: '#ffffff',
                  }}
                >
                  Cloud Data Solution
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
                  Delivering data insights and analytics to make decisions
                  quickly, and at scale. Enhance your next step decision-making
                  through actionable insights with a free trial today.
                </p>

                <div style={{ fontSize: '14px', color: '#d1d5db' }}>
                  Sold by:{' '}
                  <a
                    href="#"
                    style={{ color: '#44b9d6', textDecoration: 'none' }}
                  >
                    Cloud Data <Icon name="external" variant="inverted" />
                  </a>
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    color: '#d1d5db',
                    marginTop: '4px',
                  }}
                >
                  Tags: Free trial | Vendor insights | Quick launch
                </div>
              </div>

              <Box float="right">
                <div style={{ width: '100%', maxWidth: '300px' }}>
                  <SpaceBetween size="s" direction="vertical">
                    <Button variant="primary" fullWidth>
                      View purchase options
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
                      Try for free
                    </button>
                  </SpaceBetween>
                </div>
              </Box>
            </Grid>
          </div>
        </div>
      </div>

      {/* 3. CONTENIDO PRINCIPAL (CENTRADO) */}
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
          {/* --- COLUMNA IZQUIERDA --- */}
          <div>
            <SpaceBetween size="xxl">
              {/* Product Overview */}
              <div id="overview">
                <Header variant="h2">Product overview</Header>
                <div
                  style={{
                    marginTop: '10px',
                    fontSize: '14px',
                    lineHeight: '22px',
                    color: colors.textMain,
                  }}
                >
                  <p>
                    Receive real-time data insights to build process
                    improvements, track key performance indicators, and predict
                    future business outcomes.
                  </p>
                  <p>
                    Create a new Cloud Data Solution account to receive a 30 day
                    free trial of all Cloud Data Solution services.
                  </p>
                </div>

                {/* Product Details Table */}
                <div style={{ marginTop: '30px' }}>
                  <Header variant="h3">Product details</Header>
                  <div style={{ marginTop: '15px' }}>
                    <div
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                        marginBottom: '16px',
                      }}
                    ></div>

                    <DetailRow
                      label="Sold by"
                      value={
                        <Link external href="#">
                          Cloud Data
                        </Link>
                      }
                      textColor={colors.textMain}
                      labelColor={colors.textSecondary}
                      borderColor={colors.border}
                    />
                    <DetailRow
                      label="Product category"
                      value="Software as a Service"
                      textColor={colors.textMain}
                      labelColor={colors.textSecondary}
                      borderColor={colors.border}
                    />
                    <DetailRow
                      label="Delivery method"
                      value={
                        <div>
                          <div>QuickLaunch</div>
                          <div>CloudFormation Template</div>
                        </div>
                      }
                      textColor={colors.textMain}
                      labelColor={colors.textSecondary}
                      borderColor={colors.border}
                    />
                  </div>
                </div>

                {/* Video Placeholder */}
                <div style={{ marginTop: '30px' }}>
                  <div
                    style={{
                      width: '100%',
                      height: '320px',
                      background:
                        'linear-gradient(135deg, #0d121b 0%, #3e1628 100%)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    <div style={{ color: 'white', transform: 'scale(2)' }}>
                      ▶
                    </div>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <Link href="#" fontSize="heading-s">
                      Video Title
                    </Link>
                  </div>
                </div>

                {/* Highlights */}
                <div style={{ marginTop: '30px', color: colors.textMain }}>
                  <Header variant="h3">Highlights</Header>
                  <ul
                    style={{
                      paddingLeft: '20px',
                      marginTop: '10px',
                      lineHeight: '24px',
                    }}
                  >
                    <li>
                      Real-time data synchronization across availability zones
                    </li>
                    <li>
                      Encryption at rest and in transit using industry standard
                      protocols
                    </li>
                    <li>Automatic scaling based on demand</li>
                    <li>Integrated with major identity providers</li>
                  </ul>
                </div>

                {/* Vendor Insights */}
                <div style={{ marginTop: '30px' }}>
                  <Header variant="h3">Vendor insights</Header>
                  <p
                    style={{
                      marginTop: '10px',
                      fontSize: '14px',
                      color: colors.textMain,
                    }}
                  >
                    The current version of this product contains a security
                    profile. <Link href="#">View all profiles</Link>
                  </p>
                  <div
                    style={{
                      marginTop: '15px',
                      display: 'inline-flex',
                      flexDirection: 'column',
                      border: '1px solid #ff9900',
                      borderRadius: '4px',
                      width: '100px',
                      height: '80px',
                      padding: '10px',
                      justifyContent: 'center',
                      position: 'relative',
                      background: '#fff',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        backgroundColor: '#ff9900',
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px',
                      }}
                    ></div>
                    <span
                      style={{
                        fontWeight: 'bold',
                        fontSize: '12px',
                        color: '#232f3e',
                      }}
                    >
                      AWS
                    </span>
                    <span
                      style={{
                        fontWeight: 'bold',
                        fontSize: '10px',
                        color: '#545b64',
                        letterSpacing: '1px',
                      }}
                    >
                      PARTNER
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div id="pricing">
                <Header variant="h2">Pricing</Header>
                <div
                  style={{
                    marginTop: '10px',
                    marginBottom: '20px',
                    fontSize: '14px',
                    color: colors.textMain,
                  }}
                >
                  Use this calculator to estimate your pricing. This listing has
                  multiple pricing options.{' '}
                  <Link href="#">View purchase options</Link> to see specific
                  pricing.
                </div>
                <Container
                  header={<Header variant="h3">Cloud Data Solution</Header>}
                >
                  <Table
                    variant="embedded"
                    columnDefinitions={[
                      {
                        id: 'item',
                        header: 'Item',
                        cell: (e) => e.item,
                        width: 200,
                      },
                      {
                        id: 'description',
                        header: 'Description',
                        cell: (e) => e.description,
                      },
                      { id: 'm12', header: '12 months', cell: (e) => e.m12 },
                      { id: 'm24', header: '24 months', cell: (e) => e.m24 },
                      { id: 'm36', header: '36 months', cell: (e) => e.m36 },
                    ]}
                    items={pricingItems}
                  />
                </Container>
              </div>

              {/* Details */}
              <div id="details">
                <Header variant="h2">Details</Header>
                <SpaceBetween size="l">
                  <div>
                    <Header variant="h3">Delivery method</Header>
                    <p
                      style={{
                        fontSize: '14px',
                        marginTop: '8px',
                        color: colors.textMain,
                      }}
                    >
                      Software as a Service (SaaS) is a delivery model for
                      software applications whereby the vendor hosts and
                      operates the application over the Internet. Customers pay
                      for using the software without owning the underlying
                      infrastructure. <Link href="#">Learn more</Link>
                    </p>
                  </div>
                  <div>
                    <Header variant="h3">Terms and conditions</Header>
                    <p
                      style={{
                        fontSize: '14px',
                        marginTop: '8px',
                        color: colors.textMain,
                      }}
                    >
                      By subscribing to this product you agree to terms and
                      conditions outlined in the product{' '}
                      <Link href="#">End User License Agreement (EULA)</Link>.
                    </p>
                  </div>
                </SpaceBetween>
              </div>

              {/* More from this vendor */}
              <div id="more_vendor">
                <Header variant="h2">More from this vendor</Header>
                <div style={{ marginTop: '15px' }}>
                  <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                    {vendorProducts.map((p, i) => (
                      <ProductCard
                        key={i}
                        title={p.name}
                        category={p.category}
                        desc={p.desc}
                        isDark={isDark}
                      />
                    ))}
                  </Grid>
                </div>
              </div>

              {/* Support */}
              <div id="support">
                <Header variant="h2">Support</Header>
                <SpaceBetween size="m">
                  <div>
                    <Header variant="h3">Cloud Data Solution</Header>
                    <p
                      style={{
                        fontSize: '14px',
                        marginTop: '5px',
                        color: colors.textMain,
                      }}
                    >
                      Support is available for the Cloud Data Solution via
                      email, phone, and online ticketing. Please refer to our
                      support page for more details.{' '}
                      <Link href="#">http://example.com</Link>
                    </p>
                  </div>
                  <div>
                    <Header variant="h3">Infrastructure</Header>
                    <p
                      style={{
                        fontSize: '14px',
                        marginTop: '5px',
                        color: colors.textMain,
                      }}
                    >
                      AWS Infrastructure Services are scalable, reliable, and
                      secure. AWS offers a wide range of infrastructure services
                      including compute, storage, databases, and networking.{' '}
                      <Link href="#">Learn more</Link>
                    </p>
                  </div>
                </SpaceBetween>
              </div>

              {/* Related Products */}
              <div id="related">
                <Header variant="h2">Related products and services</Header>
                <div style={{ marginTop: '15px' }}>
                  <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                    {relatedProducts.map((p, i) => (
                      <ProductCard
                        key={i}
                        title={p.name}
                        category={p.category}
                        desc={p.desc}
                        isDark={isDark}
                      />
                    ))}
                  </Grid>
                </div>
              </div>
            </SpaceBetween>
          </div>

          {/* --- COLUMNA DERECHA (Sticky Nav) --- */}
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
                    Was this page helpful?
                  </h3>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <Button iconName="thumbs-up">Yes</Button>
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
