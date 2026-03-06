// ==========================================
// ARCHIVO: mondini3Data.ts
// Propósito: Almacenar la data estática y las rutas de imágenes para la línea Mondini 3
// ==========================================

// --- SECCIÓN 1 ---
import imgMedidorDeAire_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgMedidorDeAire_Fisico.jpg';
import imgChumaseras2_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgChumaseras2_Fisico.jpg';
import imgSelector_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgSelector_Fisico.jpg';
import imgMotorLadoSelector_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgMotorLadoSelector_Fisico.jpg';
import imgSensorNaranja_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgSensorNaranja_Fisico.jpg';
import imgSensoresAmarillos_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgSensoresAmarillos_Fisico.jpg';
import imgManguerasAzules_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgManguerasAzules_Fisico.jpg';
import imgSensorDeJaula_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgSensorDeJaula_Fisico.jpg';
import imgManguerasJarabera_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgManguerasJarabera_Fisico.jpg';
import imgTableroJarabe_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgTableroJarabe_Fisico.jpg';
import imgTorreta_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgTorreta_Fisico.jpg';
import imgCajaElectrica_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgCajaElectrica_Fisico.jpg';
import imgMotoresDebajoAzulPlata_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgMotoresDebajoAzulPlata_Fisico.jpg';

// --- SECCIÓN 2 ---
import imgBotonDeParo_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgBotonDeParo_Fisico.jpg';
import imgBoquillaDeAire_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgBoquillaDeAire_Fisico.jpg';
import imgMotoresBandasEntrada_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgMotoresBandasEntrada_Fisico.jpg';
import imgSensoresEntradaSellado_Fisico from '@/assets/cleaning-plan-page/mondini-3/imgSensoresEntradaSellado_Fisico.jpg';

