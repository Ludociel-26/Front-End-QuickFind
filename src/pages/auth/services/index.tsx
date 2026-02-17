import * as React from 'react';
import {
  Box,
  Header,
  AppLayout,
  Container,
  Grid,
  Link,
  SpaceBetween,
} from '@cloudscape-design/components';

import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import SecondaryHeader from '@/components/layouts/BreadcrumbNavBar';
import { Footer } from '@/components/layouts/AppFooter';

import iconAlmacen from '@/assets/services/AI.svg';
import iconMantenimiento from '@/assets/services/AI.svg';
import iconAI from '@/assets/services/AI.svg';
import iconAdmin from '@/assets/services/AI.svg';

const styles = `
  .aws-category-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }

  .aws-category-title {
    font-size: 16px;
    font-weight: 700;
    color: #16191f;
    margin: 0;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  .aws-service-list {
    list-style: none;
    padding: 0;
    margin: 0 0 0 36px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .aws-service-list li a {
    font-size: 14px !important;
    font-weight: 400 !important; 
    color: #0972d3 !important;
    text-decoration: none !important; 
    transition: color 0.1s ease;
  }

  .aws-service-list li a:hover {
    text-decoration: underline !important; 
    color: #033160 !important; 
  }
`;

type CategoryType = 'almacen' | 'mantenimiento' | 'ai' | 'admin';

interface AppServiceItem {
  text: string;
  href: string;
}

interface AppCategory {
  title: string;
  type: CategoryType;
  services: AppServiceItem[];
}

const SERVICES_DATA: { leftColumn: AppCategory[]; rightColumn: AppCategory[] } =
  {
    leftColumn: [
      {
        title: 'Almacén e Inventario',
        type: 'almacen',
        services: [
          { text: 'Visión General de Almacén', href: '/almacen' },
          { text: 'Órdenes de Compra', href: '/almacen/entradas/ordenes' },
          { text: 'Recepción y Calidad', href: '/almacen/entradas/recepcion' },
          { text: 'Consulta de Stock', href: '/almacen/inventario/stock' },
          { text: 'Conteo Cíclico', href: '/almacen/inventario/conteo' },
          { text: 'Kárdex y Movimientos', href: '/almacen/inventario/kardex' },
          { text: 'Pedidos y Entregas', href: '/almacen/salidas/pedidos' },
          {
            text: 'Catálogo de Productos (SKU)',
            href: '/almacen/catalogos/productos',
          },
        ],
      },
      {
        title:
          'Mantenimiento CMMS (Computerized Maintenance Management System)',
        type: 'mantenimiento',
        services: [
          { text: 'Dashboard de Operaciones', href: '/mantenimiento' },
          { text: 'Órdenes de Trabajo (WO)', href: '/mantenimiento/ordenes' },
          {
            text: 'Mantenimiento Preventivo',
            href: '/mantenimiento/preventivo',
          },
          {
            text: 'Catálogo de Activos y Equipos',
            href: '/mantenimiento/equipos',
          },
          { text: 'Solicitudes a Almacén', href: '/mantenimiento/solicitudes' },
        ],
      },
    ],
    rightColumn: [
      {
        title: 'Inteligencia Artificial y Analítica',
        type: 'ai',
        services: [
          { text: 'Predicción de Demanda', href: '/ai/demanda' },
          { text: 'Análisis Predictivo de Fallos', href: '/ai/fallos' },
          { text: 'Optimización de Rutas (Picking)', href: '/ai/rutas' },
          { text: 'Asistente de Gestión', href: '/ai/asistente' },
          { text: 'Reportes Inteligentes', href: '/ai/reportes' },
        ],
      },
      {
        title: 'Administración del Sistema',
        type: 'admin',
        services: [
          { text: 'Centro de Administración', href: '/admin' },
          { text: 'Gestión de Usuarios', href: '/admin/usuarios' },
          { text: 'Roles y Permisos', href: '/admin/roles' },
          { text: 'Áreas y Ubicaciones Físicas', href: '/admin/areas' },
          { text: 'Proveedores y Contratistas', href: '/admin/proveedores' },
          { text: 'Auditoría y Logs del Sistema', href: '/admin/auditoria' },
          { text: 'Configuración General', href: '/admin/configuracion' },
        ],
      },
    ],
  };

