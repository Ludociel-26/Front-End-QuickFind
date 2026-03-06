import * as React from 'react';
import {
  Table,
  Box,
  SpaceBetween,
  Button,
  TextFilter,
  Header,
  Pagination,
  Select,
  AppLayout,
  StatusIndicator,
  Grid,
  FormField,
  Link,
  SplitPanel,
  ColumnLayout,
  Badge,
  Icon,
} from '@cloudscape-design/components';
import { useCollection } from '@cloudscape-design/collection-hooks';

import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import SecondaryHeader from '@/components/layouts/BreadcrumbNavBar';
import { Footer } from '@/components/layouts/AppFooter';

// --- ESTILOS VISUALES ---
const styles = `
  .awsui-table-container { padding-bottom: 2px; }
  
  .log-summary-card {
    position: relative;
    width: 100%;
    padding: 20px;
    border-radius: 12px;
    background: linear-gradient(135deg, #1d2c3f 0%, #0f1b2a 100%);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    margin-bottom: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    color: white;
  }
  .log-title { font-size: 18px; font-weight: 800; margin: 0; color: #fff; }
  .log-subtitle { font-size: 12px; color: #aab7b8; }
  
  .metric-box {
    background: #f8f8f8;
    border: 1px solid #eaeded;
    padding: 12px;
    border-radius: 8px;
    text-align: center;
  }
  .metric-value { font-size: 22px; font-weight: bold; color: #0972d3; }
  .metric-label { font-size: 11px; color: #545b64; text-transform: uppercase; }
`;

// --- MOCK DATA: REGISTROS DE ANÁLISIS QUÍMICOS ---
const MOCK_CHEMICAL_LOGS = [
  {
    id: 'QUI-20260216-0600',
    fecha: '16/02/2026',
    hora: '06:00',
    turno: 'Turno A',
    operador: 'Carlos Ramirez',
    estado: 'success',
    telemetria: {
      ph: 11.0,
      dureza: 5.0,
      suavizador: 0,
    },
    observaciones: null,
  },
  {
    id: 'QUI-20260216-0800',
    fecha: '16/02/2026',
    hora: '08:00',
    turno: 'Turno A',
    operador: 'Carlos Ramirez',
    estado: 'warning',
    telemetria: {
      ph: 10.2, // Fuera de rango (Min 10.5)
      dureza: 8.5,
      suavizador: 0,
    },
    observaciones:
      'Nivel de PH por debajo de la norma. Se realizó dosificación manual para estabilizar.',
  },
  {
    id: 'QUI-20260216-1000',
    fecha: '16/02/2026',
    hora: '10:00',
    turno: 'Turno A',
    operador: 'Carlos Ramirez',
    estado: 'error',
    telemetria: {
      ph: 10.8,
      dureza: 12.0, // Fuera de rango (Max 9.99)
      suavizador: 2.0, // Fuera de norma (Debe ser 0)
    },
    observaciones:
      'Dureza alta y presencia en suavizador. Se requiere mantenimiento urgente en filtros.',
  },
  {
    id: 'QUI-20260216-1600',
    fecha: '16/02/2026',
    hora: '16:00',
    turno: 'Turno B',
    operador: 'Jose Hernandez',
    estado: 'success',
    telemetria: {
      ph: 11.2,
      dureza: 2.0,
      suavizador: 0,
    },
    observaciones: null,
  },
];

// --- LÓGICA DE VALIDACIÓN DE RANGOS ---
const isPhValid = (ph: number) => ph >= 10.5 && ph <= 11.5;
const isDurezaValid = (dureza: number) => dureza < 10;
const isSuavizadorValid = (suavizador: number) => suavizador === 0;

// --- COLUMNAS DE LA TABLA ---
// FIX: Tipamos 'item' como 'any' en todo el arreglo
const COLUMN_DEFINITIONS = [
  {
    id: 'id',
    header: 'Folio',
    cell: (item: any) => <Link href="#">{item.id}</Link>,
    sortingField: 'id',
    minWidth: 150,
  },
  {
    id: 'fecha',
    header: 'Fecha',
    cell: (item: any) => `${item.fecha} ${item.hora}`,
    sortingField: 'fecha',
    minWidth: 130,
  },
  {
    id: 'turno',
    header: 'Turno',
    cell: (item: any) => <Badge color="blue">{item.turno}</Badge>,
    sortingField: 'turno',
    minWidth: 110,
  },
  {
    id: 'operador',
    header: 'Operador / Químico',
    cell: (item: any) => item.operador,
    sortingField: 'operador',
    minWidth: 170,
  },
  {
    id: 'ph',
    header: 'PH (10.5 - 11.5)',
    cell: (item: any) => (
      <span
        style={{
          color: isPhValid(item.telemetria.ph) ? 'inherit' : '#d13212',
          fontWeight: 'bold',
        }}
      >
        {item.telemetria.ph}
      </span>
    ),
    sortingField: 'ph',
    minWidth: 130,
  },
  {
    id: 'dureza',
    header: 'Dureza (< 10)',
    cell: (item: any) => (
      <span
        style={{
          color: isDurezaValid(item.telemetria.dureza) ? 'inherit' : '#d13212',
          fontWeight: 'bold',
        }}
      >
        {item.telemetria.dureza}
      </span>
    ),
    sortingField: 'dureza',
    minWidth: 120,
  },
  {
    id: 'suavizador',
    header: 'Suavizador (0)',
    cell: (item: any) => (
      <span
        style={{
          color: isSuavizadorValid(item.telemetria.suavizador)
            ? 'inherit'
            : '#d13212',
          fontWeight: 'bold',
        }}
      >
        {item.telemetria.suavizador}
      </span>
    ),
    sortingField: 'suavizador',
    minWidth: 130,
  },
  {
    id: 'estado',
    header: 'Estado de Agua',
    cell: (item: any) => (
      // FIX: as any
      <StatusIndicator type={item.estado as any}>
        {item.estado === 'success'
          ? 'En Norma'
          : item.estado === 'warning'
            ? 'Precaución'
            : 'Crítico'}
      </StatusIndicator>
    ),
    sortingField: 'estado',
    minWidth: 140,
  },
];

