import { useContext, useState } from 'react';
import axios from 'axios';
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
} from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';

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

const INITIAL_FORM_STATE = {
  name: '',
  surname: '',
  email: '',
  password: '',
  country: '',
  birth_date: '',
  phone_lada: '+52',
  phone_number: '',
  rol_id: '1',
  area_id: '9',
};

export default function CreateUser() {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContent) || {
    backendUrl: 'http://localhost:4000',
  };

  const [formValues, setFormValues] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formValues.name.trim()) errors.name = 'Campo requerido.';
    if (!formValues.surname.trim()) errors.surname = 'Campo requerido.';
    if (!formValues.country.trim()) errors.country = 'Campo requerido.';
    if (!formValues.birth_date) errors.birth_date = 'Selecciona una fecha.';
    if (!formValues.password || formValues.password.length < 6)
      errors.password = 'Mínimo 6 caracteres.';

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

  // FIX: Se permite que el evento sea de tipo any y opcional
  const handleSubmit = async (e?: any) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/register`,
        {
          ...formValues,
          rol_id: Number(formValues.rol_id),
          area_id: Number(formValues.area_id),
        },
        { withCredentials: true },
      );

      if (response.data.success) {
        navigate('/users');
      } else {
        setSubmitError(response.data.message || 'Error al crear usuario.');
      }
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Error de conexión.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                { text: 'Crear', href: '#' },
              ]}
            />
          }
          content={
            <ContentLayout
              header={
                <Header
                  variant="h1"
                  description="Complete el formulario para dar de alta un nuevo colaborador."
                >
                  Nuevo Usuario
                </Header>
              }
            >
              <form onSubmit={handleSubmit}>
                <Form
                  actions={
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button
                        formAction="none"
                        variant="link"
                        onClick={() => navigate('/users')}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        loading={isSubmitting}
                        onClick={handleSubmit}
                      >
                        Crear Usuario
                      </Button>
                    </SpaceBetween>
                  }
                  errorText={
                    submitError && (
                      <Alert type="error" header="No se pudo crear el usuario">
                        {submitError}
                      </Alert>
                    )
                  }
                >
                  <SpaceBetween size="l">
                    {/* SECCIÓN 1: CREDENCIALES Y ACCESO (CRÍTICO) */}
                    <Container
                      header={
                        <Header variant="h2">Credenciales y Acceso</Header>
                      }
                    >
                      <SpaceBetween size="l">
                        <ColumnLayout columns={2} variant="text-grid">
                          <FormField
                            label="Correo Electrónico (Usuario)"
                            description="Se usará para iniciar sesión y recuperar contraseña."
                            errorText={formErrors.email}
                          >
                            <Input
                              value={formValues.email}
                              onChange={({ detail }) =>
                                handleChange('email', detail.value)
                              }
                              placeholder="usuario@omnipart.com"
                              type="email"
                            />
                          </FormField>
                          <FormField
                            label="Contraseña Temporal"
                            errorText={formErrors.password}
                            constraintText="Mínimo 6 caracteres. Recomiende cambiarla al primer inicio."
                          >
                            <Input
                              value={formValues.password}
                              onChange={({ detail }) =>
                                handleChange('password', detail.value)
                              }
                              type="password"
                              placeholder="••••••"
                            />
                          </FormField>
                        </ColumnLayout>

                        {/* FIX: variant 'awsui-gen-ai-label' no existe, usamos algo válido y el color body-secondary */}
                        <Box
                          variant="strong"
                          color="text-body-secondary"
                          padding={{ top: 's', bottom: 's' }}
                        >
                          Configuración de permisos
                        </Box>

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
                            isDateEnabled={() => true}
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
                            placeholder="Ej. México"
                          />
                        </FormField>
                      </ColumnLayout>
                    </Container>

                    {/* SECCIÓN 3: CONTACTO (Compacta) */}
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
                            placeholder="+52"
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
                            placeholder="10 dígitos"
                            inputMode="numeric"
                          />
                        </FormField>
                        {/* Espacio vacío para alinear si se desea o agregar extensión */}
                        <Box />
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
