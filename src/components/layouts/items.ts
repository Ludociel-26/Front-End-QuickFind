import type { SideNavigationProps } from '@cloudscape-design/components/side-navigation';

export const navItems: SideNavigationProps.Item[] = [
  {
    type: 'link',
    text: 'Dashboard',
    href: '/dashboard',
  },
  { type: 'divider' },

  // ==========================================
  // SECCIÓN 1: ALMACÉN E INVENTARIO
  // ==========================================
  {
    type: 'section',
    text: 'Almacén',
    items: [
      {
        type: 'link',
        text: 'Visión General',
        href: '/almacen', // <- Aquí va tu nueva pantalla de Landing/Overview
      },
      {
        type: 'expandable-link-group',
        text: 'Inventario General',
        href: '/inventory',
        items: [
          {
            type: 'link',
            text: 'Visual Comparator',
            href: '/almacen/visual-comparator',
          },
          {
            type: 'link',
            text: 'Recepción Rápida',
            href: '/almacen/entradas/recepcion',
          },
          {
            type: 'link',
            text: 'Control de Calidad',
            href: '/almacen/entradas/calidad',
          },
          {
            type: 'link',
            text: 'Devoluciones',
            href: '/almacen/entradas/devoluciones',
          },
        ],
      },
      {
        type: 'expandable-link-group',
        text: 'Proveedores',
        href: '/almacen/salidas',
        items: [
          {
            type: 'link',
            text: 'Pedidos / Solicitudes',
            href: '/almacen/salidas/pedidos',
          },
          {
            type: 'link',
            text: 'Lista de Picking',
            href: '/almacen/salidas/picking',
          },
          {
            type: 'link',
            text: 'Mesa de Empaque',
            href: '/almacen/salidas/empaque',
          },
          {
            type: 'link',
            text: 'Guías de Envío',
            href: '/almacen/salidas/envios',
          },
        ],
      },
      {
        type: 'expandable-link-group',
        text: 'Control de Inventario',
        href: '/almacen/inventario',
        items: [
          {
            type: 'link',
            text: 'Consulta de Stock',
            href: '/almacen/inventario/stock',
          },
          {
            type: 'link',
            text: 'Ajustes',
            href: '/almacen/inventario/ajustes',
          },
          {
            type: 'link',
            text: 'Conteo Cíclico',
            href: '/almacen/inventario/conteo',
          },
          { type: 'link', text: 'Kárdex', href: '/almacen/inventario/kardex' },
          {
            type: 'link',
            text: 'Transferencias',
            href: '/almacen/inventario/transferencias',
          },
        ],
      },
      {
        type: 'expandable-link-group',
        text: 'Catálogos Maestros',
        href: '/almacen/catalogos',
        items: [
          {
            type: 'link',
            text: 'Productos (SKU)',
            href: '/almacen/catalogos/productos',
          },
          {
            type: 'link',
            text: 'Proveedores',
            href: '/almacen/catalogos/proveedores',
          },
          {
            type: 'link',
            text: 'Ubicaciones',
            href: '/almacen/catalogos/ubicaciones',
          },
          {
            type: 'link',
            text: 'Categorías',
            href: '/almacen/catalogos/categorias',
          },
        ],
      },
    ],
  },
  { type: 'divider' },

  // ==========================================
  // SECCIÓN 2: MANTENIMIENTO
  // ==========================================
  {
    type: 'section',
    text: 'Mantenimiento',
    items: [
      {
        type: 'link',
        text: 'Visión General',
        href: '/maintenance', // <- Landing page de Mantenimiento
      },
      {
        type: 'link',
        text: 'Checklists Pre-Operativos',
        href: '/maintenance/checklists-pre-operativos',
      },
      {
        type: 'link',
        text: 'Nueva Inspección',
        href: '/maintenance/perform-inspection',
      },
      {
        type: 'link',
        text: 'Telemetría e Históricos',
        href: '/mantenimiento/equipos',
      },
      {
        type: 'link',
        text: 'Captura de Telemetría',
        href: '/maintenance/telemetry-entry',
      },
      {
        type: 'link',
        text: 'Bitácora de Vapor Logs',
        href: '/maintenance/vapor-logs-table',
      },
      {
        type: 'link',
        text: 'Bitácora Central de Vapor',
        href: '/maintenance/bitacora-central-vapor',
      },
      {
        type: 'link',
        text: 'Bitácora de Aire Logs',
        href: '/maintenance/air-logs-table',
      },
      {
        type: 'link',
        text: 'Bitácora Compresor de Aire',
        href: '/maintenance/air-compressor-entry',
      },
      {
        type: 'link',
        text: 'Bitácora de Químicos Logs',
        href: '/maintenance/chemical-analysis-logs-table',
      },
      {
        type: 'link',
        text: 'Bitácora Análisis Químicos',
        href: '/maintenance/chemical-analysis-entry',
      },
      {
        type: 'link',
        text: 'Informes Diarios de Maquinaria Congelados',
        href: '/maintenance/daily-reports-frozen-machinery',
      },
      {
        type: 'link',
        text: 'Reporte Diario: Maquinaria Refrigerados',
        href: '/maintenance/daily-reports-refrigerated-machinery',
      },
      {
        type: 'link',
        text: 'Cuarto Frio5',
        href: '/maintenance/cuarto-frio5-telemetry-entry',
      },
      {
        type: 'link',
        text: 'Activos (Maquinaria)',
        href: '/mantenimiento/ordenes',
      },
      {
        type: 'link',
        text: 'Rutinas y Bitácoras (Operación Diaria)',
        href: '/mantenimiento/preventivo',
      },
      {
        type: 'link',
        text: 'Reportes Oficiales',
        href: '/mantenimiento/solicitudes',
      },
      {
        type: 'link',
        text: 'Plan de Limpieza',
        href: '/cleaning-plan-page',
        external: true,
      },
    ],
  },
  { type: 'divider' },

  // ==========================================
  // SECCIÓN 3: ADMINISTRACIÓN DEL SISTEMA & USER
  // ==========================================
  {
    type: 'section',
    text: 'Administración',
    items: [
      {
        type: 'link',
        text: 'Centro de Administración',
        href: '/administration', // <- Landing page del Administrador
      },
      {
        type: 'link',
        text: 'Cuenta',
        href: '/admin', // <- Landing page del Administrador
      },
      {
        type: 'expandable-link-group',
        text: 'Usuarios',
        href: '/admin/user',
        items: [
          {
            type: 'link',
            text: 'Areas',
            href: '/admin/area',
          },
          {
            type: 'link',
            text: 'Roles',
            href: '/admin/role',
          },
          {
            type: 'link',
            text: 'Ubicaciones',
            href: '/almacen/catalogos/ubicaciones',
          },
          {
            type: 'link',
            text: 'Categorías',
            href: '/almacen/catalogos/categorias',
          },
        ],
      },
      {
        type: 'link',
        text: 'Auditoría y Logs',
        href: '/admin/auditoria',
      },
      { type: 'divider' },
      {
        type: 'link',
        text: 'Configuración',
        href: '/admin/configuracion',
      },
    ],
  },
];
