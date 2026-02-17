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
  .metric-value { font-size: 18px; font-weight: bold; color: #0972d3; }
  .metric-label { font-size: 11px; color: #545b64; text-transform: uppercase; }
  
  .check-item-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0; border-bottom: 1px solid #eaeded;
  }
  .check-item-row:last-child { border-bottom: none; }
`;

// --- MOCK DATA: REGISTROS DE VAPOR ---
const MOCK_VAPOR_LOGS = [
  {
    id: 'VAP-20260216-0800',
    fecha: '16/02/2026',
    hora: '08:00',
    turno: 'Turno A',
    operador: 'Carlos Ramirez',
    estado: 'success',
    telemetria: {
      kgVapor: 8.2,
      presComb: 5.5,
      lbsAire: 18,
      tempGases: 180,
      tempAgua: 95,
      tempTDia: 105,
      operacion: 'DIESEL',
      agua: 'SUAVE',
    },
    checks: {
      nivelTanque: true,
      seguridad: true,
      bombaAgua: true,
      columnaAgua: true,
      purgaFondo: true,
    },
    consumos: null, // No es cierre de turno
  },
  {
    id: 'VAP-20260216-1000',
    fecha: '16/02/2026',
    hora: '10:00',
    turno: 'Turno A',
    operador: 'Carlos Ramirez',
    estado: 'warning',
    telemetria: {
      kgVapor: 6.8,
      presComb: 4.0,
      lbsAire: 15,
      tempGases: 190,
      tempAgua: 85,
      tempTDia: 110,
      operacion: 'DIESEL',
      agua: 'SUAVE',
    },
    checks: {
      nivelTanque: true,
      seguridad: true,
      bombaAgua: true,
      columnaAgua: false,
      purgaFondo: true,
    },
    consumos: null,
    observaciones: 'Baja presión de vapor temporal por demanda en planta.',
  },
  {
    id: 'VAP-20260216-1400',
    fecha: '16/02/2026',
    hora: '14:00',
    turno: 'Turno A',
    operador: 'Carlos Ramirez',
    estado: 'success',
    telemetria: {
      kgVapor: 8.0,
      presComb: 5.0,
      lbsAire: 17,
      tempGases: 185,
      tempAgua: 90,
      tempTDia: 100,
      operacion: 'DIESEL',
      agua: 'SUAVE',
    },
    checks: {
      nivelTanque: true,
      seguridad: true,
      bombaAgua: true,
      columnaAgua: true,
      purgaFondo: true,
    },
    consumos: {
      dia: 120,
      tarde: 0,
      noche: 0,
      total: 120,
      diesel: 350,
      agua: 45,
      kgVaporTotal: 1500,
      sal: 20,
    }, // Cierre de turno A
  },
];

// --- COLUMNAS DE LA TABLA ---
const COLUMN_DEFINITIONS = [
  {
    id: 'id',
    header: 'Folio',
    cell: (item) => <Link href="#">{item.id}</Link>,
    sortingField: 'id',
    minWidth: 150,
  },
  {
    id: 'fecha',
    header: 'Fecha',
    cell: (item) => `${item.fecha} ${item.hora}`,
    sortingField: 'fecha',
    minWidth: 140,
  },
  {
    id: 'turno',
    header: 'Turno',
    cell: (item) => <Badge color="blue">{item.turno}</Badge>,
    sortingField: 'turno',
    minWidth: 110,
  },
  {
    id: 'operador',
    header: 'Operador',
    cell: (item) => item.operador,
    sortingField: 'operador',
    minWidth: 160,
  },
  {
    id: 'kgVapor',
    header: 'Kg. Vapor',
    cell: (item) => (
      <span
        style={{
          color:
            item.telemetria.kgVapor < 7 || item.telemetria.kgVapor > 8.5
              ? '#d13212'
              : 'inherit',
          fontWeight: 'bold',
        }}
      >
        {item.telemetria.kgVapor} Kg
      </span>
    ),
    sortingField: 'kgVapor',
    minWidth: 110,
  },
  {
    id: 'estado',
    header: 'Estado',
    cell: (item) => (
      <StatusIndicator type={item.estado}>
        {item.estado === 'success'
          ? 'Normal'
          : item.estado === 'warning'
            ? 'Observación'
            : 'Crítico'}
      </StatusIndicator>
    ),
    sortingField: 'estado',
    minWidth: 130,
  },
];

export default function VaporLogsTable() {
  const [data] = React.useState(MOCK_VAPOR_LOGS);
  const [loading, setLoading] = React.useState(false);
  const [navigationOpen, setNavigationOpen] = React.useState(true);

  const [selectedItems, setSelectedItems] = React.useState([]);
  const [splitPanelOpen, setSplitPanelOpen] = React.useState(false);

  React.useEffect(() => {
    setSplitPanelOpen(selectedItems.length > 0);
  }, [selectedItems]);

  const [turnoFilter, setTurnoFilter] = React.useState({
    label: 'Todos',
    value: null,
  });
  const [preferences, setPreferences] = React.useState({
    pageSize: 50,
    visibleContent: ['id', 'fecha', 'turno', 'operador', 'kgVapor', 'estado'],
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
        <Box textAlign="center" color="inherit">
          No hay registros
        </Box>
      ),
      noMatch: (
        <Box textAlign="center" color="inherit">
          No se encontraron coincidencias
        </Box>
      ),
      filteringFunction: (item, text) => {
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
        <SecondaryHeader
          breadcrumbs={[
            { text: 'Mantenimiento', href: '/' },
            { text: 'Consultas y Reportes', href: '#' },
            { text: 'Bitácora Central de Vapor', href: '#' },
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
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={({ detail }) => setSplitPanelOpen(detail.open)}
        splitPanelPreferences={{ position: 'side', size: 380 }}
        splitPanel={
          <SplitPanel
            header={<Header variant="h2">Detalles de Lectura</Header>}
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
                          <h3 className="log-title">Central de Vapor</h3>
                        </div>
                        <StatusIndicator type={item.estado as any} />
                      </div>
                      <div
                        style={{
                          marginTop: '12px',
                          fontSize: '13px',
                          color: '#cbd5e1',
                        }}
                      >
                        <Icon name="calendar" size="small" /> {item.fecha} -{' '}
                        {item.hora} hrs ({item.turno})
                      </div>
                      <div
                        style={{
                          marginTop: '4px',
                          fontSize: '13px',
                          color: '#cbd5e1',
                        }}
                      >
                        <Icon name="user-profile" size="small" /> Operador:{' '}
                        {item.operador}
                      </div>
                    </div>

                    <ColumnLayout columns={1} variant="text-grid">
                      {/* MÉTRICAS CLAVE (Cajas visuales) */}
                      <Box variant="awsui-key-label" margin={{ bottom: 'xs' }}>
                        Presiones y Temperaturas
                      </Box>
                      <Grid
                        gridDefinition={[
                          { colspan: 4 },
                          { colspan: 4 },
                          { colspan: 4 },
                        ]}
                      >
                        <div className="metric-box">
                          <div className="metric-value">
                            {item.telemetria.kgVapor}
                          </div>
                          <div className="metric-label">Kg Vapor</div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-value">
                            {item.telemetria.presComb}
                          </div>
                          <div className="metric-label">PSI Comb</div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-value">
                            {item.telemetria.tempGases}°
                          </div>
                          <div className="metric-label">Gases</div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-value">
                            {item.telemetria.tempAgua}°
                          </div>
                          <div className="metric-label">Agua</div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-value">
                            {item.telemetria.tempTDia}°
                          </div>
                          <div className="metric-label">T. Día</div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-value">
                            {item.telemetria.lbsAire}
                          </div>
                          <div className="metric-label">Lbs Aire</div>
                        </div>
                      </Grid>

                      <div
                        style={{
                          margin: '20px 0',
                          borderTop: '1px solid #eaeded',
                        }}
                      />

                      {/* MODOS DE OPERACIÓN */}
                      <Box variant="awsui-key-label" margin={{ bottom: 'xs' }}>
                        Modo de Operación
                      </Box>
                      <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                        <div>
                          <span style={{ fontSize: '11px', color: '#545b64' }}>
                            QUEMADOR
                          </span>
                          <br />
                          <Badge color="grey">
                            {item.telemetria.operacion}
                          </Badge>
                        </div>
                        <div>
                          <span style={{ fontSize: '11px', color: '#545b64' }}>
                            AGUA
                          </span>
                          <br />
                          <Badge color="grey">{item.telemetria.agua}</Badge>
                        </div>
                      </Grid>

                      <div
                        style={{
                          margin: '20px 0',
                          borderTop: '1px solid #eaeded',
                        }}
                      />

                      {/* CHECKLIST VISUAL */}
                      <Box variant="awsui-key-label" margin={{ bottom: 'xs' }}>
                        Validaciones (Checks)
                      </Box>
                      <div>
                        <div className="check-item-row">
                          <span style={{ fontSize: '13px' }}>
                            Nivel Comb. Tanque Día
                          </span>
                          <StatusIndicator
                            type={item.checks.nivelTanque ? 'success' : 'error'}
                          />
                        </div>
                        <div className="check-item-row">
                          <span style={{ fontSize: '13px' }}>
                            Disp. de Seguridad
                          </span>
                          <StatusIndicator
                            type={item.checks.seguridad ? 'success' : 'error'}
                          />
                        </div>
                        <div className="check-item-row">
                          <span style={{ fontSize: '13px' }}>
                            Bomba Alim. Agua
                          </span>
                          <StatusIndicator
                            type={item.checks.bombaAgua ? 'success' : 'error'}
                          />
                        </div>
                        <div className="check-item-row">
                          <span style={{ fontSize: '13px' }}>
                            Columna de Agua
                          </span>
                          <StatusIndicator
                            type={item.checks.columnaAgua ? 'success' : 'error'}
                          />
                        </div>
                        <div className="check-item-row">
                          <span style={{ fontSize: '13px' }}>
                            Purga de Fondo
                          </span>
                          <StatusIndicator
                            type={item.checks.purgaFondo ? 'success' : 'error'}
                          />
                        </div>
                      </div>

                      {/* CONSUMOS (Solo si existen) */}
                      {item.consumos && (
                        <>
                          <div
                            style={{
                              margin: '20px 0',
                              borderTop: '1px solid #eaeded',
                            }}
                          />
                          <Box
                            variant="awsui-key-label"
                            margin={{ bottom: 'xs' }}
                          >
                            Cierre de Turno (Consumos)
                          </Box>
                          <div
                            style={{
                              backgroundColor: '#f0f8ff',
                              padding: '12px',
                              borderRadius: '8px',
                              border: '1px solid #0972d3',
                            }}
                          >
                            <Grid
                              gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}
                            >
                              <div style={{ marginBottom: '8px' }}>
                                <span
                                  style={{ fontSize: '11px', color: '#545b64' }}
                                >
                                  DIESEL TOTAL
                                </span>
                                <br />
                                <strong>{item.consumos.diesel} Lts</strong>
                              </div>
                              <div style={{ marginBottom: '8px' }}>
                                <span
                                  style={{ fontSize: '11px', color: '#545b64' }}
                                >
                                  AGUA TOTAL
                                </span>
                                <br />
                                <strong>{item.consumos.agua} M3</strong>
                              </div>
                              <div>
                                <span
                                  style={{ fontSize: '11px', color: '#545b64' }}
                                >
                                  KG VAPOR TOT.
                                </span>
                                <br />
                                <strong>{item.consumos.kgVaporTotal} Kg</strong>
                              </div>
                              <div>
                                <span
                                  style={{ fontSize: '11px', color: '#545b64' }}
                                >
                                  SAL
                                </span>
                                <br />
                                <strong>{item.consumos.sal} Kg</strong>
                              </div>
                            </Grid>
                          </div>
                        </>
                      )}

                      {/* OBSERVACIONES */}
                      {item.observaciones && (
                        <>
                          <div
                            style={{
                              margin: '20px 0',
                              borderTop: '1px solid #eaeded',
                            }}
                          />
                          <Box
                            variant="awsui-key-label"
                            margin={{ bottom: 'xs' }}
                          >
                            Observaciones
                          </Box>
                          <div
                            style={{
                              fontSize: '13px',
                              backgroundColor: '#fff',
                              padding: '10px',
                              borderRadius: '4px',
                              border: '1px solid #eaeded',
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
                Selecciona una lectura para ver los detalles.
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
                  variant="awsui-h1-sticky"
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
                  Registros: Central de Vapor
                </Header>
              }
              filter={
                <SpaceBetween direction="vertical" size="xs">
                  <TextFilter
                    {...filterProps}
                    filteringPlaceholder="Buscar por ID u Operador..."
                    countText={`${filteredItemsCount}`}
                  />
                  <Grid gridDefinition={[{ colspan: { default: 12, s: 6 } }]}>
                    <FormField label="Filtrar por Turno" stretch={true}>
                      <Select
                        selectedOption={turnoFilter}
                        onChange={({ detail }) =>
                          setTurnoFilter(detail.selectedOption)
                        }
                        options={[
                          { label: 'Todos', value: null },
                          { label: 'Turno A', value: 'Turno A' },
                          { label: 'Turno B', value: 'Turno B' },
                          { label: 'Turno C', value: 'Turno C' },
                        ]}
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
