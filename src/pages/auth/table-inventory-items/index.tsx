import * as React from 'react';
import {
  Table,
  Box,
  SpaceBetween,
  Button,
  TextFilter,
  Header,
  Pagination,
  CollectionPreferences,
  Select,
  AppLayout,
  Flashbar,
  StatusIndicator,
  Link,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';

// --- IMPORTANTE: AJUSTA LAS RUTAS SI ES NECESARIO ---
import Navbar from '../../layouts/navbar/Navbar';
import GlobalSidebar from '../../layouts/sidebar/Sidebar';
import RouteTracker from '../../layouts/RouteTracker';

// --- CORRECCIÓN DEL ERROR DE IMPORTACIÓN ---
// Importamos los valores normales
import { useInventory, CATEGORY_OPTIONS } from '@/hooks/use-inventory';
// Importamos la interfaz COMO TIPO para evitar el SyntaxError
import type { InventoryItem } from '@/hooks/use-inventory';

// --- CSS ESTILO AWS "CÁPSULA" (SIN SALTOS) ---
const awsCustomStyles = `
  /* 1. SEPARACIÓN */
  .awsui-table-container table {
    border-collapse: separate !important; 
    border-spacing: 0 4px !important;
  }
  
  /* 2. LIMPIEZA */
  .awsui-table-container td {
    border: none !important;
  }

  /* 3. SELECCIÓN ESTILO CÁPSULA (USANDO SHADOW INSET) */
  /* Fondo y líneas superior/inferior */
  tr[class*="awsui_row-selected_"] > td {
    background-color: #f1faff !important;
    color: #16191f !important;
    box-shadow: inset 0 2px 0 0 #0972d3, inset 0 -2px 0 0 #0972d3 !important;
  }

  /* ESQUINA IZQUIERDA: Redondeo + Línea Izquierda */
  tr[class*="awsui_row-selected_"] > td:first-child {
    border-top-left-radius: 8px !important;
    border-bottom-left-radius: 8px !important;
    box-shadow: inset 2px 0 0 0 #0972d3, inset 0 2px 0 0 #0972d3, inset 0 -2px 0 0 #0972d3 !important;
  }

  /* ESQUINA DERECHA: Redondeo + Línea Derecha */
  tr[class*="awsui_row-selected_"] > td:last-child {
    border-top-right-radius: 8px !important;
    border-bottom-right-radius: 8px !important;
    box-shadow: inset -2px 0 0 0 #0972d3, inset 0 2px 0 0 #0972d3, inset 0 -2px 0 0 #0972d3 !important;
  }

  /* 4. MODO OSCURO */
  @media (prefers-color-scheme: dark) {
    tr[class*="awsui_row-selected_"] > td {
      background-color: rgba(9, 114, 211, 0.15) !important;
      color: #ffffff !important;
    }
    tr[class*="awsui_row-selected_"] a {
      color: #7aadf3 !important;
    }
  }
`;

// --- DEFINICIÓN DE COLUMNAS (Tipado correcto) ---
const COLUMN_DEFINITIONS = [
  {
    id: 'name',
    header: 'Nombre del Producto',
    cell: (item: InventoryItem) => (
      <Link variant="primary" href={`#${item.id}`}>
        {item.name}
      </Link>
    ),
    sortingField: 'name',
    isRowHeader: true,
    minWidth: 200,
  },
  {
    id: 'category',
    header: 'Categoría',
    cell: (item: InventoryItem) => item.category,
    sortingField: 'category',
    minWidth: 150,
  },
  {
    id: 'status',
    header: 'Estado',
    cell: (item: InventoryItem) => (
      <StatusIndicator
        type={
          item.status === 'Available'
            ? 'success'
            : item.status === 'Out of Stock'
              ? 'error'
              : 'warning'
        }
      >
        {item.status}
      </StatusIndicator>
    ),
    sortingField: 'status',
    minWidth: 140,
  },
  {
    id: 'quantity',
    header: 'Cantidad',
    cell: (item: InventoryItem) => item.quantity,
    sortingField: 'quantity',
    minWidth: 100,
  },
  {
    id: 'lastUpdated',
    header: 'Última Actualización',
    cell: (item: InventoryItem) => item.lastUpdated,
    sortingField: 'lastUpdated',
    minWidth: 160,
  },
];

export default function InventoryTable() {
  const { items: inventoryItems, loading } = useInventory();

  const [selectedItems, setSelectedItems] = React.useState<InventoryItem[]>([]);
  const [categoryFilter, setCategoryFilter] = React.useState(
    CATEGORY_OPTIONS[0],
  );
  const [toolsOpen, setToolsOpen] = React.useState(false);

  // --- PREFERENCIAS (Estado para el engranaje) ---
  const [preferences, setPreferences] = React.useState({
    pageSize: 50, // 50 items por defecto
    visibleContent: ['name', 'category', 'status', 'quantity', 'lastUpdated'],
  });

  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    paginationProps,
    filterProps,
  } = useCollection(inventoryItems, {
    pagination: { pageSize: preferences.pageSize },
    sorting: {},
    selection: {},
    filtering: {
      filteringFunction: (item, text) => {
        const matchesText = item.name
          .toLowerCase()
          .includes(text.toLowerCase());
        const matchesCategory = categoryFilter?.value
          ? item.category === categoryFilter.value
          : true;
        return matchesText && matchesCategory;
      },
    },
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <style>{awsCustomStyles}</style>
      <Navbar />

      <AppLayout
        navigation={<GlobalSidebar />}
        contentType="table"
        stickyHeader={true}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        notifications={
          <Flashbar
            items={[
              {
                type: 'success',
                content: 'Inventario cargado correctamente.',
                dismissible: true,
                id: 'success_msg',
              },
              {
                type: 'info',
                content: 'Sistema funcionando en modo local.',
                dismissible: true,
                id: 'info_msg',
              },
            ]}
          />
        }
        breadcrumbs={
          <RouteTracker
            items={[
              { text: 'Almacén', href: '#' },
              { text: 'Inventario General', href: '/inventory' },
            ]}
          />
        }
        tools={
          <Box padding="m">
            <Header variant="h2">Ayuda</Header>
            <Box variant="p">Gestiona los activos del sistema.</Box>
          </Box>
        }
        content={
          <Table
            {...collectionProps}
            items={items}
            selectedItems={selectedItems}
            onSelectionChange={({ detail }) =>
              setSelectedItems(detail.selectedItems as InventoryItem[])
            }
            selectionType="multi"
            variant="full-page"
            stickyHeader={true}
            resizableColumns={true}
            loading={loading}
            // CONEXIÓN DE COLUMNAS (ColumnDefinitions + VisibleColumns)
            columnDefinitions={COLUMN_DEFINITIONS}
            visibleColumns={preferences.visibleContent}
            header={
              <Header
                variant="h1"
                counter={
                  selectedItems.length > 0
                    ? `(${selectedItems.length}/${items.length})`
                    : `(${items.length})`
                }
                info={
                  <Link variant="info" onClick={() => setToolsOpen(true)}>
                    Info
                  </Link>
                }
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button disabled={selectedItems.length === 0}>
                      Ver detalles
                    </Button>
                    <Button disabled={selectedItems.length === 0}>
                      Editar
                    </Button>
                    <Button disabled={selectedItems.length === 0}>
                      Borrar
                    </Button>
                    <Button variant="primary">Crear nuevo</Button>
                  </SpaceBetween>
                }
              >
                Inventario General
              </Header>
            }
            // CONFIGURACIÓN DEL ENGRANAJE (PREFERENCIAS)
            preferences={
              <CollectionPreferences
                title="Preferencias"
                confirmLabel="Confirmar"
                cancelLabel="Cancelar"
                preferences={preferences}
                onConfirm={({ detail }) => setPreferences(detail)}
                pageSizePreference={{
                  title: 'Tamaño de página',
                  options: [
                    { value: 10, label: '10 recursos' },
                    { value: 30, label: '30 recursos' },
                    { value: 50, label: '50 recursos' },
                  ],
                }}
                contentDisplayPreference={{
                  title: 'Columnas visibles',
                  options: [
                    {
                      id: 'properties',
                      label: 'Datos del Recurso',
                      options: [
                        {
                          id: 'name',
                          label: 'Nombre del Producto',
                          alwaysVisible: true,
                        },
                        { id: 'category', label: 'Categoría' },
                        { id: 'status', label: 'Estado' },
                        { id: 'quantity', label: 'Cantidad' },
                        { id: 'lastUpdated', label: 'Última Actualización' },
                      ],
                    },
                  ],
                }}
              />
            }
            filter={
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <div style={{ flexGrow: 1 }}>
                  <TextFilter
                    {...filterProps}
                    filteringPlaceholder="Buscar por nombre..."
                    countText={`${filteredItemsCount} coincidencias`}
                  />
                </div>
                <div style={{ minWidth: '200px' }}>
                  <Select
                    selectedOption={categoryFilter}
                    onChange={({ detail }) => {
                      setCategoryFilter(detail.selectedOption);
                      actions.setFiltering(filterProps.filteringText);
                    }}
                    options={CATEGORY_OPTIONS}
                    placeholder="Categoría"
                    ariaLabel="Filtrar por categoría"
                  />
                </div>
              </div>
            }
            pagination={<Pagination {...paginationProps} />}
          />
        }
      />
    </div>
  );
}
