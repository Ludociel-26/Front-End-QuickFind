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
  SegmentedControl,
} from '@cloudscape-design/components';

import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import SecondaryHeader from '@/components/layouts/BreadcrumbNavBar';
import { Footer } from '@/components/layouts/AppFooter';

// --- ESQUEMA MAESTRO: CUARTO FRÍO #5 (2.2-16-3-16) ---
const SCHEMA = {
  // Parámetros del Sistema / Compresores
  parametrosSistema: [
    { id: 'nivel_refrigerante', label: 'Nivel de Refrigerante', unit: '%' },
    {
      id: 'pres_succion',
      label: 'Presión Succión',
      unit: 'PSI',
      target: 50,
      desc: 'Ideal: 50 PSI',
    },
    {
      id: 'pres_descarga',
      label: 'Presión Descarga',
      unit: 'PSI',
      target: 220,
      desc: 'Ideal: 220 PSI',
    },
    { id: 'pct_carga', label: '% de Carga', unit: '%' },
  ],

  // Temperaturas de los 8 Evaporadores (Aceptan "D" para Deshielo)
  evaporadores: [
    {
      id: 'evap_1',
      label: 'Temp Evap 1',
      unit: '°C',
      min: 9,
      max: 11,
      desc: '10±1°C',
    },
    {
      id: 'evap_2',
      label: 'Temp Evap 2',
      unit: '°C',
      min: 9,
      max: 11,
      desc: '10±1°C',
    },
    {
      id: 'evap_3',
      label: 'Temp Evap 3',
      unit: '°C',
      min: 0,
      max: 2,
      desc: '1±1°C (D: 0, 6, 12, 18)',
    },
    {
      id: 'evap_4',
      label: 'Temp Evap 4',
      unit: '°C',
      min: 0,
      max: 2,
      desc: '1±1°C (D: 4, 10, 16, 22)',
    },
    {
      id: 'evap_5',
      label: 'Temp Evap 5',
      unit: '°C',
      min: 0,
      max: 2,
      desc: '1±1°C (D: 2, 8, 14, 20)',
    },
    {
      id: 'evap_6',
      label: 'Temp Evap 6',
      unit: '°C',
      min: 0,
      max: 2,
      desc: '1±1°C (D: 5, 11, 17, 23)',
    },
    {
      id: 'evap_7',
      label: 'Temp Evap 7',
      unit: '°C',
      min: 0,
      max: 2,
      desc: '1±1°C (D: 1, 7, 13, 19)',
    },
    {
      id: 'evap_8',
      label: 'Temp Evap 8',
      unit: '°C',
      min: 0,
      max: 2,
      desc: '1±1°C (D: 3, 9, 15, 21)',
    },
  ],

  // Temperaturas Generales
  temperaturasAmbiente: [
    { id: 'temp_ambiente', label: 'Temp Ambiente Exterior', unit: '°C' },
    {
      id: 'temp_cuarto_1',
      label: 'Temp Cuarto (Termómetro 1)',
      unit: '°C',
      min: 0,
      max: 3,
      desc: '0-3°C',
    },
    {
      id: 'temp_cuarto_2',
      label: 'Temp Cuarto (Termómetro 2)',
      unit: '°C',
      min: 0,
      max: 3,
      desc: '0-3°C',
    },
    {
      id: 'temp_cuarto_3',
      label: 'Temp Cuarto (Termómetro 3)',
      unit: '°C',
      min: 0,
      max: 3,
      desc: '0-3°C',
    },
  ],
};

// Generador de 24 horas (De 7:00 a 06:00 según el formato)
const generateHourOptions = () => {
  // FIX: Tipamos el arreglo de opciones como any[]
  const options: any[] = [];
  for (let i = 0; i < 24; i++) {
    const hourString = i.toString().padStart(2, '0') + ':00';
    options.push({ label: hourString, value: hourString });
  }
  return options;
};

