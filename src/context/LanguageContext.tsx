import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. DEFINICIÓN DE TIPOS (Vital para evitar errores de TypeScript)
export type Language =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'it'
  | 'pt'
  | 'zh-CN'
  | 'zh-TW'
  | 'ja'
  | 'ko';

// 2. DICCIONARIO DE TRADUCCIONES (Tus datos completos)
const translations: Record<Language, any> = {
  // --- INGLÉS (English) ---
  en: {
    searchPlaceholder: 'Search services, features...', // Agregado para el Navbar
    welcome: 'Welcome',
    subtitle: 'Manage your inventory efficiently.',
    login: 'Login',
    register: 'Register',
    userPlaceholder: 'User or email',
    passwordPlaceholder: 'Password',
    rememberMe: 'Remember me',
    forgotPass: 'Forgot password?',
    btnIngresar: 'ENTER SYSTEM',
    createAccount: 'Create Account',
    joinTeam: 'Join the QuickFind team.',
    name: 'First Name',
    surname: 'Last Name',
    country: 'Select Region',
    bday: 'Birthday',
    employeeId: 'Employee ID',
    email: 'Email address',
    createPass: 'Create password',
    confirmPass: 'Confirm password',
    btnRegister: 'REQUEST REGISTRATION',
    fillForm: 'COMPLETE THE FORM',
    passStrength: ['8+ Characters', 'Uppercase', 'Number', 'Symbol'],
    panelTitle: '360° Platform',
    panelDesc: 'Total control from reception to dispatch.',
    features: ['Traceability', 'Stock Alerts', 'Audit', 'ISO Reports'],
    footer: '© 2026 QuickFind Inc.',
    privacy: 'Privacy Policy',
    recoverTitle: 'Recover Account',
    recoverDesc: 'Enter your registered email.',
    sendCode: 'Send Code',
    verifyTitle: 'Verification',
    verifyDesc: '6-digit code sent to your email.',
    verifyBtn: 'Verify',
    wrongEmail: 'Wrong email? Go back',
    newPassTitle: 'New Password',
    newPassDesc: 'Create a secure password.',
    resetBtn: 'Reset Password',
    securityFooter: '© 2026 QuickFind Security System',
    otpError: 'Complete the 6-digit code',
  },

  // --- ESPAÑOL (Spanish) ---
  es: {
    searchPlaceholder: 'Buscar servicios, características...',
    welcome: 'Bienvenido',
    subtitle: 'Gestiona tu inventario con eficiencia.',
    login: 'Iniciar sesión',
    register: 'Registro',
    userPlaceholder: 'Usuario o email',
    passwordPlaceholder: 'Contraseña',
    rememberMe: 'Recordarme',
    forgotPass: '¿Contraseña olvidada?',
    btnIngresar: 'INGRESAR AL SISTEMA',
    createAccount: 'Crear cuenta',
    joinTeam: 'Únete al equipo QuickFind.',
    name: 'Nombre',
    surname: 'Apellido',
    country: 'Selecciona tu Región',
    bday: 'Fecha de nacimiento',
    employeeId: 'No. ID',
    email: 'Correo electrónico',
    createPass: 'Crear contraseña',
    confirmPass: 'Confirmar contraseña',
    btnRegister: 'SOLICITAR REGISTRO',
    fillForm: 'COMPLETE EL FORMULARIO',
    passStrength: ['8+ Caracteres', 'Mayúscula', 'Número', 'Símbolo'],
    panelTitle: 'Plataforma 360°',
    panelDesc: 'Control total desde la recepción hasta el despacho.',
    features: ['Trazabilidad', 'Alertas Stock', 'Auditoría', 'Reportes ISO'],
    footer: '© 2026 QuickFind Inc.',
    privacy: 'Política de Privacidad',
    recoverTitle: 'Recuperar Cuenta',
    recoverDesc: 'Ingresa tu correo registrado.',
    sendCode: 'Enviar Código',
    verifyTitle: 'Verificación',
    verifyDesc: 'Código de 6 dígitos enviado a tu correo.',
    verifyBtn: 'Verificar',
    wrongEmail: '¿Correo incorrecto? Volver',
    newPassTitle: 'Nueva Contraseña',
    newPassDesc: 'Crea una contraseña segura.',
    resetBtn: 'Restablecer',
    securityFooter: '© 2026 QuickFind Security System',
    otpError: 'Complete el código de 6 dígitos',
  },

  // --- FRANCÉS (French) ---
  fr: {
    searchPlaceholder: 'Rechercher des services...',
    welcome: 'Bienvenue',
    subtitle: 'Gérez votre inventaire efficacement.',
    login: 'Connexion',
    register: "S'inscrire",
    userPlaceholder: 'Utilisateur ou email',
    passwordPlaceholder: 'Mot de passe',
    rememberMe: 'Se souvenir de moi',
    forgotPass: 'Mot de passe oublié ?',
    btnIngresar: 'ENTRER DANS LE SYSTÈME',
    createAccount: 'Créer un compte',
    joinTeam: "Rejoignez l'équipe QuickFind.",
    name: 'Prénom',
    surname: 'Nom',
    country: 'Sélectionnez votre région',
    bday: 'Date de naissance',
    employeeId: 'ID Employé',
    email: 'Adresse e-mail',
    createPass: 'Créer un mot de passe',
    confirmPass: 'Confirmer le mot de passe',
    btnRegister: "DEMANDER L'INSCRIPTION",
    fillForm: 'REMPLIR LE FORMULAIRE',
    passStrength: ['8+ Caractères', 'Majuscule', 'Chiffre', 'Symbole'],
    panelTitle: 'Plateforme 360°',
    panelDesc: "Contrôle total de la réception à l'expédition.",
    features: ['Traçabilité', 'Alertes Stock', 'Audit', 'Rapports ISO'],
    footer: '© 2026 QuickFind Inc.',
    privacy: 'Politique de confidentialité',
    recoverTitle: 'Récupérer le compte',
    recoverDesc: 'Entrez votre e-mail enregistré.',
    sendCode: 'Envoyer le code',
    verifyTitle: 'Vérification',
    verifyDesc: 'Code à 6 chiffres envoyé à votre e-mail.',
    verifyBtn: 'Vérifier',
    wrongEmail: 'Mauvais e-mail ? Retour',
    newPassTitle: 'Nouveau mot de passe',
    newPassDesc: 'Créez un mot de passe sécurisé.',
    resetBtn: 'Réinitialiser',
    securityFooter: '© 2026 QuickFind Security System',
    otpError: 'Complétez le code à 6 chiffres',
  },

  // --- ALEMÁN (German) ---
  de: {
    searchPlaceholder: 'Dienste suchen...',
    welcome: 'Willkommen',
    subtitle: 'Verwalten Sie Ihr Inventar effizient.',
    login: 'Anmelden',
    register: 'Registrieren',
    userPlaceholder: 'Benutzer oder E-Mail',
    passwordPlaceholder: 'Passwort',
    rememberMe: 'Erinnere dich an mich',
    forgotPass: 'Passwort vergessen?',
    btnIngresar: 'SYSTEM BETRETEN',
    createAccount: 'Konto erstellen',
    joinTeam: 'Treten Sie dem QuickFind-Team bei.',
    name: 'Vorname',
    surname: 'Nachname',
    country: 'Region auswählen',
    bday: 'Geburtsdatum',
    employeeId: 'Mitarbeiter-ID',
    email: 'E-Mail-Adresse',
    createPass: 'Passwort erstellen',
    confirmPass: 'Passwort bestätigen',
    btnRegister: 'REGISTRIERUNG ANFORDERN',
    fillForm: 'FORMULAR AUSFÜLLEN',
    passStrength: ['8+ Zeichen', 'Großbuchstabe', 'Zahl', 'Symbol'],
    panelTitle: '360°-Plattform',
    panelDesc: 'Totale Kontrolle vom Empfang bis zum Versand.',
    features: [
      'Rückverfolgbarkeit',
      'Bestandswarnungen',
      'Audit',
      'ISO-Berichte',
    ],
    footer: '© 2026 QuickFind Inc.',
    privacy: 'Datenschutzrichtlinie',
    recoverTitle: 'Konto wiederherstellen',
    recoverDesc: 'Geben Sie Ihre registrierte E-Mail ein.',
    sendCode: 'Code senden',
    verifyTitle: 'Überprüfung',
    verifyDesc: '6-stelliger Code an Ihre E-Mail gesendet.',
    verifyBtn: 'Überprüfen',
    wrongEmail: 'Falsche E-Mail? Zurück',
    newPassTitle: 'Neues Passwort',
    newPassDesc: 'Erstellen Sie ein sicheres Passwort.',
    resetBtn: 'Zurücksetzen',
    securityFooter: '© 2026 QuickFind Security System',
    otpError: 'Vervollständigen Sie den 6-stelligen Code',
  },

  // --- ITALIANO (Italian) ---
  it: {
    searchPlaceholder: 'Cerca servizi...',
    welcome: 'Benvenuto',
    subtitle: 'Gestisci il tuo inventario con efficienza.',
    login: 'Accedi',
    register: 'Registrati',
    userPlaceholder: 'Utente o email',
    passwordPlaceholder: 'Password',
    rememberMe: 'Ricordami',
    forgotPass: 'Password dimenticata?',
    btnIngresar: 'ACCEDI AL SISTEMA',
    createAccount: 'Crea account',
    joinTeam: 'Unisciti al team QuickFind.',
    name: 'Nome',
    surname: 'Cognome',
    country: 'Seleziona Regione',
    bday: 'Data di nascita',
    employeeId: 'ID Dipendente',
    email: 'Indirizzo email',
    createPass: 'Crea password',
    confirmPass: 'Conferma password',
    btnRegister: 'RICHIEDI REGISTRAZIONE',
    fillForm: 'COMPLETA IL MODULO',
    passStrength: ['8+ Caratteri', 'Maiuscola', 'Numero', 'Simbolo'],
    panelTitle: 'Piattaforma 360°',
    panelDesc: 'Controllo totale dalla ricezione alla spedizione.',
    features: ['Tracciabilità', 'Avvisi Stock', 'Audit', 'Report ISO'],
    footer: '© 2026 QuickFind Inc.',
    privacy: 'Privacy Policy',
    recoverTitle: 'Recupera Account',
    recoverDesc: 'Inserisci la tua email registrata.',
    sendCode: 'Invia Codice',
    verifyTitle: 'Verifica',
    verifyDesc: 'Codice a 6 cifre inviato alla tua email.',
    verifyBtn: 'Verifica',
    wrongEmail: 'Email errata? Indietro',
    newPassTitle: 'Nuova Password',
    newPassDesc: 'Crea una password sicura.',
    resetBtn: 'Reimposta',
    securityFooter: '© 2026 QuickFind Security System',
    otpError: 'Completa il codice a 6 cifre',
  },

  // --- PORTUGUÉS (Portuguese) ---
  pt: {
    searchPlaceholder: 'Pesquisar serviços...',
    welcome: 'Bem-vindo',
    subtitle: 'Gerencie seu inventário com eficiência.',
    login: 'Entrar',
    register: 'Cadastrar',
    userPlaceholder: 'Usuário ou e-mail',
    passwordPlaceholder: 'Senha',
    rememberMe: 'Lembrar de mim',
    forgotPass: 'Esqueceu a senha?',
    btnIngresar: 'ENTRAR NO SISTEMA',
    createAccount: 'Criar conta',
    joinTeam: 'Junte-se à equipe QuickFind.',
    name: 'Nome',
    surname: 'Sobrenome',
    country: 'Selecione a Região',
    bday: 'Data de nascimento',
    employeeId: 'ID Funcionário',
    email: 'Endereço de e-mail',
    createPass: 'Criar senha',
    confirmPass: 'Confirmar senha',
    btnRegister: 'SOLICITAR CADASTRO',
    fillForm: 'PREENCHA O FORMULÁRIO',
    passStrength: ['8+ Caracteres', 'Maiúscula', 'Número', 'Símbolo'],
    panelTitle: 'Plataforma 360°',
    panelDesc: 'Controle total do recebimento à expedição.',
    features: [
      'Rastreabilidade',
      'Alertas Estoque',
      'Auditoria',
      'Relatórios ISO',
    ],
    footer: '© 2026 QuickFind Inc.',
    privacy: 'Política de Privacidade',
    recoverTitle: 'Recuperar Conta',
    recoverDesc: 'Insira seu e-mail registrado.',
    sendCode: 'Enviar Código',
    verifyTitle: 'Verificação',
    verifyDesc: 'Código de 6 dígitos enviado para seu e-mail.',
    verifyBtn: 'Verificar',
    wrongEmail: 'E-mail incorreto? Voltar',
    newPassTitle: 'Nova Senha',
    newPassDesc: 'Crie uma senha segura.',
    resetBtn: 'Redefinir',
    securityFooter: '© 2026 QuickFind Security System',
    otpError: 'Complete o código de 6 dígitos',
  },

  // --- CHINO SIMPLIFICADO ---
  'zh-CN': {
    searchPlaceholder: '搜索服务...',
    welcome: '欢迎',
    subtitle: '高效管理您的库存。',
    login: '登录',
    register: '注册',
    userPlaceholder: '用户名或邮箱',
    passwordPlaceholder: '密码',
    rememberMe: '记住我',
    forgotPass: '忘记密码？',
    btnIngresar: '进入系统',
    createAccount: '创建账户',
    joinTeam: '加入 QuickFind 团队。',
    name: '名字',
    surname: '姓氏',
    country: '选择地区',
    bday: '出生日期',
    employeeId: '员工 ID',
    email: '电子邮件',
    createPass: '创建密码',
    confirmPass: '确认密码',
    btnRegister: '申请注册',
    fillForm: '填写表格',
    passStrength: ['8+ 字符', '大写字母', '数字', '符号'],
    panelTitle: '360° 平台',
    panelDesc: '从接收到发货的全程控制。',
    features: ['可追溯性', '库存预警', '审计', 'ISO 报告'],
    footer: '© 2026 QuickFind Inc.',
    privacy: '隐私政策',
    recoverTitle: '恢复帐户',
    recoverDesc: '输入您的注册邮箱。',
    sendCode: '发送代码',
    verifyTitle: '验证',
    verifyDesc: '6 位数代码已发送至您的邮箱。',
    verifyBtn: '验证',
    wrongEmail: '邮箱错误？返回',
    newPassTitle: '新密码',
    newPassDesc: '创建一个安全密码。',
    resetBtn: '重置密码',
    securityFooter: '© 2026 QuickFind Security System',
    otpError: '请填写 6 位数代码',
  },

  // --- CHINO TRADICIONAL ---
  'zh-TW': {
    searchPlaceholder: '搜尋服務...',
    welcome: '歡迎',
    subtitle: '高效管理您的庫存。',
    login: '登錄',
    register: '註冊',
    userPlaceholder: '用戶名或郵箱',
    passwordPlaceholder: '密碼',
    rememberMe: '記住我',
    forgotPass: '忘記密碼？',
    btnIngresar: '進入系統',
    createAccount: '創建賬戶',
    joinTeam: '加入 QuickFind 團隊。',
    name: '名字',
    surname: '姓氏',
    country: '選擇地區',
    bday: '出生日期',
    employeeId: '員工 ID',
    email: '電子郵件',
    createPass: '創建密碼',
    confirmPass: '確認密碼',
    btnRegister: '申請註冊',
    fillForm: '填寫表格',
    passStrength: ['8+ 字元', '大寫字母', '數字', '符號'],
    panelTitle: '360° 平台',
    panelDesc: '從接收到發貨的全程控制。',
    features: ['可追溯性', '庫存預警', '審計', 'ISO 報告'],
    footer: '© 2026 QuickFind Inc.',
    privacy: '隱私政策',
    recoverTitle: '恢復帳戶',
    recoverDesc: '輸入您的註冊郵箱。',
    sendCode: '發送代碼',
    verifyTitle: '驗證',
    verifyDesc: '6 位數代碼已發送至您的郵箱。',
    verifyBtn: '驗證',
    wrongEmail: '郵箱錯誤？返回',
    newPassTitle: '新密碼',
    newPassDesc: '創建一個安全密碼。',
    resetBtn: '重置密碼',
    securityFooter: '© 2026 QuickFind Security System',
    otpError: '請填寫 6 位數代碼',
  },

  // --- JAPONÉS ---
  ja: {
    searchPlaceholder: 'サービスを検索...',
    welcome: 'ようこそ',
    subtitle: '在庫を効率的に管理します。',
    login: 'ログイン',
    register: '登録',
    userPlaceholder: 'ユーザーまたはメール',
    passwordPlaceholder: 'パスワード',
    rememberMe: 'ログイン状態を保持',
    forgotPass: 'パスワードをお忘れですか？',
    btnIngresar: 'システムに入る',
    createAccount: 'アカウント作成',
    joinTeam: 'QuickFindチームに参加。',
    name: '名',
    surname: '姓',
    country: '地域を選択',
    bday: '生年月日',
    employeeId: '社員ID',
    email: 'メールアドレス',
    createPass: 'パスワード作成',
    confirmPass: 'パスワード確認',
    btnRegister: '登録を申請',
    fillForm: 'フォームに入力',
    passStrength: ['8文字以上', '大文字', '数字', '記号'],
    panelTitle: '360° プラットフォーム',
    panelDesc: '入荷から出荷まで完全管理。',
    features: ['追跡可能性', '在庫アラート', '監査', 'ISOレポート'],
    footer: '© 2026 QuickFind Inc.',
    privacy: 'プライバシーポリシー',
    recoverTitle: 'アカウントの回復',
    recoverDesc: '登録したメールアドレスを入力してください。',
    sendCode: 'コードを送信',
    verifyTitle: '確認',
    verifyDesc: '6桁のコードがメールに送信されました。',
    verifyBtn: '確認する',
    wrongEmail: 'メールが間違っていますか？戻る',
    newPassTitle: '新しいパスワード',
    newPassDesc: '安全なパスワードを作成してください。',
    resetBtn: 'リセット',
    securityFooter: '© 2026 QuickFind Security System',
    otpError: '6桁のコードを入力してください',
  },

  // --- COREANO ---
  ko: {
    searchPlaceholder: '서비스 검색...',
    welcome: '환영합니다',
    subtitle: '재고를 효율적으로 관리하세요.',
    login: '로그인',
    register: '등록',
    userPlaceholder: '사용자 또는 이메일',
    passwordPlaceholder: '비밀번호',
    rememberMe: '로그인 유지',
    forgotPass: '비밀번호를 잊으셨나요?',
    btnIngresar: '시스템 입장',
    createAccount: '계정 생성',
    joinTeam: 'QuickFind 팀에 합류하세요.',
    name: '이름',
    surname: '성',
    country: '지역 선택',
    bday: '생년월일',
    employeeId: '사원 ID',
    email: '이메일 주소',
    createPass: '비밀번호 생성',
    confirmPass: '비밀번호 확인',
    btnRegister: '가입 신청',
    fillForm: '양식을 작성하세요',
    passStrength: ['8자 이상', '대문자', '숫자', '특수문자'],
    panelTitle: '360° 플랫폼',
    panelDesc: '입고에서 출고까지 완벽 제어.',
    features: ['추적성', '재고 알림', '감사', 'ISO 보고서'],
    footer: '© 2026 QuickFind Inc.',
    privacy: '개인정보 처리방침',
    recoverTitle: '계정 복구',
    recoverDesc: '등록된 이메일을 입력하세요.',
    sendCode: '코드 전송',
    verifyTitle: '확인',
    verifyDesc: '6자리 코드가 이메일로 전송되었습니다.',
    verifyBtn: '확인',
    wrongEmail: '이메일이 틀렸나요? 뒤로',
    newPassTitle: '새 비밀번호',
    newPassDesc: '안전한 비밀번호를 만드세요.',
    resetBtn: '재설정',
    securityFooter: '© 2026 QuickFind Security System',
    otpError: '6자리 코드를 입력하세요',
  },
};

// 3. LOGICA DETECCIÓN IDIOMA
const getBrowserLanguage = (): Language => {
  const browserLang = navigator.language;
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('it')) return 'it';
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang === 'zh-TW' || browserLang === 'zh-HK') return 'zh-TW';
  if (browserLang.startsWith('zh')) return 'zh-CN';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('ko')) return 'ko';
  return 'en'; // Default Inglés
};

// 4. CREACIÓN DEL CONTEXTO
const LanguageContext = createContext<any>(null);

// 5. PROVIDER
export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Recuperar idioma guardado o detectar
    const saved = localStorage.getItem('appLanguage') as Language;
    if (saved && translations[saved]) {
      setLanguage(saved);
    } else {
      setLanguage(getBrowserLanguage());
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('appLanguage', lang);
  };

  // Función traductora
  const t = (key: string) => {
    const text = translations[language]?.[key];
    return text || key; // Retorna la llave si no existe traducción
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 6. HOOK
export const useLanguage = () => useContext(LanguageContext);
