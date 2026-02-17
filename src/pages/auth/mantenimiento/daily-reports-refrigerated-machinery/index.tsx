import * as React from 'react';
import {
  AppLayout,
  Container,
  Header,
  SpaceBetween,
  Button,
  Form,
  FormField,
  Select,
  Box,
  ColumnLayout,
  Grid,
  SegmentedControl,
  Textarea,
  ExpandableSection,
  Checkbox,
} from '@cloudscape-design/components';

import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import SecondaryHeader from '@/components/layouts/BreadcrumbNavBar';
import { Footer } from '@/components/layouts/AppFooter';

// --- ESQUEMA EXACTO: REPORTE DIARIO MAQUINARIA REFRIGERADOS ---
// Basado en el documento 2.2-16-3-10
const SCHEMA = {
  maquinaria: [
    { id: 'maq_1', label: '1. VENTILADOR DE CONDENSADOR BALTIMORE' },
    { id: 'maq_2', label: '2. VENTILADOR DE CONDENSADOR NUEVO' },
    { id: 'maq_3', label: '3. BOMBA NO.1 DEL CONDENSADOR NUEVO' },
    { id: 'maq_4', label: '4. BOMBA NO.2 DEL CONDENSADOR NUEVO' },
    { id: 'maq_5', label: '5. BOMBA NO.1 DEL CONDENSADOR BALTIMORE' },
    { id: 'maq_6', label: '6. BOMBA NO.2 ENFRIAMIENTO DE CABEZAS' },
    { id: 'maq_7', label: '7. PRESION DE SUCCION (30 - 40 PSI)' },
    { id: 'maq_8', label: '8. PRESION DE DESCARGA (160 - 190 PSI)' },
    { id: 'maq_9', label: '9. PRESION DE ACEITE COMPRESOR NO.1' },
    { id: 'maq_10', label: '10. PRESION DE ACEITE COMPRESOR NO.2' },
    { id: 'maq_11', label: '11. PRESION DE ACEITE COMPRESOR NO.3' },
    { id: 'maq_12', label: '12. BOMBA NO. 1 HIDROCHILLER' },
    { id: 'maq_13', label: '13. BOMBA NO. 2 HIDROCHILLER' },
    { id: 'maq_14', label: '14. REVISION DE DISPOSITIVOS DE SEGURIDAD' },
  ],
  cuartos: [
    { id: 'cf_1', label: '1. VENTILADORES DIFUSOR NO.1 CUARTO NO.1' },
    { id: 'cf_2', label: '2. VENTILADORES DIFUSOR NO.2 CUARTO NO.1' },
    { id: 'cf_3', label: '3. VENTILADORES DIFUSOR NO.3 CUARTO NO.1' },
    { id: 'cf_4', label: '4. VENTILADORES DIFUSOR NO.1 CUARTO NO.2' },
    { id: 'cf_5', label: '5. VENTILADORES DIFUSOR NO.2 CUARTO NO.2' },
    { id: 'cf_6', label: '6. VENTILADORES DIFUSOR NO.3 CUARTO NO.2' },
    { id: 'cf_7', label: '7. VENTILADORES DIFUSOR NO.1 CUARTO NO.3' },
    { id: 'cf_8', label: '8. VENTILADORES DIFUSOR NO.2 CUARTO NO.3' },
    { id: 'cf_9', label: '9. VENTILADORES DIFUSOR NO.3 CUARTO NO.3' },
    { id: 'cf_10', label: '10. VENTILADORES DIFUSOR NO.1 CUARTO NO.4' },
    { id: 'cf_11', label: '11. VENTILADORES DIFUSOR NO.2 CUARTO NO.4' },
    { id: 'cf_12', label: '12. VENTILADORES DIFUSOR NO.3 CUARTO NO.4' },
  ],
  climaCentral: [
    { id: 'cc_1', label: '1. PRESION DE SUCCION 20 TON. (60 -75 PSI)' },
    { id: 'cc_2', label: '2. PRESION DE DESCARGA 20 TON (200 - 300 PSI)' },
    { id: 'cc_3', label: '3. NIVEL DE ACEITE 20 TON ( A 3/4 DE MIRILLA)' },
    { id: 'cc_4', label: '4. RUIDO EXTRAÑO MOTOR ELECTRICO 20 TON' },
    { id: 'cc_5', label: '5. RUIDO EXTRAÑO COMPRESOR 20 TON' },
    { id: 'cc_6', label: '6. VENTILADORES CONDENSADOR 20 TON' },
    { id: 'cc_7', label: '7. AMPERAJE DE COMPRESOR 20 TON' },
    { id: 'cc_8', label: '8. AMPERAJE DE VENTILADORES 20 TON' },
    { id: 'cc_9', label: '9. PRESION DE SUCCION 30 TON. (60 -75 PSI)' },
    { id: 'cc_10', label: '10. PRESION DE DESCARGA 30 TON (200 - 300 PSI)' },
    { id: 'cc_11', label: '11. NIVEL DE ACEITE 30 TON ( A 3/4 DE MIRILLA)' },
    { id: 'cc_12', label: '12. RUIDO EXTRAÑO MOTOR ELECTRICO 30 TON' },
    { id: 'cc_13', label: '13. RUIDO EXTRAÑO COMPRESOR 30 TON' },
    { id: 'cc_14', label: '14. VENTILADORES CONDENSADOR 30 TON' },
    { id: 'cc_15', label: '15. AMPERAJE DE COMPRESOR 30 TON' },
    { id: 'cc_16', label: '16. AMPERAJE DE VENTILADORES 30 TON' },
  ],
  manejadora50Ton: [
    { id: 'man_1', label: '1. VIBRACION' },
    { id: 'man_2', label: '2. RUIDO EXTRAÑO' },
    { id: 'man_3', label: '3. ESCURIMIENTOS DE AGUA' },
    { id: 'man_4', label: '4. AMPERAJE' },
    { id: 'man_5', label: '5. FILTROS DE SUCCION' },
  ],
  enfriadorJarabe: [
    { id: 'jar_1', label: '1. PRESION DE SUCCION (25 - 40 PSI)' },
    { id: 'jar_2', label: '2. PRESION DE DESCARGA (200 - 250 PSI)' },
    { id: 'jar_3', label: '3. NIVEL DE ACEITE ( A 3/4 DE MIRILLA)' },
    { id: 'jar_4', label: '4. VENTILADORES CONDENSADORES' },
    { id: 'jar_5', label: '5. RUIDO EXTRAÑO COMPRESOR O MOTOR' },
    { id: 'jar_6', label: '6. AMPERAJE COMPRESOR' },
  ],
  acondicionado: [
    { id: 'ac_1', label: '1. CLIMAS DE REVISION DE FUGAS CARRIER No. 1 y 2' },
    { id: 'ac_2', label: '2. CLIMAS DEL AREA DE ENZIMATICO No. 1 y 2' },
    { id: 'ac_3', label: '3. CLIMAS DEL AREA DE 7 OZ No. 1, 2 y 3' },
    { id: 'ac_4', label: '4. CLIMA DE TORRE 3' },
    { id: 'ac_5', label: '5. CLIMAS DE TORRE 4 No. 1 y 2' },
    { id: 'ac_6', label: '6. CLIMA DE OFICINAS GENERALES PLANTA BAJA' },
  ],
  amoniaco: [
    { id: 'am_1', label: '1. SENSOR DE AMONIACO DE CUARTO DE MAQUINAS' },
    { id: 'am_2', label: '2. SENSOR DE AMONIACO DE CUARTO FRIO # 1' },
    { id: 'am_3', label: '3. SENSOR DE AMONIACO DE CUARTO FRIO # 2' },
    { id: 'am_4', label: '4. SENSOR DE AMONIACO DE CUARTO FRIO # 3' },
    { id: 'am_5', label: '5. SENSOR DE AMONIACO DE CUARTO FRIO # 4' },
  ],
  rejillas: [
    {
      id: 'rej_1',
      label: '1. INSPECCION DE LAS REJILLAS DE AIRE DE VENTILACION.',
    },
  ],
  limpieza: {
    id: 'limpieza_area',
    label: 'REALIZAR LIMPIEZA DEL AREA Y MAQUINARIA',
  },
};

