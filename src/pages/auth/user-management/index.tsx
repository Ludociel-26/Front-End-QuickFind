import axios from 'axios';
import { useContext, useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

// Imports de Cloudscape Design System
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
  CollectionPreferences,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';

// Contexto Global
import { AppContent } from '@/context/AppContext';

// Imports Locales
import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import { Footer } from '@/components/layouts/AppFooter';
import SecondaryHeader from '@/components/layouts/BreadcrumbNavBar';

// --- ESTILOS CSS ---
const awsStyles = `
  .awsui-table-row-selected > td {
    box-shadow: none !important;
    background-color: #f1faff !important;
    border-top: 2px solid #0972d3 !important;
    border-bottom: 2px solid #0972d3 !important;
  }

  .awsui-table-row-selected > td:first-child {
    border-left: 2px solid #0972d3 !important;
    border-top-left-radius: 12px !important; 
    border-bottom-left-radius: 12px !important;
  }

  .awsui-table-row-selected > td:last-child {
    border-right: 2px solid #0972d3 !important;
    border-top-right-radius: 12px !important;
    border-bottom-right-radius: 12px !important;
  }

  .awsui-table-select {
    padding-left: 10px !important;
  }
`;

// --- INTERFACES ---
export interface UserItem {
  id: string;
  email: string;
  rol_id: number;
  role_name: string;
  area_id: number;
  area_level: string;
  name: string;
  surname: string;
  country: string;
  birth_date: string;
  is_account_verified: boolean;
  is_active: boolean;
}

// --- COLUMNAS ---
const COLUMN_DEFINITIONS = [
  {
    id: 'name',
    header: 'Nombre',
    cell: (item: UserItem) => (
      <Link href="#" variant="primary" {...({ fontSize: 'body-m' } as any)}>
        <b>{`${item.name} ${item.surname}`}</b>
      </Link>
    ),
    sortingField: 'name',
    isRowHeader: true,
    minWidth: 180,
  },
  {
    id: 'email',
    header: 'Correo Electrónico',
    cell: (item: UserItem) => item.email,
    sortingField: 'email',
    minWidth: 200,
  },
  {
    id: 'role_name',
    header: 'Rol',
    cell: (item: UserItem) => (
      <Badge color={item.role_name === 'admin' ? 'blue' : 'grey'}>
        {item.role_name || 'Sin Rol'}
      </Badge>
    ),
    sortingField: 'role_name',
    minWidth: 120,
  },
  {
    id: 'area_level',
    header: 'Área',
    cell: (item: UserItem) => item.area_level || 'General',
    sortingField: 'area_level',
    minWidth: 140,
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

const ValueWithLabel = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <div>
    <Box variant={'awsui-key-label' as any} color="text-label">
      {label}
    </Box>
    <div>{children}</div>
  </div>
);

export default function UsersTable() {
  // 🚩 CORRECCIÓN: Extraemos el contexto sin la URL quemada y leemos la URL desde el .env de Vite
  const { alerts, addAlert, setPageLoading } = useContext(AppContent) || {};
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [navigationOpen, setNavigationOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(false);

  const [tablePreferences, setTablePreferences] = useState({
    pageSize: 50,
    visibleContent: ['name', 'email', 'role_name', 'area_level', 'status'],
  });

  const [splitPreferences, setSplitPreferences] = useState<any>({
    position: 'bottom',
  });

  const [usersData, setUsersData] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<UserItem[]>([]);

  const [splitPanelOpen, setSplitPanelOpen] = useState(false);
  const [splitPanelSize, setSplitPanelSize] = useState(280);

  const isMounted = useRef(true);
  // FIX: Candado para asegurar que la petición se haga solo 1 vez al entrar
  const hasFetched = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    if (setPageLoading) {
      setPageLoading(false);
    }
    return () => {
      isMounted.current = false;
    };
  }, [setPageLoading]);

  const fetchUsers = useCallback(
    async (isRefresh = false) => {
      const alertId = addAlert
        ? addAlert(
            'info',
            isRefresh
              ? 'Actualizando lista de usuarios...'
              : 'Obteniendo usuarios de la base de datos...',
            'Sincronizando',
            undefined,
            true,
          )
        : undefined;

      try {
        if (isMounted.current) {
          if (isRefresh) setRefreshing(true);
          else setLoading(true);
        }

        // 🚩 Aquí ya utiliza el backendUrl traído desde el .env
        const response = await axios.get(`${backendUrl}/api/user/all-users`, {
          withCredentials: true,
        });

        if (response.data.success) {
          if (isMounted.current) {
            setUsersData(response.data.users);
          }
          await new Promise((resolve) => setTimeout(resolve, 600));

          // FIX: Notificamos "Éxito" incondicionalmente para que cierre el Load Global siempre
          if (addAlert) {
            addAlert(
              'success',
              'Listado de usuarios cargado correctamente.',
              'Éxito',
              alertId,
              false,
            );
          }
        } else {
          // FIX: Notificamos "Advertencia" incondicionalmente
          if (addAlert) {
            addAlert(
              'warning',
              'No se encontraron usuarios o hubo un problema al leer la base de datos.',
              'Advertencia',
              alertId,
              false,
            );
          }
        }
      } catch (error: any) {
        console.error('Error cargando usuarios:', error);
        // FIX: Notificamos "Error" incondicionalmente
        if (addAlert) {
          addAlert(
            'error',
            error.message || 'Error al conectar con el servidor',
            'Fallo de Red',
            alertId,
            false,
          );
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [backendUrl, addAlert], // backendUrl ahora es una dependencia de entorno
  );

  // FIX: Solo ejecutar la llamada inicial si no se ha hecho ya
  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchUsers();
    }
  }, [fetchUsers]);

  useEffect(() => {
    if (selectedItems.length > 0) {
      setSplitPanelOpen(true);
    } else {
      setSplitPanelOpen(false);
    }
  }, [selectedItems]);

  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    paginationProps,
    filterProps,
  } = useCollection(usersData, {
    pagination: { pageSize: tablePreferences.pageSize },
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

  const getSplitPanelContent = (user: UserItem | undefined) => {
    if (!user)
      return (
        <SplitPanel header={'Detalles del Usuario' as any}>
          <Box textAlign="center" padding="l">
            Selecciona un usuario para ver detalles.
          </Box>
        </SplitPanel>
      );

    return (
      <SplitPanel
        header={
          (
            <Header
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Button>Restablecer Contraseña</Button>
                  <Button variant={user.is_active ? 'normal' : 'primary'}>
                    {user.is_active ? 'Deshabilitar' : 'Habilitar'}
                  </Button>
                </SpaceBetween>
              }
            >
              {user.name} {user.surname}
            </Header>
          ) as any
        }
        i18nStrings={{
          preferencesTitle: 'Preferencias del panel',
          preferencesPositionLabel: 'Posición del panel',
          preferencesPositionDescription: 'Elige posición',
          preferencesPositionSide: 'Lado',
          preferencesPositionBottom: 'Abajo',
          closeButtonAriaLabel: 'Cerrar panel',
          openButtonAriaLabel: 'Abrir panel',
          resizeHandleAriaLabel: 'Redimensionar panel',
        }}
      >
        <ColumnLayout columns={3} variant="text-grid">
          <SpaceBetween size="l">
            <div>
              <Box variant="h3" padding={{ bottom: 's' }}>
                Estado de Cuenta
              </Box>
              <SpaceBetween size="m">
                <ValueWithLabel label="Email">
                  {user.is_account_verified ? (
                    <StatusIndicator type="success">Verificado</StatusIndicator>
                  ) : (
                    <StatusIndicator type="pending">Pendiente</StatusIndicator>
                  )}
                </ValueWithLabel>
                <ValueWithLabel label="Acceso">
                  <StatusIndicator
                    type={user.is_active ? 'success' : 'stopped'}
                  >
                    {user.is_active ? 'Habilitado' : 'Deshabilitado'}
                  </StatusIndicator>
                </ValueWithLabel>
              </SpaceBetween>
            </div>
          </SpaceBetween>

          <SpaceBetween size="l">
            <div>
              <Box variant="h3" padding={{ bottom: 's' }}>
                Organización
              </Box>
              <SpaceBetween size="m">
                <ValueWithLabel label="Rol">
                  <Badge color="blue">{user.role_name}</Badge>
                </ValueWithLabel>
                <ValueWithLabel label="Área">{user.area_level}</ValueWithLabel>
              </SpaceBetween>
            </div>
          </SpaceBetween>

          <SpaceBetween size="l">
            <div>
              <Box variant="h3" padding={{ bottom: 's' }}>
                Datos Personales
              </Box>
              <SpaceBetween size="m">
                <ValueWithLabel label="Nombre">
                  {user.name} {user.surname}
                </ValueWithLabel>
                <ValueWithLabel label="Correo">{user.email}</ValueWithLabel>
                <ValueWithLabel label="País">{user.country}</ValueWithLabel>
              </SpaceBetween>
            </div>
          </SpaceBetween>
        </ColumnLayout>

        <Box padding="s"></Box>
      </SplitPanel>
    );
  };

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <style>{awsStyles}</style>

      <div
        id="sticky-nav-container"
        style={{ position: 'sticky', top: 0, zIndex: 1002 }}
      >
        <Navbar />
        <SecondaryHeader
          breadcrumbs={[
            { text: 'Sistema', href: '#' },
            { text: 'Usuarios', href: '/users' },
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
        contentType="table"
        notifications={
          alerts && alerts.length > 0 ? (
            <Flashbar items={alerts as any} stackItems={true} />
          ) : null
        }
        splitPanel={getSplitPanelContent(selectedItems[0])}
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={({ detail }) => setSplitPanelOpen(detail.open)}
        splitPanelSize={splitPanelSize}
        onSplitPanelResize={({ detail }) => setSplitPanelSize(detail.size)}
        splitPanelPreferences={splitPreferences}
        onSplitPanelPreferencesChange={({ detail }) =>
          setSplitPreferences(detail)
        }
        content={
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
            stickyHeaderVerticalOffset={90}
            loading={loading}
            loadingText="Cargando usuarios..."
            header={
              <Header
                variant="h1"
                counter={!loading ? `(${items.length})` : ''}
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button
                      iconName="refresh"
                      loading={refreshing}
                      onClick={() => fetchUsers(true)}
                      ariaLabel="Refrescar"
                    />
                    <Button disabled={selectedItems.length === 0}>
                      Editar
                    </Button>
                    <Button variant="primary">Crear usuario</Button>
                  </SpaceBetween>
                }
              >
                Usuarios
              </Header>
            }
            preferences={
              <CollectionPreferences
                title="Preferencias"
                confirmLabel="Confirmar"
                cancelLabel="Cancelar"
                preferences={tablePreferences as any}
                onConfirm={({ detail }) => setTablePreferences(detail as any)}
                pageSizePreference={{
                  title: 'Tamaño de página',
                  options: [
                    { value: 50, label: '50 recursos' },
                    { value: 100, label: '100 recursos' },
                    { value: 200, label: '200 recursos' },
                  ],
                }}
                visibleContentPreference={{
                  title: 'Seleccionar columnas visibles',
                  options: [
                    {
                      label: 'Propiedades principales',
                      options: COLUMN_DEFINITIONS.map((col) => ({
                        id: col.id,
                        label: col.header as string,
                      })),
                    },
                  ],
                }}
              />
            }
            filter={
              <TextFilter
                {...filterProps}
                filteringPlaceholder="Buscar usuarios..."
                countText={`${filteredItemsCount} coincidencias`}
              />
            }
            pagination={<Pagination {...paginationProps} />}
          />
        }
      />
      <Footer />
    </div>
  );
}