// Exportamos la Data de la Sección 1
export const m3Sec1Data = [
  {
    raw: '*Medidor de aire',
    tech: 'Manómetro / Regulador Neumático',
    desc: 'Cubrir carátula para evitar condensación interna.',
    images: [
      { src: imgMedidorDeAire_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Chumaseras 2',
    tech: 'Chumaceras Expuestas (2)',
    desc: 'Evitar inyección directa de agua a presión en el sello.',
    images: [
      { src: imgChumaseras2_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Selector',
    tech: 'Selector Rotativo de Control',
    desc: 'Aislar completamente con bolsa y asegurar con cincho.',
    images: [
      { src: imgSelector_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Motor (lado selector)',
    tech: 'Motorreductor (Zona Panel)',
    desc: 'Sellar caja de conexiones eléctricas con nudo ciego.',
    images: [
      { src: imgMotorLadoSelector_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Sensor naranja',
    tech: 'Sensor Fotoeléctrico Principal',
    desc: 'Color naranja. Sellar lente y arnés trasero rigurosamente.',
    images: [
      { src: imgSensorNaranja_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Sensores amarillos',
    tech: 'Banco de Sensores (Amarillos)',
    desc: 'Agrupar cableado y colocar funda protectora global.',
    images: [
      { src: imgSensoresAmarillos_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Mangueras azules',
    tech: 'Líneas Neumáticas (Azules)',
    desc: 'Revisar racores; no aplicar agua a alta presión.',
    images: [
      { src: imgManguerasAzules_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Sensor de la jaula',
    tech: 'Sensor de Enclavamiento (Interlock)',
    desc: 'Altamente sensible. Uso obligatorio de funda plástica.',
    images: [
      { src: imgSensorDeJaula_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Mangueras de jarabera',
    tech: 'Líneas de Dosificación',
    desc: 'Asegurar conectores para evitar ingreso capilar de agua.',
    images: [
      { src: imgManguerasJarabera_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Tablero del jarabe',
    tech: 'Panel de Control de Dosificación',
    desc: 'Sellar bordes de puerta del gabinete o usar lona.',
    images: [
      { src: imgTableroJarabe_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Torreta tablero jarabe',
    tech: 'Baliza Luminosa (Torreta)',
    desc: 'Cubrir desde la base de la torreta hacia arriba.',
    images: [
      { src: imgTorreta_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Botonera tablero jarabera',
    tech: 'Estación de Botones (Jarabera)',
    desc: 'Cubrir botonera entera para proteger empaques internos.',
    images: [
      { src: imgTableroJarabe_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Caja electrica jarabera',
    tech: 'Gabinete de Distribución',
    desc: 'Verificar cierre hermético y prensacables.',
    images: [
      { src: imgCajaElectrica_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: 'Cableado de caja jarabera',
    tech: 'Canalización y Arneses',
    desc: 'Sellar entrada de cables a la caja principal.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Motores debajo tablero (azul/plata)',
    tech: 'Motores de Accionamiento',
    desc: 'Validar color azul/plata. Aislamiento inferior total (bolsa/cincho).',
    images: [
      { src: imgMotoresDebajoAzulPlata_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*Motor de banda dentada (verde)',
    tech: 'Servomotor de Banda',
    desc: 'Validar color verde. Proteger encóder y conectores expuestos.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
];

// Exportamos la Data de la Sección 2
export const m3Sec2Data = [
  {
    raw: '*-Botón de paro',
    tech: 'Paro de Emergencia (E-Stop)',
    desc: 'Riesgo de corto circuito. Sellar herméticamente.',
    images: [
      { src: imgBotonDeParo_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*-Boquilla de aire',
    tech: 'Boquilla de Soplado',
    desc: 'Evitar ingreso de agua en la línea neumática.',
    images: [
      { src: imgBoquillaDeAire_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- Motores bandas entrada',
    tech: 'Motores Transportador Entrada',
    desc: 'Hacer nudo ciego en bolsa protectora en base.',
    images: [
      { src: imgMotoresBandasEntrada_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*-Sensores entrada sellado',
    tech: 'Sensores de Presencia',
    desc: 'Muy delicados, cubrir lente y cuerpo completo.',
    images: [
      { src: imgSensoresEntradaSellado_Fisico, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*-Terminacion cables (amarillos)',
    tech: 'Conectores Sensores Inferiores',
    desc: 'Aislar terminales amarillas expuestas.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*-Conexiones aire y cables',
    tech: 'Múltiple de Válvulas y Clemas',
    desc: 'No aplicar chorro directo. Usar cubierta/lona.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*-Sensores rodillos',
    tech: 'Sensores Inductivos de Rodillos',
    desc: 'Fijar bolsa protectora firmemente en el arnés.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*-Sensores jaula naranja',
    tech: 'Cortinas Perimetrales (Naranjas)',
    desc: 'Cubrir ambos costados completos de los lentes.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- Terminación sable negro',
    tech: 'Arneses de Seguridad (Negros)',
    desc: 'Sellar conector de final de carrera.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- conexiones inferiores res.',
    tech: 'Bloques Conexión Resistencias',
    desc: 'Alto riesgo eléctrico. Aislamiento total.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- conexiones motores sup.',
    tech: 'Cajas de Empalme Aéreas',
    desc: 'Asegurar tapas de conexión ciegas.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- Motores inferiores (2V 1G)',
    tech: 'Motores Tracción (2 Verdes/1 Gris)',
    desc: 'Aislar por completo cajas de terminales.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- Barómetro inferior',
    tech: 'Manómetro Inferior de Línea',
    desc: 'Cubrir carátula de cristal y racores.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- Tablero completo final',
    tech: 'Gabinete de Control Principal',
    desc: 'Uso de lona plástica industrial extensa.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- Conexiones inf. tablero',
    tech: 'Acometida Inferior del Gabinete',
    desc: 'Sellar la base donde ingresan los cables.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- botoneras de tablero',
    tech: 'Interfaz de Operador (Stop)',
    desc: 'Evitar humedad en los selectores.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '*- Botonera trasera',
    tech: 'Panel de Control Secundario',
    desc: 'Aislar botonera de respaldo.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '- Conexión final rodillo',
    tech: 'Conector Alimentación Rodillo',
    desc: 'Sellar terminal de cableado móvil.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '- tapones chumaseras',
    tech: 'Chumaceras Cerradas (Tapones)',
    desc: 'Verificar integridad del tapón de goma.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
  {
    raw: '- impresora',
    tech: 'Módulo de Impresión Térmica',
    desc: 'Componente sumamente frágil. Funda especial rígida.',
    images: [
      { src: null, label: 'Componente Físico' },
      { src: null, label: 'Aislamiento Correcto' },
    ],
  },
];

export const SECTIONS = [
  { id: 'intro', text: 'Propósito del Protocolo' },
  { id: 'tabla', text: 'Inventario Completo' },
  { id: 'sec1', text: 'Sección 1 (Entrada)' },
  { id: 'sec2', text: 'Sección 2 (Sellado)' },
];