// OPCIONES VISUALES DE ESTADO
const OPCIONES_TRES_ESTADOS = [
  { text: '✓ Normal', id: 'NORMAL' },
  { text: '! Anormal', id: 'ANORMAL' },
  { text: '✕ Falla', id: 'FALLA' },
];

const OPCIONES_DOS_ESTADOS_AMONIACO = [
  { text: '✓ Normal', id: 'NORMAL' },
  { text: '✕ Falla', id: 'FALLA' },
];

export default function DailyReportRefrigerados() {
  const [navigationOpen, setNavigationOpen] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);

  const [turno, setTurno] = React.useState({ label: 'Turno A', value: 'A' });
  const [observacionesGlobales, setObservacionesGlobales] = React.useState('');

  const [evaluations, setEvaluations] = React.useState({});

  // Inicialización exacta
  React.useEffect(() => {
    const initialState = {};

    // Todos los módulos de 3 estados
    [
      ...SCHEMA.maquinaria,
      ...SCHEMA.cuartos,
      ...SCHEMA.climaCentral,
      ...SCHEMA.manejadora50Ton,
      ...SCHEMA.enfriadorJarabe,
      ...SCHEMA.acondicionado,
      ...SCHEMA.rejillas,
    ].forEach((item) => {
      initialState[item.id] = { status: 'NORMAL', comments: '' };
    });

    // Amoníaco (Normal / Falla)
    SCHEMA.amoniaco.forEach((item) => {
      initialState[item.id] = { status: 'NORMAL', comments: '' };
    });

    // Limpieza (Booleano)
    initialState[SCHEMA.limpieza.id] = { status: false, comments: '' };

    setEvaluations(initialState);
    setObservacionesGlobales('');
    setShowErrorAlert(false);
  }, [turno.value]);

  const handleStatusChange = (id, newStatus) => {
    setEvaluations((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: newStatus,
        comments:
          newStatus === 'NORMAL' || newStatus === true ? '' : prev[id].comments,
      },
    }));
  };

  const handleCommentChange = (id, text) => {
    setEvaluations((prev) => ({
      ...prev,
      [id]: { ...prev[id], comments: text },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowErrorAlert(false);

    const hasErrors = Object.values(evaluations).some(
      (evalItem) =>
        (evalItem.status === 'ANORMAL' || evalItem.status === 'FALLA') &&
        evalItem.comments?.trim() === '',
    );

    if (hasErrors) {
      setShowErrorAlert(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    const payload = {
      reportType: 'diario_maquinaria_refrigerados',
      turno: turno.value,
      timestamp: new Date().toISOString(),
      evaluations,
      observacionesGlobales,
    };

    console.log('JSON listo para Base de Datos (Refrigerados):', payload);

    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Reporte Diario de Refrigerados (Turno ${turno.value}) guardado.`);
    }, 1500);
  };

  const renderRow = (item, options) => {
    const currentEval = evaluations[item.id];
    if (!currentEval) return null;

    const requiresComment =
      currentEval.status === 'ANORMAL' || currentEval.status === 'FALLA';
    const isMissingComment =
      showErrorAlert && requiresComment && currentEval.comments.trim() === '';
    const borderColor = currentEval.status === 'FALLA' ? '#d13212' : '#ff9900';

    return (
      <div
        key={item.id}
        style={{
          borderBottom: '1px solid #eaeded',
          paddingBottom: '12px',
          paddingTop: '12px',
        }}
      >
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 7 } },
            { colspan: { default: 12, s: 5 } },
          ]}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', height: '100%' }}
          >
            <Box
              variant="span"
              fontSize="body-m"
              fontWeight={requiresComment ? 'bold' : 'normal'}
            >
              {item.label}
            </Box>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <SegmentedControl
              selectedId={currentEval.status}
              onChange={({ detail }) =>
                handleStatusChange(item.id, detail.selectedId)
              }
              options={options}
            />
          </div>
        </Grid>
        {requiresComment && (
          <div
            style={{
              marginTop: '12px',
              padding: '16px',
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              borderLeft: `4px solid ${borderColor}`,
            }}
          >
            <FormField
              label={`Observaciones / Comentarios (${currentEval.status})`}
              errorText={
                isMissingComment
                  ? 'Debe justificar esta evaluación obligatoriamente.'
                  : null
              }
            >
              <Textarea
                value={currentEval.comments}
                onChange={({ detail }) =>
                  handleCommentChange(item.id, detail.value)
                }
                placeholder="Describa el problema, niveles fuera de rango o ruidos extraños..."
                rows={2}
              />
            </FormField>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#f2f3f3',
      }}
    >
      <div
        id="sticky-nav-container"
        style={{ position: 'sticky', top: 0, zIndex: 1002, width: '100%' }}
      >
        <Navbar />
        <SecondaryHeader
          breadcrumbs={[
            { text: 'Mantenimiento', href: '/' },
            { text: 'Reportes Diarios', href: '#' },
            { text: 'Maquinaria Refrigerados', href: '#' },
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
        toolsHide={true}
        content={
          <div style={{ padding: '24px' }}>
            <form onSubmit={handleSubmit}>
              <Form
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Button formAction="none" variant="link">
                      Descartar
                    </Button>
                    <Button variant="primary" loading={isSubmitting}>
                      Guardar Reporte
                    </Button>
                  </SpaceBetween>
                }
                errorText={
                  showErrorAlert
                    ? 'Faltan comentarios en las evaluaciones marcadas con Anormal o Falla.'
                    : null
                }
              >
                <SpaceBetween size="l">
                  <Header
                    variant="h1"
                    description="Realice la inspección física de los equipos de refrigeración. Las anomalías requerirán justificación."
                  >
                    Reporte Diario: Maquinaria Refrigerados
                  </Header>

                  {/* CABECERA (TURNO Y FECHA) */}
                  <Container>
                    <ColumnLayout columns={2}>
                      <FormField label="Turno a Reportar">
                        <Select
                          selectedOption={turno}
                          onChange={({ detail }) =>
                            setTurno(detail.selectedOption)
                          }
                          options={[
                            { label: 'Turno A', value: 'A' },
                            { label: 'Turno B', value: 'B' },
                            { label: 'Turno C', value: 'C' },
                          ]}
                        />
                      </FormField>
                      <FormField label="Fecha de Registro">
                        <div style={{ paddingTop: '8px', fontWeight: 'bold' }}>
                          {new Date().toLocaleDateString('es-MX', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                      </FormField>
                    </ColumnLayout>
                  </Container>

                  {/* MODULO 1: MAQUINARIA */}
                  <ExpandableSection
                    headerText="1. FUNCIONAMIENTO DE MAQUINARIA"
                    variant="container"
                    defaultExpanded
                  >
                    {SCHEMA.maquinaria.map((item) =>
                      renderRow(item, OPCIONES_TRES_ESTADOS),
                    )}
                  </ExpandableSection>

                  {/* MODULO 2: CUARTOS FRIOS */}
                  <ExpandableSection
                    headerText="2. CUARTOS FRIOS (DIFUSORES)"
                    variant="container"
                  >
                    {SCHEMA.cuartos.map((item) =>
                      renderRow(item, OPCIONES_TRES_ESTADOS),
                    )}
                  </ExpandableSection>

                  {/* MODULO 3: CLIMA CENTRAL PRODUCCION */}
                  <ExpandableSection
                    headerText="3. CLIMA CENTRAL PRODUCCION"
                    variant="container"
                  >
                    {SCHEMA.climaCentral.map((item) =>
                      renderRow(item, OPCIONES_TRES_ESTADOS),
                    )}
                  </ExpandableSection>

                  <Grid
                    gridDefinition={[
                      { colspan: { default: 12, l: 6 } },
                      { colspan: { default: 12, l: 6 } },
                    ]}
                  >
                    {/* MODULO 4: MANEJADORA 50 TON */}
                    <Container
                      header={
                        <Header variant="h3">MANEJADORA AIRE 50 TON</Header>
                      }
                    >
                      {SCHEMA.manejadora50Ton.map((item) =>
                        renderRow(item, OPCIONES_TRES_ESTADOS),
                      )}
                    </Container>

                    {/* MODULO 5: ENFRIADOR DE JARABE */}
                    <Container
                      header={<Header variant="h3">ENFRIADOR DE JARABE</Header>}
                    >
                      {SCHEMA.enfriadorJarabe.map((item) =>
                        renderRow(item, OPCIONES_TRES_ESTADOS),
                      )}
                    </Container>
                  </Grid>

                  {/* MODULO 6: AIRE ACONDICIONADO */}
                  <Container
                    header={
                      <Header variant="h2">
                        SISTEMA DE AIRE ACONDICIONADO
                      </Header>
                    }
                  >
                    {SCHEMA.acondicionado.map((item) =>
                      renderRow(item, OPCIONES_TRES_ESTADOS),
                    )}
                  </Container>

                  <Grid
                    gridDefinition={[
                      { colspan: { default: 12, l: 6 } },
                      { colspan: { default: 12, l: 6 } },
                    ]}
                  >
                    {/* MODULO 7: AMONIACO */}
                    <Container
                      header={
                        <Header variant="h3">DETECCIÓN DE AMONIACO</Header>
                      }
                    >
                      {SCHEMA.amoniaco.map((item) =>
                        renderRow(item, OPCIONES_DOS_ESTADOS_AMONIACO),
                      )}
                    </Container>

                    <SpaceBetween size="l">
                      {/* MODULO 8: REJILLAS */}
                      <Container
                        header={
                          <Header variant="h3">REJILLAS DE VENTILACIÓN</Header>
                        }
                      >
                        {renderRow(SCHEMA.rejillas[0], OPCIONES_TRES_ESTADOS)}
                      </Container>

                      {/* MODULO 9: LIMPIEZA */}
                      <Container
                        header={<Header variant="h3">LIMPIEZA</Header>}
                      >
                        <FormField label={SCHEMA.limpieza.label}>
                          <Checkbox
                            checked={
                              evaluations[SCHEMA.limpieza.id]?.status || false
                            }
                            onChange={({ detail }) =>
                              handleStatusChange(
                                SCHEMA.limpieza.id,
                                detail.checked,
                              )
                            }
                          >
                            Limpieza Completada en este Turno
                          </Checkbox>
                        </FormField>
                      </Container>
                    </SpaceBetween>
                  </Grid>

                  {/* OBSERVACIONES GENERALES */}
                  <Container
                    header={
                      <Header variant="h2">Observaciones Generales</Header>
                    }
                  >
                    <Textarea
                      value={observacionesGlobales}
                      onChange={({ detail }) =>
                        setObservacionesGlobales(detail.value)
                      }
                      placeholder="Escriba aquí los comentarios generales del reporte diario o eventualidades del turno..."
                      rows={3}
                    />
                  </Container>
                </SpaceBetween>
              </Form>
            </form>
          </div>
        }
      />
      <Footer />
    </div>
  );
}
