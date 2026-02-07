import React, { memo } from 'react';
import {
  Box,
  ColumnLayout,
  Link,
  StatusIndicator,
  BarChart,
  AreaChart,
  PieChart,
  Table,
  SpaceBetween,
  Icon,
  Spinner,
  Badge,
} from '@cloudscape-design/components';

interface WidgetProps {
  loading?: boolean;
}

const DATES = [
  new Date(2023, 0, 1),
  new Date(2023, 0, 2),
  new Date(2023, 0, 3),
  new Date(2023, 0, 4),
];

const TRAFFIC_SERIES = [
  {
    title: 'Éxito',
    type: 'area' as const,
    color: '#1D8102',
    data: [
      { x: DATES[0], y: 120 },
      { x: DATES[1], y: 340 },
      { x: DATES[2], y: 220 },
      { x: DATES[3], y: 450 },
    ],
  },
  {
    title: 'Errores',
    type: 'area' as const,
    color: '#D13212',
    data: [
      { x: DATES[0], y: 10 },
      { x: DATES[1], y: 25 },
      { x: DATES[2], y: 15 },
      { x: DATES[3], y: 40 },
    ],
  },
];

// --- WRAPPER PRINCIPAL (CORREGIDO) ---
// overflow: 'hidden' elimina el scroll del contenedor del widget
const WidgetWrapper = ({
  children,
  loading,
}: {
  children: React.ReactNode;
  loading?: boolean;
}) => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}
  >
    {loading ? (
      <Box
        padding="l"
        textAlign="center"
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Spinner size="large" />
      </Box>
    ) : (
      children
    )}
  </div>
);

// --- CONTENEDOR GRÁFICAS (CORREGIDO) ---
// minHeight: 0 permite que la gráfica se encoja si el usuario hace pequeño el widget, sin generar scroll.
const ResponsiveChartContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div style={{ flex: 1, minHeight: 0, position: 'relative', width: '100%' }}>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </div>
  </div>
);

// --- CONTENEDOR TABLAS (NUEVO) ---
// Fuerza a la tabla a vivir dentro del espacio sin desbordar el widget
const TableContainer = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      flex: 1,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {children}
  </div>
);

// 1. KPI RESUMEN
export const InventorySummary = memo(({ loading }: WidgetProps) => (
  <WidgetWrapper loading={loading}>
    <Box padding="s">
      <ColumnLayout columns={4} variant="text-grid" borders="vertical">
        <div>
          <Box variant="awsui-key-label">Refacciones</Box>
          <Link href="#" variant="awsui-value-large" fontSize="display-l">
            1,842
          </Link>
        </div>
        <div>
          <Box variant="awsui-key-label">Valor Total</Box>
          <Link href="#" variant="awsui-value-large" fontSize="display-l">
            $45.2k
          </Link>
        </div>
        <div>
          <Box variant="awsui-key-label">Críticos</Box>
          <Box
            variant="awsui-value-large"
            fontSize="display-l"
            color="text-status-error"
          >
            12
          </Box>
        </div>
        <div>
          <Box variant="awsui-key-label">Obsoletos</Box>
          <Link
            href="#"
            variant="awsui-value-large"
            fontSize="display-l"
            color="text-status-inactive"
          >
            85
          </Link>
        </div>
      </ColumnLayout>
    </Box>
  </WidgetWrapper>
));

// 2. USO POR MÁQUINA
export const MachineUsage = memo(({ loading }: WidgetProps) => (
  <WidgetWrapper loading={loading}>
    <ResponsiveChartContainer>
      <BarChart
        series={[
          {
            title: 'Consultas',
            type: 'bar',
            data: [
              { x: 'IJ White', y: 320 },
              { x: 'Mundini', y: 210 },
              { x: 'Moleelar', y: 150 },
              { x: 'Sidel', y: 90 },
              { x: 'Krones', y: 280 },
            ],
          },
        ]}
        xDomain={['IJ White', 'Mundini', 'Moleelar', 'Sidel', 'Krones']}
        yDomain={[0, 400]}
        fitHeight={true}
        hideFilter
        hideLegend
        i18nStrings={{ yTickFormatter: (e) => `${e}` }}
        ariaLabel="Uso por máquina"
      />
    </ResponsiveChartContainer>
  </WidgetWrapper>
));

// 3. TRÁFICO
export const MonthlyTraffic = memo(({ loading }: WidgetProps) => (
  <WidgetWrapper loading={loading}>
    <ResponsiveChartContainer>
      <AreaChart
        series={TRAFFIC_SERIES}
        xDomain={[DATES[0], DATES[3]]}
        yDomain={[0, 600]}
        fitHeight={true}
        hideFilter
        xScaleType="time"
        i18nStrings={{
          legendAriaLabel: 'Leyenda',
          chartAriaRoleDescription: 'gráfico',
        }}
        ariaLabel="Tráfico mensual"
      />
    </ResponsiveChartContainer>
  </WidgetWrapper>
));

