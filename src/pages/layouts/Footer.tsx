import * as React from 'react';
// CORRECCIÓN: Importamos Box, Link y SpaceBetween desde el paquete principal
import { Box, Link, SpaceBetween } from '@cloudscape-design/components';

// Icono SVG simple de AWS (Smile) para el footer
const AwsLogo = () => (
  <svg
    width="32"
    height="20"
    viewBox="0 0 58 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ verticalAlign: 'middle', marginLeft: '8px' }}
  >
    <path
      d="M44.4062 14.5422C41.7422 14.5422 39.5262 15.3533 37.7877 16.9831C37.893 15.1764 39.3857 13.8013 41.5667 13.8013C42.7247 13.8013 43.6692 14.0471 44.582 14.4716L45.4592 12.6373C44.3885 12.0747 43.0757 11.7227 41.4965 11.7227C37.7525 11.7227 35.3312 14.1182 35.3312 18.0498V25.2151H37.893V24.0551C39.421 25.3213 41.4262 26.024 43.529 26.024C48.0557 26.024 50.8982 22.9316 50.8982 18.5778H50.8632C50.8632 15.9129 48.3715 14.5422 44.4062 14.5422ZM44.2657 24.1609C41.8122 24.1609 39.421 22.8258 37.893 21.0693V18.7893C37.893 17.5227 38.8055 16.5724 40.584 16.5724C43.1457 16.5724 48.3365 17.1702 48.3365 20.0898C48.3365 22.5093 46.5467 24.1609 44.2657 24.1609Z"
      fill="#FF9900"
    />
    <path
      d="M17.0279 25.2151H19.7299L22.6776 12.0036H19.9756L18.3964 20.3067H18.3261L15.9399 12.0036H13.5186L11.1324 20.3067H11.0621L9.44791 12.0036H6.74585L9.72866 25.2151H12.3956L14.7116 16.5369H14.7819L17.0279 25.2151Z"
      fill="white"
    />
    <path
      d="M33.4866 12.0036L30.1529 23.3671H30.0826L27.0296 12.0036H24.2222L28.6791 25.2151H31.5216L36.2589 12.0036H33.4866Z"
      fill="white"
    />
    <path
      d="M51.9161 27.6773C50.3371 28.8027 46.5819 30.6311 39.8791 30.6311C32.0534 30.6311 28.2984 29.1893 25.9121 27.888L24.8944 29.8213C27.9124 31.4382 32.3341 33.0204 39.8791 33.0204C47.74 33.0204 51.9864 31.0533 53.7411 29.7173L51.9161 27.6773Z"
      fill="white"
    />
  </svg>
);

const FooterSeparator = () => (
  <span style={{ color: '#545b64', margin: '0 0.5rem' }}>|</span>
);

export const Footer = () => {
  return (
    <Box
      padding={{ vertical: 'm', horizontal: 'l' }}
      // Estilo en línea para forzar el fondo oscuro exacto de la captura
      style={{
        backgroundColor: '#232f3e',
        color: '#ffffff',
        fontSize: '12px',
        marginTop: 'auto',
        width: '100%',
        boxSizing: 'border-box', // Asegura que el padding no desborde el ancho
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        {/* Sección Izquierda: Enlaces */}
        <Box display="flex">
          <SpaceBetween direction="horizontal" size="xs">
            <Box display="inline-block">
              <Link variant="secondary" href="#" color="inverted">
                About
              </Link>
              <FooterSeparator />
              <Link variant="secondary" href="#" color="inverted">
                Connect
              </Link>
              <FooterSeparator />
              <Link variant="secondary" href="#" color="inverted">
                Privacy
              </Link>
              <span style={{ marginLeft: '4px', fontSize: '10px' }}>↗</span>
              <FooterSeparator />
              <Link variant="secondary" href="#" color="inverted">
                Site terms
              </Link>
              <span style={{ marginLeft: '4px', fontSize: '10px' }}>↗</span>
              <FooterSeparator />
              <Link variant="secondary" href="#" color="inverted">
                Cookie preferences
              </Link>
              <FooterSeparator />
              <span style={{ color: '#879596' }}>
                © 2026, Amazon Web Services, Inc. or its affiliates. All rights
                reserved.
              </span>
            </Box>
          </SpaceBetween>
        </Box>

        {/* Sección Derecha: Logo y "Made with love" */}
        <Box display="flex" color="text-body-secondary">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#ffffff', marginRight: '5px' }}>
              Made with love at
            </span>
            <AwsLogo />
          </div>
        </Box>
      </div>
    </Box>
  );
};
