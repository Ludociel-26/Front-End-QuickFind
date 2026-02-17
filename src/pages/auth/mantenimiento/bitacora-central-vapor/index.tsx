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
  Checkbox,
  SegmentedControl,
} from '@cloudscape-design/components';

import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import SecondaryHeader from '@/components/layouts/BreadcrumbNavBar';
import { Footer } from '@/components/layouts/AppFooter';

// --- ESQUEMA MAESTRO: BITÁCORA CENTRAL DE VAPOR 100% COMPLETO ---
const VAPOR_SCHEMA = {
  name: 'Bitácora Central de Vapor',

  // 1. Agrupación de Métricas Numéricas (Horarias y Acumuladas)
  numericGroups: [
    {
      title: 'Presiones y Flujos (Horario)',
      fields: [
        {
          id: 'pres_comb',
          label: 'Presión en Comb.',
          unit: 'PSI',
          desc: '4-6 Cleaver / 1.5-2 Merggo',
        },
        {
          id: 'kg_vapor',
          label: 'Kg. Vapor',
          unit: 'Kg',
          min: 7.0,
          max: 8.5,
          desc: 'Rango: 7 a 8.5',
        },
        {
          id: 'lbs_aire',
          label: 'LBS Aire',
          unit: 'LBS',
          desc: '10-20 Cerreg / 15-25 Cleaver / 20-35 Myrggo',
        },
        {
          id: 'comb_rango',
          label: 'Comb. (Rango)',
          unit: 'Unidades',
          min: 30,
          max: 130,
          desc: '30-130 Cerreg/Merggo / 110-130 Cleaver',
        },
      ],
    },
    {
      title: 'Temperaturas (°C) (Horario)',
      fields: [
        {
          id: 'temp_tdia',
          label: 'Temp. T. Día',
          unit: '°C',
          max: 120,
          desc: 'Máximo 120°C',
        },
        {
          id: 'temp_gases',
          label: 'Temp. Gases',
          unit: '°C',
          min: 100,
          max: 250,
          desc: 'Rango: 100 a 250°C',
        },
        {
          id: 'temp_agua',
          label: 'Temp. Agua',
          unit: '°C',
          min: 80,
          max: 120,
          desc: 'Rango: 80 a 120°C',
        },
      ],
    },
    {
      title: 'Consumos de Combustible y Operación (Cierre de Turno)',
      fields: [
        {
          id: 'consumo_dia',
          label: 'Consumo Día',
          unit: 'Lts/Kg',
          desc: 'Combustible turno día',
        },
        {
          id: 'consumo_tarde',
          label: 'Consumo Tarde',
          unit: 'Lts/Kg',
          desc: 'Combustible turno tarde',
        },
        {
          id: 'consumo_noche',
          label: 'Consumo Noche',
          unit: 'Lts/Kg',
          desc: 'Combustible turno noche',
        },
        {
          id: 'consumo_total',
          label: 'Consumo TOTAL',
          unit: 'Lts/Kg',
          desc: 'Suma total combustible',
        },
        {
          id: 'consumo_diesel',
          label: 'Consumo Diésel',
          unit: 'Lts',
          desc: 'Reporte de Diésel',
        },
        {
          id: 'consumo_agua',
          label: 'Consumo de Agua',
          unit: 'M3/Lts',
          desc: 'Agua total ingresada',
        },
        {
          id: 'total_kg_vapor',
          label: 'Total Kg./Vapor',
          unit: 'Kg',
          desc: 'Vapor acumulado',
        },
        {
          id: 'consumo_sal',
          label: 'Consumo de Sal',
          unit: 'Kg',
          desc: 'Sal para suavizadores',
        },
      ],
    },
  ],

  // 2. Modos de Operación
  operationalModes: [
    {
      id: 'tipo_operacion',
      label: 'Operación del Quemador',
      options: [
        { id: 'COMB', text: 'Combustóleo' },
        { id: 'DIESEL', text: 'Diésel' },
      ],
    },
    {
      id: 'tipo_agua',
      label: 'Alimentación de Agua',
      options: [
        { id: 'SUAVE', text: 'Agua Suave' },
        { id: 'CRUDA', text: 'Agua Cruda' },
      ],
    },
  ],

  // 3. Revisiones Visuales y Purgas (Checkboxes exactos al formato)
  checks: [
    {
      id: 'rev_nivel_tanque',
      label: 'Revisar Nivel de Combustóleo Tanque Día',
    },
    { id: 'rev_seguridad', label: 'Revisar Dispositivos de Seguridad' },
    { id: 'rev_bomba_agua', label: 'Revisar Bomba de Alim. de Agua' },
    { id: 'colum_n_agu', label: 'COLUM. N. AGU. (Columna de Agua)' }, // Etiqueta exacta
    { id: 'purga_fondo', label: 'PURGA FONDO (Purga de Fondo)' },
  ],
};

