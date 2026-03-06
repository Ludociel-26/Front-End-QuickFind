import * as React from 'react';
import { useContext, useState, useEffect, useRef } from 'react';
import { AppContent } from '@/context/AppContext';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import {
  TopNavigation,
  Header,
  SpaceBetween,
  Grid,
  Cards,
  Box,
  Icon,
  Button,
  Flashbar,
  Table,
  Container,
} from '@cloudscape-design/components';

import { Space } from 'lucide-react';

// ==========================================
// IMPORTACIÓN DEL LOGO
// ==========================================
import logoQuickFind from '@/assets/icons/appiconf2.png';

// ==========================================
// DATA IMPORTADA
// ==========================================
import { m3Sec1Data, m3Sec2Data, SECTIONS } from './mondini3Data';

// ==========================================
// COMPONENTES UI PERSONALIZADOS (Pantalla Web)
// ==========================================
const SectionTitle = ({
  title,
  subtitle,
  isDark,
}: {
  title: string;
  subtitle?: string;
  isDark: boolean;
}) => (
  <div
    style={{
      marginBottom: '32px',
      borderBottom: `2px solid ${isDark ? '#414d5c' : '#eaeded'}`,
      paddingBottom: '16px',
    }}
  >
    <h2
      style={{
        fontSize: '38px',
        fontWeight: '900',
        color: isDark ? '#ffffff' : '#16191f',
        margin: '0 0 12px 0',
        letterSpacing: '-0.5px',
      }}
    >
      {title}
    </h2>
    {subtitle && (
      <p
        style={{
          fontSize: '18px',
          color: isDark ? '#aab7b8' : '#545b64',
          margin: 0,
          lineHeight: '1.5',
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

const CardCarousel = ({
  images,
  isDark,
}: {
  images: { src: string | null; label: string }[];
  isDark: boolean;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '200px',
        backgroundColor: isDark ? '#232f3e' : '#f8f8f8',
        overflow: 'hidden',
        borderBottom: `1px solid ${isDark ? '#414d5c' : '#eaeded'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {currentImage.src ? (
        <img
          key={currentIndex}
          src={currentImage.src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            animation: 'fadeIn 0.5s',
          }}
          alt={currentImage.label}
        />
      ) : (
        <SpaceBetween
          key={currentIndex}
          size="xs"
          direction="vertical"
          alignItems="center"
        >
          <Icon
            name={'camera' as any}
            size="large"
            variant={isDark ? 'subtle' : 'normal'}
          />
          <span
            style={{
              fontSize: '13px',
              color: isDark ? '#687078' : '#879596',
              animation: 'fadeIn 0.5s',
            }}
          >
            Añadir Foto ({currentImage.label})
          </span>
        </SpaceBetween>
      )}

      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          backgroundColor: 'rgba(0,0,0,0.65)',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: 'bold',
        }}
      >
        {currentImage.label}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          display: 'flex',
          gap: '4px',
          backgroundColor: isDark
            ? 'rgba(22, 25, 31, 0.8)'
            : 'rgba(255, 255, 255, 0.9)',
          padding: '4px 8px',
          borderRadius: '16px',
        }}
      >
        <button
          onClick={prevSlide}
          style={{
            background: 'transparent',
            border: 'none',
            color: isDark ? '#fff' : '#16191f',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
          }}
        >
          <Icon name={'angle-left' as any} size="small" variant="normal" />
        </button>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: isDark ? '#fff' : '#16191f',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {currentIndex + 1}/{images.length}
        </span>
        <button
          onClick={nextSlide}
          style={{
            background: 'transparent',
            border: 'none',
            color: isDark ? '#fff' : '#16191f',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '2px',
          }}
        >
          <Icon name={'angle-right' as any} size="small" variant="normal" />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// MOTOR PDF: PLANTILLA CON TAMAÑO EXACTO A4
// ==========================================
const A4_WIDTH = 1240;
const A4_HEIGHT = 1754;

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <div
    className="pdf-page"
    style={{
      width: `${A4_WIDTH}px`,
      height: `${A4_HEIGHT}px`,
      padding: '80px 70px', // Mayor padding general superior e inferior
      boxSizing: 'border-box',
      backgroundColor: '#ffffff',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

// ==========================================
// COMPONENTE: PLANTILLA OCULTA PARA PDF
// ==========================================
const PrintTemplate = ({
  dataSec1,
  dataSec2,
}: {
  dataSec1: any[];
  dataSec2: any[];
}) => {
  const allData = [...dataSec1, ...dataSec2];
  const currentDate = new Date()
    .toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .split('/')
    .reverse()
    .join('-');

  // Optimizando para mayor espaciado. Bajamos a 12 ítems en la Pág 1 para que el Header respire bien.
  const tablePage1 = allData.slice(0, 12);
  const tablePage2 = allData.slice(12);
  // Solo 3 fotos por página para que tengan más espacio vertical
  const photoChunks = chunkArray(allData, 3);

  // Función reutilizable para renderizar tablas estilo AWS Console (Súper espaciada)
  const renderAwsTable = (dataChunk: any[]) => (
    <div
      style={{
        borderRadius: '8px',
        border: '1px solid #eaeded',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '15px',
          color: '#16191f',
        }}
      >
        <thead
          style={{
            backgroundColor: '#fafafa',
            borderBottom: '2px solid #eaeded',
          }}
        >
          <tr>
            <th
              style={{
                textAlign: 'left',
                padding: '20px 24px',
                fontWeight: 'bold',
                color: '#545b64',
                width: '25%',
              }}
            >
              ID Físico
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '20px 24px',
                fontWeight: 'bold',
                color: '#545b64',
                width: '35%',
              }}
            >
              Componente Técnico
            </th>
            <th
              style={{
                textAlign: 'left',
                padding: '20px 24px',
                fontWeight: 'bold',
                color: '#545b64',
                width: '40%',
              }}
            >
              Instrucción
            </th>
          </tr>
        </thead>
        <tbody>
          {dataChunk.map((item, i) => (
            <tr
              key={i}
              style={{
                borderBottom: '1px solid #eaeded',
                backgroundColor: i % 2 === 0 ? '#ffffff' : '#f4f9ff',
              }}
            >
              <td
                style={{
                  padding: '18px 24px',
                  color: '#0972d3',
                  fontWeight: 'bold',
                }}
              >
                {item.raw}
              </td>
              <td style={{ padding: '18px 24px', fontWeight: '600' }}>
                {item.tech}
              </td>
              <td
                style={{
                  padding: '18px 24px',
                  color: '#545b64',
                  lineHeight: '1.6',
                }}
              >
                {item.desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* =========================================
          PÁGINA 1: PORTADA, DATOS Y PRIMERA PARTE DE LA TABLA
          ========================================= */}
      <PageWrapper>
        {/* Header con Título Negro y Mayor Separación */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '60px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img
              src={logoQuickFind}
              alt="Logo"
              style={{ height: '70px', objectFit: 'contain' }}
            />
            <h1
              style={{
                fontSize: '48px',
                fontWeight: '900',
                color: '#16191f',
                margin: 0,
                letterSpacing: '-1px',
                transform: 'translateY(-2px)',
              }}
            >
              QuickFind
            </h1>
          </div>
          <div
            style={{ textAlign: 'right', fontSize: '16px', color: '#16191f' }}
          >
            <div>
              <strong>Fecha:</strong> {currentDate}
            </div>
          </div>
        </div>

        {/* Barra de OT con más espacio */}
        <div
          style={{
            backgroundColor: '#fbfbfb',
            border: '1px solid #eaeded',
            padding: '20px 30px',
            borderRadius: '8px',
            fontSize: '18px',
            color: '#16191f',
            marginBottom: '50px',
          }}
        >
          QuickFind System -{' '}
          <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
            N°: OT - LOTO - M3
          </span>
        </div>

        {/* Bloque de Datos (Más espaciado y elegante) */}
        <div style={{ display: 'flex', gap: '50px', marginBottom: '60px' }}>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#545b64',
                margin: '0 0 20px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              DATOS GENERALES
            </h3>
            <div
              style={{
                backgroundColor: '#fbfbfb',
                border: '1px solid #eaeded',
                borderRadius: '8px',
                padding: '30px',
                fontSize: '15px',
                lineHeight: '2.8',
                color: '#16191f',
              }}
            >
              <div>
                <strong style={{ display: 'inline-block', width: '160px' }}>
                  Generó:
                </strong>{' '}
                ___________________________________
              </div>
              <div>
                <strong style={{ display: 'inline-block', width: '160px' }}>
                  Duración estimada:
                </strong>{' '}
                ___________________________________
              </div>
              <div>
                <strong style={{ display: 'inline-block', width: '160px' }}>
                  Responsable:
                </strong>{' '}
                TÉCNICO DE TURNO
              </div>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#545b64',
                margin: '0 0 20px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              ACTIVOS
            </h3>
            <div
              style={{
                backgroundColor: '#fbfbfb',
                border: '1px solid #eaeded',
                borderRadius: '8px',
                padding: '30px',
                fontSize: '15px',
                lineHeight: '2.8',
                color: '#16191f',
              }}
            >
              <div>
                <strong style={{ display: 'inline-block', width: '110px' }}>
                  Descripción:
                </strong>{' '}
                EMPACADORA MONDINI 3 (LÍNEA 3)
              </div>
              <div>
                <strong style={{ display: 'inline-block', width: '110px' }}>
                  Ubicación:
                </strong>{' '}
                ___________________________________
              </div>
              <div>
                <strong style={{ display: 'inline-block', width: '110px' }}>
                  Prioridad:
                </strong>{' '}
                Muy Alta
              </div>
            </div>
          </div>
        </div>

        {/* Inicio de la Tabla Maestra (Página 1) */}
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#16191f',
            margin: '0 0 25px 0',
            textTransform: 'uppercase',
            borderBottom: '2px solid #16191f',
            paddingBottom: '10px',
            display: 'inline-block',
          }}
        >
          LISTADO DE COMPONENTES
        </h3>
        {renderAwsTable(tablePage1)}
      </PageWrapper>

      {/* =========================================
          PÁGINA 2+: CONTINUACIÓN DE LA TABLA
          ========================================= */}
      {tablePage2.length > 0 && (
        <PageWrapper>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '50px',
              borderBottom: '2px solid #eaeded',
              paddingBottom: '20px',
            }}
          >
            <img
              src={logoQuickFind}
              alt="Logo"
              style={{ height: '45px', objectFit: 'contain' }}
            />
            <h3
              style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#16191f',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              LISTADO DE COMPONENTES (Cont.)
            </h3>
          </div>
          {renderAwsTable(tablePage2)}
        </PageWrapper>
      )}

      {/* =========================================
          PÁGINAS DE FOTOGRAFÍAS (MUY ESPACIADAS)
          ========================================= */}
      {photoChunks.map((chunk, index) => (
        <PageWrapper key={`photo-page-${index}`}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '50px',
              borderBottom: '2px solid #eaeded',
              paddingBottom: '20px',
            }}
          >
            <img
              src={logoQuickFind}
              alt="Logo"
              style={{ height: '45px', objectFit: 'contain' }}
            />
            <h3
              style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#16191f',
                margin: 0,
                textTransform: 'uppercase',
              }}
            >
              EVIDENCIA VISUAL (Pág. {index + 1})
            </h3>
          </div>

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}
          >
            {chunk.map((item, idx) => (
              <div key={idx}>
                <div
                  style={{
                    marginBottom: '20px',
                    borderBottom: '1px solid #eaeded',
                    paddingBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#0972d3',
                    }}
                  >
                    {item.raw}
                  </span>
                  <span
                    style={{
                      fontSize: '18px',
                      color: '#545b64',
                      marginLeft: '12px',
                    }}
                  >
                    - {item.tech}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '30px', height: '320px' }}>
                  {item.images.map((img: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        backgroundColor: '#fbfbfb',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '15px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 15,
                          left: 15,
                          background: 'rgba(255, 255, 255, 0.95)',
                          color: '#16191f',
                          border: '1px solid #d1d5db',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          zIndex: 2,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        }}
                      >
                        {img.label}
                      </div>
                      {img.src ? (
                        <img
                          src={img.src}
                          alt={img.label}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            margin: 'auto',
                            display: 'block',
                            borderRadius: '4px',
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            color: '#879596',
                            fontSize: '16px',
                            fontStyle: 'italic',
                          }}
                        >
                          Fotografía no disponible
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PageWrapper>
      ))}
    </div>
  );
};

// ==========================================
// COMPONENTE PRINCIPAL MONDINI 3
// ==========================================
export default function Mondini3Details() {
  const context = useContext(AppContent);
  if (!context) return null;
  const { isDark } = context;

  const [activeSection, setActiveSection] = useState('intro');
  const [isExporting, setIsExporting] = useState(false);

  const [flashbarItems, setFlashbarItems] = useState<any[]>([
    {
      type: 'warning',
      dismissible: true,
      content: (
        <Box fontSize="body-s">
          <strong>Normativa LOTTO:</strong> Desconecte la energía eléctrica
          general de la Mondini 3 antes de iniciar lavado.
        </Box>
      ),
      id: 'msg_loto',
    },
  ]);

  const printContainerRef = useRef<HTMLDivElement>(null);

  const colors = {
    bgPage: isDark ? '#0f1b2a' : '#ffffff',
    bgHeader: '#16191f',
    textMain: isDark ? '#fbfbfb' : '#16191f',
    textSecondary: isDark ? '#aab7b8' : '#545b64',
    border: isDark ? '#414d5c' : '#eaeded',
    activeLink: '#0972d3',
  };

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `@keyframes fadeIn { from { opacity: 0.4; } to { opacity: 1; } }`;
    document.head.appendChild(style);

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      let currentSection = SECTIONS[0].id;
      for (const section of SECTIONS) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = section.id;
        }
      }
      setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.head.removeChild(style);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 180;
      const elementPosition =
        element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  // ==========================================
  // FUNCIÓN: EXPORTAR A PDF
  // ==========================================
  const handleExportPDF = async () => {
    if (!printContainerRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(printContainerRef.current, {
        scale: 1.2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = 210;
      const pdfHeight = 297;

      const pages =
        printContainerRef.current.querySelectorAll('.pdf-page').length;
      const totalPdfHeight = pages * pdfHeight;

      for (let i = 0; i < pages; i++) {
        if (i > 0) pdf.addPage();
        pdf.addImage(
          imgData,
          'JPEG',
          0,
          -(i * pdfHeight),
          pdfWidth,
          totalPdfHeight,
        );
      }

      pdf.save(
        `Reporte_QuickFind_Mondini3_${new Date().toISOString().split('T')[0]}.pdf`,
      );

      setFlashbarItems((prev) => [
        {
          type: 'success',
          dismissible: true,
          content:
            'El PDF corporativo se ha generado al instante y sin cortes.',
          id: `success_${new Date().getTime()}`,
        },
        ...prev,
      ]);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      setFlashbarItems((prev) => [
        {
          type: 'error',
          dismissible: true,
          content: 'Ocurrió un error al generar el PDF.',
          id: `error_${new Date().getTime()}`,
        },
        ...prev,
      ]);
    } finally {
      setIsExporting(false);
    }
  };

  const renderCards = (data: any[]) => (
    <Cards
      cardsPerRow={[
        { cards: 1 },
        { minWidth: 600, cards: 2 },
        { minWidth: 900, cards: 3 },
      ]}
      cardDefinition={{
        header: (item) => (
          <div style={{ fontSize: '16px', fontWeight: '800' }}>{item.tech}</div>
        ),
        sections: [
          {
            id: 'carousel',
            content: (item) => (
              <CardCarousel images={item.images} isDark={isDark} />
            ),
          },
          {
            id: 'desc',
            content: (item) => (
              <span
                style={{
                  fontSize: '14px',
                  lineHeight: '1.4',
                  display: 'block',
                  marginTop: '4px',
                }}
              >
                {item.desc}
              </span>
            ),
          },
          {
            id: 'raw',
            content: (item) => (
              <span
                style={{
                  fontSize: '12px',
                  color: '#879596',
                  fontFamily: 'monospace',
                }}
              >
                Físico: {item.raw}
              </span>
            ),
          },
        ],
      }}
      items={data}
    />
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors.bgPage,
        color: colors.textMain,
        fontFamily:
          '"Amazon Ember", "Helvetica Neue", Roboto, Arial, sans-serif',
      }}
    >
      <div style={{ position: 'sticky', top: 0, zIndex: 1002, width: '100%' }}>
        <TopNavigation
          identity={{ href: '/cleaning-plan', title: 'Atrás: Menú Principal' }}
          utilities={[]}
        />
      </div>

      <div style={{ backgroundColor: colors.bgHeader, width: '100%' }}>
        <div
          style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 40px' }}
        >
          <div style={{ paddingTop: '20px' }}>
            <Flashbar items={flashbarItems} />
          </div>

          <div style={{ padding: '30px 0 50px 0', color: '#ffffff' }}>
            <nav
              aria-label="Breadcrumb"
              style={{ marginBottom: '16px', fontSize: '14px' }}
            >
              <span style={{ color: '#879596' }}>Plan de Limpieza</span>{' '}
              <span style={{ margin: '0 8px', color: '#879596' }}>/</span>{' '}
              <span style={{ color: '#fbfbfb' }}>Línea Mondini 3</span>
            </nav>

            <Grid
              gridDefinition={[
                { colspan: { default: 12, s: 8 } },
                { colspan: { default: 12, s: 4 } },
              ]}
            >
              <div>
                <h1
                  style={{
                    fontSize: '40px',
                    fontWeight: '900',
                    margin: '0 0 16px 0',
                    color: '#ffffff',
                    letterSpacing: '-0.5px',
                  }}
                >
                  Inventario de Protección: Mondini 3
                </h1>
                <p
                  style={{
                    fontSize: '18px',
                    lineHeight: '28px',
                    color: '#d1d5db',
                    maxWidth: '800px',
                    marginBottom: '24px',
                  }}
                >
                  Catálogo visual detallado. Compare el estado físico de cada
                  componente con su correcto aislamiento antes de inyectar agua.
                </p>
              </div>
              <Box float="right">
                <Button
                  variant="primary"
                  iconName="download"
                  loading={isExporting}
                  onClick={handleExportPDF}
                >
                  Descargar PDF de Línea 3
                </Button>
              </Box>
            </Grid>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '60px 40px',
          color: colors.textMain,
        }}
      >
        <Grid
          gridDefinition={[
            { colspan: { default: 12, s: 9, m: 10 } },
            { colspan: { default: 12, s: 3, m: 2 } },
          ]}
        >
          <div style={{ paddingRight: '40px' }}>
            <div id="intro" style={{ marginBottom: '80px' }}>
              <SectionTitle
                title="Propósito de Intervención"
                subtitle="Minimización de riesgos operativos y eléctricos."
                isDark={isDark}
              />
              <div
                style={{
                  fontSize: '18px',
                  lineHeight: '1.6',
                  color: colors.textMain,
                }}
              >
                <p>
                  La arquitectura de la empacadora <strong>Mondini 3</strong>{' '}
                  presenta componentes de muy alta sensibilidad en su zona de
                  tracción y bloqueos de seguridad. Este protocolo detalla el
                  procedimiento innegociable para proteger instrumentación
                  clave, garantizando que no se generen micro-cortos o
                  descalibraciones por filtración de agua a presión.
                </p>
                <Space></Space>
                <p style={{ color: colors.textSecondary }}>
                  Preste especial atención al{' '}
                  <strong>Sensor de Enclavamiento (color naranja)</strong> y a
                  los <strong>motores de accionamiento (azul y plata)</strong>{' '}
                  debajo del tablero. Utilice las tablas de abajo y los
                  carruseles de las tarjetas para verificar el estado desnudo vs
                  aislado.
                </p>
              </div>
            </div>

            <div id="tabla" style={{ marginBottom: '100px' }}>
              <SectionTitle
                title="Inventario Completo"
                subtitle="Checklist tabular de componentes divididos por sección operativa."
                isDark={isDark}
              />
              <SpaceBetween size="xl">
                <Container
                  header={
                    <Header variant="h2">
                      Sección 1: Entrada y Dosificación
                    </Header>
                  }
                >
                  <Table
                    variant="embedded"
                    columnDefinitions={[
                      {
                        id: 'tech',
                        header: 'Componente Técnico',
                        cell: (e) => e.tech,
                      },
                      {
                        id: 'raw',
                        header: 'Nombre Físico/Planta',
                        cell: (e) => (
                          <span style={{ color: '#879596' }}>{e.raw}</span>
                        ),
                      },
                      {
                        id: 'desc',
                        header: 'Instrucción de Aislamiento',
                        cell: (e) => e.desc,
                      },
                    ]}
                    items={m3Sec1Data}
                    stripedRows
                  />
                </Container>

                <Container
                  header={
                    <Header variant="h2">Sección 2: Sellado y Salida</Header>
                  }
                >
                  <Table
                    variant="embedded"
                    columnDefinitions={[
                      {
                        id: 'tech',
                        header: 'Componente Técnico',
                        cell: (e) => e.tech,
                      },
                      {
                        id: 'raw',
                        header: 'Nombre Físico/Planta',
                        cell: (e) => (
                          <span style={{ color: '#879596' }}>{e.raw}</span>
                        ),
                      },
                      {
                        id: 'desc',
                        header: 'Instrucción de Aislamiento',
                        cell: (e) => e.desc,
                      },
                    ]}
                    items={m3Sec2Data}
                    stripedRows
                  />
                </Container>
              </SpaceBetween>
            </div>

            <div id="sec1" style={{ marginBottom: '100px' }}>
              <SectionTitle
                title="Mondini 3 - Sección 1"
                subtitle="Componentes de Entrada y Dosificación de Jarabe."
                isDark={isDark}
              />
              {renderCards(m3Sec1Data)}
            </div>

            <div id="sec2" style={{ marginBottom: '100px' }}>
              <SectionTitle
                title="Mondini 3 - Sección 2"
                subtitle="Componentes de Zona de Sellado y Salida."
                isDark={isDark}
              />
              {renderCards(m3Sec2Data)}
            </div>
          </div>

          <div
            style={{ height: '100%', borderLeft: `1px solid ${colors.border}` }}
          >
            <div
              style={{ position: 'sticky', top: '120px', paddingLeft: '20px' }}
            >
              <SpaceBetween size="l">
                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      marginBottom: '10px',
                      color: colors.textMain,
                    }}
                  >
                    Navegación
                  </h3>
                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      borderLeft: `2px solid ${colors.border}`,
                    }}
                  >
                    {SECTIONS.map((section) => (
                      <li key={section.id} style={{ margin: 0 }}>
                        <a
                          href={`#${section.id}`}
                          onClick={(e) => scrollToSection(e, section.id)}
                          style={{
                            display: 'block',
                            padding: '6px 16px',
                            textDecoration: 'none',
                            fontSize: '14px',
                            color:
                              activeSection === section.id
                                ? colors.activeLink
                                : colors.textSecondary,
                            fontWeight:
                              activeSection === section.id ? '700' : '400',
                            borderLeft:
                              activeSection === section.id
                                ? `2px solid ${colors.activeLink}`
                                : '2px solid transparent',
                            marginLeft: '-2px',
                            transition: 'all 0.1s',
                          }}
                        >
                          {section.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{ height: '1px', backgroundColor: colors.border }}
                ></div>

                <div>
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      marginBottom: '10px',
                      color: colors.textMain,
                    }}
                  >
                    ¿Reportar falla?
                  </h3>
                  <Button iconName={'status-warning' as any}>
                    Levantar Ticket
                  </Button>
                </div>
              </SpaceBetween>
            </div>
          </div>
        </Grid>
      </div>

      {/* ========================================================
          CONTENEDOR OCULTO PARA EXPORTACIÓN PDF
      ======================================================== */}
      <div
        style={{ position: 'absolute', top: 0, left: '-9999px', zIndex: -1 }}
      >
        <div ref={printContainerRef}>
          <PrintTemplate dataSec1={m3Sec1Data} dataSec2={m3Sec2Data} />
        </div>
      </div>
    </div>
  );
}
