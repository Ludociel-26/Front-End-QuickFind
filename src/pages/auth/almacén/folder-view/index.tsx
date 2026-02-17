import * as React from 'react';
import {
  AppLayout,
  Table,
  Header,
  SplitPanel,
  Box,
  SpaceBetween,
  Button,
  ColumnLayout,
  StatusIndicator,
  TextFilter,
  Badge,
  Icon,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';

// Ajusta las rutas según tu proyecto
import Navbar from '../../../components/layouts/navbar/Navbar';
import RouteTracker from '../../../../components/layouts/RouteTracker';
import GlobalSidebar from '../../../components/layouts/sidebar/Sidebar';

import { COLUMN_DEFINITIONS, MOCK_FOLDERS } from './folder-config';
import type { FolderItem } from './folder-config';

// --- 1. LÓGICA DE EXPANSIÓN (DEFINIDA FUERA DEL COMPONENTE) ---
// Al estar fuera, evitamos que React la re-cree en cada render, lo que soluciona el bug de expansión
const getItemChildren = (item: FolderItem) => item.children || [];
const isItemExpandable = (item: FolderItem) => item.type === 'folder';

// Helper visual
const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div>
    <Box variant="awsui-key-label" color="text-label" fontSize="body-s">
      {label}
    </Box>
    <Box variant="p" fontSize="body-s" color="text-body-primary">
      {value}
    </Box>
  </div>
);

