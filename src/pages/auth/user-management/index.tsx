import * as React from "react";
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
  Flashbar,        // Notificaciones
  StatusIndicator,
  Badge,
  SplitPanel,
  ColumnLayout
} from "@cloudscape-design/components";
import { useCollection } from "@cloudscape-design/collection-hooks";

// Imports Locales de Layouts
// Ajusta la cantidad de "../" según tu estructura real. 
// Si estás en src/pages/auth/table-users/:
import Navbar from '../../layouts/navbar/Navbar'; 
import GlobalSidebar from '../../layouts/sidebar/Sidebar';
import RouteTracker from '../../layouts/RouteTracker'; // <--- EL COMPONENTE NUEVO

// IMPORTACIÓN SEGURA (Tipos separados de valores)
import { COLUMN_DEFINITIONS, MOCK_USERS } from "./users-config";
import type { UserItem } from "./users-config";

// Componente auxiliar para detalles
const ValueWithLabel = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div>
    <Box variant="awsui-key-label" color="text-label">{label}</Box>
    <div>{children}</div>
  </div>
);

export default function UsersTable() {
  const [selectedItems, setSelectedItems] = React.useState<UserItem[]>([]);
  
  const [splitPanelPreferences, setSplitPanelPreferences] = React.useState({
    position: 'bottom' as const
  });
  const [isSplitPanelOpen, setIsSplitPanelOpen] = React.useState(false);

  React.useEffect(() => {
    if (selectedItems.length > 0) setIsSplitPanelOpen(true);
    else setIsSplitPanelOpen(false);
  }, [selectedItems]);

  const { items, actions, filteredItemsCount, collectionProps, paginationProps, filterProps } = useCollection(
    MOCK_USERS,
    {
      pagination: { pageSize: 10 },
      sorting: { defaultState: { sortingColumn: COLUMN_DEFINITIONS[0] } },
      selection: {},
      filtering: {
        empty: ( <Box textAlign="center" color="inherit"><b>No hay usuarios</b></Box> ),
        noMatch: ( 
          <Box textAlign="center" color="inherit">
            <b>No hay coincidencias</b>
            <Button onClick={() => actions.setFiltering("")}>Borrar filtro</Button>
          </Box> 
        ),
      },
    }
  );

  // --- CONTENIDO DEL PANEL DE DETALLE ---
  const getSplitPanelContent = (user: UserItem | undefined) => {
    if (!user) return <Box textAlign="center" padding="l">Selecciona un usuario.</Box>;

    return (
      <SplitPanel
        header={
          <Header
            actions={
              <SpaceBetween direction="horizontal" size="xs">
                <Button>Restablecer Contraseña</Button>
                {user.is_active ? (
                  <Button variant="normal" iconName="status-stopped">Deshabilitar Cuenta</Button>
                ) : (
                  <Button variant="primary" iconName="status-positive">Habilitar Acceso</Button>
                )}
              </SpaceBetween>
            }
          >
            {user.name} {user.surname}
          </Header>
        }
        i18nStrings={{
          preferencesTitle: "Preferencias",
          preferencesPositionLabel: "Posición",
          preferencesPositionDescription: "Elige posición",
          preferencesPositionSide: "Lado",
          preferencesPositionBottom: "Abajo",
          preferencesConfirm: "OK",
          preferencesCancel: "Cancelar",
          closeButtonAriaLabel: "Cerrar",
          openButtonAriaLabel: "Abrir",
          resizeHandleAriaLabel: "Redimensionar"
        }}
      >
        <ColumnLayout columns={3} variant="text-grid">
          
          <SpaceBetween size="l">
            <div>
              <Box variant="h3">Control de Acceso</Box>
              <SpaceBetween size="s">
                <ValueWithLabel label="Validación de Correo">
                   {user.is_account_verified ? (
                     <StatusIndicator type="success">Correo Verificado</StatusIndicator>
                   ) : (
                     <StatusIndicator type="pending">Pendiente de validación</StatusIndicator>
                   )}
                </ValueWithLabel>
                <ValueWithLabel label="Acceso al Sistema (Admin)">
                   {user.is_active ? (
                     <StatusIndicator type="success">Acceso Habilitado</StatusIndicator>
                   ) : (
                     <StatusIndicator type="stopped">Acceso Bloqueado/Inactivo</StatusIndicator>
                   )}
                </ValueWithLabel>
                <ValueWithLabel label="Token de Sesión">
                  <Box color="text-body-secondary" fontSize="body-s">
                    {user.auth_token ? "●●●●●●●●" : "No iniciado"}
                  </Box>
                </ValueWithLabel>
              </SpaceBetween>
            </div>
          </SpaceBetween>

          <SpaceBetween size="l">
             <div>
              <Box variant="h3">Información Laboral</Box>
              <SpaceBetween size="s">
                <ValueWithLabel label="Rol / Permisos">
                   <Badge color="blue">{user.role}</Badge>
                </ValueWithLabel>
                <ValueWithLabel label="Área / Departamento">
                   {user.area || "Sin asignar"}
                </ValueWithLabel>
                <ValueWithLabel label="Fecha Registro">{user.created_at}</ValueWithLabel>
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
                <ValueWithLabel label="Correo Electrónico">
                   {user.email}
                </ValueWithLabel>
                <ValueWithLabel label="País">{user.country}</ValueWithLabel>
                <ValueWithLabel label="Fecha Nacimiento">{user.birth_date}</ValueWithLabel>
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
      
      {/* 2. Área Principal con Scroll propio */}
      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
        <AppLayout
          navigation={<GlobalSidebar />}
          toolsHide={true}
          contentType="table"
          stickyHeader={true}
          
          // --- AQUÍ ESTÁ LA INTEGRACIÓN DEL ROUTE TRACKER ---
          breadcrumbs={
            <RouteTracker 
              items={[
                { text: "Administración", href: "#" },
                { text: "Usuarios", href: "/users" }
              ]}
            />
          }

          content={
            <Box padding={{ top: 's' }}>
              <SpaceBetween size="m">
                
                {/* NOTIFICACIONES BIEN UBICADAS */}
                <Flashbar
                  items={[
                    {
                      type: "info",
                      dismissible: true,
                      content: "Bienvenido a la gestión de usuarios.",
                      id: "message_1"
                    }
                  ]}
                />

                {/* TABLA */}
                <Table
                  {...collectionProps}
                  selectedItems={selectedItems}
                  onSelectionChange={({ detail }) => setSelectedItems(detail.selectedItems as UserItem[])}
                  columnDefinitions={COLUMN_DEFINITIONS}
                  items={items}
                  selectionType="single"
                  variant="full-page"
                  stickyHeader={true}
                  header={
                    <Header
                      counter={`(${items.length})`}
                      actions={
                        <SpaceBetween direction="horizontal" size="xs">
                          <Button disabled={selectedItems.length === 0}>Editar</Button>
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
                      filteringPlaceholder="Buscar por nombre, correo o rol..."
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
          onSplitPanelPreferencesChange={({ detail }) => setSplitPanelPreferences(detail)}
        />
      </div>
    </div>
  );
}