import * as React from 'react';
import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import {
  AppLayout,
  Container,
  Header,
  SpaceBetween,
  ContentLayout,
  Form,
  FormField,
  Input,
  Button,
  Select,
  DatePicker,
  ColumnLayout,
  Alert,
  Box,
  Toggle,
  Spinner,
} from '@cloudscape-design/components';
import { useNavigate, useParams } from 'react-router-dom';

// Contexto y Layouts
import { AppContent } from '@/context/AppContext';
import Navbar from '@/components/layouts/AppHeader';
import GlobalSidebar from '@/components/layouts/AppSidebar';
import RouteTracker from '../../../../components/layouts/RouteTracker';

// --- CONFIGURACIÓN ---
const ROLE_OPTIONS = [
  {
    label: 'Usuario (Estándar)',
    value: '1',
    description: 'Acceso básico a consulta.',
  },
  {
    label: 'Mantenimiento',
    value: '2',
    description: 'Gestión de refacciones y reportes.',
  },
  {
    label: 'Administrador',
    value: '3',
    description: 'Acceso total al sistema.',
  },
];

const AREA_OPTIONS = [
  { label: 'General', value: '9' },
  { label: 'Mantenimiento', value: '2' },
  { label: 'Sistemas', value: '1' },
  { label: 'Ventas', value: '3' },
  { label: 'Almacén', value: '4' },
];

