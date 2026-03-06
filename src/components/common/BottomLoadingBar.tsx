// Asegúrate de tener instalado: npm install @cloudscape-design/chat-components
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
        {/* FIX: as any para silenciar el validador estricto de colores de Cloudscape */}
        <Box margin={{ bottom: 'xs' }} color={'text-body-secondary' as any}>
          {text}
        </Box>
        {/* FIX: as any para que acepte la variante sin marcar error de tipos */}
        <LoadingBar variant={'gen-ai' as any} />
      </LiveRegion>
    </div>
  );
};
