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

// --- ESQUEMA MAESTRO REESTRUCTURADO (Solo Bitácora Central de Vapor) ---
const VAPOR_SCHEMA = {
  name: 'Bitácora Central de Vapor',

  // 1. Agrupación de Métricas Numéricas
  numericGroups: [
    {
      title: 'Presiones y Flujos',
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
          desc: 'Rango esperado: 7 a 8.5',
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
      title: 'Temperaturas (°C)',
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
  ],

  // 2. Modos de Operación (Mutuamente Excluyentes)
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

  // 3. Revisiones Visuales y Rutinarias (Checkboxes)
  checks: [
    {
      id: 'rev_nivel_tanque',
      label: 'Revisar Nivel de Combustóleo en Tanque de Día',
    },
    { id: 'rev_seguridad', label: 'Revisar Dispositivos de Seguridad' },
    { id: 'rev_bomba_agua', label: 'Revisar Bomba de Alimentación de Agua' },
    { id: 'columna_agua', label: 'Columna de Agua' },
    { id: 'purga_fondo', label: 'Purga de Fondo' },
  ],
};

// Generador de horas
const generateHourOptions = () => {
  // FIX: Tipamos el arreglo
  const options: any[] = [];
  for (let i = 0; i < 24; i++) {
    const hourString = i.toString().padStart(2, '0') + ':00';
    options.push({ label: hourString, value: hourString });
  }
  return options;
};

export default function CentralVaporEntry() {
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FIX: Tipamos como any para el componente Select
  const [hour, setHour] = useState<any>({ label: '08:00', value: '08:00' });

  // Estado único que almacenará todos los datos de la hora
  // FIX: Declarado como diccionario para permitir keys dinámicas
  const [readings, setReadings] = useState<Record<string, any>>({});

  // Inicialización dinámica del estado basada en el esquema
  useEffect(() => {
    // FIX: Tipado para soportar propiedades inyectadas
    const initialReadings: Record<string, any> = {};

    // Inicializar campos numéricos
    VAPOR_SCHEMA.numericGroups.forEach((group) => {
      group.fields.forEach((field) => {
        initialReadings[field.id] = '';
      });
    });

    // Inicializar modos de operación (Por defecto el primero de la lista)
    VAPOR_SCHEMA.operationalModes.forEach((mode) => {
      initialReadings[mode.id] = mode.options[0].id;
    });

    // Inicializar checkboxes
    VAPOR_SCHEMA.checks.forEach((check) => {
      initialReadings[check.id] = false;
    });

    setReadings(initialReadings);
  }, [hour.value]);

  // FIX: Tipamos id y value
  const handleInputChange = (id: string, value: any) => {
    setReadings((prev) => ({ ...prev, [id]: value }));
  };

  // FIX: Tipamos metric y value
  const getValidationError = (metric: any, value: any) => {
    if (value === '' || value === undefined) return null;
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Debe ser un número válido.';
    if (metric.min !== undefined && numValue < metric.min)
      return `Mínimo: ${metric.min}`;
    if (metric.max !== undefined && numValue > metric.max)
      return `Máximo: ${metric.max}`;
    return null;
  };

  // FIX: Tipamos el evento y lo hacemos robusto
  const handleSubmit = (e?: any) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
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
        {/* FIX: Ignoramos la validación de prop types */}
        {/* @ts-ignore */}
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
                    description="Capture todos los parámetros, modos de operación y rutinas de inspección de la hora actual."
                  >
                    Bitácora Central de Vapor
                  </Header>

                  <Container>
                    <FormField label="Hora de Corte">
                      <Select
                        selectedOption={hour}
                        // FIX: Forzamos la opción como any
                        onChange={({ detail }) =>
                          setHour(detail.selectedOption as any)
                        }
                        options={generateHourOptions()}
                      />
                    </FormField>
                  </Container>

                  {/* 1. SECCIÓN DE TEMPERATURAS Y PRESIONES (Agrupadas) */}
                  {VAPOR_SCHEMA.numericGroups.map((group, index) => (
                    <Container
                      key={index}
                      header={<Header variant="h2">{group.title}</Header>}
                    >
                      <ColumnLayout
                        columns={group.fields.length > 3 ? 4 : 3}
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

                  {/* 2. SECCIÓN DE MODOS DE OPERACIÓN (Segmented Controls) */}
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

                  {/* 3. SECCIÓN DE REVISIONES Y PURGAS (Checkboxes) */}
                  <Container
                    header={<Header variant="h2">Revisiones de Rutina</Header>}
                  >
                    <Alert
                      statusIconAriaLabel="Info"
                      type="info"
                      header="Confirmación Visual"
                    >
                      Confirme únicamente las tareas ejecutadas o validadas en
                      esta hora de operación.
                    </Alert>
                    <Box margin={{ top: 'l' }}>
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
