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
  Alert,
  Textarea,
} from '@cloudscape-design/components';

import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import SecondaryHeader from '@/components/layouts/BreadcrumbNavBar';
import { Footer } from '@/components/layouts/AppFooter';

// --- ESQUEMA MAESTRO: ANÁLISIS QUÍMICOS ---
const CHEMICAL_SCHEMA = {
  name: 'Bitácora Análisis Químicos (Central de Vapor)',
  metrics: [
    {
      id: 'ph',
      label: 'Nivel de PH',
      unit: 'Escala PH',
      min: 10.5,
      max: 11.5,
      desc: 'Rango esperado: 10.5 a 11.5',
    },
    {
      id: 'dureza',
      label: 'Dureza',
      unit: 'PPM',
      max: 9.99,
      desc: 'Debe ser menor a 10 (< 10)',
    },
    {
      id: 'suavizador',
      label: 'Suavizador',
      unit: 'PPM',
      exact: 0,
      desc: 'Debe ser exactamente 0 PPM',
    },
  ],
};

// Generador de intervalos de 2 horas (Formato 24h: 06:00, 08:00... 04:00)
const generateBiHourlyOptions = () => {
  // FIX: Tipamos el arreglo de retorno
  const options: any[] = [];
  for (let i = 0; i < 24; i += 2) {
    const hourString = i.toString().padStart(2, '0') + ':00';
    options.push({ label: hourString, value: hourString });
  }
  return options;
};

export default function ChemicalAnalysisEntry() {
  const [navigationOpen, setNavigationOpen] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // --- ESTADOS DE CONTEXTO ---
  // FIX: Tipamos el estado de los Select a any para no chocar con TS
  const [turno, setTurno] = React.useState<any>({
    label: 'Turno A',
    value: 'A',
  });
  const [hour, setHour] = React.useState<any>({
    label: '06:00',
    value: '06:00',
  });
  const [observaciones, setObservaciones] = React.useState('');

  // FIX: Tipamos explícitamente el objeto de lecturas como un diccionario
  const [readings, setReadings] = React.useState<Record<string, any>>({});

  React.useEffect(() => {
    // FIX: Tipamos inicializador para que permita agregar propiedades dinámicamente
    const initialReadings: Record<string, any> = {};
    CHEMICAL_SCHEMA.metrics.forEach((metric) => {
      initialReadings[metric.id] = '';
    });
    setReadings(initialReadings);
    setObservaciones('');
  }, [hour.value, turno.value]);

  // FIX: Tipamos los parámetros id y value
  const handleInputChange = (id: string, value: any) => {
    setReadings((prev) => ({ ...prev, [id]: value }));
  };

  // Validación química estricta
  // FIX: Tipamos los parámetros
  const getValidationError = (metric: any, value: any) => {
    if (value === '' || value === undefined) return null;
    const num = parseFloat(value);
    if (isNaN(num)) return 'Debe ser un valor numérico.';

    // Regla especial para Suavizador (Debe ser exactamente 0)
    if (metric.exact !== undefined && num !== metric.exact) {
      return `Fuera de norma. Debe ser ${metric.exact} ${metric.unit}.`;
    }
    // Regla para PH (Rango) y Dureza (Menor a 10)
    if (metric.min !== undefined && num < metric.min)
      return `Valor bajo (Min: ${metric.min}).`;
    if (metric.max !== undefined && num > metric.max)
      return `Valor alto (Max: ${metric.max}).`;

    return null;
  };

  // FIX: Tipamos el evento de forma opcional y robusta
  const handleSubmit = (e?: any) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    setIsSubmitting(true);

    const payload = {
      assetId: 'analisis_quimicos_vapor',
      turno: turno.value,
      timestampHour: hour.value,
      telemetry: readings,
      observaciones,
    };

    console.log('JSON listo para la Base de Datos (Químicos):', payload);

    setTimeout(() => {
      setIsSubmitting(false);
      alert(
        `Análisis químico de las ${hour.value} (Turno ${turno.value}) guardado correctamente.`,
      );
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
        {/* FIX: Omitimos el chequeo estricto del componente BreadcrumbNavBar */}
        {/* @ts-ignore */}
        <SecondaryHeader
          breadcrumbs={[
            { text: 'Mantenimiento', href: '/' },
            { text: 'Telemetría', href: '#' },
            { text: 'Análisis Químicos', href: '#' },
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
                      Guardar Análisis
                    </Button>
                  </SpaceBetween>
                }
              >
                <SpaceBetween size="l">
                  <Header
                    variant="h1"
                    description="Registre los niveles de PH, Dureza y Suavizador del agua de las calderas (Intervalos de 2 horas)."
                  >
                    Bitácora Análisis Químicos
                  </Header>

                  {/* 1. SELECCIÓN DE TURNO Y HORA */}
                  <Container
                    header={<Header variant="h2">Contexto Operativo</Header>}
                  >
                    <ColumnLayout columns={2}>
                      <FormField label="Turno de Operación">
                        <Select
                          selectedOption={turno}
                          // FIX: as any para que no choque con la interfaz de Cloudscape
                          onChange={({ detail }) =>
                            setTurno(detail.selectedOption as any)
                          }
                          options={[
                            { label: 'Turno A (Día)', value: 'A' },
                            { label: 'Turno B (Tarde)', value: 'B' },
                            { label: 'Turno C (Noche)', value: 'C' },
                          ]}
                        />
                      </FormField>
                      <FormField label="Hora de Toma de Muestra (CST)">
                        <Select
                          selectedOption={hour}
                          // FIX: as any
                          onChange={({ detail }) =>
                            setHour(detail.selectedOption as any)
                          }
                          options={generateBiHourlyOptions()}
                        />
                      </FormField>
                    </ColumnLayout>
                  </Container>

                  {/* 2. PARÁMETROS QUÍMICOS */}
                  <Container
                    header={
                      <Header variant="h2">Lecturas de Calidad de Agua</Header>
                    }
                  >
                    <Box margin={{ bottom: 'l' }}>
                      <Alert type="info">
                        El sistema validará automáticamente que la Dureza sea
                        menor a 10 y que el Suavizador se mantenga en 0 PPM,
                        según la norma de calidad 2.2-16-3-6.
                      </Alert>
                    </Box>
                    <ColumnLayout columns={3} variant="text-grid">
                      {CHEMICAL_SCHEMA.metrics.map((metric) => (
                        <FormField
                          key={metric.id}
                          label={`${metric.label}`}
                          description={metric.desc}
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
                  </Container>

                  {/* 3. OBSERVACIONES / AJUSTES QUÍMICOS */}
                  <Container
                    header={
                      <Header variant="h2">Ajustes y Observaciones</Header>
                    }
                  >
                    <FormField label="Comentarios de la lectura">
                      <Textarea
                        value={observaciones}
                        onChange={({ detail }) =>
                          setObservaciones(detail.value)
                        }
                        placeholder="Si algún valor salió de rango, especifique qué ajuste químico se realizó o la causa raíz..."
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
