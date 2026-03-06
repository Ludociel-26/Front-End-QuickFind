import axios from 'axios';
import { useContext, useState, useCallback, useEffect, useRef } from 'react';

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
  CollectionPreferences,
  Input,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';

// Contexto Global
import { AppContent } from '@/context/AppContext';

// Imports Locales
import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import { Footer } from '@/components/layouts/AppFooter';
import SecondaryHeader from '@/components/layouts/BreadcrumbNavBar';

// 👇 IMPORTACIÓN DE TU IMAGEN PARA EL ESTADO VACÍO 👇
import emptyStateImage from '@/assets/robot-empty.png';

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
`;

// --- INTERFACES ---
export interface RoleItem {
  rol_id: number;
  name: string;
  descripcion: string;
  createdAt?: string;
  updatedAt?: string;
}

// --- COMPONENTE: EMPTY STATE CON IMAGEN ---
const EmptyState = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action: React.ReactNode;
}) => {
  return (
    <Box textAlign="center" color="inherit">
      <Box padding={{ bottom: 's' }} variant="p" color="inherit">
        <b>{title}</b>
      </Box>
      <Box padding={{ bottom: 's' }} variant="p" color="inherit">
        {subtitle}
      </Box>
      <Box padding={{ bottom: 'l' }}>
        <img
          src={emptyStateImage}
          alt="Estado vacío"
          style={{
            maxWidth: '250px',
            width: '100%',
            display: 'block',
            margin: '0 auto',
          }}
        />
      </Box>
      {action}
    </Box>
  );
};

export default function RolesTable() {
  // 🚩 CORRECCIÓN: Usamos la variable de entorno para la URL del backend
  const { alerts, addAlert, setPageLoading } = useContext(AppContent) || {};
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [navigationOpen, setNavigationOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [rolesData, setRolesData] = useState<RoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItems, setSelectedItems] = useState<RoleItem[]>([]);

  const [tablePreferences, setTablePreferences] = useState({
    pageSize: 20,
    visibleContent: ['rol_id', 'name', 'descripcion'],
  });

  const isMounted = useRef(true);
  const hasFetched = useRef(false);

  // --- DEFINICIÓN DE COLUMNAS CON INLINE EDIT ---
  const COLUMN_DEFINITIONS = [
    {
      id: 'rol_id',
      header: 'ID',
      cell: (item: RoleItem) => item.rol_id,
      sortingField: 'rol_id',
      minWidth: 80,
      isRowHeader: true,
    },
    {
      id: 'name',
      header: 'Nombre del Rol',
      // Renderizado limpio, en negritas y capitalizado, sin colores.
      cell: (item: RoleItem) => (
        <strong style={{ textTransform: 'capitalize' }}>{item.name}</strong>
      ),
      sortingField: 'name',
      minWidth: 160,
      editConfig: {
        ariaLabel: 'Editar nombre del rol',
        editIconAriaLabel: 'editable',
        errorIconAriaLabel: 'Error de validación',
        editingCell: (item: RoleItem, { currentValue, setValue }: any) => (
          <Input
            autoFocus
            value={currentValue ?? item.name}
            onChange={(e) => setValue(e.detail.value)}
            placeholder="Ej. admin"
          />
        ),
        validation: (_item: RoleItem, value: string) => {
          if (!value || value.trim() === '')
            return 'El nombre del rol es requerido.';
          return undefined;
        },
      },
    },
    {
      id: 'descripcion',
      header: 'Descripción',
      cell: (item: RoleItem) => item.descripcion,
      sortingField: 'descripcion',
      minWidth: 350,
      editConfig: {
        ariaLabel: 'Editar descripción',
        editIconAriaLabel: 'editable',
        errorIconAriaLabel: 'Error de validación',
        editingCell: (item: RoleItem, { currentValue, setValue }: any) => (
          <Input
            autoFocus
            value={currentValue ?? item.descripcion}
            onChange={(e) => setValue(e.detail.value)}
            placeholder="Nivel de acceso..."
          />
        ),
        validation: (_item: RoleItem, value: string) => {
          if (!value || value.trim() === '')
            return 'La descripción es requerida.';
          if (value.length < 5) return 'La descripción es demasiado corta.';
          return undefined;
        },
      },
    },
  ];

  useEffect(() => {
    isMounted.current = true;
    if (setPageLoading) setPageLoading(false);
    return () => {
      isMounted.current = false;
    };
  }, [setPageLoading]);

  // --- OBTENER DATOS DE LA API REAL (A PRUEBA DE FALLOS) ---
  const fetchRoles = useCallback(
    async (isRefresh = false) => {
      const alertId = addAlert
        ? addAlert(
            'info',
            isRefresh
              ? 'Actualizando roles...'
              : 'Obteniendo catálogo de roles de la base de datos...',
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

        const response = await axios.get(`${backendUrl}/api/roles`, {
          withCredentials: true,
        });

        const resData = response.data;

        if (Array.isArray(resData) || resData.success) {
          if (isMounted.current) {
            const validData = Array.isArray(resData)
              ? resData
              : resData.roles || [];
            setRolesData(validData);
          }
          await new Promise((resolve) => setTimeout(resolve, 600));

          if (addAlert) {
            addAlert(
              'success',
              'Catálogo de roles cargado correctamente.',
              'Éxito',
              alertId,
              false,
            );
          }
        } else {
          if (addAlert) {
            addAlert(
              'warning',
              'No se encontraron roles o hubo un problema al leer la base de datos.',
              'Advertencia',
              alertId,
              false,
            );
          }
        }
      } catch (error: any) {
        console.error('Error cargando roles:', error);
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
    [backendUrl, addAlert],
  );

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchRoles();
    }
  }, [fetchRoles]);

  // --- LÓGICA DE GUARDADO INLINE HACIA LA API ---
  const handleInlineEditSave = async (
    item: RoleItem,
    column: any,
    newValue: string,
  ) => {
    try {
      await axios.put(
        `${backendUrl}/api/roles/${item.rol_id}`,
        { [column.id]: newValue },
        { withCredentials: true },
      );

      setRolesData((prevData) =>
        prevData.map((role) =>
          role.rol_id === item.rol_id
            ? { ...role, [column.id]: newValue }
            : role,
        ),
      );

      if (addAlert) {
        addAlert(
          'success',
          `El campo ${column.header} se actualizó correctamente.`,
          'Guardado exitoso',
          undefined,
          false,
        );
      }
    } catch (error: any) {
      console.error('Error actualizando rol:', error);
      if (addAlert) {
        addAlert(
          'error',
          'Ocurrió un error al intentar guardar los cambios. Intenta de nuevo.',
          'Error de guardado',
          undefined,
          false,
        );
      }
      throw error;
    }
  };

  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    paginationProps,
    filterProps,
  } = useCollection(rolesData, {
    pagination: { pageSize: tablePreferences.pageSize },
    sorting: { defaultState: { sortingColumn: COLUMN_DEFINITIONS[0] } },
    selection: {},
    filtering: {
      empty: (
        <EmptyState
          title="No hay roles del sistema"
          subtitle="No existen roles o niveles de acceso registrados para mostrar."
          action={<Button variant="primary">Crear rol</Button>}
        />
      ),
      noMatch: (
        <EmptyState
          title="No hay coincidencias"
          subtitle="No se encontraron roles que coincidan con la búsqueda."
          action={
            <Button onClick={() => actions.setFiltering('')}>
              Borrar filtro
            </Button>
          }
        />
      ),
    },
  });

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
            { text: 'Configuración', href: '#' },
            { text: 'Roles y Accesos', href: '/roles' },
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
        content={
          <Table
            {...collectionProps}
            selectedItems={selectedItems}
            onSelectionChange={({ detail }) =>
              setSelectedItems(detail.selectedItems as RoleItem[])
            }
            columnDefinitions={COLUMN_DEFINITIONS as any}
            items={items}
            selectionType="single"
            variant="full-page"
            stickyHeader={true}
            stickyHeaderVerticalOffset={90}
            loading={loading}
            loadingText="Cargando roles..."
            trackBy="rol_id"
            submitEdit={handleInlineEditSave as any}
            empty={
              <div style={{ padding: '40px 0' }}>{collectionProps.empty}</div>
            }
            header={
              <Header
                variant="h1"
                counter={!loading ? `(${items.length})` : ''}
                description="Administra los niveles de acceso y permisos dentro de la plataforma."
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button
                      iconName="refresh"
                      loading={refreshing}
                      onClick={() => fetchRoles(true)}
                      ariaLabel="Refrescar"
                    />
                    <Button disabled={selectedItems.length === 0}>
                      Eliminar
                    </Button>
                    <Button variant="primary">Nuevo rol</Button>
                  </SpaceBetween>
                }
              >
                Roles del Sistema
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
                    { value: 20, label: '20 recursos' },
                    { value: 50, label: '50 recursos' },
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
                filteringPlaceholder="Buscar rol (ej. admin)..."
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
