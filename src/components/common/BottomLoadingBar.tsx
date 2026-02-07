import * as React from 'react';
// Asegúrate de tener instalado: @cloudscape-design/chat-components
import LoadingBar from '@cloudscape-design/chat-components/loading-bar';
import LiveRegion from '@cloudscape-design/components/live-region';
import Box from '@cloudscape-design/components/box';

interface BottomLoadingBarProps {
  text?: string;
  visible: boolean;
}

export const BottomLoadingBar = ({
  text = 'Cargando vista...',
  visible,
}: BottomLoadingBarProps) => {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 9999, // Por encima de todo
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fondo sutil para que se lea
        borderTop: '1px solid #e1e4ea',
        padding: '10px 20px',
      }}
    >
      <LiveRegion>
        <Box margin={{ bottom: 'xs' }} color="text-body-secondary">
          {text}
        </Box>
        <LoadingBar variant="gen-ai" />
      </LiveRegion>
    </div>
  );
};
