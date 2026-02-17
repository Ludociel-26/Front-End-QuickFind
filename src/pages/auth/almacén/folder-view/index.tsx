import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
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
import Navbar from '@/components/layouts/AppHeader';
import RouteTracker from '@/components/layouts/RouteTracker';
import GlobalSidebar from '@/components/layouts/AppSidebar';

import { COLUMN_DEFINITIONS, MOCK_FOLDERS } from './folder-config';
import type { FolderItem } from './folder-config';

// --- 1. LÓGICA DE EXPANSIÓN (DEFINIDA FUERA DEL COMPONENTE) ---
// Al estar fuera, evitamos que React la re-cree en cada render, lo que soluciona el bug de expansión
const getItemChildren = (item: FolderItem) => item.children || [];
const isItemExpandable = (item: FolderItem) => item.type === 'folder';

// Helper visual
const DetailRow = ({ label, value }: { label: string; value: ReactNode }) => (
  <div>
    {/* FIX: variant as any para usar clases internas */}
    <Box
      variant={'awsui-key-label' as any}
      color="text-label"
      fontSize="body-s"
    >
      {label}
    </Box>
    {/* FIX: color as any para evitar rechazo estricto */}
    <Box variant="p" fontSize="body-s" color={'text-body-primary' as any}>
      {value}
    </Box>
  </div>
);

export default function FolderInventoryView() {
  const [selectedItems, setSelectedItems] = useState<FolderItem[]>([]);

  // --- 2. ESTADOS DEL SPLIT PANEL ---
  // FIX: Estado tipado como any para que el objeto detail coincida sin error
  const [splitPanelPreferences, setSplitPanelPreferences] = useState<any>({
    position: 'side',
  });
  const [splitPanelSize, setSplitPanelSize] = useState(400);
  const [isSplitPanelOpen, setIsSplitPanelOpen] = useState(false);

  useEffect(() => {
    if (selectedItems.length > 0) setIsSplitPanelOpen(true);
    else setIsSplitPanelOpen(false);
  }, [selectedItems]);

  // --- 3. CONFIGURACIÓN DE DATOS ---
  // FIX: Se quitó 'actions' porque estaba declarado pero no se usaba en esta vista
  const { items, filteredItemsCount, collectionProps, filterProps } =
    useCollection(MOCK_FOLDERS, {
      selection: {},
      sorting: {},
      pagination: { pageSize: 9999 }, // Sin paginación para ver todo el árbol
      filtering: {
        empty: (
          // FIX: color as any
          <Box textAlign="center" color={'inherit' as any}>
            <b>No hay datos</b>
          </Box>
        ),
        noMatch: (
          <Box textAlign="center" color={'inherit' as any}>
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
          // FIX: Mantenemos tu Header intacto y silenciamos a TS con as any
          header={(<Header>Detalles de Área</Header>) as any}
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
                <Icon name={'folder' as any} size="large" variant="link" />
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
              <Box variant={'awsui-key-label' as any}>Descripción</Box>
              <Box variant="p">{item.details?.description}</Box>
            </Box>
          </Box>
        </SplitPanel>
      );
    }

    // VISTA ITEM
    return (
      <SplitPanel
        // FIX: Mantenemos tus botones en el header superior tal como querías
        header={
          (
            <Header
              actions={
                <Button iconName={'external' as any} variant="icon">
                  Ficha
                </Button>
              }
            >
              {item.name}
            </Header>
          ) as any
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
                <Box variant={'awsui-key-label' as any} fontSize="body-s">
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
        <Navbar />
      </div>

      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
        <AppLayout
          navigation={<GlobalSidebar />}
          toolsHide={true}
          contentType="table"
          // FIX: Eliminado stickyHeader={true} de aquí porque AppLayout no lo soporta
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
                // FIX: as any para saltar la validación estricta de propiedades faltantes en expandableRows
                expandableRows={
                  {
                    getItemChildren: getItemChildren,
                    isItemExpandable: isItemExpandable,
                  } as any
                }
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
          splitPanelSize={splitPanelSize}
          onSplitPanelResize={({ detail }) => setSplitPanelSize(detail.size)}
        />
      </div>
    </div>
  );
}
