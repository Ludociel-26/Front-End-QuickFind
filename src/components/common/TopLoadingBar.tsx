import * as React from 'react';
import LoadingBar from '@cloudscape-design/chat-components/loading-bar';

interface TopLoadingBarProps {
  visible: boolean;
}

export const TopLoadingBar = ({ visible }: TopLoadingBarProps) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, // Pegado al techo de la web
        left: 0,
        width: '100%', // Ancho completo
        zIndex: 10000, // Por encima del header y menús
        height: '6px', // Altura del contenedor para darle presencia
        pointerEvents: 'none', // Permite hacer click a lo que esté debajo mientras carga
      }}
    >
      {/* variant="gen-ai": Colores modernos (tipo Amazon Q).
         Si prefieres azul clásico de AWS, cambia a variant="indeterminate" (si el componente lo permite) 
         o usa CSS puro, pero el gen-ai es el más moderno.
      */}
      <LoadingBar variant="gen-ai" />
    </div>
  );
};