export default function EditUser() {
  const navigate = useNavigate();
  const { userId } = useParams(); // Obtenemos el ID de la URL
  const { backendUrl } = useContext(AppContent) || {
    backendUrl: 'http://localhost:4000',
  };

  // Estados de carga
  const [loadingData, setLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estados del formulario
  const [formValues, setFormValues] = useState({
    name: '',
    surname: '',
    email: '',
    country: '',
    birth_date: '',
    phone_lada: '+52', // Valor por defecto si viene null
    phone_number: '',
    rol_id: '1',
    area_id: '9',
    is_active: true,
    is_account_verified: false,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // --- 1. CARGAR DATOS DEL USUARIO ---
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        setLoadingData(true);
        // Llamada al endpoint que creamos: getUserById
        const response = await axios.get(
          `${backendUrl}/api/user/admin/${userId}`,
          {
            withCredentials: true,
          },
        );

        if (response.data.success) {
          const user = response.data.user;

          // Formatear fecha para el DatePicker (YYYY-MM-DD)
          let formattedDate = '';
          if (user.birth_date) {
            formattedDate = new Date(user.birth_date)
              .toISOString()
              .split('T')[0];
          }

          setFormValues({
            name: user.name || '',
            surname: user.surname || '',
            email: user.email || '',
            country: user.country || '',
            birth_date: formattedDate,
            phone_lada: user.phone_lada || '+52', // Asumiendo que agregaste estos campos al modelo
            phone_number: user.phone_number || '',
            rol_id: String(user.rol_id), // Convertir a string para el Select
            area_id: String(user.area_id),
            is_active: user.is_active,
            is_account_verified: user.is_account_verified,
          });
        }
      } catch (error) {
        console.error('Error cargando usuario:', error);
        setSubmitError('No se pudo cargar la información del usuario.');
      } finally {
        setLoadingData(false);
      }
    };

    fetchUserData();
  }, [userId, backendUrl]);

  // --- MANEJO DE CAMBIOS ---
  const handleChange = (field: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // --- VALIDACIÓN ---
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formValues.name.trim()) errors.name = 'Campo requerido.';
    if (!formValues.surname.trim()) errors.surname = 'Campo requerido.';
    if (!formValues.country.trim()) errors.country = 'Campo requerido.';
    if (!formValues.birth_date) errors.birth_date = 'Selecciona una fecha.';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formValues.email || !emailRegex.test(formValues.email))
      errors.email = 'Email inválido.';

    const phoneRegex = /^\d{10}$/;
    if (formValues.phone_number && !phoneRegex.test(formValues.phone_number)) {
      errors.phone_number = 'Debe ser de 10 dígitos.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // --- ENVIAR ACTUALIZACIÓN ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.put(
        `${backendUrl}/api/user/update-user/${userId}`,
        {
          ...formValues,
          rol_id: Number(formValues.rol_id),
          area_id: Number(formValues.area_id),
        },
        { withCredentials: true },
      );

      if (response.data.success) {
        // Regresar a la tabla tras éxito
        navigate('/users');
      } else {
        setSubmitError(response.data.message || 'Error al actualizar usuario.');
      }
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Error de conexión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingData) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flexShrink: 0, zIndex: 1001 }}>
        <Navbar />
      </div>

      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
        <AppLayout
          navigation={<GlobalSidebar />}
          toolsHide={true}
          contentType="form"
          breadcrumbs={
            <RouteTracker
              items={[
                { text: 'Administración', href: '#' },
                { text: 'Usuarios', href: '/users' },
                { text: 'Editar Usuario', href: '#' },
              ]}
            />
          }
          content={
            <ContentLayout
              header={
                <Header
                  variant="h1"
                  description={`Editando información de: ${formValues.name} ${formValues.surname}`}
                  actions={
                    <SpaceBetween direction="horizontal" size="xs">
                      {/* Botón rápido para cancelar */}
                      <Button onClick={() => navigate('/users')}>
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        loading={isSubmitting}
                        onClick={handleSubmit}
                      >
                        Guardar Cambios
                      </Button>
                    </SpaceBetween>
                  }
                >
                  Editar Usuario
                </Header>
              }
            >
              <form onSubmit={handleSubmit}>
                <Form
                  errorText={
                    submitError && (
                      <Alert type="error" header="Error de actualización">
                        {submitError}
                      </Alert>
                    )
                  }
                >
                  <SpaceBetween size="l">
                    {/* SECCIÓN 1: ESTADO Y ACCESO */}
                    <Container
                      header={<Header variant="h2">Estado y Permisos</Header>}
                    >
                      <SpaceBetween size="l">
                        {/* Control de Estado (Activo/Inactivo) */}
                        <Box variant="awsui-key-label">Estado de la cuenta</Box>
                        <ColumnLayout columns={2} variant="text-grid">
                          <Toggle
                            onChange={({ detail }) =>
                              handleChange('is_active', detail.checked)
                            }
                            checked={formValues.is_active}
                          >
                            {formValues.is_active
                              ? 'Cuenta Activa (Habilitada)'
                              : 'Cuenta Bloqueada (Deshabilitada)'}
                          </Toggle>

                          <Toggle
                            onChange={({ detail }) =>
                              handleChange(
                                'is_account_verified',
                                detail.checked,
                              )
                            }
                            checked={formValues.is_account_verified}
                          >
                            {formValues.is_account_verified
                              ? 'Correo Verificado'
                              : 'Correo No Verificado'}
                          </Toggle>
                        </ColumnLayout>

                        <div
                          style={{
                            borderTop: '1px solid #eaeded',
                            margin: '10px 0',
                          }}
                        ></div>

                        <ColumnLayout columns={2} variant="text-grid">
                          <FormField
                            label="Rol del Sistema"
                            errorText={formErrors.rol_id}
                          >
                            <Select
                              selectedOption={
                                ROLE_OPTIONS.find(
                                  (opt) => opt.value === formValues.rol_id,
                                ) || null
                              }
                              onChange={({ detail }) =>
                                handleChange(
                                  'rol_id',
                                  detail.selectedOption.value,
                                )
                              }
                              options={ROLE_OPTIONS}
                            />
                          </FormField>
                          <FormField
                            label="Área / Departamento"
                            errorText={formErrors.area_id}
                          >
                            <Select
                              selectedOption={
                                AREA_OPTIONS.find(
                                  (opt) => opt.value === formValues.area_id,
                                ) || null
                              }
                              onChange={({ detail }) =>
                                handleChange(
                                  'area_id',
                                  detail.selectedOption.value,
                                )
                              }
                              options={AREA_OPTIONS}
                            />
                          </FormField>
                        </ColumnLayout>

                        {/* Nota: No permitimos editar el Email aquí comúnmente, pero si lo necesitas, descomenta: */}
                        <FormField
                          label="Correo Electrónico"
                          errorText={formErrors.email}
                        >
                          <Input
                            value={formValues.email}
                            onChange={({ detail }) =>
                              handleChange('email', detail.value)
                            }
                          />
                        </FormField>
                      </SpaceBetween>
                    </Container>

                    {/* SECCIÓN 2: INFORMACIÓN PERSONAL */}
                    <Container
                      header={
                        <Header variant="h2">Información Personal</Header>
                      }
                    >
                      <ColumnLayout columns={2} variant="text-grid">
                        <FormField
                          label="Nombre(s)"
                          errorText={formErrors.name}
                        >
                          <Input
                            value={formValues.name}
                            onChange={({ detail }) =>
                              handleChange('name', detail.value)
                            }
                          />
                        </FormField>
                        <FormField
                          label="Apellido(s)"
                          errorText={formErrors.surname}
                        >
                          <Input
                            value={formValues.surname}
                            onChange={({ detail }) =>
                              handleChange('surname', detail.value)
                            }
                          />
                        </FormField>
                        <FormField
                          label="Fecha de Nacimiento"
                          errorText={formErrors.birth_date}
                        >
                          <DatePicker
                            value={formValues.birth_date}
                            onChange={({ detail }) =>
                              handleChange('birth_date', detail.value)
                            }
                            placeholder="YYYY-MM-DD"
                          />
                        </FormField>
                        <FormField
                          label="País de Residencia"
                          errorText={formErrors.country}
                        >
                          <Input
                            value={formValues.country}
                            onChange={({ detail }) =>
                              handleChange('country', detail.value)
                            }
                          />
                        </FormField>
                      </ColumnLayout>
                    </Container>

                    {/* SECCIÓN 3: CONTACTO */}
                    <Container header={<Header variant="h2">Contacto</Header>}>
                      <ColumnLayout columns={3} variant="text-grid">
                        <FormField
                          label="Lada"
                          errorText={formErrors.phone_lada}
                          stretch={true}
                        >
                          <Input
                            value={formValues.phone_lada}
                            onChange={({ detail }) =>
                              handleChange('phone_lada', detail.value)
                            }
                          />
                        </FormField>
                        <FormField
                          label="Teléfono / Celular"
                          errorText={formErrors.phone_number}
                          stretch={true}
                        >
                          <Input
                            value={formValues.phone_number}
                            onChange={({ detail }) =>
                              handleChange('phone_number', detail.value)
                            }
                            inputMode="numeric"
                          />
                        </FormField>
                      </ColumnLayout>
                    </Container>
                  </SpaceBetween>
                </Form>
              </form>
            </ContentLayout>
          }
        />
      </div>
    </div>
  );
}
