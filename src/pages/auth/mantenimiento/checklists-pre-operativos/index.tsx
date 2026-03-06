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

// --- COMPONENTES DE LAYOUT (Tus importaciones) ---
import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import SecondaryHeader from '@/components/layouts/BreadcrumbNavBar';
import { Footer } from '@/components/layouts/AppFooter';

// --- ESTILOS VISUALES ADAPTADOS A MANTENIMIENTO ---
const styles = `
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

  span[class*="awsui_option-content"] {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    display: block !important;
    max-width: 100% !important;
  }

  .awsui-table-container {
      padding-bottom: 2px;
  }

  /* --- TARJETA DE ESTADO (SplitPanel) --- */
  .checklist-summary-card {
    position: relative;
    width: 100%;
    padding: 20px;
    border-radius: 12px;
    background: linear-gradient(135deg, #1d2c3f 0%, #0f1b2a 100%);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    margin-bottom: 20px;
    border: 1px solid rgba(255,255,255,0.1);
    color: white;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .summary-title {
    font-size: 18px;
    font-weight: 800;
    margin: 0;
    color: #fff;
  }

  .summary-subtitle {
    font-size: 12px;
    color: #aab7b8;
  }
  
  .check-item-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #eaeded;
  }
  .check-item-row:last-child {
    border-bottom: none;
  }
`;

// --- INTERFAZ DE DATOS ---
export interface ChecklistExecution {
  id: string;
  area: string;
  fecha: string;
  hora: string;
  turno: string;
  operador: string;
  estadoGeneral: 'success' | 'warning' | 'error';
  observaciones: string;
  detalles: { tarea: string; estado: 'Normal' | 'Programar' | 'Inmediata' }[];
}

