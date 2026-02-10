import * as React from 'react';
import axios from 'axios';
import { useContext } from 'react';
// 1. Imports de Cloudscape
import {
  Table,
  Box,
  SpaceBetween,
  Button,
  TextFilter,
  Header,
  Pagination,
  AppLayout,
  Flashbar,
  StatusIndicator,
  Badge,
  SplitPanel,
  ColumnLayout,
  Link,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';

// Contexto para obtener la URL del backend
import { AppContent } from '@/context/AppContext'; // Ajusta la ruta si es necesario

// Imports Locales
import Navbar from '../../layouts/navbar/Navbar';
import GlobalSidebar from '../../layouts/sidebar/Sidebar';
import RouteTracker from '../../layouts/RouteTracker';

// --- DEFINICIÓN DE TIPOS SEGÚN TU JSON ---
export interface UserItem {
  id: string;
  email: string;
  rol_id: number;
  role_name: string; // Dato importante para la tabla
  area_id: number;
  area_level: string; // Dato importante para la tabla
  name: string;
  surname: string;
  country: string;
  birth_date: string;
  is_account_verified: boolean;
  is_active: boolean;
}

// --- DEFINICIÓN DE COLUMNAS (Adaptadas a tu JSON) ---
const COLUMN_DEFINITIONS = [
  {
    id: 'name',
    header: 'Nombre',
    cell: (item: UserItem) => (
      <Link href="#">{`${item.name} ${item.surname}`}</Link>
    ),
    sortingField: 'name',
    isRowHeader: true,
  },
  {
    id: 'email',
    header: 'Correo Electrónico',
    cell: (item: UserItem) => item.email,
    sortingField: 'email',
  },
  {
    id: 'role_name',
    header: 'Rol',
    cell: (item: UserItem) => (
      // Muestra 'admin' en azul y otros en gris
      <Badge color={item.role_name === 'admin' ? 'blue' : 'grey'}>
        {item.role_name || 'Sin Rol'}
      </Badge>
    ),
    sortingField: 'role_name',
  },
  {
    id: 'area_level',
    header: 'Área',
    cell: (item: UserItem) => item.area_level || 'General',
    sortingField: 'area_level',
  },
  {
    id: 'status',
    header: 'Estado',
    cell: (item: UserItem) => (
      <StatusIndicator type={item.is_active ? 'success' : 'stopped'}>
        {item.is_active ? 'Activo' : 'Inactivo'}
      </StatusIndicator>
    ),
    minWidth: 120,
  },
];

// Componente auxiliar para detalles
const ValueWithLabel = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div>
    <Box variant="awsui-key-label" color="text-label">
      {label}
    </Box>
    <div>{children}</div>
  </div>
);

