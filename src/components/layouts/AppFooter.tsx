// FIX: Eliminamos la importación de React, Box y SpaceBetween porque no se utilizaban
import { Icon } from '@cloudscape-design/components';

export const Footer = () => {
  return (
    <footer
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        backgroundColor: '#232f3e', // Color exacto del footer de AWS
        color: '#ffffff',
        padding: '0 20px',
        height: '35px', // Altura delgada como la consola
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '12px',
        zIndex: 9000, // Encima de todo
        borderTop: '1px solid #3d4a5c', // Borde sutil superior
      }}
    >
      {/* SECCIÓN IZQUIERDA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* CloudShell */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
          }}
        >
          {/* FIX: as any para silenciar el validador de iconos */}
          <Icon name={'angle-right' as any} variant="inverted" />
          <span className="footer-link">CloudShell</span>
        </div>

        {/* Comentarios */}
        <div style={{ cursor: 'pointer' }} className="footer-link">
          Comentarios
        </div>

        {/* Aplicación Móvil */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: 'pointer',
          }}
        >
          {/* FIX: as any para silenciar el validador de iconos */}
          <Icon name={'mobile' as any} variant="inverted" />
          <span className="footer-link">Aplicación móvil</span>
        </div>
      </div>

      {/* SECCIÓN DERECHA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span style={{ color: '#9ba2b0' }}>
          © 2026, QuickFind, Inc. o sus filiales.
        </span>
        <span className="footer-link" style={{ cursor: 'pointer' }}>
          Privacidad
        </span>
        <span className="footer-link" style={{ cursor: 'pointer' }}>
          Términos
        </span>
        <span className="footer-link" style={{ cursor: 'pointer' }}>
          Preferencias de cookies
        </span>
      </div>

      {/* Estilos hover simples para los textos */}
      <style>{`
        .footer-link:hover {
          text-decoration: underline;
          color: #fff;
        }
        .footer-link {
          color: #d1d5db;
        }
      `}</style>
    </footer>
  );
};