const generateHourOptions = () => {
  const options = [];
  for (let i = 0; i < 24; i++) {
    const hourString = i.toString().padStart(2, '0') + ':00';
    options.push({ label: hourString, value: hourString });
  }
  return options;
};

export default function CentralVaporEntry() {
  const [navigationOpen, setNavigationOpen] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [hour, setHour] = React.useState({ label: '08:00', value: '08:00' });

  const [readings, setReadings] = React.useState({});

  React.useEffect(() => {
    const initialReadings = {};

    VAPOR_SCHEMA.numericGroups.forEach((group) => {
      group.fields.forEach((field) => {
        initialReadings[field.id] = '';
      });
    });

    VAPOR_SCHEMA.operationalModes.forEach((mode) => {
      initialReadings[mode.id] = mode.options[0].id;
    });

    VAPOR_SCHEMA.checks.forEach((check) => {
      initialReadings[check.id] = false;
    });

    setReadings(initialReadings);
  }, [hour.value]);

  const handleInputChange = (id, value) => {
    setReadings((prev) => ({ ...prev, [id]: value }));
  };

  const getValidationError = (metric, value) => {
    if (value === '') return null;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Debe ser un número.';
    if (metric.min !== undefined && numValue < metric.min)
      return `Mínimo: ${metric.min}`;
    if (metric.max !== undefined && numValue > metric.max)
      return `Máximo: ${metric.max}`;
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      assetId: 'caldera_principal',
      timestampHour: hour.value,
      telemetry: readings,
    };

    console.log('Payload formateado para Node/PostgreSQL:', payload);

    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Bitácora de las ${hour.value} guardada correctamente.`);
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
            { text: 'Telemetría', href: '#' },
            { text: 'Central de Vapor', href: '#' },
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
                    description="Capture los parámetros de la caldera. Llene el bloque de consumos únicamente si es cierre de turno."
                  >
                    Bitácora Central de Vapor
                  </Header>

                  <Container>
                    <FormField label="Hora de Corte (CST)">
                      <Select
                        selectedOption={hour}
                        onChange={({ detail }) =>
                          setHour(detail.selectedOption)
                        }
                        options={generateHourOptions()}
                      />
                    </FormField>
                  </Container>

                  {/* 1. MÉTRICAS AGRUPADAS (Presiones, Temperaturas y ahora Consumos) */}
                  {VAPOR_SCHEMA.numericGroups.map((group, index) => (
                    <Container
                      key={index}
                      header={<Header variant="h2">{group.title}</Header>}
                    >
                      {/* Si es el bloque de consumos, mostramos una alerta informativa */}
                      {group.title.includes('Consumos') && (
                        <Box margin={{ bottom: 'm' }}>
                          <Alert type="info">
                            Estos campos se llenan al finalizar el turno
                            correspondiente (Día, Tarde, Noche). Déjelos en
                            blanco si es una captura intermedia.
                          </Alert>
                        </Box>
                      )}

                      <ColumnLayout
                        columns={group.fields.length > 4 ? 4 : 3}
                        variant="text-grid"
                      >
                        {group.fields.map((field) => (
                          <FormField
                            key={field.id}
                            label={`${field.label} (${field.unit})`}
                            description={field.desc}
                            errorText={getValidationError(
                              field,
                              readings[field.id],
                            )}
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
                              placeholder="0.00"
                            />
                          </FormField>
                        ))}
                      </ColumnLayout>
                    </Container>
                  ))}

                  {/* 2. MODOS DE OPERACIÓN */}
                  <Container
                    header={<Header variant="h2">Estados de Operación</Header>}
                  >
                    <ColumnLayout columns={2}>
                      {VAPOR_SCHEMA.operationalModes.map((mode) => (
                        <FormField key={mode.id} label={mode.label}>
                          <SegmentedControl
                            selectedId={readings[mode.id]}
                            onChange={({ detail }) =>
                              handleInputChange(mode.id, detail.selectedId)
                            }
                            options={mode.options}
                          />
                        </FormField>
                      ))}
                    </ColumnLayout>
                  </Container>

                  {/* 3. REVISIONES VISUALES */}
                  <Container
                    header={<Header variant="h2">Revisiones y Purgas</Header>}
                  >
                    <Box margin={{ top: 'm' }}>
                      <Grid
                        gridDefinition={[
                          { colspan: { default: 12, s: 6 } },
                          { colspan: { default: 12, s: 6 } },
                        ]}
                      >
                        {VAPOR_SCHEMA.checks.map((check) => (
                          <div key={check.id} style={{ marginBottom: '16px' }}>
                            <Checkbox
                              onChange={({ detail }) =>
                                handleInputChange(check.id, detail.checked)
                              }
                              checked={readings[check.id] || false}
                            >
                              <span
                                style={{ fontSize: '14px', fontWeight: '500' }}
                              >
                                {check.label}
                              </span>
                            </Checkbox>
                          </div>
                        ))}
                      </Grid>
                    </Box>
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
