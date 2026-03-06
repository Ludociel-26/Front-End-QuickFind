import { Button, BreadcrumbGroup } from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';

// Importamos el archivo CSS externo
import './styles/breadcrumbNav.css';

interface BreadcrumbNavBarProps {
  breadcrumbs: { text: string; href: string }[];
  onMenuClick: () => void;
  onInfoClick: () => void;
  isMenuOpen: boolean;
  isInfoOpen: boolean;
}

export default function BreadcrumbNavBar({
  breadcrumbs,
  onMenuClick,
  onInfoClick,
  isMenuOpen,
  isInfoOpen,
}: BreadcrumbNavBarProps) {
  const navigate = useNavigate();

  return (
    <div className="aws-breadcrumb-nav">
      {/* LADO IZQUIERDO */}
      <div className="nav-left">
        <div className={`nav-btn-wrapper ${isMenuOpen ? 'active' : ''}`}>
          <Button
            variant="icon"
            iconName="menu"
            ariaLabel="Menu"
            onClick={onMenuClick}
          />
        </div>

        <div className="breadcrumb-wrapper">
          <BreadcrumbGroup
            items={breadcrumbs}
            expandAriaLabel="Ruta completa"
            ariaLabel="Navegación"
            onFollow={(e) => {
              if (!e.detail.external) {
                e.preventDefault();
                navigate(e.detail.href);
              }
            }}
          />
        </div>
      </div>

      {/* LADO DERECHO */}
      <div className="nav-right">
        <div className={`nav-btn-wrapper ${isInfoOpen ? 'active' : ''}`}>
          <Button
            variant="icon"
            iconName="status-info"
            ariaLabel="Info"
            onClick={onInfoClick}
          />
        </div>
      </div>
    </div>
  );
}
