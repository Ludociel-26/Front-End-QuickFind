import { useState, useEffect } from 'react';
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

// --- ESQUEMA EXACTO: REPORTE DIARIO MAQUINARIA CONGELADOS ---
const SCHEMA = {
  maquinaria: [
    { id: 'maq_1', label: '1. VENTILADOR DE CONDENSADOR FRICK NO.1' },
    { id: 'maq_2', label: '2. VENTILADOR DE CONDENSADOR FRICK NO.2' },
    { id: 'maq_3', label: '3. VENTILADOR DE CONDENSADOR FRICK NO.3' },
    { id: 'maq_4', label: '4. BOMBA NO.1 DEL CONDENSADOR FRICK NO.1' },
    { id: 'maq_5', label: '5. BOMBA No. 1 DE TORRE PROTEC.' },
    { id: 'maq_6', label: '6. BOMBA No. 2 DE TORRE PROTEC.' },
    { id: 'maq_7', label: '7. VENTILADORES DE TORRE PROTEC' },
    { id: 'maq_8', label: '8. PRESION DE ACEITE DE COMPRESOR No. 1' },
    { id: 'maq_9', label: '9. REVISAR NIVEL DE ACEITE EN COMPRESOR No. 1' },
    { id: 'maq_10', label: '10. PRESION DE ACEITE DE COMPRESOR No. 2' },
    { id: 'maq_11', label: '11. REVISAR NIVEL DE ACEITE EN COMPRESOR No. 2' },
    { id: 'maq_12', label: '12. PRESION DE ACEITE DE COMPRESOR No. 3' },
    { id: 'maq_13', label: '13. REVISAR NIVEL DE ACEITE EN COMPRESOR No. 3' },
    { id: 'maq_14', label: '14. BOMBA NO. 1 RECIRCULADOR AMONIACO #1' },
    { id: 'maq_15', label: '15. BOMBA NO. 2 RECIRCULADOR AMONIACO #1' },
    { id: 'maq_16', label: '16. BOMBA NO. 1 RECIRCULADOR AMONIACO #2' },
    { id: 'maq_17', label: '17. BOMBA NO. 2 RECIRCULADOR AMONIACO #2' },
    { id: 'maq_18', label: '18. REVISION DE DISPOSITIVOS DE SEGURIDAD' },
  ],
  cuartos: [
    { id: 'cf_1', label: '1. VENTILADORES DIFUSOR NO.1 DE EMPAQUE' },
    { id: 'cf_2', label: '2. VENTILADORES DIFUSOR NO.2 DE EMPAQUE' },
    { id: 'cf_3', label: '3. VENTILADORES DIFUSOR NO.3 DE RAMPAS' },
    { id: 'cf_4', label: '4. VENTILADORES DIFUSOR NO.4 DE RAMPAS' },
    { id: 'cf_5', label: '5. VENTILADORES DIFUSOR NO.5 DE CUARTO REFRIGERADO' },
    { id: 'cf_6', label: '6. VENTILADORES DIFUSOR NO.6 DE CUARTO REFRIGERADO' },
    { id: 'cf_7', label: '7. VENTILADORES DIFUSOR NO.7 DE CUARTO SECO' },
    { id: 'cf_8', label: '8. VENTILADORES DIFUSOR NO.8 DE CUARTO CONGELADO' },
    { id: 'cf_9', label: '9. VENTILADORES DIFUSOR NO.9 DE CUARTO CONGELADO' },
    { id: 'cf_10', label: '10. VENTILADORES DIFUSOR NO.10 DE MONDINIS' },
    { id: 'cf_11', label: '11. VENTILADORES DIFUSOR NO.11 DE MONDINIS' },
    { id: 'cf_12', label: '12. VENTILADORES DIFUSOR NO.12 DE CUARTO SECO' },
    { id: 'cf_13', label: '13. VENTILADORES DIFUSOR NO.13 DE CONSERVACION' },
  ],
  acondicionado: [
    { id: 'ac_1', label: '1. CLIMA # 1' },
    { id: 'ac_2', label: '2. CLIMA # 2' },
    { id: 'ac_3', label: '3. CLIMA # 3' },
    { id: 'ac_4', label: '4. CLIMA # 4' },
    { id: 'ac_5', label: '5. AREA DE ENVAFLEX' },
    { id: 'ac_6', label: '6. CLIMA OFICINA DE SERVICIOS TECNICOS' },
  ],
  amoniaco: [
    { id: 'am_1', label: '1. SENSOR DE AMONIACO DE CUARTO DE MAQUINAS' },
    { id: 'am_2', label: '2. SENSOR DE AMONIACO DEL HIDROCHILLER' },
    { id: 'am_3', label: '3. SENSOR DE AMONIACO DEL DIFUSOR # 8' },
    { id: 'am_4', label: '4. SENSOR DE AMONIACO DEL DIFUSOR # 9' },
    { id: 'am_5', label: '5. SENSOR DE AMONIACO DEL I.Q.F.' },
  ],
  aisladosABC: [
    {
      id: 'rejillas',
      label: 'INSPECCION DE LAS REJILLAS DE AIRE DE VENTILACION.',
    },
    {
      id: 'ecochiller',
      label: 'REVISAR FUNCIONAMIENTO DEL SISTEMA DEL ECOCHILLER',
    },
  ],
  dosificadores: [
    {
      id: 'dosi_frick',
      label: 'CONDENSADOR FRICK: FUNCIONAMIENTO DE DOSIFICADORES',
    },
    {
      id: 'dosi_protec',
      label: 'TORRE PROTEC: FUNCIONAMIENTO DE DOSIFICADORES',
    },
  ],
  limpieza: {
    id: 'limpieza_area',
    label: 'REALIZAR LIMPIEZA DEL AREA Y MAQUINARIA',
  },
};

