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
  SegmentedControl,
  Textarea,
  Box,
  ColumnLayout,
  Icon,
  Grid, // Importado correctamente
} from '@cloudscape-design/components';

import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import SecondaryHeader from '@/components/layouts/BreadcrumbNavBar';
import { Footer } from '@/components/layouts/AppFooter';

// --- DICCIONARIO DE TAREAS EXACTAS POR ÁREA (Basado en los PDFs) ---
const CHECKLISTS_POR_AREA = {
  ref: [
    { id: 'termo_ref', label: 'CHECAR TERMODINAMICAS' },
    { id: 'etiq_ref', label: 'CHECAR VAPOR DE ETIQUETADORA' },
    { id: 'tolva_ref', label: 'CHECAR VAPOR EN TOLVA' },
    { id: 'ester_ref', label: 'CHECAR VAPOR EN CUARTO DE ESTERILIZACION' },
    { id: 'lin_mond_ref', label: 'CHECAR LINEAS DE VAPOR EN MONDINIS' },
    {
      id: 'val_alim_ref',
      label:
        'CHECAR VALVULAS DE ALIMENTACION DE VAPOR QUE ESTEN TOTALMENTE ABIERTAS',
    },
    {
      id: 'man_mond_ref',
      label: 'CHECAR CONDICIONES DE LOS MANOMETROS EN MONDINIS',
    },
    {
      id: 'man_cerr_ref',
      label: 'CHECAR CONDICIONES DE LOS MANOMETROS EN CERRADORA',
    },
    {
      id: 'man_cald_ref',
      label: 'CHECAR CONDICIONES DE LOS MANOMETROS EN CALDERAS',
    },
    {
      id: 'man_comp_ref',
      label: 'CHECAR CONDICIONES DE LOS MANOMETROS EN COMPRESORES DE AIRE',
    },
    {
      id: 'reg_mond_ref',
      label: 'CHECAR CONDICIONES DE REGULADORES EN MONDINIS',
    },
    {
      id: 'val_sel_ref',
      label: 'CHECAR FUNCIONAMINETO DE VALVULAS SELENOIDE DE TANQUE DE DIA',
    },
    { id: 'alarma_ref', label: 'CHECAR ALARMA DE TANQUE DE DIA' },
    { id: 'mirilla_ref', label: 'CHECAR MIRILLA DE TANQUE DE COMBUSTOLEO' },
  ],
  conge: [
    { id: 'termo_conge', label: 'CHECAR TERMODINAMICAS' },
    { id: 'etiq_conge', label: 'CHECAR VAPOR DE ETIQUETADORA' },
    { id: 'tolva_conge', label: 'CHECAR VAPOR EN TOLVA' },
    { id: 'ester_conge', label: 'CHECAR VAPOR EN CUARTO DE ESTERILIZACION' },
    { id: 'lin_mond_conge', label: 'CHECAR LINEAS DE VAPOR EN MONDINIS' },
    {
      id: 'val_alim_conge',
      label:
        'CHECAR VALVULAS DE ALIMENTACION DE VAPOR QUE ESTEN TOTALMENTE ABIERTAS',
    },
    {
      id: 'man_mond_conge',
      label: 'CHECAR CONDICIONES DE LOS MANOMETROS EN MONDINIS',
    },
    {
      id: 'man_comp_conge',
      label: 'CHECAR CONDICIONES DE LOS MANOMETROS EN COMPRESORES DE AIRE',
    },
    {
      id: 'reg_mond_conge',
      label: 'CHECAR CONDICIONES DE REGULADORES EN MONDINIS',
    },
    {
      id: 'val_func_conge',
      label: 'CHECAR FUNCIONAMIENTO DE LAS VALVULAS EN MONDINIS',
    },
  ],
};

