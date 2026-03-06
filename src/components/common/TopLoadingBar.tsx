// Asegúrate de tener instalado: npm install @cloudscape-design/chat-components
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
        height: '3px', // <-- ELIMINADO: Ya no necesitamos definir la altura aquí
        pointerEvents: 'none', // Permite hacer click a lo que esté debajo mientras carga
        overflow: 'hidden', // Asegura que nada se salga del contenedor principal
      }}
    >
      {/* HACK DE CSS PARA ENGROSAR LA BARRA:
        Envolvemos el LoadingBar en un div y usamos 'transform: scaleY(n)' 
        para estirarlo verticalmente. 
        - scaleY(3) lo hace 3 veces más grueso de lo normal. 
        - Ajusta el '3' a '2' o '4' según qué tan grueso lo quieras.
      */}
      <div
        style={{
          transform: 'scaleY(4)', // <-- AJUSTA ESTE VALOR para el grosor (ej. 2, 3, 4)
          transformOrigin: 'top center', // Se estira desde arriba hacia abajo
          width: '100%',
        }}
      >
        {/* variant="gen-ai": Colores modernos (tipo Amazon Q). */}
        {/* FIX: as any para que acepte la variante sin marcar error de tipos */}
        <LoadingBar variant={'gen-ai' as any} />
      </div>
    </div>
  );
};