export default function FolderInventoryView() {
  const [selectedItems, setSelectedItems] = React.useState<FolderItem[]>([]);

  // --- 2. ESTADOS DEL SPLIT PANEL (SOLUCIÓN DEL ERROR) ---
  const [splitPanelPreferences, setSplitPanelPreferences] = React.useState({
    position: 'side' as const,
  });
  const [splitPanelSize, setSplitPanelSize] = React.useState(400); // Estado para el tamaño
  const [isSplitPanelOpen, setIsSplitPanelOpen] = React.useState(false);

  React.useEffect(() => {
    if (selectedItems.length > 0) setIsSplitPanelOpen(true);
    else setIsSplitPanelOpen(false);
  }, [selectedItems]);

  // --- 3. CONFIGURACIÓN DE DATOS ---
  const { items, actions, filteredItemsCount, collectionProps, filterProps } =
    useCollection(MOCK_FOLDERS, {
      selection: {},
      sorting: {},
      pagination: { pageSize: 9999 }, // Sin paginación para ver todo el árbol
      filtering: {
        empty: (
          <Box textAlign="center" color="inherit">
            <b>No hay datos</b>
          </Box>
        ),
        noMatch: (
          <Box textAlign="center" color="inherit">
            <b>No hay coincidencias</b>
          </Box>
        ),
        filteringFunction: (item, filteringText) => {
          if (!filteringText) return true;
          const term = filteringText.toLowerCase();
          // Búsqueda profunda (Padre e Hijos)
          const checkMatch = (i: FolderItem): boolean => {
            const matchSelf =
              i.name.toLowerCase().includes(term) ||
              (i.details?.sku?.toLowerCase().includes(term) ?? false);
            if (matchSelf) return true;
            if (i.children)
              return i.children.some((child) => checkMatch(child));
            return false;
          };
          return checkMatch(item);
        },
      },
    });

  // --- CONTENIDO DEL PANEL ---
  const getSplitPanelContent = (item?: FolderItem) => {
    if (!item)
      return (
        <Box textAlign="center" padding="l">
          Selecciona un elemento.
        </Box>
      );

    // VISTA CARPETA
    if (item.type === 'folder') {
      return (
        <SplitPanel
          header={<Header>Detalles de Área</Header>}
          i18nStrings={{
            preferencesTitle: 'Preferencias',
            preferencesPositionLabel: 'Posición',
            preferencesPositionDescription: 'Ajustar vista',
            preferencesPositionSide: 'Lateral',
            preferencesPositionBottom: 'Inferior',
            preferencesConfirm: 'OK',
            preferencesCancel: 'Cancelar',
            closeButtonAriaLabel: 'Cerrar',
            openButtonAriaLabel: 'Abrir',
            resizeHandleAriaLabel: 'Redimensionar',
          }}
        >
          <Box padding="l">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  padding: '12px',
                  background: 'var(--color-background-container-content)',
                  borderRadius: '8px',
                  border: '1px solid var(--color-border-divider-default)',
                  marginRight: '15px',
                }}
              >
                <Icon name="folder" size="large" variant="link" />
              </div>
              <div>
                <Box variant="h2">{item.name}</Box>
                <Badge color="blue">Contenedor</Badge>
              </div>
            </div>
            <ColumnLayout columns={2} variant="text-grid">
              <DetailRow
                label="Ubicación"
                value={item.details?.location || 'N/A'}
              />
              <DetailRow
                label="Responsable"
                value={item.details?.manager || 'N/A'}
              />
            </ColumnLayout>
            <Box margin={{ top: 'l' }}>
              <Box variant="awsui-key-label">Descripción</Box>
              <Box variant="p">{item.details?.description}</Box>
            </Box>
          </Box>
        </SplitPanel>
      );
    }

    // VISTA ITEM
    return (
      <SplitPanel
        header={
          <Header
            actions={
              <Button iconName="external" variant="icon">
                Ficha
              </Button>
            }
          >
            {item.name}
          </Header>
        }
        i18nStrings={{
          preferencesTitle: 'Preferencias',
          preferencesPositionLabel: 'Posición',
          preferencesPositionDescription: 'Ajustar vista',
          preferencesPositionSide: 'Lateral',
          preferencesPositionBottom: 'Inferior',
          preferencesConfirm: 'OK',
          preferencesCancel: 'Cancelar',
          closeButtonAriaLabel: 'Cerrar',
          openButtonAriaLabel: 'Abrir',
          resizeHandleAriaLabel: 'Redimensionar',
        }}
      >
        <Box padding={{ bottom: 'l' }}>
          <div
            style={{
              width: '100%',
              height: '200px',
              backgroundColor: 'var(--color-background-container-content)',
              border: '1px solid var(--color-border-divider-default)',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item.details?.image ? (
              <img
                src={item.details.image}
                alt={item.name}
                style={{ maxHeight: '100%', maxWidth: '100%', padding: '10px' }}
              />
            ) : (
              <Box color="text-body-secondary">Sin imagen</Box>
            )}
          </div>

          <ColumnLayout columns={2} variant="text-grid">
            <SpaceBetween size="m">
              <DetailRow label="Proveedor" value={item.details?.supplier} />
              <DetailRow label="SKU" value={item.details?.sku} />
            </SpaceBetween>
            <SpaceBetween size="m">
              <DetailRow label="Ubicación" value={item.details?.location} />
              <div>
                <Box variant="awsui-key-label" fontSize="body-s">
                  Stock
                </Box>
                <StatusIndicator
                  type={
                    item.details!.stock! > item.details!.min_stock!
                      ? 'success'
                      : 'error'
                  }
                >
                  {item.details?.stock} Unidades
                </StatusIndicator>
              </div>
            </SpaceBetween>
          </ColumnLayout>

          <Box margin={{ top: 'm' }}>
            <Box variant="h5">Descripción</Box>
            <Box variant="p" color="text-body-secondary">
              {item.details?.description}
            </Box>
          </Box>

          <Box margin={{ top: 'l' }}>
            <Button fullWidth variant="primary">
              Solicitar
            </Button>
          </Box>
        </Box>
      </SplitPanel>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flexShrink: 0, zIndex: 1001 }}>
        {' '}
        <Navbar />{' '}
      </div>

      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
        <AppLayout
          navigation={<GlobalSidebar />}
          toolsHide={true}
          contentType="table"
          stickyHeader={true}
          breadcrumbs={
            <RouteTracker
              items={[
                { text: 'Almacén', href: '#' },
                { text: 'Explorador', href: '/folders' },
              ]}
            />
          }
          content={
            <Box padding={{ top: 's' }}>
              <Table
                {...collectionProps}
                trackBy="id"
                selectedItems={selectedItems}
                onSelectionChange={({ detail }) =>
                  setSelectedItems(detail.selectedItems as FolderItem[])
                }
                columnDefinitions={COLUMN_DEFINITIONS}
                items={items}
                selectionType="single"
                variant="full-page"
                stickyHeader={true}
                // --- 4. EXPANSIÓN CORREGIDA ---
                expandableRows={{
                  getItemChildren: getItemChildren,
                  isItemExpandable: isItemExpandable,
                }}
                header={
                  <Header
                    counter={`(${items.length} Áreas)`}
                    actions={
                      <SpaceBetween direction="horizontal" size="xs">
                        <Button>Importar</Button>
                        <Button variant="primary">Nueva Carpeta</Button>
                      </SpaceBetween>
                    }
                  >
                    Inventario Jerárquico
                  </Header>
                }
                filter={
                  <TextFilter
                    {...filterProps}
                    filteringPlaceholder="Buscar carpeta, SKU..."
                    countText={`${filteredItemsCount} resultados`}
                  />
                }
              />
            </Box>
          }
          // --- 5. CONFIGURACIÓN COMPLETA DEL SPLIT PANEL ---
          splitPanel={getSplitPanelContent(selectedItems[0])}
          splitPanelOpen={isSplitPanelOpen}
          onSplitPanelToggle={({ detail }) => setIsSplitPanelOpen(detail.open)}
          splitPanelPreferences={splitPanelPreferences}
          onSplitPanelPreferencesChange={({ detail }) =>
            setSplitPanelPreferences(detail)
          }
          // Aquí solucionamos el error: pasamos size Y el handler
          splitPanelSize={splitPanelSize}
          onSplitPanelResize={({ detail }) => setSplitPanelSize(detail.size)}
        />
      </div>
    </div>
  );
}