// OPCIONES DE ESTADO CON ICONOS VISUALES
const OPCIONES_TRES_ESTADOS = [
  { text: '✓ Normal', id: 'NORMAL' },
  { text: '! Anormal', id: 'ANORMAL' },
  { text: '✕ Falla', id: 'FALLA' },
];

const OPCIONES_DOS_ESTADOS_AMONIACO = [
  { text: '✓ Normal', id: 'NORMAL' },
  { text: '✕ Falla', id: 'FALLA' },
];

const OPCIONES_DOSIFICADORES = [
  { text: 'SÍ', id: 'SI' },
  { text: 'NO', id: 'NO' },
];

export default function DailyReportCongelados() {
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  // FIX: Tipamos el Select de turno
  const [turno, setTurno] = useState<any>({ label: 'Turno A', value: 'A' });
  const [observacionesGlobales, setObservacionesGlobales] = useState('');

  // FIX: Declaramos evaluations como diccionario de objetos anidados
  const [evaluations, setEvaluations] = useState<Record<string, any>>({});

  // Inicialización exacta
  useEffect(() => {
    // FIX: Tipamos el initialState
    const initialState: Record<string, any> = {};

    // Normal / Anormal / Falla (Inician en Normal)
    [
      ...SCHEMA.maquinaria,
      ...SCHEMA.cuartos,
      ...SCHEMA.acondicionado,
      ...SCHEMA.aisladosABC,
    ].forEach((item) => {
      initialState[item.id] = { status: 'NORMAL', comments: '' };
    });

    // Amoníaco (Normal / Falla)
    SCHEMA.amoniaco.forEach((item) => {
      initialState[item.id] = { status: 'NORMAL', comments: '' };
    });

    // Dosificadores (SI / NO)
    SCHEMA.dosificadores.forEach((item) => {
      initialState[item.id] = { status: 'SI', comments: '' };
    });

    // Limpieza (Booleano)
    initialState[SCHEMA.limpieza.id] = { status: false, comments: '' };

    setEvaluations(initialState);
    setObservacionesGlobales('');
    setShowErrorAlert(false);
  }, [turno.value]);

  // FIX: Tipamos id y newStatus
  const handleStatusChange = (id: string, newStatus: any) => {
    setEvaluations((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        status: newStatus,
        comments:
          newStatus === 'NORMAL' || newStatus === 'SI' || newStatus === true
            ? ''
            : prev[id].comments,
      },
    }));
  };

  // FIX: Tipamos id y text
  const handleCommentChange = (id: string, text: string) => {
    setEvaluations((prev) => ({
      ...prev,
      [id]: { ...prev[id], comments: text },
    }));
  };

  // FIX: Tipamos 'e' y lo manejamos opcionalmente para que funcione en Form y Button
  const handleSubmit = (e?: any) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setShowErrorAlert(false);

    const hasErrors = Object.values(evaluations).some(
      (evalItem) =>
        (evalItem.status === 'ANORMAL' ||
          evalItem.status === 'FALLA' ||
          evalItem.status === 'NO') &&
        evalItem.comments?.trim() === '',
    );

    if (hasErrors) {
      setShowErrorAlert(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    const payload = {
      reportType: 'diario_maquinaria_congelados',
      turno: turno.value,
      timestamp: new Date().toISOString(),
      evaluations,
      observacionesGlobales,
    };

    console.log('JSON listo para Base de Datos:', payload);

    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Reporte Diario de Congelados (Turno ${turno.value}) guardado.`);
    }, 1500);
  };

  // Componente reutilizable para renderizar filas del formulario con estilo dinámico
  // FIX: Tipamos item y options
  const renderRow = (item: any, options: any[]) => {
    const currentEval = evaluations[item.id];
    if (!currentEval) return null;

    const requiresComment =
      currentEval.status === 'ANORMAL' ||
      currentEval.status === 'FALLA' ||
      currentEval.status === 'NO';
    const isMissingComment =
      showErrorAlert && requiresComment && currentEval.comments.trim() === '';

    // Color del borde dependiendo del estado (Naranja para Anormal/No, Rojo para Falla)
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
            {/* FIX: variant 'span' no existe nativamente, forzamos as any */}
            <Box
              variant={'span' as any}
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
              description="Obligatorio para justificar este estado."
              errorText={
                isMissingComment
                  ? 'Debe describir la anomalía o acción tomada.'
                  : null
              }
            >
              <Textarea
                value={currentEval.comments}
                onChange={({ detail }) =>
                  handleCommentChange(item.id, detail.value)
                }
                placeholder="Describa el problema, ruidos extraños, fugas o acciones correctivas..."
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
        {/* FIX: Ignoramos TS para las props de SecondaryHeader */}
        {/* @ts-ignore */}
        <SecondaryHeader
          breadcrumbs={[
            { text: 'Mantenimiento', href: '/' },
            { text: 'Reportes Diarios', href: '#' },
            { text: 'Maquinaria Congelados', href: '#' },
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
                    <Button
                      variant="primary"
                      loading={isSubmitting}
                      onClick={handleSubmit}
                    >
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
                    description="Realice la inspección física de los equipos. Las evaluaciones marcadas como 'Anormal' o 'Falla' requerirán justificación obligatoria."
                  >
                    Reporte Diario: Maquinaria Congelados
                  </Header>

                  {/* CABECERA (TURNO Y FECHA) */}
                  <Container>
                    <ColumnLayout columns={2}>
                      <FormField label="Turno a Reportar">
                        <Select
                          selectedOption={turno}
                          // FIX: as any
                          onChange={({ detail }) =>
                            setTurno(detail.selectedOption as any)
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
                    headerText="2. DIFUSORES EN CUARTOS FRIOS"
                    variant="container"
                  >
                    {SCHEMA.cuartos.map((item) =>
                      renderRow(item, OPCIONES_TRES_ESTADOS),
                    )}
                  </ExpandableSection>

                  <Grid
                    gridDefinition={[
                      { colspan: { default: 12, l: 6 } },
                      { colspan: { default: 12, l: 6 } },
                    ]}
                  >
                    {/* MODULO 3 Y 4: DOSIFICADORES */}
                    <SpaceBetween size="l">
                      <Container
                        header={<Header variant="h3">CONDENSADOR FRICK</Header>}
                      >
                        {renderRow(
                          SCHEMA.dosificadores[0],
                          OPCIONES_DOSIFICADORES,
                        )}
                      </Container>
                      <Container
                        header={<Header variant="h3">TORRE PROTEC</Header>}
                      >
                        {renderRow(
                          SCHEMA.dosificadores[1],
                          OPCIONES_DOSIFICADORES,
                        )}
                      </Container>
                    </SpaceBetween>

                    {/* MODULO 5 Y 6: REJILLAS Y ECOCHILLER */}
                    <SpaceBetween size="l">
                      <Container
                        header={
                          <Header variant="h3">
                            INSPECCIÓN REJILLAS DE AIRE
                          </Header>
                        }
                      >
                        {renderRow(
                          SCHEMA.aisladosABC[0],
                          OPCIONES_TRES_ESTADOS,
                        )}
                      </Container>
                      <Container
                        header={
                          <Header variant="h3">SISTEMA ECOCHILLER</Header>
                        }
                      >
                        {renderRow(
                          SCHEMA.aisladosABC[1],
                          OPCIONES_TRES_ESTADOS,
                        )}
                      </Container>
                    </SpaceBetween>
                  </Grid>

                  {/* MODULO 7: AIRE ACONDICIONADO */}
                  <Container
                    header={
                      <Header variant="h2">SISTEMA DE ACONDICIONADO</Header>
                    }
                  >
                    {SCHEMA.acondicionado.map((item) =>
                      renderRow(item, OPCIONES_TRES_ESTADOS),
                    )}
                  </Container>

                  {/* MODULO 8: DETECCION DE AMONIACO */}
                  <Container
                    header={
                      <Header variant="h2">
                        SISTEMA DE DETECCIÓN DE AMONIACO
                      </Header>
                    }
                  >
                    {SCHEMA.amoniaco.map((item) =>
                      renderRow(item, OPCIONES_DOS_ESTADOS_AMONIACO),
                    )}
                  </Container>

                  {/* MODULO 9 Y OBSERVACIONES FINALES */}
                  <Grid
                    gridDefinition={[
                      { colspan: { default: 12, m: 5 } },
                      { colspan: { default: 12, m: 7 } },
                    ]}
                  >
                    <Container
                      header={<Header variant="h3">LIMPIEZA DE ÁREA</Header>}
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

                    <Container
                      header={
                        <Header variant="h3">OBSERVACIONES GENERALES</Header>
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
                  </Grid>
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
