import { useState, useEffect } from 'react';
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
  .metric-value { font-size: 18px; font-weight: bold; color: #0972d3; }
  .metric-label { font-size: 11px; color: #545b64; text-transform: uppercase; }
  
  .check-item-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 8px 0; border-bottom: 1px solid #eaeded;
  }
  .check-item-row:last-child { border-bottom: none; }
`;

// --- MOCK DATA: REGISTROS DE COMPRESOR DE AIRE ---
const MOCK_AIRE_LOGS = [
  {
    id: 'AIR-20260216-0600',
    fecha: '16/02/2026',
    hora: '06:00',
    turno: 'Turno A',
    operador: 'Miguel Sanchez',
    estado: 'success',
    telemetria: {
      temperaturas: {
        sullFinal: 85,
        gdFinal: 82,
      },
      presiones: {
        sullFinal: 110,
        gdFinal: 115,
      },
      checks: {
        fuga_aire: 'NO',
        fuga_aceite: 'NO',
        ruido_extrano: 'NO',
        purga_test: 'OFF',
        mirilla_filtro: 'LLENO',
      },
      cierre: null, // No es turno C
    },
  },
  {
    id: 'AIR-20260216-0800',
    fecha: '16/02/2026',
    hora: '08:00',
    turno: 'Turno A',
    operador: 'Miguel Sanchez',
    estado: 'warning',
    telemetria: {
      temperaturas: {
        sullFinal: 96,
        gdFinal: 85, // Sull fuera de rango (>95)
      },
      presiones: {
        sullFinal: 105,
        gdFinal: 112,
      },
      checks: {
        fuga_aire: 'NO',
        fuga_aceite: 'NO',
        ruido_extrano: 'NO',
        purga_test: 'OFF',
        mirilla_filtro: 'VACIO',
      },
      cierre: null,
    },
    observaciones:
      'Temperatura del compresor Sull ligeramente alta al final del bloque. Mirilla de purga vacía.',
  },
  {
    id: 'AIR-20260216-2200',
    fecha: '16/02/2026',
    hora: '22:00',
    turno: 'Turno C',
    operador: 'Roberto Gomez',
    estado: 'success',
    telemetria: {
      temperaturas: {
        sullFinal: 80,
        gdFinal: 81,
      },
      presiones: {
        sullFinal: 115,
        gdFinal: 115,
      },
      checks: {
        fuga_aire: 'NO',
        fuga_aceite: 'NO',
        ruido_extrano: 'NO',
        purga_test: 'ON',
        mirilla_filtro: 'LLENO',
      },
      cierre: {
        horas_sull: 12450.5,
        horas_gd: 8320.0,
      }, // Cierre de turno C (Horómetros)
    },
  },
];

// --- COLUMNAS DE LA TABLA ---
// FIX: Tipamos 'item' como 'any' para satisfacer a TS
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
    header: 'Operador',
    cell: (item: any) => item.operador,
    sortingField: 'operador',
    minWidth: 160,
  },
  {
    id: 'tempSull',
    header: 'Temp Sull (°C)',
    cell: (item: any) => (
      <span
        style={{
          color:
            item.telemetria.temperaturas.sullFinal > 95 ? '#d13212' : 'inherit',
          fontWeight: 'bold',
        }}
      >
        {item.telemetria.temperaturas.sullFinal}°
      </span>
    ),
    sortingField: 'tempSull',
    minWidth: 120,
  },
  {
    id: 'tempGD',
    header: 'Temp GD (°C)',
    cell: (item: any) => (
      <span
        style={{
          color:
            item.telemetria.temperaturas.gdFinal > 95 ? '#d13212' : 'inherit',
          fontWeight: 'bold',
        }}
      >
        {item.telemetria.temperaturas.gdFinal}°
      </span>
    ),
    sortingField: 'tempGD',
    minWidth: 120,
  },
  {
    id: 'estado',
    header: 'Estado',
    cell: (item: any) => (
      // FIX: as any para que acepte estados dinámicos sin validación literal
      <StatusIndicator type={item.estado as any}>
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

export default function AirCompressorLogsTable() {
  // FIX: Tipamos los arreglos como any[]
  const [data] = useState<any[]>(MOCK_AIRE_LOGS);
  const [navigationOpen, setNavigationOpen] = useState(true);

  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [splitPanelOpen, setSplitPanelOpen] = useState(false);

  useEffect(() => {
    setSplitPanelOpen(selectedItems.length > 0);
  }, [selectedItems]);

  // FIX: Tipamos filtro como any para manejar 'undefined' en lugar de 'null'
  const [turnoFilter, setTurnoFilter] = useState<any>({
    label: 'Todos',
    value: undefined,
  });

  const [preferences] = useState<any>({
    pageSize: 50,
    visibleContent: [
      'id',
      'fecha',
      'turno',
      'operador',
      'tempSull',
      'tempGD',
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
      // FIX: Tipamos 'item' como 'any'
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

  // Funciones auxiliares para evaluar los estados visuales del checklist
  // FIX: Tipamos los parámetros
  const evaluateCheckStatus = (value: string, goodState: string) => {
    return value === goodState ? 'success' : 'error';
  };

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
        {/* FIX: Ignoramos TS para evitar problemas de interfaz con BreadcrumbNavBar */}
        {/* @ts-ignore */}
        <SecondaryHeader
          breadcrumbs={[
            { text: 'Mantenimiento', href: '/' },
            { text: 'Consultas y Reportes', href: '#' },
            { text: 'Bitácora Compresor de Aire', href: '#' },
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
        // FIX: Eliminado stickyHeader={true} (AppLayout no lo soporta)
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={({ detail }) => setSplitPanelOpen(detail.open)}
        // FIX: Pasado as any para silenciar el error en las preferencias de panel
        splitPanelPreferences={{ position: 'side', size: 380 } as any}
        splitPanel={
          <SplitPanel
            // FIX: Header envuelto en as any
            header={
              (<Header variant="h2">Detalles del Bloque (2 Hrs)</Header>) as any
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
                          <h3 className="log-title">Compresores de Aire</h3>
                        </div>
                        {/* FIX: as any para el StatusIndicator */}
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
                        Operador: {item.operador}
                      </div>
                    </div>

                    <ColumnLayout columns={1} variant="text-grid">
                      {/* MÉTRICAS FINALES (Cajas visuales) */}
                      {/* FIX: variant as any */}
                      <Box
                        variant={'awsui-key-label' as any}
                        margin={{ bottom: 'xs' }}
                      >
                        Parámetros de Cierre de Bloque
                      </Box>
                      <Grid gridDefinition={[{ colspan: 6 }, { colspan: 6 }]}>
                        <div className="metric-box">
                          <div
                            className="metric-value"
                            style={{
                              color:
                                item.telemetria.temperaturas.sullFinal > 95
                                  ? '#d13212'
                                  : '#0972d3',
                            }}
                          >
                            {item.telemetria.temperaturas.sullFinal}°
                          </div>
                          <div className="metric-label">Temp Sull</div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-value">
                            {item.telemetria.presiones.sullFinal}
                          </div>
                          <div className="metric-label">PSI Sull</div>
                        </div>
                        <div className="metric-box">
                          <div
                            className="metric-value"
                            style={{
                              color:
                                item.telemetria.temperaturas.gdFinal > 95
                                  ? '#d13212'
                                  : '#0972d3',
                            }}
                          >
                            {item.telemetria.temperaturas.gdFinal}°
                          </div>
                          <div className="metric-label">Temp GD</div>
                        </div>
                        <div className="metric-box">
                          <div className="metric-value">
                            {item.telemetria.presiones.gdFinal}
                          </div>
                          <div className="metric-label">PSI GD</div>
                        </div>
                      </Grid>

                      <div
                        style={{
                          margin: '20px 0',
                          borderTop: '1px solid #eaeded',
                        }}
                      />

                      {/* CHECKLIST VISUAL (Fugas y Purgas) */}
                      {/* FIX: variant as any */}
                      <Box
                        variant={'awsui-key-label' as any}
                        margin={{ bottom: 'xs' }}
                      >
                        Inspección Física (Checks)
                      </Box>
                      <div>
                        <div className="check-item-row">
                          <span style={{ fontSize: '13px' }}>Fuga de Aire</span>
                          {/* FIX: as any */}
                          <StatusIndicator
                            type={
                              evaluateCheckStatus(
                                item.telemetria.checks.fuga_aire,
                                'NO',
                              ) as any
                            }
                          >
                            {item.telemetria.checks.fuga_aire === 'NO'
                              ? 'Sin Fugas'
                              : 'Fuga'}
                          </StatusIndicator>
                        </div>
                        <div className="check-item-row">
                          <span style={{ fontSize: '13px' }}>
                            Fuga de Aceite
                          </span>
                          <StatusIndicator
                            type={
                              evaluateCheckStatus(
                                item.telemetria.checks.fuga_aceite,
                                'NO',
                              ) as any
                            }
                          >
                            {item.telemetria.checks.fuga_aceite === 'NO'
                              ? 'Sin Fugas'
                              : 'Fuga'}
                          </StatusIndicator>
                        </div>
                        <div className="check-item-row">
                          <span style={{ fontSize: '13px' }}>
                            Ruidos Extraños
                          </span>
                          <StatusIndicator
                            type={
                              evaluateCheckStatus(
                                item.telemetria.checks.ruido_extrano,
                                'NO',
                              ) as any
                            }
                          >
                            {item.telemetria.checks.ruido_extrano === 'NO'
                              ? 'Normal'
                              : 'Anormal'}
                          </StatusIndicator>
                        </div>
                        <div className="check-item-row">
                          <span style={{ fontSize: '13px' }}>Purga Test</span>
                          <Badge
                            color={
                              item.telemetria.checks.purga_test === 'ON'
                                ? 'blue'
                                : 'grey'
                            }
                          >
                            {item.telemetria.checks.purga_test}
                          </Badge>
                        </div>
                        <div className="check-item-row">
                          <span style={{ fontSize: '13px' }}>
                            Mirilla Filtro Purga
                          </span>
                          <StatusIndicator
                            type={
                              evaluateCheckStatus(
                                item.telemetria.checks.mirilla_filtro,
                                'LLENO',
                              ) as any
                            }
                          >
                            {item.telemetria.checks.mirilla_filtro}
                          </StatusIndicator>
                        </div>
                      </div>

                      {/* HORÓMETROS (Solo Turno C) */}
                      {item.telemetria.cierre && (
                        <>
                          <div
                            style={{
                              margin: '20px 0',
                              borderTop: '1px solid #eaeded',
                            }}
                          />
                          <Box
                            variant={'awsui-key-label' as any}
                            margin={{ bottom: 'xs' }}
                          >
                            Cierre de Turno C (Horómetros)
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
                              <div>
                                <span
                                  style={{ fontSize: '11px', color: '#545b64' }}
                                >
                                  HORAS SULL
                                </span>
                                <br />
                                <strong>
                                  {item.telemetria.cierre.horas_sull} Hrs
                                </strong>
                              </div>
                              <div>
                                <span
                                  style={{ fontSize: '11px', color: '#545b64' }}
                                >
                                  HORAS GD
                                </span>
                                <br />
                                <strong>
                                  {item.telemetria.cierre.horas_gd} Hrs
                                </strong>
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
                            variant={'awsui-key-label' as any}
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
                Selecciona una lectura para ver los detalles del bloque.
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
                  // FIX: as any
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
                  Registros: Compresor de Aire
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
                        // FIX: as any
                        onChange={({ detail }) =>
                          setTurnoFilter(detail.selectedOption as any)
                        }
                        // FIX: undefined en lugar de null para evitar errores de TS
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
