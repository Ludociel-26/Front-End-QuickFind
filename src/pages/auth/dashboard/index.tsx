import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from 'react';

// --- IMPORTACIONES CLOUDSCAPE ---
import Board from '@cloudscape-design/board-components/board';
import type { BoardProps } from '@cloudscape-design/board-components/board';
import BoardItem from '@cloudscape-design/board-components/board-item';
import {
  AppLayout,
  ContentLayout,
  Header,
  SpaceBetween,
  Button,
  Box,
  Flashbar,
  Spinner,
} from '@cloudscape-design/components';

// --- IMPORTACIONES LOCALES ---
import { getDefaultLayout, getBoardWidgets, allWidgets } from './config';
import type { WidgetDataType } from './interfaces';
import { DashboardPalette } from './palette';
import { boardI18nStrings } from './board-i18n';

// --- CONTEXTO ---
import { AppContent } from '@/context/AppContext';

// --- TUS COMPONENTES ---
import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import { Footer } from '@/components/layouts/AppFooter';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    let timeoutId: number;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setWidth(window.innerWidth), 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);
  return width;
}

export default function DashboardFeature() {
  const windowWidth = useWindowWidth();

  // --- CONTEXTO GLOBAL ---
  const { setPageLoading, alerts, addAlert } = useContext(AppContent) || {};

  // --- ESTADOS DE CARGA LOCAL ---
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isWidgetLoading, setIsWidgetLoading] = useState(true);

  // Control de UI
  const [navigationOpen, setNavigationOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(false);

  // Referencias para evitar ciclos infinitos y actualizaciones desmontadas
  const isMounted = useRef(true);
  const hasLoaded = useRef(false); // <-- CANDADO DE SEGURIDAD

  // --- CARGA DE ITEMS ---
  const [items, setItems] = useState<BoardProps.Item<WidgetDataType>[]>(() => {
    const savedLayout = localStorage.getItem('inventory-dashboard-v6-large');
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        return parsedLayout
          .map((item: any) => {
            const config = allWidgets[item.id];
            if (!config) return null;
            return {
              ...item,
              minColumnSpan: 1,
              minRowSpan: 1,
              data: {
                title: config.title || 'Widget',
                provider: config.provider,
                disableContentPaddings: false,
              },
            };
          })
          .filter(Boolean);
      } catch (e) {
        console.error('Error cargando layout:', e);
        return getBoardWidgets(getDefaultLayout(window.innerWidth));
      }
    }
    return getBoardWidgets(getDefaultLayout(window.innerWidth));
  });

  // --- SECUENCIA DE CARGA ROBUSTA (PROTEGIDA CONTRA LOOPS) ---
  useEffect(() => {
    isMounted.current = true;

    // Si ya cargó antes, abortamos para no repetir las notificaciones
    if (hasLoaded.current) return;

    if (setPageLoading) {
      setPageLoading(false);
    }

    const loadDashboard = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (isMounted.current) {
        setIsPageLoading(false);
      }

      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (isMounted.current && !hasLoaded.current) {
        setIsWidgetLoading(false);

        // Disparamos notificaciones SOLO UNA VEZ
        if (addAlert) {
          addAlert(
            'success',
            'Inventario sincronizado correctamente.',
            'Sincronización',
          );
          addAlert('info', 'Bienvenido al Panel de Control.', 'Bienvenido');
        }

        hasLoaded.current = true; // Cerramos el candado
      }
    };

    loadDashboard();

    return () => {
      isMounted.current = false;
    };
  }, []); // <-- ARREGLO VACÍO: Solo se ejecuta al montar el componente

  const handleItemsChange = useCallback(
    (event: CustomEvent<BoardProps.ItemsChangeDetail<WidgetDataType>>) => {
      setItems(event.detail.items);
    },
    [],
  );

  useEffect(() => {
    if (!isWidgetLoading && !isPageLoading) {
      const timeout = setTimeout(() => {
        const layoutToSave = items.map((item) => ({
          id: item.id,
          columnSpan: item.columnSpan,
          rowSpan: item.rowSpan,
        }));
        localStorage.setItem(
          'inventory-dashboard-v6-large',
          JSON.stringify(layoutToSave),
        );
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [items, isWidgetLoading, isPageLoading]);

  const handleAddWidget = useCallback((widgetId: string) => {
    const widgetConfig = allWidgets[widgetId];
    if (!widgetConfig) return;
    setItems((prev) => [
      ...prev,
      {
        id: widgetId,
        rowSpan: widgetConfig.definition?.defaultRowSpan || 2,
        columnSpan: widgetConfig.definition?.defaultColumnSpan || 1,
        minRowSpan: 1,
        minColumnSpan: 1,
        data: {
          title: widgetConfig.title || 'Widget',
          provider: widgetConfig.provider,
          disableContentPaddings: false,
        },
      },
    ]);
  }, []);

  const handleReset = useCallback(() => {
    setIsPageLoading(true);
    setIsWidgetLoading(true);

    setItems(getBoardWidgets(getDefaultLayout(windowWidth)));
    localStorage.removeItem('inventory-dashboard-v6-large');

    setTimeout(() => {
      if (isMounted.current) setIsPageLoading(false);
      setTimeout(() => {
        if (isMounted.current) {
          setIsWidgetLoading(false);
          if (addAlert) {
            addAlert(
              'success',
              'Diseño restablecido por defecto.',
              'Vista Actualizada',
            );
          }
        }
      }, 1000);
    }, 800);
  }, [windowWidth, addAlert]);

  const renderItem = useCallback(
    (item: BoardProps.Item<WidgetDataType>, actions: any) => {
      const WidgetComponent = item.data.provider;
      return (
        <BoardItem
          header={<Header>{item.data.title}</Header>}
          i18nStrings={{
            dragHandleAriaLabel: 'Arrastrar widget',
            resizeHandleAriaLabel: 'Redimensionar widget',
            resizeHandleAriaDescription:
              'Enter para redimensionar, Esc para cancelar',
          }}
          settings={
            <Button
              variant="icon"
              iconName="close"
              onClick={() => actions.removeItem()}
              ariaLabel="Quitar"
            />
          }
        >
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <WidgetComponent loading={isWidgetLoading} />
          </div>
        </BoardItem>
      );
    },
    [isWidgetLoading],
  );

  return (
    <div className="dashboard-container">
      <Navbar />

      <AppLayout
        contentType="dashboard"
        navigationOpen={navigationOpen}
        onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
        navigation={<GlobalSidebar />}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        toolsWidth={350}
        tools={
          <DashboardPalette
            activeWidgetIds={items.map((i) => i.id)}
            onAddWidget={handleAddWidget}
          />
        }
        notifications={
          alerts && alerts.length > 0 ? (
            <Flashbar items={alerts as any} stackItems={true} />
          ) : null
        }
        breadcrumbs={null}
        content={
          <ContentLayout
            header={
              <Box padding={{ top: 'l' }}>
                <SpaceBetween size="m">
                  <Header
                    variant="h1"
                    actions={
                      <SpaceBetween direction="horizontal" size="xs">
                        <Button onClick={handleReset} disabled={isPageLoading}>
                          Restablecer Vista
                        </Button>
                        <Button
                          variant="primary"
                          iconName="add-plus"
                          onClick={() => setToolsOpen(true)}
                          disabled={isPageLoading}
                        >
                          Agregar widgets
                        </Button>
                      </SpaceBetween>
                    }
                  >
                    Panel de Control - Inventario
                  </Header>
                </SpaceBetween>
              </Box>
            }
          >
            {isPageLoading ? (
              <Box
                padding="xxl"
                display="flex"
                alignItems="center"
                justifyContent="center"
                customStyles={{ height: '60vh' }}
              >
                <Spinner size="large" />
              </Box>
            ) : (
              <SpaceBetween size="xxl">
                <div
                  style={{
                    display: 'flow-root',
                    width: '100%',
                    minHeight: '80vh',
                    paddingBottom: '50px',
                  }}
                >
                  <Board
                    items={items}
                    onItemsChange={handleItemsChange}
                    i18nStrings={boardI18nStrings}
                    renderItem={renderItem}
                    empty={
                      <Box textAlign="center" padding="l">
                        <Box variant="strong" color="text-body-secondary">
                          Sin widgets
                        </Box>
                        <Button onClick={() => setToolsOpen(true)}>
                          Agregar widgets
                        </Button>
                      </Box>
                    }
                  />
                </div>
              </SpaceBetween>
            )}
          </ContentLayout>
        }
      />

      <Footer />
    </div>
  );
}
