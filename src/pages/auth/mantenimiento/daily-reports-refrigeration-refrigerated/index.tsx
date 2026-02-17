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
  Input,
  Box,
  ColumnLayout,
  Grid,
  Alert,
  Textarea,
} from '@cloudscape-design/components';

import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import SecondaryHeader from '@/components/layouts/BreadcrumbNavBar';
import { Footer } from '@/components/layouts/AppFooter';

// --- ESQUEMA MAESTRO: TELEMETRÍA REFRIGERADOS (2.2-16-3-12) ---
const SCHEMA = {
  // Las métricas horarias que se repiten para los 3 compresores
  compresores: [1, 2, 3],
  metricasCompresor: [
    { id: 'pres_succ', label: 'Presión Succión', unit: 'PSI' },
    { id: 'pres_desc', label: 'Presión Descarga', unit: 'PSI' },
    { id: 'pres_aceite', label: 'Presión de Aceite', unit: 'PSI' },
    { id: 'voltaje', label: 'Voltaje', unit: 'V' },
    { id: 'ampers', label: 'Ampers', unit: 'A' },
  ],

  // Parámetros de cierre/inicio de turno por compresor
  datosTurnoCompresor: [
    { id: 'horometro', label: 'Horómetro (Inicio/Fin)', unit: 'Hrs' },
    { id: 'nivel_aceite', label: 'Nivel de Aceite', unit: '%' },
  ],

  // Cuartos Fríos con sus rangos extraídos del formato original
  cuartosFrios: [
    {
      id: 'cf_1',
      label: 'Cuarto Frío No. 1',
      desc: 'Rango: 0 a 3 °C',
      min: 0,
      max: 3,
    },
    {
      id: 'cf_2',
      label: 'Cuarto Frío No. 2',
      desc: 'Rango: 6 a 13 °C',
      min: 6,
      max: 13,
    },
    {
      id: 'cf_3',
      label: 'Cuarto Frío No. 3',
      desc: 'Rango: 0 a 3 °C',
      min: 0,
      max: 3,
    },
    {
      id: 'cf_4',
      label: 'Cuarto Frío No. 4',
      desc: 'Rango: 0 a 3 °C',
      min: 0,
      max: 3,
    },
    {
      id: 'cf_5',
      label: 'Cuarto Frío No. 5',
      desc: 'Rango: 0 a 3 °C',
      min: 0,
      max: 3,
    },
  ],
};

// Generador de horas (Formato 24 hrs para cubrir los 3 turnos)
const generateHourOptions = () => {
  const options = [];
  for (let i = 0; i < 24; i++) {
    const hourString = i.toString().padStart(2, '0') + ':00';
    options.push({ label: hourString, value: hourString });
  }
  return options;
};