// --- MOCK DATA BASADO EN LOS FORMATOS REALES ---
const MOCK_DATA: ChecklistExecution[] = [
  {
    id: 'CHK-20260215-001',
    area: 'Calderas Ref',
    fecha: '15/02/2026',
    hora: '06:15',
    turno: 'Turno A',
    operador: 'Carlos Ramirez',
    estadoGeneral: 'success',
    observaciones: 'Arranque de turno sin novedades. Todo trabajando normal.',
    detalles: [
      { tarea: 'CHECAR TERMODINAMICAS', estado: 'Normal' },
      { tarea: 'CHECAR VAPOR DE ETIQUETADORA', estado: 'Normal' },
      { tarea: 'CHECAR VAPOR EN TOLVA', estado: 'Normal' },
    ],
  },
  {
    id: 'CHK-20260215-002',
    area: 'Calderas Conge',
    fecha: '15/02/2026',
    hora: '07:30',
    turno: 'Turno A',
    operador: 'Miguel Sanchez',
    estadoGeneral: 'warning',
    observaciones: 'Manómetro en Mondinis presenta ligera vibración.',
    detalles: [
      { tarea: 'CHECAR LINEAS DE VAPOR EN MONDINIS', estado: 'Normal' },
      {
        tarea: 'CHECAR CONDICIONES DE LOS MANOMETROS EN MONDINIS',
        estado: 'Programar',
      },
      {
        tarea: 'CHECAR CONDICIONES DE REGULADORES EN MONDINIS',
        estado: 'Normal',
      },
    ],
  },
  {
    id: 'CHK-20260215-003',
    area: 'Calderas Ref',
    fecha: '15/02/2026',
    hora: '10:00',
    turno: 'Turno A',
    operador: 'Carlos Ramirez',
    estadoGeneral: 'success',
    observaciones: 'Segunda ronda completada. Parámetros estables.',
    detalles: [
      { tarea: 'CHECAR VAPOR EN CUARTO DE ESTERILIZACION', estado: 'Normal' },
      {
        tarea: 'CHECAR CONDICIONES DE LOS MANOMETROS EN CERRADORA',
        estado: 'Normal',
      },
    ],
  },
  {
    id: 'CHK-20260215-004',
    area: 'Calderas Conge',
    fecha: '15/02/2026',
    hora: '14:10',
    turno: 'Turno B',
    operador: 'Luis Perez',
    estadoGeneral: 'error',
    observaciones:
      'Válvula de alimentación bloqueada parcialmente. Se detuvo línea 2 brevemente.',
    detalles: [
      {
        tarea:
          'CHECAR VALVULAS DE ALIMENTACION DE VAPOR QUE ESTEN TOTALMENTE ABIERTAS',
        estado: 'Inmediata',
      },
      {
        tarea: 'CHECAR FUNCIONAMIENTO DE LAS VALVULAS EN MONDINIS',
        estado: 'Programar',
      },
    ],
  },
  {
    id: 'CHK-20260215-005',
    area: 'Calderas Ref',
    fecha: '15/02/2026',
    hora: '15:30',
    turno: 'Turno B',
    operador: 'Jose Hernandez',
    estadoGeneral: 'success',
    observaciones: 'Tanque de día operando correctamente.',
    detalles: [
      {
        tarea: 'CHECAR FUNCIONAMINETO DE VALVULAS SELENOIDE DE TANQUE DE DIA',
        estado: 'Normal',
      },
      { tarea: 'CHECAR ALARMA DE TANQUE DE DIA', estado: 'Normal' },
      { tarea: 'CHECAR MIRILLA DE TANQUE DE COMBUSTOLEO', estado: 'Normal' },
    ],
  },
  {
    id: 'CHK-20260215-006',
    area: 'Calderas Conge',
    fecha: '15/02/2026',
    hora: '18:45',
    turno: 'Turno B',
    operador: 'Luis Perez',
    estadoGeneral: 'success',
    observaciones: 'Revisión general de compresores OK.',
    detalles: [
      {
        tarea: 'CHECAR CONDICIONES DE LOS MANOMETROS EN COMPRESORES DE AIRE',
        estado: 'Normal',
      },
      { tarea: 'CHECAR VAPOR DE ETIQUETADORA', estado: 'Normal' },
    ],
  },
  {
    id: 'CHK-20260215-007',
    area: 'Calderas Ref',
    fecha: '15/02/2026',
    hora: '22:15',
    turno: 'Turno C',
    operador: 'Raul Martinez',
    estadoGeneral: 'warning',
    observaciones:
      'Se escucha un ruido extraño en las válvulas selenoide, programar revisión para el turno de día.',
    detalles: [
      {
        tarea: 'CHECAR FUNCIONAMINETO DE VALVULAS SELENOIDE DE TANQUE DE DIA',
        estado: 'Programar',
      },
      { tarea: 'CHECAR TERMODINAMICAS', estado: 'Normal' },
    ],
  },
  {
    id: 'CHK-20260215-008',
    area: 'Calderas Conge',
    fecha: '15/02/2026',
    hora: '23:50',
    turno: 'Turno C',
    operador: 'Roberto Gomez',
    estadoGeneral: 'success',
    observaciones: 'Sin anomalías durante el deshielo.',
    detalles: [
      { tarea: 'CHECAR LINEAS DE VAPOR EN MONDINIS', estado: 'Normal' },
      {
        tarea: 'CHECAR FUNCIONAMIENTO DE LAS VALVULAS EN MONDINIS',
        estado: 'Normal',
      },
    ],
  },
  {
    id: 'CHK-20260216-009',
    area: 'Calderas Ref',
    fecha: '16/02/2026',
    hora: '02:00',
    turno: 'Turno C',
    operador: 'Raul Martinez',
    estadoGeneral: 'error',
    observaciones: 'Falla en compresor de aire principal. Presión inestable.',
    detalles: [
      {
        tarea: 'CHECAR CONDICIONES DE LOS MANOMETROS EN COMPRESORES DE AIRE',
        estado: 'Inmediata',
      },
      {
        tarea: 'CHECAR CONDICIONES DE LOS MANOMETROS EN CALDERAS',
        estado: 'Normal',
      },
    ],
  },
  {
    id: 'CHK-20260216-010',
    area: 'Calderas Conge',
    fecha: '16/02/2026',
    hora: '06:10',
    turno: 'Turno A',
    operador: 'Miguel Sanchez',
    estadoGeneral: 'success',
    observaciones: 'Relevo de turno, todo se encuentra en parámetros.',
    detalles: [
      { tarea: 'CHECAR TERMODINAMICAS', estado: 'Normal' },
      { tarea: 'CHECAR VAPOR EN TOLVA', estado: 'Normal' },
    ],
  },
  {
    id: 'CHK-20260216-011',
    area: 'Calderas Ref',
    fecha: '16/02/2026',
    hora: '08:45',
    turno: 'Turno A',
    operador: 'Carlos Ramirez',
    estadoGeneral: 'warning',
    observaciones:
      'Baja presión de vapor en esterilización, se ajustó regulador pero hay que monitorear.',
    detalles: [
      {
        tarea: 'CHECAR VAPOR EN CUARTO DE ESTERILIZACION',
        estado: 'Programar',
      },
      {
        tarea: 'CHECAR CONDICIONES DE LOS MANOMETROS EN CERRADORA',
        estado: 'Normal',
      },
    ],
  },
  {
    id: 'CHK-20260216-012',
    area: 'Calderas Conge',
    fecha: '16/02/2026',
    hora: '11:20',
    turno: 'Turno A',
    operador: 'Miguel Sanchez',
    estadoGeneral: 'success',
    observaciones: 'Inspección de rutina completada exitosamente.',
    detalles: [
      {
        tarea:
          'CHECAR VALVULAS DE ALIMENTACION DE VAPOR QUE ESTEN TOTALMENTE ABIERTAS',
        estado: 'Normal',
      },
      {
        tarea: 'CHECAR CONDICIONES DE REGULADORES EN MONDINIS',
        estado: 'Normal',
      },
    ],
  },
];