export default function CuartoFrio5TelemetryEntry() {
  const [navigationOpen, setNavigationOpen] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // FIX: Tipamos estados a any para los componentes Select de Cloudscape
  const [turno, setTurno] = React.useState<any>({
    label: 'Turno A',
    value: 'A',
  });
  const [hour, setHour] = React.useState<any>({
    label: '07:00',
    value: '07:00',
  });
  const [observaciones, setObservaciones] = React.useState('');

  // FIX: Aseguramos que TS reconozca "readings" como un diccionario dinámico
  const [readings, setReadings] = React.useState<Record<string, any>>({});

  // Inicialización de campos
  React.useEffect(() => {
    // FIX: Tipamos initialReadings
    const initialReadings: Record<string, any> = {};

    // Nivel de Aceite tiene su propio control (OK / X)
    initialReadings['nivel_aceite'] = 'OK';
    initialReadings['apagadores_encendidos'] = true;

    SCHEMA.parametrosSistema.forEach((m) => (initialReadings[m.id] = ''));
    SCHEMA.evaporadores.forEach((m) => (initialReadings[m.id] = ''));
    SCHEMA.temperaturasAmbiente.forEach((m) => (initialReadings[m.id] = ''));

    setReadings(initialReadings);
    setObservaciones('');
  }, [hour.value, turno.value]);

  // FIX: Tipamos id y value
  const handleInputChange = (id: string, value: any) => {
    setReadings((prev) => ({ ...prev, [id]: value }));
  };

  // CORRECCIÓN 2: Validador protegido contra valores 'undefined'
  // FIX: Tipamos metric y value
  const getValidationError = (metric: any, value: any) => {
    // Escudo: Si es undefined, nulo, o cadena vacía, no validamos nada aún
    if (value === undefined || value === null || value === '') return null;

    // Convertimos a string por seguridad antes de hacer trim()
    const stringValue = String(value).trim().toUpperCase();

    // Regla especial: Si es 'D', es un deshielo válido
    if (stringValue === 'D') return null;

    // Si no es D, intentamos convertir a número
    const num = parseFloat(stringValue);
    if (isNaN(num)) return 'Ingrese un número o la letra "D" para deshielo.';

    if (metric.min !== undefined && num < metric.min)
      return `Mínimo esperado: ${metric.min}`;
    if (metric.max !== undefined && num > metric.max)
      return `Máximo esperado: ${metric.max}`;

    return null;
  };

  // FIX: Tipamos el evento de forma opcional y llamamos preventDefault condicionalmente
  const handleSubmit = (e?: any) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setIsSubmitting(true);

    const payload = {
      assetArea: 'cuarto_frio_5',
      turno: turno.value,
      timestampHour: hour.value,
      telemetry: readings,
      observaciones,
    };

    console.log('JSON listo para Base de Datos (Cuarto Frío #5):', payload);

    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Lecturas del CF#5 a las ${hour.value} guardadas exitosamente.`);
    }, 1200);
  };

  // Manejo seguro del estado inicial de los SegmentedControls antes de que el useEffect termine
  const nivelAceiteValue =
    readings['nivel_aceite'] !== undefined ? readings['nivel_aceite'] : 'OK';
  const apagadoresValue =
    readings['apagadores_encendidos'] !== undefined
      ? readings['apagadores_encendidos']
        ? 'SI'
        : 'NO'
      : 'SI';

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
        {/* FIX: Ignoramos TS para evitar problemas con la propiedad isMenuOpen */}
        {/* @ts-ignore */}
        <SecondaryHeader
          breadcrumbs={[
            { text: 'Mantenimiento', href: '/' },
            { text: 'Telemetría Operativa', href: '#' },
            { text: 'Cuarto Frío #5', href: '#' },
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
                      Guardar Registro Horario
                    </Button>
                  </SpaceBetween>
                }
              >
                <SpaceBetween size="l">
                  <Header
                    variant="h1"
                    description="Capture los parámetros del cuarto frío. Use la letra 'D' en los evaporadores cuando se encuentren en ciclo de deshielo."
                  >
                    Bitácora: Sala de Compresores Cuarto Frío #5
                  </Header>

                  {/* 1. CONTEXTO DE HORA Y TURNO */}
                  <Container
                    header={<Header variant="h2">Hora de Lectura</Header>}
                  >
                    <ColumnLayout columns={2}>
                      <FormField label="Turno de Operación">
                        <Select
                          selectedOption={turno}
                          // FIX: Forzamos la opción como any para que la acepte
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
                      <FormField label="Hora (Intervalos de 1 Hr)">
                        <Select
                          selectedOption={hour}
                          // FIX: Forzamos la opción como any
                          onChange={({ detail }) =>
                            setHour(detail.selectedOption as any)
                          }
                          options={generateHourOptions()}
                        />
                      </FormField>
                    </ColumnLayout>
                  </Container>

                  {/* 2. PARÁMETROS DEL SISTEMA (PRESIONES Y NIVELES) */}
                  <Container
                    header={
                      <Header variant="h2">
                        Parámetros de Sala de Compresores
                      </Header>
                    }
                  >
                    <SpaceBetween size="l">
                      <ColumnLayout columns={4} variant="text-grid">
                        {SCHEMA.parametrosSistema.map((metric) => (
                          <FormField
                            key={metric.id}
                            label={`${metric.label} (${metric.unit})`}
                            description={metric.desc}
                          >
                            <Input
                              type="number"
                              step="any"
                              value={
                                readings[metric.id] !== undefined
                                  ? readings[metric.id]
                                  : ''
                              }
                              onChange={({ detail }) =>
                                handleInputChange(metric.id, detail.value)
                              }
                              placeholder="0.00"
                            />
                          </FormField>
                        ))}
                      </ColumnLayout>

                      <div
                        style={{
                          borderTop: '1px solid #eaeded',
                          paddingTop: '16px',
                        }}
                      >
                        <Grid
                          gridDefinition={[{ colspan: { default: 12, s: 6 } }]}
                        >
                          <FormField
                            label="Revisión de Nivel de Aceite (5 Compresores)"
                            description="Si están de la mitad a tres cuartos reporte OK, en caso contrario reporte 'X' y anote en observaciones."
                          >
                            <SegmentedControl
                              selectedId={nivelAceiteValue}
                              onChange={({ detail }) =>
                                handleInputChange(
                                  'nivel_aceite',
                                  detail.selectedId,
                                )
                              }
                              options={[
                                { text: '✓ OK (Niveles Óptimos)', id: 'OK' },
                                { text: '✕ X (Revisar Niveles)', id: 'X' },
                              ]}
                            />
                          </FormField>
                        </Grid>
                      </div>
                    </SpaceBetween>
                  </Container>

                  {/* 3. TEMPERATURAS DE EVAPORADORES */}
                  <Container
                    header={
                      <Header variant="h2">Temperaturas de Evaporadores</Header>
                    }
                  >
                    <Box margin={{ bottom: 'm' }}>
                      <Alert type="info" header="Instrucción de Deshielo">
                        Si el evaporador está en ciclo de deshielo, escriba la
                        letra <strong>D</strong> en lugar de la temperatura. Los
                        horarios programados están indicados debajo de cada
                        campo.
                      </Alert>
                    </Box>
                    <Grid
                      gridDefinition={Array(8).fill({
                        colspan: { default: 12, s: 3 },
                      })}
                    >
                      {SCHEMA.evaporadores.map((evap) => (
                        <div key={evap.id} style={{ marginBottom: '16px' }}>
                          <FormField
                            label={evap.label}
                            description={evap.desc}
                            errorText={getValidationError(
                              evap,
                              readings[evap.id],
                            )}
                          >
                            <Input
                              type="text"
                              value={
                                readings[evap.id] !== undefined
                                  ? readings[evap.id]
                                  : ''
                              }
                              onChange={({ detail }) =>
                                handleInputChange(evap.id, detail.value)
                              }
                              placeholder="Ej. 1.5 o D"
                            />
                          </FormField>
                        </div>
                      ))}
                    </Grid>
                  </Container>

                  {/* 4. TEMPERATURAS DE CUARTO Y AMBIENTE */}
                  <Container
                    header={
                      <Header variant="h2">Temperaturas Interiores</Header>
                    }
                  >
                    <Box margin={{ bottom: 'm' }}>
                      <Alert type="warning">
                        La temperatura del cuarto debe ser leída exclusivamente
                        en los termómetros interiores. (Rango esperado: 0 a
                        3°C).
                      </Alert>
                    </Box>
                    <ColumnLayout columns={4} variant="text-grid">
                      {SCHEMA.temperaturasAmbiente.map((temp) => (
                        <FormField
                          key={temp.id}
                          label={temp.label}
                          description={temp.desc}
                          errorText={getValidationError(
                            temp,
                            readings[temp.id],
                          )}
                        >
                          <Input
                            type="number"
                            step="any"
                            value={
                              readings[temp.id] !== undefined
                                ? readings[temp.id]
                                : ''
                            }
                            onChange={({ detail }) =>
                              handleInputChange(temp.id, detail.value)
                            }
                            placeholder="0.00"
                          />
                        </FormField>
                      ))}
                    </ColumnLayout>
                  </Container>

                  {/* 5. VALIDACIÓN FINAL Y OBSERVACIONES */}
                  <Grid
                    gridDefinition={[
                      { colspan: { default: 12, m: 5 } },
                      { colspan: { default: 12, m: 7 } },
                    ]}
                  >
                    <Container
                      header={
                        <Header variant="h3">Validación de Apagadores</Header>
                      }
                    >
                      <FormField description="Revisa que los apagadores manuales de los difusores y compresores estén encendidos.">
                        <SegmentedControl
                          selectedId={apagadoresValue}
                          onChange={({ detail }) =>
                            handleInputChange(
                              'apagadores_encendidos',
                              detail.selectedId === 'SI',
                            )
                          }
                          options={[
                            { text: 'Sí, encendidos', id: 'SI' },
                            { text: 'No (Reportar)', id: 'NO' },
                          ]}
                        />
                      </FormField>
                    </Container>

                    <Container
                      header={
                        <Header variant="h3">
                          Observaciones (Reporte al Reverso)
                        </Header>
                      }
                    >
                      <FormField>
                        <Textarea
                          value={observaciones}
                          onChange={({ detail }) =>
                            setObservaciones(detail.value)
                          }
                          placeholder="Si marcó 'X' en niveles de aceite, 'No' en apagadores, o hay otra anomalía, descríbalo aquí..."
                          rows={3}
                        />
                      </FormField>
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
