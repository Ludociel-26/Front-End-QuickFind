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
  StatusIndicator,
  Grid,
  FormField,
  Link,
  SplitPanel,
  ColumnLayout,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';

// --- IMPORTACIÓN DE DATOS ---
import { MOCK_DATA } from './mockData';

import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import SecondaryHeader from '@/components/layouts/BreadcrumbNavBar';
import { Footer } from '@/components/layouts/AppFooter';

// --- ESTILOS VISUALES ---
const styles = `
  /* 1. Ocultar scrollbars */
  div[class*="awsui_dropdown"],
  ul[class*="awsui_options-list"],
  div[class*="awsui_select-pane"] {
    scrollbar-width: none !important; 
    -ms-overflow-style: none !important;
  }
  div[class*="awsui_dropdown"]::-webkit-scrollbar,
  ul[class*="awsui_options-list"]::-webkit-scrollbar,
  div[class*="awsui_select-pane"]::-webkit-scrollbar { 
    display: none !important;
  }

  /* 2. Truncar texto en selects para que no rompa el diseño compacto */
  span[class*="awsui_option-content"] {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    display: block !important;
    max-width: 100% !important;
  }

  /* 3. Tabla limpia */
  .awsui-table-container {
      padding-bottom: 2px;
  }

  /* --- 4. TARJETA MODERNA (Glassmorphism) --- */
  .item-modern-card {
    position: relative;
    width: 100%;
    height: 180px; /* Altura reducida para panel delgado */
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    background-color: #232f3e;
    margin-bottom: 16px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .item-card-bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  .item-modern-card:hover .item-card-bg-image {
    transform: scale(1.1);
  }

  .item-card-blur-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 12px;
    background: rgba(15, 20, 30, 0.75); 
    backdrop-filter: blur(8px); 
    -webkit-backdrop-filter: blur(8px);
    border-top: 1px solid rgba(255, 255, 255, 0.15);
    color: white;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .card-title {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    margin: 0;
  }

  .card-desc {
    font-size: 11px;
    color: #cbd5e1;
    line-height: 1.3;
    max-height: 2.6em;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// --- INTERFAZ ---
export interface InventoryItem {
  clave: string;
  descripcion: string;
  ubicacion: string;
  usoEn: string;
  usoEn2: string;
  proveedores: string;
  fotos: boolean;
}

// --- COLUMNAS ---
const COLUMN_DEFINITIONS = [
  {
    id: 'clave',
    header: 'Clave',
    cell: (item: InventoryItem) => (
      <Link href="#" variant="primary">
        {item.clave}
      </Link>
    ),
    sortingField: 'clave',
    minWidth: 90,
  },
  {
    id: 'descripcion',
    header: 'Descripción',
    cell: (item: InventoryItem) => item.descripcion,
    sortingField: 'descripcion',
    minWidth: 220,
  },
  {
    id: 'ubicacion',
    header: 'Ubicación',
    cell: (item: InventoryItem) => item.ubicacion,
    sortingField: 'ubicacion',
    minWidth: 140,
  },
  {
    id: 'usoEn',
    header: 'Uso en',
    cell: (item: InventoryItem) => item.usoEn,
    sortingField: 'usoEn',
    minWidth: 140,
  },
  {
    id: 'usoEn2',
    header: 'Uso en 2',
    cell: (item: InventoryItem) => item.usoEn2 || '-',
    sortingField: 'usoEn2',
    minWidth: 130,
  },
  {
    id: 'proveedores',
    header: 'Proveedores',
    cell: (item: InventoryItem) => item.proveedores,
    sortingField: 'proveedores',
    minWidth: 150,
  },
  {
    id: 'fotos',
    header: 'Fotos',
    cell: (item: InventoryItem) => (
      <StatusIndicator type={item.fotos ? 'success' : 'stopped'}>
        {item.fotos ? 'Disponible' : 'Sin Foto'}
      </StatusIndicator>
    ),
    sortingField: 'fotos',
    minWidth: 110,
  },
];

export default function InventoryTable() {
  const [inventoryItems] = React.useState<InventoryItem[]>(MOCK_DATA);
  const [loading, setLoading] = React.useState(false);
  const [navigationOpen, setNavigationOpen] = React.useState(true);

  const [selectedItems, setSelectedItems] = React.useState<InventoryItem[]>([]);
  const [splitPanelOpen, setSplitPanelOpen] = React.useState(false);

  // CONFIGURACIÓN: Panel DELGADO (280px)
  const [splitPanelPreferences, setSplitPanelPreferences] = React.useState({
    position: 'side' as const,
    size: 280,
  });

  React.useEffect(() => {
    setSplitPanelOpen(selectedItems.length > 0);
  }, [selectedItems]);

  // --- FILTROS ---
  const [ubicacionFilter, setUbicacionFilter] = React.useState({
    label: 'Todas',
    value: null,
  });
  const [usoEnFilter, setUsoEnFilter] = React.useState({
    label: 'Todos',
    value: null,
  });
  const [usoEn2Filter, setUsoEn2Filter] = React.useState({
    label: 'Todos',
    value: null,
  });
  const [proveedorFilter, setProveedorFilter] = React.useState({
    label: 'Todos',
    value: null,
  });
  const [fotosFilter, setFotosFilter] = React.useState<{
    label: string;
    value: string | null;
  }>({ label: 'Todos', value: null });

  const [preferences, setPreferences] = React.useState({
    pageSize: 50,
    visibleContent: [
      'clave',
      'descripcion',
      'ubicacion',
      'usoEn',
      'usoEn2',
      'proveedores',
      'fotos',
    ],
  });

  const getFilterOptions = (
    field: keyof InventoryItem,
    placeholder: string,
  ) => {
    const uniqueValues = Array.from(
      new Set(inventoryItems.map((item) => item[field])),
    )
      .filter((val) => val !== '' && val !== null && val !== undefined)
      .sort();

    return [
      { label: placeholder, value: null },
      ...uniqueValues.map((val) => ({
        label: String(val),
        value: String(val),
      })),
    ];
  };

  const ubicacionOptions = React.useMemo(
    () => getFilterOptions('ubicacion', 'Todas'),
    [inventoryItems],
  );
  const usoEnOptions = React.useMemo(
    () => getFilterOptions('usoEn', 'Todos'),
    [inventoryItems],
  );
  const usoEn2Options = React.useMemo(
    () => getFilterOptions('usoEn2', 'Todos'),
    [inventoryItems],
  );
  const proveedorOptions = React.useMemo(
    () => getFilterOptions('proveedores', 'Todos'),
    [inventoryItems],
  );

  const fotosOptions = [
    { label: 'Todos', value: null },
    { label: 'Con Foto', value: 'true' },
    { label: 'Sin Foto', value: 'false' },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  const {
    items,
    filteredItemsCount,
    collectionProps,
    paginationProps,
    filterProps,
  } = useCollection(inventoryItems, {
    pagination: { pageSize: preferences.pageSize },
    sorting: {},
    selection: {},
    filtering: {
      empty: (
        <Box textAlign="center" color="inherit">
          No hay datos
        </Box>
      ),
      noMatch: (
        <Box textAlign="center" color="inherit">
          No se encontraron coincidencias
        </Box>
      ),
      filteringFunction: (item, text) => {
        const matchText =
          (item.descripcion || '').toLowerCase().includes(text.toLowerCase()) ||
          (item.clave || '').toLowerCase().includes(text.toLowerCase());
        const matchUbicacion = ubicacionFilter.value
          ? item.ubicacion === ubicacionFilter.value
          : true;
        const matchUsoEn = usoEnFilter.value
          ? item.usoEn === usoEnFilter.value
          : true;
        const matchUsoEn2 = usoEn2Filter.value
          ? item.usoEn2 === usoEn2Filter.value
          : true;
        const matchProveedor = proveedorFilter.value
          ? item.proveedores === proveedorFilter.value
          : true;
        let matchFotos = true;
        if (fotosFilter.value === 'true') matchFotos = item.fotos === true;
        if (fotosFilter.value === 'false') matchFotos = item.fotos === false;

        return (
          matchText &&
          matchUbicacion &&
          matchUsoEn &&
          matchUsoEn2 &&
          matchProveedor &&
          matchFotos
        );
      },
    },
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f2f3f3',
        paddingBottom: '24px',
      }}
    >
      <style>{styles}</style>

      <div
        id="sticky-nav-container"
        style={{ position: 'sticky', top: 0, zIndex: 1002, width: '100%' }}
      >
        <Navbar />
        <SecondaryHeader
          breadcrumbs={[
            { text: 'Servicios', href: '/' },
            { text: 'Almacén', href: '#' },
            { text: 'Inventario General', href: '#' },
          ]}
          isMenuOpen={navigationOpen}
          onMenuClick={() => setNavigationOpen(!navigationOpen)}
        />
      </div>

      <AppLayout
        headerSelector="#sticky-nav-container"
        navigation={<GlobalSidebar />}
        navigationOpen={navigationOpen}
        onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
        contentType="table"
        stickyHeader={true}
        // --- SPLIT PANEL (LADO DERECHO DELGADO) ---
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={({ detail }) => setSplitPanelOpen(detail.open)}
        splitPanelPreferences={splitPanelPreferences}
        onSplitPanelPreferencesChange={({ detail }) =>
          setSplitPanelPreferences(detail as any)
        }
        splitPanelI18nStrings={{
          preferencesTitle: 'Preferencias',
          preferencesPositionLabel: 'Posición',
          preferencesPositionDescription: 'Elige posición del panel',
          preferencesPositionSide: 'Lado',
          preferencesPositionBottom: 'Abajo',
          preferencesConfirm: 'OK',
          preferencesCancel: 'Cancelar',
          closeButtonAriaLabel: 'Cerrar',
          openButtonAriaLabel: 'Abrir',
          resizeHandleAriaLabel: 'Redimensionar',
        }}
        splitPanel={
          <SplitPanel
            header={
              <Header variant="h2">
                {selectedItems.length > 0 ? 'Detalles' : 'Detalles'}
              </Header>
            }
          >
            {selectedItems.length > 0 ? (
              <div style={{ paddingBottom: '20px' }}>
                {selectedItems.map((item, index) => (
                  <div key={item.clave}>
                    {index > 0 && (
                      <div
                        style={{
                          borderTop: '1px solid #eaeded',
                          margin: '20px 0',
                        }}
                      />
                    )}

                    {/* TARJETA MODERNA AJUSTADA PARA PANEL DELGADO */}
                    <div className="item-modern-card">
                      <img
                        src={
                          item.fotos
                            ? 'https://zummar.com/wp-content/uploads/2024/07/chumacera-de-banco-UCP-205-16-pedestal.jpg'
                            : 'https://www.svgrepo.com/show/451131/no-image.svg'
                        }
                        alt="Refacción"
                        className="item-card-bg-image"
                      />
                      <div className="item-card-blur-overlay">
                        <h3 className="card-title">{item.clave}</h3>
                        <div className="card-desc" title={item.descripcion}>
                          {item.descripcion}
                        </div>
                      </div>
                    </div>

                    {/* INFO COMPACTA */}
                    <ColumnLayout columns={1} variant="text-grid">
                      <div style={{ marginBottom: '8px' }}>
                        <Box
                          variant="awsui-key-label"
                          color="text-label"
                          fontSize="body-s"
                        >
                          Proveedor
                        </Box>
                        <div style={{ fontSize: '13px' }}>
                          {item.proveedores}
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '8px',
                          marginBottom: '8px',
                        }}
                      >
                        <div>
                          <Box
                            variant="awsui-key-label"
                            color="text-label"
                            fontSize="body-s"
                          >
                            Ubicación
                          </Box>
                          <div style={{ fontSize: '13px' }}>
                            {item.ubicacion}
                          </div>
                        </div>
                        <div>
                          <Box
                            variant="awsui-key-label"
                            color="text-label"
                            fontSize="body-s"
                          >
                            Estado
                          </Box>
                          <StatusIndicator
                            type={item.fotos ? 'success' : 'stopped'}
                          >
                            {item.fotos ? 'Foto OK' : 'Sin Foto'}
                          </StatusIndicator>
                        </div>
                      </div>

                      <div style={{ marginBottom: '8px' }}>
                        <Box
                          variant="awsui-key-label"
                          color="text-label"
                          fontSize="body-s"
                        >
                          Uso En
                        </Box>
                        <div style={{ fontSize: '13px' }}>{item.usoEn}</div>
                      </div>

                      {item.usoEn2 && (
                        <div>
                          <Box
                            variant="awsui-key-label"
                            color="text-label"
                            fontSize="body-s"
                          >
                            Uso Secundario
                          </Box>
                          <div style={{ fontSize: '13px' }}>{item.usoEn2}</div>
                        </div>
                      )}
                    </ColumnLayout>
                  </div>
                ))}
              </div>
            ) : (
              <Box
                textAlign="center"
                color="text-body-secondary"
                margin={{ top: 'xl' }}
              >
                Selecciona un ítem.
              </Box>
            )}
          </SplitPanel>
        }
        content={
          <div style={{ marginTop: '16px' }}>
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
              stickyHeaderVerticalOffset={100}
              loading={loading}
              loadingText="Cargando..."
              columnDefinitions={COLUMN_DEFINITIONS}
              visibleColumns={preferences.visibleContent}
              header={
                <Header
                  variant="awsui-h1-sticky"
                  counter={`(${items.length})`}
                  actions={
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button
                        iconName="refresh"
                        onClick={handleRefresh}
                        loading={loading}
                        ariaLabel="Refrescar"
                      />
                      <Button disabled={selectedItems.length === 0}>
                        Ver detalles
                      </Button>
                      <Button disabled={selectedItems.length === 0}>
                        Editar
                      </Button>
                      <Button variant="primary">Crear nuevo</Button>
                    </SpaceBetween>
                  }
                >
                  Inventario General
                </Header>
              }
              preferences={
                <CollectionPreferences
                  title="Preferencias"
                  confirmLabel="Confirmar"
                  cancelLabel="Cancelar"
                  preferences={preferences}
                  onConfirm={({ detail }) => setPreferences(detail)}
                  pageSizePreference={{
                    title: 'Filas por página',
                    options: [50, 100, 200, 400].map((n) => ({
                      value: n,
                      label: `${n} filas`,
                    })),
                  }}
                  contentDisplayPreference={{
                    title: 'Columnas visibles',
                    options: [
                      {
                        id: 'main-columns',
                        label: 'Información',
                        options: COLUMN_DEFINITIONS.map((c) => ({
                          id: c.id,
                          label: c.header as string,
                        })),
                      },
                    ],
                  }}
                />
              }
              filter={
                <SpaceBetween direction="vertical" size="xs">
                  {' '}
                  {/* Reducido espacio vertical */}
                  <TextFilter
                    {...filterProps}
                    filteringPlaceholder="Buscar..."
                    countText={`${filteredItemsCount}`}
                  />
                  {/* GRID COMPACTO: 
                    Configurado para usar columas pequeñas (2) en lugar de grandes (3 o 4).
                    Esto hace que no se estiren tanto horizontalmente.
                    Suman 10 columnas en total (2+2+2+2+2), dejando espacio libre a la derecha.
                  */}
                  <Grid
                    gridDefinition={[
                      { colspan: { default: 12, xxs: 6, s: 4, m: 2 } }, // Ubicación
                      { colspan: { default: 12, xxs: 6, s: 4, m: 2 } }, // Uso En
                      { colspan: { default: 12, xxs: 6, s: 4, m: 2 } }, // Uso En 2
                      { colspan: { default: 12, xxs: 6, s: 6, m: 2 } }, // Proveedor
                      { colspan: { default: 12, xxs: 12, s: 6, m: 2 } }, // Fotos
                    ]}
                  >
                    <FormField label="Ubicación" stretch={true}>
                      <Select
                        selectedOption={ubicacionFilter}
                        onChange={({ detail }) =>
                          setUbicacionFilter(detail.selectedOption)
                        }
                        options={ubicacionOptions}
                        placeholder="Todas"
                        filteringType="auto"
                        selectedAriaLabel="Seleccionado"
                        virtualScroll={true}
                      />
                    </FormField>

                    <FormField label="Uso En" stretch={true}>
                      <Select
                        selectedOption={usoEnFilter}
                        onChange={({ detail }) =>
                          setUsoEnFilter(detail.selectedOption)
                        }
                        options={usoEnOptions}
                        placeholder="Todos"
                        filteringType="auto"
                        selectedAriaLabel="Seleccionado"
                        virtualScroll={true}
                      />
                    </FormField>

                    <FormField label="Uso En (2)" stretch={true}>
                      <Select
                        selectedOption={usoEn2Filter}
                        onChange={({ detail }) =>
                          setUsoEn2Filter(detail.selectedOption)
                        }
                        options={usoEn2Options}
                        placeholder="Todos"
                        filteringType="auto"
                        selectedAriaLabel="Seleccionado"
                        virtualScroll={true}
                      />
                    </FormField>

                    <FormField label="Proveedor" stretch={true}>
                      <Select
                        selectedOption={proveedorFilter}
                        onChange={({ detail }) =>
                          setProveedorFilter(detail.selectedOption)
                        }
                        options={proveedorOptions}
                        placeholder="Todos"
                        filteringType="auto"
                        selectedAriaLabel="Seleccionado"
                        virtualScroll={true}
                      />
                    </FormField>

                    <FormField label="Fotos" stretch={true}>
                      <Select
                        selectedOption={fotosFilter}
                        onChange={({ detail }) =>
                          setFotosFilter(detail.selectedOption)
                        }
                        options={fotosOptions}
                        placeholder="Todos"
                        selectedAriaLabel="Seleccionado"
                      />
                    </FormField>
                  </Grid>
                </SpaceBetween>
              }
              pagination={<Pagination {...paginationProps} />}
            />
          </div>
        }
      />
      <Footer />
    </div>
  );
}
