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
  SegmentedControl,
  Textarea,
} from '@cloudscape-design/components';

import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import SecondaryHeader from '@/components/layouts/BreadcrumbNavBar';
import { Footer } from '@/components/layouts/AppFooter';

// --- ESQUEMA MAESTRO: BITÁCORA COMPRESOR DE AIRE ---
const COMPRESSOR_SCHEMA = {
  // Configuración de Temperaturas
  tempLecturas: [1, 2, 3, 4, 5, 6, 7],
  tempFinales: [
    { id: 'temp_sull', label: 'Temperatura Sull', unit: '°C', max: 95 },
    { id: 'temp_gd', label: 'Temperatura GD', unit: '°C', max: 95 },
  ],

  // Configuración de Presiones
  presLecturas: [1, 2, 3, 4, 5, 6, 7],
  presFinales: [
    { id: 'pres_sull', label: 'Presión Sull', unit: 'PSI', min: 100, max: 120 },
    { id: 'pres_gd', label: 'Presión GD', unit: 'PSI', min: 100, max: 120 },
  ],

  // Revisiones Visuales
  visualChecks: [
    {
      id: 'fuga_aire',
      label: 'Fuga de Aire',
      options: [
        { id: 'NO', text: 'Sin Fugas' },
        { id: 'SI', text: 'Fuga Detectada' },
      ],
    },
    {
      id: 'fuga_aceite',
      label: 'Fuga de Aceite',
      options: [
        { id: 'NO', text: 'Sin Fugas' },
        { id: 'SI', text: 'Fuga Detectada' },
      ],
    },
    {
      id: 'ruido_extrano',
      label: 'Ruidos Extraños',
      options: [
        { id: 'NO', text: 'Operación Normal' },
        { id: 'SI', text: 'Ruido Anormal' },
      ],
    },
    {
      id: 'purga_test',
      label: 'Purga de Aire',
      options: [
        { id: 'OFF', text: 'OFF' },
        { id: 'ON', text: 'TEST ON' },
      ],
    },
    {
      id: 'mirilla_filtro',
      label: 'Mirilla Nivel Filtro Purga',
      options: [
        { id: 'LLENO', text: 'Lleno' },
        { id: 'VACIO', text: 'Vacío' },
      ],
    },
  ],

  // Cierre de Turno
  cierreTurno: [
    { id: 'horas_sull', label: 'Horas Trabajadas (Sull)', unit: 'Hrs' },
    { id: 'horas_gd', label: 'Horas Trabajadas (GD)', unit: 'Hrs' },
  ],
};

const generateBiHourlyOptions = () => {
  const options = [];
  for (let i = 0; i < 24; i += 2) {
    const hourString = i.toString().padStart(2, '0') + ':00';
    options.push({ label: hourString, value: hourString });
  }
  return options;
};