export default function ChemicalAnalysisLogsTable() {
  const [data] = React.useState(MOCK_CHEMICAL_LOGS);
  const [navigationOpen, setNavigationOpen] = React.useState(true);

  // FIX: Tipar como any[]
  const [selectedItems, setSelectedItems] = React.useState<any[]>([]);
  const [splitPanelOpen, setSplitPanelOpen] = React.useState(false);

  React.useEffect(() => {
    setSplitPanelOpen(selectedItems.length > 0);
  }, [selectedItems]);

  // FIX: Tipar como any y cambiar null a undefined
  const [turnoFilter, setTurnoFilter] = React.useState<any>({
    label: 'Todos',
    value: undefined,
  });

  const [preferences] = React.useState({
    pageSize: 50,
    visibleContent: [
      'id',
      'fecha',
      'turno',
      'operador',
      'ph',
      'dureza',
      'suavizador',
      'estado',
    ],
  });

  const {
    items,
    filteredItemsCount,
    collectionProps,
    paginationProps,
    filterProps,
  } = useCollection(data, {
    pagination: { pageSize: preferences.pageSize },
    sorting: {},
    selection: {},
    filtering: {
      empty: (
        // FIX: color as any
        <Box textAlign="center" color={'inherit' as any}>
          No hay registros
        </Box>
      ),
      noMatch: (
        // FIX: color as any
        <Box textAlign="center" color={'inherit' as any}>
          No se encontraron coincidencias
        </Box>
      ),
      // FIX: Tipar item como any
      filteringFunction: (item: any, text: string) => {
        const matchText =
          item.id.toLowerCase().includes(text.toLowerCase()) ||
          item.operador.toLowerCase().includes(text.toLowerCase());
        const matchTurno = turnoFilter.value
          ? item.turno === turnoFilter.value
          : true;
        return matchText && matchTurno;
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
        {/* FIX: @ts-ignore */}
        {/* @ts-ignore */}
        <SecondaryHeader
          breadcrumbs={[
            { text: 'Mantenimiento', href: '/' },
            { text: 'Consultas y Reportes', href: '#' },
            { text: 'Análisis Químicos', href: '#' },
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
        // FIX: Quitamos stickyHeader={true} inválido en AppLayout
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={({ detail }) => setSplitPanelOpen(detail.open)}
        // FIX: as any
        splitPanelPreferences={{ position: 'side', size: 380 } as any}
        splitPanel={
          <SplitPanel
            // FIX: Header envuelto en as any
            header={
              (<Header variant="h2">Detalle de Muestra de Agua</Header>) as any
            }
          >
            {selectedItems.length > 0 ? (
              <div style={{ paddingBottom: '20px' }}>
                {selectedItems.map((item) => (
                  <div key={item.id}>
                    {/* TARJETA DE RESUMEN */}
                    <div className="log-summary-card">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          <p className="log-subtitle">{item.id}</p>
                          <h3 className="log-title">Análisis Químico</h3>
                        </div>
                        {/* FIX: as any */}
                        <StatusIndicator type={item.estado as any} />
                      </div>
                      <div
                        style={{
                          marginTop: '12px',
                          fontSize: '13px',
                          color: '#cbd5e1',
                        }}
                      >
                        {/* FIX: Icon as any */}
                        <Icon name={'calendar' as any} size="small" />{' '}
                        {item.fecha} - {item.hora} hrs ({item.turno})
                      </div>
                      <div
                        style={{
                          marginTop: '4px',
                          fontSize: '13px',
                          color: '#cbd5e1',
                        }}
                      >
                        {/* FIX: Icon as any */}
                        <Icon name={'user-profile' as any} size="small" />{' '}
                        Químico / Operador: {item.operador}
                      </div>
                    </div>

                    <ColumnLayout columns={1} variant="text-grid">
                      {/* MÉTRICAS QUÍMICAS (Cajas visuales) */}
                      {/* FIX: variant as any */}
                      <Box
                        variant={'awsui-key-label' as any}
                        margin={{ bottom: 'xs' }}
                      >
                        Resultados Analíticos
                      </Box>
                      <Grid
                        gridDefinition={[
                          { colspan: 4 },
                          { colspan: 4 },
                          { colspan: 4 },
                        ]}
                      >
                        <div className="metric-box">
                          <div
                            className="metric-value"
                            style={{
                              color: isPhValid(item.telemetria.ph)
                                ? '#0972d3'
                                : '#d13212',
                            }}
                          >
                            {item.telemetria.ph}
                          </div>
                          <div className="metric-label">PH</div>
                        </div>
                        <div className="metric-box">
                          <div
                            className="metric-value"
                            style={{
                              color: isDurezaValid(item.telemetria.dureza)
                                ? '#0972d3'
                                : '#d13212',
                            }}
                          >
                            {item.telemetria.dureza}
                          </div>
                          <div className="metric-label">Dureza</div>
                        </div>
                        <div className="metric-box">
                          <div
                            className="metric-value"
                            style={{
                              color: isSuavizadorValid(
                                item.telemetria.suavizador,
                              )
                                ? '#0972d3'
                                : '#d13212',
                            }}
                          >
                            {item.telemetria.suavizador}
                          </div>
                          <div className="metric-label">Suavizador</div>
                        </div>
                      </Grid>

                      {/* REFERENCIAS DE NORMA */}
                      <div
                        style={{
                          margin: '20px 0',
                          borderTop: '1px solid #eaeded',
                        }}
                      />
                      {/* FIX: variant as any */}
                      <Box
                        variant={'awsui-key-label' as any}
                        margin={{ bottom: 'xs' }}
                      >
                        Parámetros de Norma
                      </Box>
                      <div
                        style={{
                          backgroundColor: '#fff',
                          padding: '12px',
                          borderRadius: '8px',
                          border: '1px solid #eaeded',
                          fontSize: '12px',
                          color: '#545b64',
                        }}
                      >
                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                          <li>
                            <strong>PH:</strong> 10.5 a 11.5
                          </li>
                          <li>
                            <strong>Dureza:</strong> Menor a 10 PPM
                          </li>
                          <li>
                            <strong>Suavizador:</strong> Exactamente 0 PPM
                          </li>
                        </ul>
                      </div>

                      {/* OBSERVACIONES Y AJUSTES */}
                      {item.observaciones && (
                        <>
                          <div
                            style={{
                              margin: '20px 0',
                              borderTop: '1px solid #eaeded',
                            }}
                          />
                          {/* FIX: variant as any */}
                          <Box
                            variant={'awsui-key-label' as any}
                            margin={{ bottom: 'xs' }}
                          >
                            Ajustes Realizados / Observaciones
                          </Box>
                          <div
                            style={{
                              fontSize: '13px',
                              backgroundColor: '#fff',
                              padding: '10px',
                              borderRadius: '4px',
                              border: '1px solid #eaeded',
                              borderLeft:
                                item.estado === 'error'
                                  ? '4px solid #d13212'
                                  : '4px solid #ff9900',
                            }}
                          >
                            {item.observaciones}
                          </div>
                        </>
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
                Selecciona una muestra para ver los detalles.
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
                setSelectedItems(detail.selectedItems)
              }
              selectionType="single"
              variant="full-page"
              stickyHeader={true}
              columnDefinitions={COLUMN_DEFINITIONS}
              visibleColumns={preferences.visibleContent}
              header={
                <Header
                  // FIX: variant as any
                  variant={'awsui-h1-sticky' as any}
                  counter={`(${items.length})`}
                  actions={
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button iconName="refresh" ariaLabel="Refrescar" />
                      <Button
                        iconName="download"
                        disabled={selectedItems.length === 0}
                      >
                        Exportar PDF
                      </Button>
                    </SpaceBetween>
                  }
                >
                  Registros: Análisis Químicos
                </Header>
              }
              filter={
                <SpaceBetween direction="vertical" size="xs">
                  <TextFilter
                    {...filterProps}
                    filteringPlaceholder="Buscar por Folio u Operador..."
                    countText={`${filteredItemsCount}`}
                  />
                  <Grid gridDefinition={[{ colspan: { default: 12, s: 6 } }]}>
                    <FormField label="Filtrar por Turno" stretch={true}>
                      <Select
                        selectedOption={turnoFilter}
                        // FIX: as any
                        onChange={({ detail }) =>
                          setTurnoFilter(detail.selectedOption as any)
                        }
                        // FIX: Reemplazar null por undefined y forzar as any
                        options={
                          [
                            { label: 'Todos', value: undefined },
                            { label: 'Turno A', value: 'Turno A' },
                            { label: 'Turno B', value: 'Turno B' },
                            { label: 'Turno C', value: 'Turno C' },
                          ] as any
                        }
                        placeholder="Todos"
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
