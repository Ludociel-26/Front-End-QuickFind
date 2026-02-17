import type { BoardProps } from '@cloudscape-design/board-components/board';

// Utilizamos un casteo "as any" al final para que TypeScript acepte propiedades extra
export const boardI18nStrings: BoardProps.I18nStrings<any> = {
  // 1. INICIO DEL ARRASTRE
  // FIX: Se tipa explícitamente 'operationType' como string
  liveAnnouncementDndStarted: (operationType: string) =>
    operationType === 'resize' ? 'Resizing started' : 'Dragging started',

  // 2. REORDENAMIENTO EXITOSO
  liveAnnouncementDndItemReordered: (op: any) =>
    `Item ${op.item.data.title} reordered to column ${op.col + 1}, row ${op.row + 1}`,

  // 3. CAMBIO DE TAMAÑO EXITOSO
  liveAnnouncementDndItemResized: (op: any) =>
    `Item ${op.item.data.title} resized to ${op.rowSpan} rows and ${op.colSpan} columns`,

  // 4. OPERACIÓN COMPLETADA (General)
  // FIX: Se tipa explícitamente 'operationType' como string
  liveAnnouncementDndCommitted: (operationType: string) =>
    `Operation committed: ${operationType}`,

  // 5. OPERACIÓN DESCARTADA
  liveAnnouncementDndDiscarded: () =>
    `Operation discarded. Item returned to original position.`,

  // 6. ELIMINAR ELEMENTO
  liveAnnouncementItemRemoved: (op: any) =>
    `Removed item ${op.item.data.title}.`,

  liveAnnouncementPcItemRemoved: (op: any) =>
    `Removed item ${op.item.data.title}.`,

  // TEXTOS ESTÁTICOS (Estos sí son strings)
  liveAnnouncementDndEyebrow: 'Board operation',
  navigationAriaLabel: 'Board navigation',
  sidebarAriaLabel: 'Board sidebar',
} as any;