// --- COLUMNAS DE LA TABLA ---
const COLUMN_DEFINITIONS = [
  {
    id: 'id',
    header: 'ID Registro',
    cell: (item: ChecklistExecution) => <Link href="#">{item.id}</Link>,
    sortingField: 'id',
    minWidth: 160,
  },
  {
    id: 'area',
    header: 'Área / Equipo',
    cell: (item: ChecklistExecution) => item.area,
    sortingField: 'area',
    minWidth: 150,
  },
  {
    id: 'fecha',
    header: 'Fecha',
    cell: (item: ChecklistExecution) => `${item.fecha} ${item.hora}`,
    sortingField: 'fecha',
    minWidth: 150,
  },
  {
    id: 'turno',
    header: 'Turno',
    cell: (item: ChecklistExecution) => (
      <Badge color="blue">{item.turno}</Badge>
    ),
    sortingField: 'turno',
    minWidth: 120,
  },
  {
    id: 'operador',
    header: 'Operador',
    cell: (item: ChecklistExecution) => item.operador,
    sortingField: 'operador',
    minWidth: 180,
  },
  {
    id: 'estadoGeneral',
    header: 'Estado General',
    cell: (item: ChecklistExecution) => {
      const statusMap = {
        success: { type: 'success', text: 'Operativo' },
        warning: { type: 'warning', text: 'Requiere Prog.' },
        error: { type: 'error', text: 'Crítico' },
      };
      const status = statusMap[item.estadoGeneral];
      return (
        <StatusIndicator type={status.type as any}>
          {status.text}
        </StatusIndicator>
      );
    },
    sortingField: 'estadoGeneral',
    minWidth: 150,
  },
];