export default function AirCompressorEntry() {
  const [navigationOpen, setNavigationOpen] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hour, setHour] = React.useState({ label: '06:00', value: '06:00' });
  const [observaciones, setObservaciones] = React.useState('');

  const [readings, setReadings] = React.useState({});

  React.useEffect(() => {
    const initialReadings = {};

    // Inicializar las 7 lecturas de Temperatura y Presión
    COMPRESSOR_SCHEMA.tempLecturas.forEach(
      (num) => (initialReadings[`temp_lec_${num}`] = ''),
    );
    COMPRESSOR_SCHEMA.presLecturas.forEach(
      (num) => (initialReadings[`pres_lec_${num}`] = ''),
    );

    // Inicializar los campos finales Sull/GD
    COMPRESSOR_SCHEMA.tempFinales.forEach(
      (metric) => (initialReadings[metric.id] = ''),
    );
    COMPRESSOR_SCHEMA.presFinales.forEach(
      (metric) => (initialReadings[metric.id] = ''),
    );

    // Inicializar checkboxes y cierres
    COMPRESSOR_SCHEMA.visualChecks.forEach(
      (check) => (initialReadings[check.id] = check.options[0].id),
    );
    COMPRESSOR_SCHEMA.cierreTurno.forEach(
      (field) => (initialReadings[field.id] = ''),
    );

    setReadings(initialReadings);
    setObservaciones('');
  }, [hour.value]);

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

    const payload = {
      assetId: 'compresor_aire',
      timestampHour: hour.value,
      telemetry: readings,
      observaciones,
    };

    console.log('JSON listo para la Base de Datos:', payload);

    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Bitácora de las ${hour.value} guardada correctamente.`);
    }, 1000);
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
            { text: 'Telemetría', href: '#' },
            { text: 'Compresor de Aire', href: '#' },
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
                      Guardar Lecturas
                    </Button>
                  </SpaceBetween>
                }
              >
                <SpaceBetween size="l">
                  <Header
                    variant="h1"
                    description="Capture los 7 registros del periodo y los parámetros finales de Sull y GD."
                  >
                    Bitácora Compresor de Aire
                  </Header>

                  <Container>
                    <FormField label="Hora de Lectura (Intervalo de 2 hrs)">
                      <Select
                        selectedOption={hour}
                        onChange={({ detail }) =>
                          setHour(detail.selectedOption)
                        }
                        options={generateBiHourlyOptions()}
                      />
                    </FormField>
                  </Container>

                  {/* 1. CONTENEDOR DE TEMPERATURAS */}
                  <Container
                    header={
                      <Header variant="h2">
                        Temperaturas de Operación (°C)
                      </Header>
                    }
                  >
                    <SpaceBetween size="l">
                      {/* Las 7 Lecturas de Temperatura */}
                      <div>
                        <Box
                          variant="awsui-key-label"
                          margin={{ bottom: 'xs' }}
                        >
                          Registros de Temperatura (1 al 7)
                        </Box>
                        <ColumnLayout columns={7}>
                          {COMPRESSOR_SCHEMA.tempLecturas.map((num) => (
                            <FormField
                              key={`t_lec_${num}`}
                              label={`Lec ${num}`}
                            >
                              <Input
                                type="number"
                                step="any"
                                value={
                                  readings[`temp_lec_${num}`] !== undefined
                                    ? readings[`temp_lec_${num}`]
                                    : ''
                                }
                                onChange={({ detail }) =>
                                  handleInputChange(
                                    `temp_lec_${num}`,
                                    detail.value,
                                  )
                                }
                                placeholder="-"
                              />
                            </FormField>
                          ))}
                        </ColumnLayout>
                      </div>

                      {/* Los 2 datos finales de Temperatura (Sull y GD) */}
                      <div
                        style={{
                          borderTop: '1px solid #eaeded',
                          paddingTop: '16px',
                        }}
                      >
                        <Box
                          variant="awsui-key-label"
                          margin={{ bottom: 'xs' }}
                        >
                          Registro Final por Equipo
                        </Box>
                        <ColumnLayout columns={2}>
                          {COMPRESSOR_SCHEMA.tempFinales.map((metric) => (
                            <FormField
                              key={metric.id}
                              label={`${metric.label}`}
                              description={`Máximo ${metric.max}°C`}
                              errorText={getValidationError(
                                metric,
                                readings[metric.id],
                              )}
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
                      </div>
                    </SpaceBetween>
                  </Container>

                  {/* 2. CONTENEDOR DE PRESIONES */}
                  <Container
                    header={<Header variant="h2">Presión de Aire (PSI)</Header>}
                  >
                    <SpaceBetween size="l">
                      {/* Las 7 Lecturas de Presión */}
                      <div>
                        <Box
                          variant="awsui-key-label"
                          margin={{ bottom: 'xs' }}
                        >
                          Registros de Presión (1 al 7)
                        </Box>
                        <ColumnLayout columns={7}>
                          {COMPRESSOR_SCHEMA.presLecturas.map((num) => (
                            <FormField
                              key={`p_lec_${num}`}
                              label={`Lec ${num}`}
                            >
                              <Input
                                type="number"
                                step="any"
                                value={
                                  readings[`pres_lec_${num}`] !== undefined
                                    ? readings[`pres_lec_${num}`]
                                    : ''
                                }
                                onChange={({ detail }) =>
                                  handleInputChange(
                                    `pres_lec_${num}`,
                                    detail.value,
                                  )
                                }
                                placeholder="-"
                              />
                            </FormField>
                          ))}
                        </ColumnLayout>
                      </div>

                      {/* Los 2 datos finales de Presión (Sull y GD) */}
                      <div
                        style={{
                          borderTop: '1px solid #eaeded',
                          paddingTop: '16px',
                        }}
                      >
                        <Box
                          variant="awsui-key-label"
                          margin={{ bottom: 'xs' }}
                        >
                          Registro Final por Equipo
                        </Box>
                        <ColumnLayout columns={2}>
                          {COMPRESSOR_SCHEMA.presFinales.map((metric) => (
                            <FormField
                              key={metric.id}
                              label={`${metric.label}`}
                              description={`Rango: ${metric.min} - ${metric.max} PSI`}
                              errorText={getValidationError(
                                metric,
                                readings[metric.id],
                              )}
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
                      </div>
                    </SpaceBetween>
                  </Container>

                  {/* 3. INSPECCIÓN Y PURGAS */}
                  <Container
                    header={
                      <Header variant="h2">Inspección de Fugas y Purgas</Header>
                    }
                  >
                    <ColumnLayout columns={3} variant="text-grid">
                      {COMPRESSOR_SCHEMA.visualChecks.map((check) => (
                        <FormField key={check.id} label={check.label}>
                          <SegmentedControl
                            selectedId={readings[check.id]}
                            onChange={({ detail }) =>
                              handleInputChange(check.id, detail.selectedId)
                            }
                            options={check.options}
                          />
                        </FormField>
                      ))}
                    </ColumnLayout>
                  </Container>

                  {/* 4. CIERRE DE TURNO */}
                  <Container
                    header={<Header variant="h2">Horas Trabajadas</Header>}
                  >
                    <Box margin={{ bottom: 'm' }}>
                      <Alert type="warning">
                        Las horas trabajadas se tomarán al final del turno "C".
                        Si no es su turno, deje esto en blanco.
                      </Alert>
                    </Box>
                    <ColumnLayout columns={2}>
                      {COMPRESSOR_SCHEMA.cierreTurno.map((field) => (
                        <FormField
                          key={field.id}
                          label={`${field.label} (${field.unit})`}
                        >
                          <Input
                            type="number"
                            step="any"
                            value={
                              readings[field.id] !== undefined
                                ? readings[field.id]
                                : ''
                            }
                            onChange={({ detail }) =>
                              handleInputChange(field.id, detail.value)
                            }
                            placeholder="Ej. 12500"
                          />
                        </FormField>
                      ))}
                    </ColumnLayout>
                  </Container>

                  {/* 5. OBSERVACIONES */}
                  <Container
                    header={<Header variant="h2">Observaciones</Header>}
                  >
                    <FormField label="Comentarios">
                      <Textarea
                        value={observaciones}
                        onChange={({ detail }) =>
                          setObservaciones(detail.value)
                        }
                        placeholder="Registre cualquier anomalía del bloque..."
                        rows={2}
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