export default function UsersTable() {
  // Obtenemos URL del backend del contexto
  const { backendUrl } = useContext(AppContent) || {
    backendUrl: 'http://localhost:4000',
  };

  const [usersData, setUsersData] = React.useState<UserItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedItems, setSelectedItems] = React.useState<UserItem[]>([]);

  const [splitPanelPreferences, setSplitPanelPreferences] = React.useState({
    position: 'bottom' as const,
  });
  const [isSplitPanelOpen, setIsSplitPanelOpen] = React.useState(false);

  // --- EFECTO: CARGAR DATOS DE LA API ---
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        // Usamos withCredentials para que pasen las cookies si las usas
        const response = await axios.get(`${backendUrl}/api/user/all-users`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setUsersData(response.data.users);
        }
      } catch (error) {
        console.error('Error cargando usuarios:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [backendUrl]);

  React.useEffect(() => {
    if (selectedItems.length > 0) setIsSplitPanelOpen(true);
    else setIsSplitPanelOpen(false);
  }, [selectedItems]);

  // Hook de Cloudscape para manejar paginación y filtros con los datos de la API
  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    paginationProps,
    filterProps,
  } = useCollection(usersData, {
    pagination: { pageSize: 10 },
    sorting: { defaultState: { sortingColumn: COLUMN_DEFINITIONS[0] } },
    selection: {},
    filtering: {
      empty: (
        <Box textAlign="center" color="inherit">
          <b>No hay usuarios</b>
        </Box>
      ),
      noMatch: (
        <Box textAlign="center" color="inherit">
          <b>No hay coincidencias</b>
          <Button onClick={() => actions.setFiltering('')}>
            Borrar filtro
          </Button>
        </Box>
      ),
    },
  });

  // --- CONTENIDO DEL PANEL DE DETALLE (Adaptado a tu JSON) ---
  const getSplitPanelContent = (user: UserItem | undefined) => {
    if (!user)
      return (
        <Box textAlign="center" padding="l">
          Selecciona un usuario para ver detalles.
        </Box>
      );

    return (
      <SplitPanel
        header={
          <Header
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button>Restablecer Contraseña</Button>
                {user.is_active ? (
                  <Button variant="normal" iconName="status-stopped">
                    Deshabilitar
                  </Button>
                ) : (
                  <Button variant="primary" iconName="status-positive">
                    Habilitar
                  </Button>
                )}
              </SpaceBetween>
            }
          >
            {user.name} {user.surname}
          </Header>
        }
        i18nStrings={{
          preferencesTitle: 'Preferencias',
          preferencesPositionLabel: 'Posición',
          preferencesPositionDescription: 'Elige posición',
          preferencesPositionSide: 'Lado',
          preferencesPositionBottom: 'Abajo',
          preferencesConfirm: 'OK',
          preferencesCancel: 'Cancelar',
          closeButtonAriaLabel: 'Cerrar',
          openButtonAriaLabel: 'Abrir',
          resizeHandleAriaLabel: 'Redimensionar',
        }}
      >
        <ColumnLayout columns={3} variant="text-grid">
          <SpaceBetween size="l">
            <div>
              <Box variant="h3">Estado de Cuenta</Box>
              <SpaceBetween size="s">
                <ValueWithLabel label="Verificación de Email">
                  {user.is_account_verified ? (
                    <StatusIndicator type="success">Verificado</StatusIndicator>
                  ) : (
                    <StatusIndicator type="pending">Pendiente</StatusIndicator>
                  )}
                </ValueWithLabel>
                <ValueWithLabel label="Acceso al Sistema">
                  {user.is_active ? (
                    <StatusIndicator type="success">Habilitado</StatusIndicator>
                  ) : (
                    <StatusIndicator type="stopped">Bloqueado</StatusIndicator>
                  )}
                </ValueWithLabel>
              </SpaceBetween>
            </div>
          </SpaceBetween>

          <SpaceBetween size="l">
            <div>
              <Box variant="h3">Información Organizacional</Box>
              <SpaceBetween size="s">
                <ValueWithLabel label="Rol Asignado">
                  <Badge color="blue">{user.role_name}</Badge>
                </ValueWithLabel>
                <ValueWithLabel label="Área / Departamento">
                  {user.area_level} (ID: {user.area_id})
                </ValueWithLabel>
              </SpaceBetween>
            </div>
          </SpaceBetween>

          <SpaceBetween size="l">
            <div>
              <Box variant="h3">Datos Personales</Box>
              <SpaceBetween size="s">
                <ValueWithLabel label="Nombre Completo">
                  {user.name} {user.surname}
                </ValueWithLabel>
                <ValueWithLabel label="Correo">{user.email}</ValueWithLabel>
                <ValueWithLabel label="País">{user.country}</ValueWithLabel>
                <ValueWithLabel label="Fecha Nacimiento">
                  {new Date(user.birth_date).toLocaleDateString()}
                </ValueWithLabel>
              </SpaceBetween>
            </div>
          </SpaceBetween>
        </ColumnLayout>
      </SplitPanel>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* 1. Navbar Fijo */}
      <div style={{ flexShrink: 0, zIndex: 1001 }}>
        <Navbar />
      </div>

      {/* 2. Área Principal */}
      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
        <AppLayout
          navigation={<GlobalSidebar />}
          toolsHide={true}
          contentType="table"
          stickyHeader={true}
          breadcrumbs={
            <RouteTracker
              items={[
                { text: 'Administración', href: '#' },
                { text: 'Usuarios', href: '/users' },
              ]}
            />
          }
          content={
            <Box padding={{ top: 's' }}>
              <SpaceBetween size="m">
                <Flashbar
                  items={[
                    {
                      type: 'info',
                      dismissible: true,
                      content: 'Listado de usuarios cargado desde el servidor.',
                      id: 'message_1',
                    },
                  ]}
                />

                <Table
                  {...collectionProps}
                  selectedItems={selectedItems}
                  onSelectionChange={({ detail }) =>
                    setSelectedItems(detail.selectedItems as UserItem[])
                  }
                  columnDefinitions={COLUMN_DEFINITIONS}
                  items={items}
                  selectionType="single"
                  variant="full-page"
                  stickyHeader={true}
                  loading={loading} // Indicador de carga conectado
                  loadingText="Cargando usuarios..."
                  header={
                    <Header
                      counter={!loading ? `(${items.length})` : ''}
                      actions={
                        <SpaceBetween direction="horizontal" size="xs">
                          <Button disabled={selectedItems.length === 0}>
                            Editar
                          </Button>
                          <Button variant="primary">Nuevo Usuario</Button>
                        </SpaceBetween>
                      }
                    >
                      Gestión de Usuarios
                    </Header>
                  }
                  filter={
                    <TextFilter
                      {...filterProps}
                      filteringPlaceholder="Buscar por nombre, correo..."
                      countText={`${filteredItemsCount} coincidencias`}
                    />
                  }
                  pagination={<Pagination {...paginationProps} />}
                />
              </SpaceBetween>
            </Box>
          }
          splitPanel={getSplitPanelContent(selectedItems[0])}
          splitPanelOpen={isSplitPanelOpen}
          onSplitPanelToggle={({ detail }) => setIsSplitPanelOpen(detail.open)}
          splitPanelPreferences={splitPanelPreferences}
          onSplitPanelPreferencesChange={({ detail }) =>
            setSplitPanelPreferences(detail)
          }
        />
      </div>
    </div>
  );
}