export default function PreOperativeChecklists() {
  const [data] = React.useState<ChecklistExecution[]>(MOCK_DATA);
  const [loading, setLoading] = React.useState(false);
  const [navigationOpen, setNavigationOpen] = React.useState(true);
  const [selectedItems, setSelectedItems] = React.useState<
    ChecklistExecution[]
  >([]);
  const [splitPanelOpen, setSplitPanelOpen] = React.useState(false);

  // FIX: Tipamos state como any para evitar incompatibilidad en el detail
  const [splitPanelPreferences, setSplitPanelPreferences] = React.useState<any>(
    {
      position: 'side',
      size: 320,
    },
  );

  React.useEffect(() => {
    setSplitPanelOpen(selectedItems.length > 0);
  }, [selectedItems]);

  // --- FILTROS ---
  // FIX: Tipamos filtros como any y usamos undefined para complacer al Select
  const [areaFilter, setAreaFilter] = React.useState<any>({
    label: 'Todas',
    value: undefined,
  });
  const [turnoFilter, setTurnoFilter] = React.useState<any>({
    label: 'Todos',
    value: undefined,
  });
  const [estadoFilter, setEstadoFilter] = React.useState<any>({
    label: 'Todos',
    value: undefined,
  });

  // FIX: Tipamos preferencias como any
  const [preferences, setPreferences] = React.useState<any>({
    pageSize: 50,
    visibleContent: [
      'id',
      'area',
      'fecha',
      'turno',
      'operador',
      'estadoGeneral',
    ],
  });

  const getFilterOptions = (
    field: keyof ChecklistExecution,
    placeholder: string,
  ) => {
    const uniqueValues = Array.from(
      new Set(data.map((item) => item[field])),
    ).sort();
    return [
      { label: placeholder, value: undefined },
      ...uniqueValues.map((val) => ({
        label: String(val),
        value: String(val),
      })),
    ] as any[];
  };

  const areaOptions = React.useMemo(
    () => getFilterOptions('area', 'Todas'),
    [data],
  );
  const turnoOptions = React.useMemo(
    () => getFilterOptions('turno', 'Todos'),
    [data],
  );

  // FIX: Opciones tipadas como arreglo para el Select
  const estadoOptions: any[] = [
    { label: 'Todos', value: undefined },
    { label: 'Operativo', value: 'success' },
    { label: 'Requiere Programar', value: 'warning' },
    { label: 'Crítico (Falla)', value: 'error' },
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
      filteringFunction: (item, text) => {
        const matchText =
          item.id.toLowerCase().includes(text.toLowerCase()) ||
          item.operador.toLowerCase().includes(text.toLowerCase());
        const matchArea = areaFilter.value
          ? item.area === areaFilter.value
          : true;
        const matchTurno = turnoFilter.value
          ? item.turno === turnoFilter.value
          : true;
        const matchEstado = estadoFilter.value
          ? item.estadoGeneral === estadoFilter.value
          : true;
        return matchText && matchArea && matchTurno && matchEstado;
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
        {/* FIX: Ignorar TS strict property */}
        {/* @ts-ignore */}
        <SecondaryHeader
          breadcrumbs={[
            { text: 'Mantenimiento', href: '/' },
            { text: 'Bitácoras Operativas', href: '#' },
            { text: 'Checklists Pre-Operativos', href: '#' },
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
        // FIX: Eliminado stickyHeader={true} inválido en AppLayout
        splitPanelOpen={splitPanelOpen}
        onSplitPanelToggle={({ detail }) => setSplitPanelOpen(detail.open)}
        splitPanelPreferences={splitPanelPreferences}
        // FIX: as any en detail
        onSplitPanelPreferencesChange={({ detail }) =>
          setSplitPanelPreferences(detail as any)
        }
        splitPanel={
          <SplitPanel
            // FIX: as any en Header wrapper
            header={
              (<Header variant="h2">Detalle de Inspección</Header>) as any
            }
          >
            {selectedItems.length > 0 ? (
              <div style={{ paddingBottom: '20px' }}>
                {selectedItems.map((item) => (
                  <div key={item.id}>
                    {/* TARJETA DE RESUMEN CMMS */}
                    <div className="checklist-summary-card">
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div>
                          <p className="summary-subtitle">{item.id}</p>
                          <h3 className="summary-title">{item.area}</h3>
                        </div>
                        {/* FIX: as any */}
                        <StatusIndicator type={item.estadoGeneral as any} />
                      </div>
                      <div
                        style={{
                          marginTop: '12px',
                          fontSize: '13px',
                          color: '#cbd5e1',
                        }}
                      >
                        {/* FIX: icon as any */}
                        <Icon name={'calendar' as any} size="small" />{' '}
                        {item.fecha} a las {item.hora} hrs
                      </div>
                    </div>

                    <ColumnLayout columns={1} variant="text-grid">
                      <div style={{ marginBottom: '16px' }}>
                        {/* FIX: variant as any */}
                        <Box
                          variant={'awsui-key-label' as any}
                          color="text-label"
                          fontSize="body-s"
                        >
                          Operador Responsable
                        </Box>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                          {item.operador}
                        </div>
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        {/* FIX: variant as any */}
                        <Box
                          variant={'awsui-key-label' as any}
                          color="text-label"
                          fontSize="body-s"
                        >
                          Observaciones / Comentarios
                        </Box>
                        <div
                          style={{
                            fontSize: '13px',
                            backgroundColor: '#f8f8f8',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #eaeded',
                          }}
                        >
                          {item.observaciones || 'Sin observaciones.'}
                        </div>
                      </div>

                      {/* LISTADO DE PUNTOS REVISADOS */}
                      <div>
                        {/* FIX: variant as any */}
                        <Box
                          variant={'awsui-key-label' as any}
                          color="text-label"
                          fontSize="body-s"
                          margin={{ bottom: 'xs' }}
                        >
                          Puntos Evaluados
                        </Box>
                        <div style={{ borderTop: '1px solid #eaeded' }}>
                          {item.detalles.map((detalle, idx) => (
                            <div key={idx} className="check-item-row">
                              <span
                                style={{
                                  fontSize: '12px',
                                  width: '70%',
                                  lineHeight: '1.2',
                                }}
                              >
                                {detalle.tarea}
                              </span>
                              <StatusIndicator
                                type={
                                  detalle.estado === 'Normal'
                                    ? 'success'
                                    : detalle.estado === 'Programar'
                                      ? 'warning'
                                      : 'error'
                                }
                              >
                                {detalle.estado}
                              </StatusIndicator>
                            </div>
                          ))}
                        </div>
                      </div>
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
                Selecciona un registro para ver la inspección.
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
                setSelectedItems(detail.selectedItems as ChecklistExecution[])
              }
              selectionType="single" // En CMMS suele ser mejor ver los detalles de uno a la vez
              variant="full-page"
              stickyHeader={true}
              loading={loading}
              loadingText="Cargando bitácoras..."
              columnDefinitions={COLUMN_DEFINITIONS}
              visibleColumns={preferences.visibleContent}
              header={
                <Header
                  // FIX: variant as any
                  variant={'awsui-h1-sticky' as any}
                  counter={`(${items.length})`}
                  actions={
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button
                        iconName="refresh"
                        onClick={handleRefresh}
                        ariaLabel="Refrescar"
                      />
                      <Button
                        iconName="download"
                        disabled={selectedItems.length === 0}
                      >
                        Exportar PDF
                      </Button>
                      <Button variant="primary" iconName="add-plus">
                        Realizar Inspección
                      </Button>
                    </SpaceBetween>
                  }
                >
                  Registro de Pre-Operativos
                </Header>
              }
              preferences={
                <CollectionPreferences
                  title="Preferencias"
                  confirmLabel="Confirmar"
                  cancelLabel="Cancelar"
                  preferences={preferences}
                  onConfirm={({ detail }) => setPreferences(detail as any)}
                  pageSizePreference={{
                    title: 'Registros por página',
                    options: [50, 100].map((n) => ({
                      value: n,
                      label: `${n} registros`,
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
                    ] as any,
                  }}
                />
              }
              filter={
                <SpaceBetween direction="vertical" size="xs">
                  <TextFilter
                    {...filterProps}
                    filteringPlaceholder="Buscar por ID u Operador..."
                    countText={`${filteredItemsCount}`}
                  />
                  <Grid
                    gridDefinition={[
                      { colspan: { default: 12, s: 4 } },
                      { colspan: { default: 12, s: 4 } },
                      { colspan: { default: 12, s: 4 } },
                    ]}
                  >
                    <FormField label="Área / Equipo" stretch={true}>
                      <Select
                        selectedOption={areaFilter}
                        onChange={({ detail }) =>
                          setAreaFilter(detail.selectedOption as any)
                        }
                        options={areaOptions}
                        placeholder="Todas"
                      />
                    </FormField>
                    <FormField label="Turno" stretch={true}>
                      <Select
                        selectedOption={turnoFilter}
                        onChange={({ detail }) =>
                          setTurnoFilter(detail.selectedOption as any)
                        }
                        options={turnoOptions}
                        placeholder="Todos"
                      />
                    </FormField>
                    <FormField label="Estado de Inspección" stretch={true}>
                      <Select
                        selectedOption={estadoFilter}
                        onChange={({ detail }) =>
                          setEstadoFilter(detail.selectedOption as any)
                        }
                        options={estadoOptions}
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