const ServiceCategory = ({ category }: { category: AppCategory }) => (
  <Box margin={{ bottom: 'xxl' }}>
    <div className="aws-category-header">
      <CategoryIcon type={category.type} />
      <h3 className="aws-category-title">{category.title}</h3>
    </div>
    <ul className="aws-service-list">
      {category.services.map((service) => (
        <li key={service.href}>
          <Link href={service.href} variant="primary">
            {service.text}
          </Link>
        </li>
      ))}
    </ul>
  </Box>
);

export default function AppDirectory() {
  const [navigationOpen, setNavigationOpen] = React.useState<boolean>(true);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f2f3f3',
      }}
    >
      <style>{styles}</style>

      <div
        id="sticky-nav-container"
        style={{ position: 'sticky', top: 0, zIndex: 1002, width: '100%' }}
      >
        <Navbar />
        {/* @ts-ignore: Se omite la validación estricta de propiedades faltantes en la interfaz de BreadcrumbNavBar para compilar sin errores */}
        <SecondaryHeader
          breadcrumbs={[
            { text: 'Página de inicio', href: '/dashboard' },
            { text: 'Todos los servicios', href: '#' },
          ]}
          isMenuOpen={navigationOpen}
          onMenuClick={() => setNavigationOpen((prev) => !prev)}
        />
      </div>

      <AppLayout
        headerSelector="#sticky-nav-container"
        navigation={<GlobalSidebar />}
        navigationOpen={navigationOpen}
        onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
        toolsHide={true}
        content={
          <Box padding={{ top: 'l', bottom: 'xxl', horizontal: 'l' }}>
            <SpaceBetween size="l">
              <Box
                variant="h1"
                fontWeight="bold"
                padding={{ top: 'xs', bottom: 'xs' }}
              >
                Todos los servicios
              </Box>

              <Container
                header={<Header variant="h2">Servicios por categoría</Header>}
              >
                <Grid
                  gridDefinition={[
                    { colspan: { default: 12, s: 6 } },
                    { colspan: { default: 12, s: 6 } },
                  ]}
                >
                  <div>
                    {SERVICES_DATA.leftColumn.map((category) => (
                      <ServiceCategory
                        key={category.title}
                        category={category}
                      />
                    ))}
                  </div>

                  <div>
                    {SERVICES_DATA.rightColumn.map((category) => (
                      <ServiceCategory
                        key={category.title}
                        category={category}
                      />
                    ))}
                  </div>
                </Grid>
              </Container>
            </SpaceBetween>
          </Box>
        }
      />
      <Footer />
    </div>
  );
}

const baseIconStyle: React.CSSProperties = {
  width: '24px',
  height: '24px',
  borderRadius: '2px',
  padding: '3px',
  objectFit: 'contain',
};

function CategoryIcon({ type }: { type: CategoryType }) {
  switch (type) {
    case 'almacen':
      return (
        <img
          src={iconAlmacen}
          alt="Icono Almacén"
          style={{ ...baseIconStyle, backgroundColor: '#287A3E' }}
        />
      );
    case 'mantenimiento':
      return (
        <img
          src={iconMantenimiento}
          alt="Icono Mantenimiento"
          style={{ ...baseIconStyle, backgroundColor: '#D15F27' }}
        />
      );
    case 'ai':
      return (
        <img
          src={iconAI}
          alt="Icono IA"
          style={{ ...baseIconStyle, backgroundColor: '#1C7E7C' }}
        />
      );
    case 'admin':
      return (
        <img
          src={iconAdmin}
          alt="Icono Admin"
          style={{ ...baseIconStyle, backgroundColor: '#C9252D' }}
        />
      );
    default:
      return null;
  }
}
