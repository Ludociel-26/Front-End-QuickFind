import * as React from 'react';
import { Button, BreadcrumbGroup } from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';

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

      <style>{`
        /* BARRA FIJA (Restaurado a tu fondo sólido original) */
        .aws-breadcrumb-nav {
          height: 44px;
          background-color: var(--color-background-layout-panel-default, #ffffff);
          border-bottom: 1px solid var(--color-border-divider-default, #eaeded);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
          box-sizing: border-box;
          width: 100%;
        }

        .nav-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .nav-right {
          display: flex;
          align-items: center;
        }

        /* WRAPPER DEL BOTÓN */
        .nav-btn-wrapper {
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.1s ease-in-out;
        }

        .nav-btn-wrapper button {
          margin: 0 !important;
        }

        .nav-btn-wrapper:not(.active):hover {
          background-color: var(--color-background-button-normal-hover, #e9ebed);
        }

        /* ESTADO ACTIVO (Restaurado a tu azul original) */
        .nav-btn-wrapper.active {
          background-color: #0972d3;
        }

        /* ICONO BLANCO FORZADO (Usando selector seguro) */
        .nav-btn-wrapper.active [class*="awsui_icon_"] {
          color: white !important;
          fill: white !important;
        }

        .breadcrumb-wrapper {
          display: flex;
          align-items: center;
          margin-top: 2px;
        }
      `}</style>
    </div>
  );
}
