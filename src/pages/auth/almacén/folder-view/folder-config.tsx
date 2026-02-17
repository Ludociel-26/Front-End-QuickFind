import * as React from 'react';
import { Badge, Icon, StatusIndicator } from '@cloudscape-design/components';
import type { TableProps } from '@cloudscape-design/components';

// --- 1. INTERFAZ DE DATOS ---
export interface FolderItem {
  id: string;
  name: string;
  type: 'folder' | 'item';
  tags?: { label: string; color: 'blue' | 'red' | 'green' | 'grey' }[];
  details?: {
    description?: string;
    location?: string;
    manager?: string;
    image?: string;
    supplier?: string;
    sku?: string;
    stock?: number;
    min_stock?: number;
  };
  children?: FolderItem[];
}

// --- 2. DISEÑO DE LA CELDA DE NOMBRE (Icono pegado) ---
const NameCell = (item: FolderItem) => (
  <div style={{ display: 'flex', alignItems: 'center', minHeight: '24px' }}>
    {/* Icono: Azul si es carpeta, Gris si es archivo */}
    <span
      style={{
        marginRight: '8px',
        display: 'flex',
        alignItems: 'center',
        color: item.type === 'folder' ? '#0972d3' : '#545b64',
      }}
    >
      <Icon
        name={item.type === 'folder' ? 'folder' : 'file'}
        variant={item.type === 'folder' ? 'normal' : 'subtle'}
        size="medium"
      />
    </span>

    {/* Título */}
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span
        style={{
          fontWeight: item.type === 'folder' ? 700 : 400,
          fontSize: '14px',
          color: 'var(--color-text-body-default)',
        }}
      >
        {item.name}
      </span>
      {/* Subtítulo pequeño si es item */}
      {item.type === 'item' && item.details?.sku && (
        <span style={{ fontSize: '12px', color: 'gray' }}>
          {item.details.sku}
        </span>
      )}
    </div>
  </div>
);

// --- 3. DEFINICIÓN DE COLUMNAS ---
export const COLUMN_DEFINITIONS: TableProps.ColumnDefinition<FolderItem>[] = [
  {
    id: 'name',
    header: 'Nombre',
    cell: (item) => NameCell(item),
    width: 450,
    minWidth: 300,
  },
  {
    id: 'tags',
    header: 'Etiquetas',
    cell: (item) => (
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {item.tags?.map((tag, i) => (
          <Badge key={i} color={tag.color}>
            {tag.label}
          </Badge>
        ))}
      </div>
    ),
    width: 200,
  },
  {
    id: 'status',
    header: 'Estado',
    cell: (item) => {
      if (item.type === 'folder') return null;
      const stock = item.details?.stock || 0;
      const min = item.details?.min_stock || 0;
      return (
        <StatusIndicator type={stock > min ? 'success' : 'error'}>
          {stock} Unidades
        </StatusIndicator>
      );
    },
    width: 150,
  },
];

// --- 4. DATOS MOCK ---
export const MOCK_FOLDERS: FolderItem[] = [
  {
    id: 'plant-1',
    name: 'Planta Monterrey',
    type: 'folder',
    tags: [{ label: 'Principal', color: 'blue' }],
    details: {
      description: 'Planta de manufactura.',
      location: 'MTY',
      manager: 'Gerente Ops',
    },
    children: [
      {
        id: 'area-manto',
        name: 'Área de Mantenimiento',
        type: 'folder',
        tags: [{ label: 'Taller', color: 'grey' }],
        details: {
          description: 'Taller central.',
          location: 'Nave 2',
          manager: 'Jefe Taller',
        },
        children: [
          {
            id: 'rack-elec',
            name: 'Estantería Eléctrica',
            type: 'folder',
            details: {
              description: 'Componentes eléctricos.',
              location: 'Pasillo 4',
              manager: 'Jefe Taller',
            },
            children: [
              {
                id: 'item-motor',
                name: 'Servo Motor 5kW',
                type: 'item',
                tags: [
                  { label: 'Siemens', color: 'blue' },
                  { label: 'Crítico', color: 'red' },
                ],
                details: {
                  image: 'https://via.placeholder.com/300x200?text=Motor',
                  supplier: 'Siemens',
                  sku: 'SIE-SRV-5000',
                  stock: 2,
                  min_stock: 4,
                  location: 'E-04-A',
                  description: 'Motor principal línea 1.',
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'root-2',
    name: 'Oficinas CDMX',
    type: 'folder',
    details: {
      description: 'Corporativo.',
      location: 'CDMX',
      manager: 'Admin',
    },
    children: [
      {
        id: 'it-closet',
        name: 'Site de Comunicaciones',
        type: 'folder',
        children: [
          {
            id: 'item-switch',
            name: 'Switch 24 Puertos',
            type: 'item',
            tags: [{ label: 'Cisco', color: 'blue' }],
            details: {
              image: 'https://via.placeholder.com/300x200?text=Switch',
              supplier: 'Cisco',
              sku: 'CIS-2960',
              stock: 5,
              min_stock: 2,
              location: 'Site',
              description: 'Switch de borde.',
            },
          },
        ],
      },
    ],
  },
];
