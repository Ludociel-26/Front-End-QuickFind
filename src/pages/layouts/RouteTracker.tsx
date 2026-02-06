import * as React from "react";
import { BreadcrumbGroup, Button } from "@cloudscape-design/components";
import type { BreadcrumbGroupProps } from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom";

interface RouteTrackerProps {
  items?: BreadcrumbGroupProps.Item[];
}

export default function RouteTracker({ items }: RouteTrackerProps) {
  const navigate = useNavigate();

  const defaultItems: BreadcrumbGroupProps.Item[] = [
    { text: "OmniPart", href: "/dashboard" },
    { text: "Servicios", href: "#" }
  ];

  const breadcrumbItems = items || defaultItems;

  return (
    <div style={{
      /* ESTILOS DE ANCLAJE (STICKY) */
      position: "sticky",
      top: 0,
      zIndex: 1000,
      
      /* CORRECCIÓN MODO OSCURO */
      backgroundColor: "var(--color-background-layout-main)", 
      borderBottom: "1px solid var(--color-border-divider-default)", 
      
      /* ESTILOS VISUALES */
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 20px",
      marginTop: "-10px", 
      marginLeft: "-20px",
      marginRight: "-20px"
    }}>
      {/* LADO IZQUIERDO */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ 
          fontWeight: 800, 
          fontSize: "16px", 
          color: "var(--color-text-heading-default)", 
          borderRight: "1px solid var(--color-border-divider-default)",
          paddingRight: "12px"
        }}>
          OmniPart
        </div>

        <BreadcrumbGroup
          items={breadcrumbItems}
          ariaLabel="Ruta de navegación"
          onFollow={(event) => {
            if (!event.detail.external) {
              event.preventDefault();
              navigate(event.detail.href);
            }
          }}
        />
      </div>

      {/* LADO DERECHO */}
      <div>
        <Button 
          variant="icon" 
          iconName="status-info" 
          ariaLabel="Información"
        />
      </div>
    </div>
  );
}