// 4. SISTEMA
export const SystemHealth = memo(({ loading }: WidgetProps) => (
  <WidgetWrapper loading={loading}>
    <ColumnLayout columns={1} borders="horizontal">
      <Box padding={{ vertical: 's' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box variant="strong">Modelo IA</Box>
          <StatusIndicator type="success">En línea</StatusIndicator>
        </div>
      </Box>
      <Box padding={{ vertical: 's' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box variant="strong">API Backend</Box>
          <StatusIndicator type="success">Estable</StatusIndicator>
        </div>
      </Box>
      <Box padding={{ vertical: 's' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box variant="strong">DB Usuarios</Box>
          <StatusIndicator type="success">OK</StatusIndicator>
        </div>
      </Box>
      <Box padding={{ vertical: 's' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box variant="strong">ERP Sync</Box>
          <StatusIndicator type="warning">Lento</StatusIndicator>
        </div>
      </Box>
    </ColumnLayout>
  </WidgetWrapper>
));

// 5. CATEGORÍAS
export const CategoryDistribution = memo(({ loading }: WidgetProps) => (
  <WidgetWrapper loading={loading}>
    <ResponsiveChartContainer>
      <PieChart
        data={[
          { title: 'Sensores', value: 35, color: '#0073bb' },
          { title: 'Motores', value: 20, color: '#e07700' },
          { title: 'Bandas', value: 15, color: '#2c823c' },
          { title: 'Otros', value: 30, color: '#5f6b7a' },
        ]}
        size="medium"
        variant="donut"
        hideLegend
        fitHeight={true}
        innerMetricDescription="Total"
        innerMetricValue="1.8k"
        ariaLabel="Categorías"
      />
    </ResponsiveChartContainer>
  </WidgetWrapper>
));

// 6. ALERTAS STOCK (Usa TableContainer)
export const StockAlerts = memo(({ loading }: WidgetProps) => (
  <WidgetWrapper loading={loading}>
    <TableContainer>
      <Table
        columnDefinitions={[
          {
            header: 'Refacción',
            cell: (item) => <Link href="#">{item.name}</Link>,
          },
          {
            header: 'Cant.',
            cell: (item) => <Badge color="red">{item.stock}</Badge>,
          },
          { header: 'Maq.', cell: (item) => item.machine },
        ]}
        items={[
          { name: 'Sensor #22', stock: '0', machine: 'Mundini' },
          { name: 'Banda 5m', stock: '1', machine: 'IJ White' },
          { name: 'Rodamiento', stock: '2', machine: 'Sidel' },
          { name: 'Válvula Pn.', stock: '2', machine: 'Krones' },
          { name: 'Pistón 3mm', stock: '1', machine: 'Moleelar' },
        ]}
        variant="embedded"
      />
    </TableContainer>
  </WidgetWrapper>
));

// 7. CONSULTAS (Usa TableContainer)
export const RecentQueries = memo(({ loading }: WidgetProps) => (
  <WidgetWrapper loading={loading}>
    <TableContainer>
      <Table
        columnDefinitions={[
          { header: 'Hora', cell: (item) => item.time, width: 85 },
          { header: 'Usuario', cell: (item) => item.user },
          {
            header: 'Est.',
            cell: (item) => (
              <StatusIndicator
                type={item.status === 'OK' ? 'success' : 'error'}
              >
                {item.status}
              </StatusIndicator>
            ),
          },
        ]}
        items={[
          { time: '10:42', user: 'Juan P.', status: 'OK' },
          { time: '10:38', user: 'Luis R.', status: 'Error' },
          { time: '10:15', user: 'Admin', status: 'OK' },
          { time: '09:50', user: 'Ana M.', status: 'OK' },
        ]}
        variant="embedded"
      />
    </TableContainer>
  </WidgetWrapper>
));

// 8. NOTIFICACIONES
export const SystemNotifications = memo(({ loading }: WidgetProps) => (
  <WidgetWrapper loading={loading}>
    <SpaceBetween size="s">
      <Box variant="h4">Avisos</Box>
      <Box variant="p" color="text-body-secondary">
        Mantenimiento IA programado.
      </Box>
      <Box fontSize="body-s" color="text-status-info">
        Sáb 02:00 AM - 04:00 AM
      </Box>
      <Link href="#">
        <Icon name="external" /> Detalles
      </Link>
    </SpaceBetween>
  </WidgetWrapper>
));

// 9. OBSOLETOS
export const ObsoleteStats = memo(({ loading }: WidgetProps) => (
  <WidgetWrapper loading={loading}>
    <ColumnLayout columns={2} variant="text-grid">
      <div>
        <Box variant="awsui-key-label">Ref. Bajas</Box>
        <Box fontSize="heading-xl" color="text-status-inactive">
          12%
        </Box>
      </div>
      <div>
        <Box variant="awsui-key-label">Inactivos</Box>
        <Box fontSize="heading-xl">45</Box>
      </div>
    </ColumnLayout>
  </WidgetWrapper>
));

export const OperationalMetrics = memo(({ loading }: WidgetProps) => (
  <WidgetWrapper loading={loading}>
    <Box textAlign="center" padding="l">
      <StatusIndicator type="success">Servidor OK</StatusIndicator>
      <Box variant="p" color="text-body-secondary">
        99.9% Uptime
      </Box>
    </Box>
  </WidgetWrapper>
));
