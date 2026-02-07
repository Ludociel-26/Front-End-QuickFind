// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import type { BoardProps } from '@cloudscape-design/board-components/board';
import {
  InventorySummary,
  MachineUsage,
  MonthlyTraffic,
  SystemHealth,
  CategoryDistribution,
  StockAlerts,
  RecentQueries,
  SystemNotifications,
  ObsoleteStats,
  OperationalMetrics,
} from './widgets';
import type {
  WidgetConfig,
  WidgetDataType,
  StoredWidgetPlacement,
} from './interfaces';

export const allWidgets: Record<string, WidgetConfig> = {
  // 1. KPI RESUMEN (Ancho completo)
  inventorySummary: {
    title: 'Resumen Global de Inventario',
    provider: InventorySummary,
    definition: {
      defaultColumnSpan: 4,
      defaultRowSpan: 2,
      minRowSpan: 2,
      minColumnSpan: 2,
    },
  },
  // 2. GRÁFICA MÁQUINAS (MUY GRANDE - 5 FILAS)
  machineUsage: {
    title: 'Consumo por Máquina',
    provider: MachineUsage,
    definition: {
      defaultColumnSpan: 2,
      defaultRowSpan: 5,
      minRowSpan: 4,
      minColumnSpan: 1,
    },
  },
  // 3. TRÁFICO (GRANDE - 4 FILAS)
  monthlyTraffic: {
    title: 'Rendimiento de Consultas',
    provider: MonthlyTraffic,
    definition: {
      defaultColumnSpan: 2,
      defaultRowSpan: 4,
      minRowSpan: 3,
      minColumnSpan: 1,
    },
  },
  // 4. ALERTAS DE STOCK (GRANDE - 4 FILAS)
  stockAlerts: {
    title: '⚠️ Alertas de Stock Bajo',
    provider: StockAlerts,
    definition: {
      defaultColumnSpan: 2,
      defaultRowSpan: 4,
      minRowSpan: 3,
      minColumnSpan: 1,
    },
  },
  // 5. SALUD (ALTO)
  systemHealth: {
    title: 'Estado de Servidores',
    provider: SystemHealth,
    definition: {
      defaultColumnSpan: 1,
      defaultRowSpan: 4,
      minRowSpan: 2,
      minColumnSpan: 1,
    },
  },
  // 6. CATEGORÍAS (MEDIANO)
  categoryDistribution: {
    title: 'Categorías',
    provider: CategoryDistribution,
    definition: {
      defaultColumnSpan: 1,
      defaultRowSpan: 4,
      minRowSpan: 3,
      minColumnSpan: 1,
    },
  },
  // 7. CONSULTAS (MEDIANO)
  recentQueries: {
    title: 'Últimos Movimientos',
    provider: RecentQueries,
    definition: {
      defaultColumnSpan: 2,
      defaultRowSpan: 3,
      minRowSpan: 2,
      minColumnSpan: 1,
    },
  },
  // 8. RESTO
  systemNotifications: {
    title: 'Avisos',
    provider: SystemNotifications,
    definition: {
      defaultColumnSpan: 1,
      defaultRowSpan: 2,
      minRowSpan: 2,
      minColumnSpan: 1,
    },
  },
  obsoleteStats: {
    title: 'Obsolescencia',
    provider: ObsoleteStats,
    definition: {
      defaultColumnSpan: 1,
      defaultRowSpan: 2,
      minRowSpan: 2,
      minColumnSpan: 1,
    },
  },
  operationalMetrics: {
    title: 'Uptime',
    provider: OperationalMetrics,
    definition: { defaultRowSpan: 2, minRowSpan: 2, minColumnSpan: 1 },
  },
};

// --- LAYOUT ---
const defaultLayout: ReadonlyArray<StoredWidgetPlacement> = [
  { id: 'inventorySummary', columnSpan: 4, rowSpan: 2 },
  { id: 'machineUsage', columnSpan: 2, rowSpan: 5 }, // Izquierda Gigante
  { id: 'stockAlerts', columnSpan: 2, rowSpan: 4 }, // Derecha Grande
  { id: 'systemHealth', columnSpan: 1, rowSpan: 4 }, // Centro Alto
  { id: 'monthlyTraffic', columnSpan: 2, rowSpan: 4 },
  { id: 'categoryDistribution', columnSpan: 1, rowSpan: 4 },
  { id: 'recentQueries', columnSpan: 2, rowSpan: 3 },
  { id: 'systemNotifications', columnSpan: 1, rowSpan: 2 },
  { id: 'obsoleteStats', columnSpan: 1, rowSpan: 2 },
];

function merge<T extends { id: string }>(
  src: ReadonlyArray<T>,
  overrides: ReadonlyArray<Partial<T> & { id: string }>,
): ReadonlyArray<T> {
  return src.map((item) => {
    const match = overrides.find((override) => override.id === item.id);
    return match ? { ...item, ...match } : item;
  });
}

export function getDefaultLayout(width: number) {
  if (width >= 2160) {
    return merge(defaultLayout, [
      { id: 'inventorySummary', columnOffset: { '6': 0 } },
    ]);
  }
  if (width > 1200) return defaultLayout;
  if (width > 992) {
    return merge(defaultLayout, [
      { id: 'inventorySummary', columnSpan: 4 },
      { id: 'machineUsage', columnSpan: 2 },
    ]);
  }
  return merge(defaultLayout, [
    { id: 'inventorySummary', columnSpan: 1, rowSpan: 4 },
  ]);
}

export function getBoardWidgets(
  layout: ReadonlyArray<StoredWidgetPlacement>,
): BoardProps.Item<WidgetDataType>[] {
  return layout
    .map((position) => {
      const widget = allWidgets[position.id];
      if (!widget) return null as any;

      return {
        ...position,
        data: {
          title: widget.title || '',
          provider: widget.provider,
          disableContentPaddings: false,
        },
        columnSpan:
          position.columnSpan ?? widget.definition?.defaultColumnSpan ?? 1,
        rowSpan: position.rowSpan ?? widget.definition?.defaultRowSpan ?? 2,
        minColumnSpan: 1,
        minRowSpan: 1,
      };
    })
    .filter(Boolean);
}