export default function PerformInspection() {
  const [navigationOpen, setNavigationOpen] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showErrorAlert, setShowErrorAlert] = React.useState(false);

  // --- ESTADO DEL FORMULARIO ---
  const [area, setArea] = React.useState({
    label: 'Calderas Ref',
    value: 'ref',
  });
  const [turno, setTurno] = React.useState({ label: 'Turno A', value: 'A' });
  const [checks, setChecks] = React.useState({});

  // --- LÓGICA DINÁMICA: Efecto que cambia las preguntas cuando cambia el Área ---
  React.useEffect(() => {
    // Al cambiar el área seleccionada, construimos el estado inicial solo para ESAS tareas
    const tareasActuales = CHECKLISTS_POR_AREA[area.value];
    const estadoInicial = tareasActuales.reduce(
      (acc, task) => ({
        ...acc,
        [task.id]: { status: 'NORMAL', comments: '' },
      }),
      {},
    );

    setChecks(estadoInicial);
    setShowErrorAlert(false); // Limpiamos errores previos
  }, [area.value]);

  const handleStatusChange = (taskId, newStatus) => {
    setChecks((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        status: newStatus,
        comments: newStatus === 'NORMAL' ? '' : prev[taskId].comments,
      },
    }));
  };

  const handleCommentChange = (taskId, text) => {
    setChecks((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        comments: text,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowErrorAlert(false);

    const hasErrors = Object.values(checks).some(
      (check) =>
        (check.status === 'ANORMAL' || check.status === 'FALLA') &&
        check.comments.trim() === '',
    );

    if (hasErrors) {
      setShowErrorAlert(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    console.log('Datos enviados al Backend:', {
      area: area.value,
      turno: turno.value,
      checks,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      alert('Inspección guardada exitosamente en Base de Datos');
    }, 1500);
  };

  // Variable auxiliar para obtener las tareas del área seleccionada
  const tareasDeLaVista = CHECKLISTS_POR_AREA[area.value] || [];

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
            { text: 'Bitácoras Operativas', href: '/checklists' },
            { text: 'Nueva Inspección', href: '#' },
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
                      Cancelar
                    </Button>
                    <Button variant="primary" loading={isSubmitting}>
                      Guardar Inspección
                    </Button>
                  </SpaceBetween>
                }
                errorText={
                  showErrorAlert
                    ? 'Por favor, justifique todas las anomalías o fallas detectadas en la sección de comentarios.'
                    : null
                }
              >
                <SpaceBetween size="l">
                  <Header
                    variant="h1"
                    description="Complete el checklist pre-operativo. Las desviaciones requieren justificación obligatoria."
                  >
                    Nueva Inspección Pre-Operativa
                  </Header>

                  {/* METADATA DEL TURNO */}
                  <Container
                    header={<Header variant="h2">Datos de Operación</Header>}
                  >
                    <ColumnLayout columns={2}>
                      <FormField
                        label="Área / Equipo"
                        description="Seleccione el área para cargar su checklist específico"
                      >
                        <Select
                          selectedOption={area}
                          onChange={({ detail }) =>
                            setArea(detail.selectedOption)
                          }
                          options={[
                            { label: 'Calderas Ref', value: 'ref' },
                            { label: 'Calderas Conge', value: 'conge' },
                          ]}
                        />
                      </FormField>
                      <FormField label="Turno Asignado">
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
                    </ColumnLayout>
                  </Container>

                  {/* CHECKLIST DE TAREAS DINÁMICO */}
                  <Container
                    header={
                      <Header
                        variant="h2"
                        counter={`(${tareasDeLaVista.length} puntos)`}
                      >
                        Puntos de Revisión
                      </Header>
                    }
                  >
                    {/* Verificamos si el estado checks ya se inicializó con las tareas correctas */}
                    {Object.keys(checks).length === tareasDeLaVista.length ? (
                      <SpaceBetween size="xl">
                        {tareasDeLaVista.map((task, index) => {
                          const currentCheck = checks[task.id];
                          if (!currentCheck) return null; // Previene errores de renderizado rápido

                          const requiresComment =
                            currentCheck.status === 'ANORMAL' ||
                            currentCheck.status === 'FALLA';
                          const isMissingComment =
                            showErrorAlert &&
                            requiresComment &&
                            currentCheck.comments.trim() === '';

                          return (
                            <div key={task.id}>
                              {index > 0 && (
                                <div
                                  style={{
                                    borderTop: '1px solid #eaeded',
                                    margin: '20px 0',
                                  }}
                                />
                              )}

                              <Grid
                                gridDefinition={[
                                  { colspan: { default: 12, s: 7 } },
                                  { colspan: { default: 12, s: 5 } },
                                ]}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    height: '100%',
                                  }}
                                >
                                  <Box
                                    variant="span"
                                    fontSize="body-m"
                                    fontWeight="bold"
                                  >
                                    {task.label}
                                  </Box>
                                </div>

                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                  }}
                                >
                                  <SegmentedControl
                                    selectedId={currentCheck.status}
                                    onChange={({ detail }) =>
                                      handleStatusChange(
                                        task.id,
                                        detail.selectedId,
                                      )
                                    }
                                    options={[
                                      { text: '✓ Normal', id: 'NORMAL' },
                                      { text: '! Anormal', id: 'ANORMAL' },
                                      { text: '✕ Falla', id: 'FALLA' },
                                    ]}
                                  />
                                </div>
                              </Grid>

                              {requiresComment && (
                                <div
                                  style={{
                                    marginTop: '16px',
                                    padding: '16px',
                                    backgroundColor: '#fafafa',
                                    borderRadius: '8px',
                                    borderLeft: `4px solid ${currentCheck.status === 'FALLA' ? '#d13212' : '#ff9900'}`,
                                  }}
                                >
                                  <FormField
                                    label="Observaciones Y/O Comentarios"
                                    description={`Obligatorio para justificar estado: ${currentCheck.status}`}
                                    errorText={
                                      isMissingComment
                                        ? 'Debe ingresar un comentario describiendo el problema.'
                                        : null
                                    }
                                  >
                                    <Textarea
                                      value={currentCheck.comments}
                                      onChange={({ detail }) =>
                                        handleCommentChange(
                                          task.id,
                                          detail.value,
                                        )
                                      }
                                      placeholder="Describa el problema encontrado o la acción tomada..."
                                      rows={2}
                                    />
                                  </FormField>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </SpaceBetween>
                    ) : (
                      <Box textAlign="center" margin={{ top: 'xl' }}>
                        Cargando checklist...
                      </Box>
                    )}
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