export default function RefrigeradosTelemetryEntry() {
  const [navigationOpen, setNavigationOpen] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [turno, setTurno] = React.useState({ label: 'Turno A', value: 'A' });
  const [hour, setHour] = React.useState({ label: '07:00', value: '07:00' });
  const [observaciones, setObservaciones] = React.useState('');

  const [readings, setReadings] = React.useState({});

  // Inicialización dinámica del estado
  React.useEffect(() => {
    const initialReadings = {};

    // Inicializar campos de los 3 Compresores
    SCHEMA.compresores.forEach((num) => {
      SCHEMA.metricasCompresor.forEach((metric) => {
        initialReadings[`c${num}_${metric.id}`] = '';
      });
      SCHEMA.datosTurnoCompresor.forEach((metric) => {
        initialReadings[`c${num}_${metric.id}`] = '';
      });
    });

    // Inicializar campos de Cuartos Fríos
    SCHEMA.cuartosFrios.forEach((cf) => {
      initialReadings[cf.id] = '';
    });

    setReadings(initialReadings);
    setObservaciones('');
  }, [hour.value, turno.value]); // Se limpia al cambiar de hora o turno

  const handleInputChange = (id, value) => {
    setReadings((prev) => ({ ...prev, [id]: value }));
  };

  const getValidationError = (metric, value) => {
    if (value === '') return null;
    const num = parseFloat(value);
    if (isNaN(num)) return 'Inválido';
    if (metric.min !== undefined && num < metric.min)
      return `Min: ${metric.min}`;
    if (metric.max !== undefined && num > metric.max)
      return `Max: ${metric.max}`;
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Empaquetado estructurado para PostgreSQL (JSONB)
    const payload = {
      assetArea: 'division_refrigerados',
      turno: turno.value,
      timestampHour: hour.value,
      telemetry: {
        compresores: SCHEMA.compresores.map((num) => ({
          id: num,
          lecturas: SCHEMA.metricasCompresor.reduce(
            (acc, m) => ({ ...acc, [m.id]: readings[`c${num}_${m.id}`] }),
            {},
          ),
          cierre: SCHEMA.datosTurnoCompresor.reduce(
            (acc, m) => ({ ...acc, [m.id]: readings[`c${num}_${m.id}`] }),
            {},
          ),
        })),
        cuartosFrios: SCHEMA.cuartosFrios.reduce(
          (acc, cf) => ({ ...acc, [cf.id]: readings[cf.id] }),
          {},
        ),
      },
      observaciones,
    };

    console.log('Payload Estructurado (Refrigerados):', payload);

    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Lecturas de las ${hour.value} guardadas exitosamente.`);
    }, 1200);
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
            { text: 'Telemetría Operativa', href: '#' },
            { text: 'Refrigeración (Refrigerados)', href: '#' },
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
                      Guardar Registro Horario
                    </Button>
                  </SpaceBetween>
                }
              >
                <SpaceBetween size="l">
                  <Header
                    variant="h1"
                    description="Capture la telemetría horaria de los 3 compresores y las temperaturas de los cuartos fríos."
                  >
                    Bitácora Horaria: División Refrigerados
                  </Header>

                  {/* 1. CONTEXTO DE CAPTURA */}
                  <Container
                    header={<Header variant="h2">Datos del Registro</Header>}
                  >
                    <ColumnLayout columns={2}>
                      <FormField label="Turno">
                        <Select
                          selectedOption={turno}
                          onChange={({ detail }) =>
                            setTurno(detail.selectedOption)
                          }
                          options={[
                            { label: 'Turno A (07:00 a 15:00)', value: 'A' },
                            { label: 'Turno B (15:00 a 23:00)', value: 'B' },
                            { label: 'Turno C (23:00 a 07:00)', value: 'C' },
                          ]}
                        />
                      </FormField>
                      <FormField label="Hora de Lectura (CST)">
                        <Select
                          selectedOption={hour}
                          onChange={({ detail }) =>
                            setHour(detail.selectedOption)
                          }
                          options={generateHourOptions()}
                        />
                      </FormField>
                    </ColumnLayout>
                  </Container>

                  {/* 2. COMPRESORES EN PARALELO (Grid de 3 Columnas) */}
                  <Grid
                    gridDefinition={[
                      { colspan: { default: 12, l: 4 } },
                      { colspan: { default: 12, l: 4 } },
                      { colspan: { default: 12, l: 4 } },
                    ]}
                  >
                    {SCHEMA.compresores.map((num) => (
                      <Container
                        key={`comp_${num}`}
                        header={<Header variant="h2">Compresor {num}</Header>}
                      >
                        <SpaceBetween size="m">
                          {/* Parámetros Horarios */}
                          <div
                            style={{
                              backgroundColor: '#fff',
                              padding: '16px',
                              borderRadius: '8px',
                              border: '1px solid #eaeded',
                            }}
                          >
                            <Box
                              variant="awsui-key-label"
                              margin={{ bottom: 'm' }}
                            >
                              Lecturas Horarias
                            </Box>
                            <ColumnLayout columns={1}>
                              {SCHEMA.metricasCompresor.map((metric) => {
                                const inputId = `c${num}_${metric.id}`;
                                return (
                                  <FormField
                                    key={inputId}
                                    label={`${metric.label} (${metric.unit})`}
                                  >
                                    <Input
                                      type="number"
                                      step="any"
                                      value={
                                        readings[inputId] !== undefined
                                          ? readings[inputId]
                                          : ''
                                      }
                                      onChange={({ detail }) =>
                                        handleInputChange(inputId, detail.value)
                                      }
                                      placeholder="0.00"
                                    />
                                  </FormField>
                                );
                              })}
                            </ColumnLayout>
                          </div>

                          {/* Parámetros de Turno (Horómetro y Aceite) */}
                          <div
                            style={{
                              backgroundColor: '#f0f8ff',
                              padding: '16px',
                              borderRadius: '8px',
                              border: '1px solid #0972d3',
                            }}
                          >
                            <Box
                              variant="awsui-key-label"
                              margin={{ bottom: 'xs' }}
                            >
                              Cierre / Inicio de Turno
                            </Box>
                            <span
                              style={{
                                fontSize: '12px',
                                color: '#545b64',
                                display: 'block',
                                marginBottom: '12px',
                              }}
                            >
                              Llenar solo al inicio o fin del turno.
                            </span>
                            <ColumnLayout columns={1}>
                              {SCHEMA.datosTurnoCompresor.map((metric) => {
                                const inputId = `c${num}_${metric.id}`;
                                return (
                                  <FormField
                                    key={inputId}
                                    label={`${metric.label}`}
                                  >
                                    <Input
                                      type="number"
                                      step="any"
                                      value={
                                        readings[inputId] !== undefined
                                          ? readings[inputId]
                                          : ''
                                      }
                                      onChange={({ detail }) =>
                                        handleInputChange(inputId, detail.value)
                                      }
                                      placeholder="-"
                                    />
                                  </FormField>
                                );
                              })}
                            </ColumnLayout>
                          </div>
                        </SpaceBetween>
                      </Container>
                    ))}
                  </Grid>

                  {/* 3. TEMPERATURAS CUARTOS FRÍOS */}
                  <Container
                    header={
                      <Header variant="h2">
                        Temperaturas de Cuartos Fríos (°C)
                      </Header>
                    }
                  >
                    <ColumnLayout columns={3} variant="text-grid">
                      {SCHEMA.cuartosFrios.map((cf) => (
                        <FormField
                          key={cf.id}
                          label={cf.label}
                          description={cf.desc}
                          errorText={getValidationError(cf, readings[cf.id])}
                        >
                          <Input
                            type="number"
                            step="any"
                            value={
                              readings[cf.id] !== undefined
                                ? readings[cf.id]
                                : ''
                            }
                            onChange={({ detail }) =>
                              handleInputChange(cf.id, detail.value)
                            }
                            placeholder="Ej. 2.5"
                          />
                        </FormField>
                      ))}
                    </ColumnLayout>
                  </Container>

                  {/* 4. OBSERVACIONES */}
                  <Container
                    header={<Header variant="h2">Observaciones</Header>}
                  >
                    <FormField label="Comentarios u ocurrencias de la hora">
                      <Textarea
                        value={observaciones}
                        onChange={({ detail }) =>
                          setObservaciones(detail.value)
                        }
                        placeholder="Anote aquí cualquier equipo en mantenimiento, paros o anomalías..."
                        rows={3}
                      />
                    </FormField>
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
