import * as React from 'react';
// Importamos componentes visuales
import {
  Link,
  StatusIndicator,
  Badge,
  Box,
} from '@cloudscape-design/components';
import type { TableProps } from '@cloudscape-design/components';

// 1. DEFINICIÓN DE TIPO (Exportamos la interfaz)
export interface UserItem {
  id: number;
  email: string;
  role: string;
  area: string | null;
  name: string;
  surname: string;
  country: string;
  birth_date: string;

  // Estados lógicos
  is_account_verified: boolean; // ¿Confirmó su correo?
  is_active: boolean; // ¿El admin lo activó/aprobó?

  auth_token?: string;
  created_at: string;
}

// 2. COLUMNAS DE LA TABLA (Solo las más importantes)
export const COLUMN_DEFINITIONS: TableProps.ColumnDefinition<UserItem>[] = [
  {
    id: 'fullname',
    header: 'Usuario',
    cell: (item) => (
      <div>
        <Link href={`#${item.id}`} variant="primary" fontSize="body-m">
          {item.name} {item.surname}
        </Link>
        <Box variant="p" color="text-body-secondary" fontSize="body-s">
          {item.email}
        </Box>
      </div>
    ),
    sortingField: 'name',
    isRowHeader: true,
  },
  {
    id: 'role_area',
    header: 'Rol y Área',
    cell: (item) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Badge color="blue">{item.role}</Badge>
        <span style={{ fontSize: '12px', color: '#687078' }}>
          {item.area || 'N/A'}
        </span>
      </div>
    ),
    sortingField: 'role',
  },
  {
    id: 'verification',
    header: 'Verificación de Correo',
    cell: (item) => {
      // Lógica visual para los 3 estados que pediste
      if (item.is_account_verified) {
        return <StatusIndicator type="success">Verificado</StatusIndicator>; // Verde con Palomita
      } else {
        return <StatusIndicator type="pending">Pendiente</StatusIndicator>; // Gris/Azul de espera
      }
    },
    sortingField: 'is_account_verified',
  },
  {
    id: 'status',
    header: 'Acceso al Sistema',
    cell: (item) => (
      <StatusIndicator type={item.is_active ? 'success' : 'stopped'}>
        {item.is_active ? 'Habilitado' : 'Deshabilitado'}
      </StatusIndicator>
    ),
    sortingField: 'is_active',
  },
  {
    id: 'created',
    header: 'Registro',
    cell: (item) => item.created_at,
    sortingField: 'created_at',
  },
];

// 3. DATOS DE PRUEBA (MOCK DATA)
export const MOCK_USERS: UserItem[] = [
  {
    id: 1,
    name: 'Carlos',
    surname: 'Ruiz',
    email: 'admin@omnipart.com',
    role: 'Administrador',
    area: 'Sistemas',
    country: 'México',
    birth_date: '1990-05-15',
    is_account_verified: true, // Verificado
    is_active: true, // Habilitado
    created_at: '2024-01-01',
  },
  {
    id: 2,
    name: 'Ana',
    surname: 'López',
    email: 'ana.ventas@omnipart.com',
    role: 'Ventas',
    area: 'Ventas Norte',
    country: 'México',
    birth_date: '1995-08-20',
    is_account_verified: true,
    is_active: true,
    created_at: '2024-01-10',
  },
  {
    id: 3,
    name: 'Roberto',
    surname: 'Gómez',
    email: 'beto.almacen@omnipart.com',
    role: 'Almacén',
    area: 'Bodega Central',
    country: 'Colombia',
    birth_date: '1988-12-10',
    is_account_verified: false, // Pendiente (No ha validado mail)
    is_active: false, // Deshabilitado (No entra al sistema)
    created_at: '2024-02-05',
  },
  {
    id: 4,
    name: 'Lucía',
    surname: 'Méndez',
    email: 'lucia.hr@omnipart.com',
    role: 'Recursos Humanos',
    area: 'Corporativo',
    country: 'España',
    birth_date: '1992-03-30',
    is_account_verified: true, // Validó mail...
    is_active: false, // ...pero el Admin la deshabilitó manualmente
    created_at: '2024-01-20',
  },
  {
    id: 5,
    name: 'Miguel',
    surname: 'Torres',
    email: 'miguel.tec@omnipart.com',
    role: 'Técnico',
    area: 'Mantenimiento',
    country: 'México',
    birth_date: '1998-07-15',
    is_account_verified: false,
    is_active: false, // Nuevo registro, todo pendiente
    created_at: '2024-02-20',
  },
];
