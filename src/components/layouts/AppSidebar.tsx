import { SideNavigation } from '@cloudscape-design/components';
import { useLocation, useNavigate } from 'react-router-dom';
import { navItems } from './items'; // Tu archivo de items optimizado
import './styles/sidebar.css';

export default function GlobalSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="global-sidebar-container">
      <SideNavigation
        // DETECCIÓN AUTOMÁTICA DE RUTA
        activeHref={location.pathname}
        header={{
          href: '/services',
          text: 'Servicios',
        }}
        items={navItems}
        // NAVEGACIÓN SPA SIN RECARGA (Crucial para velocidad)
        onFollow={(event) => {
          if (!event.detail.external) {
            event.preventDefault();
            navigate(event.detail.href);
          }
        }}
      />
    </div>
  );
}
