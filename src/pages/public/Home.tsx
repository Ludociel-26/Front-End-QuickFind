// FIX: Quitamos "React" de la importación
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Search,
  ChevronDown,
  Code,
  Terminal,
  Play,
  Shield,
  Zap,
  CheckCircle2,
  Lock,
  GitPullRequest,
} from 'lucide-react';

// --- CONFIGURACIÓN DE ANIMACIONES ---

// Animación de flotación continua (bucle infinito)
// FIX: Tipamos explícitamente como "any" para saltar la validación estricta de framer-motion
const floatLoop: any = {
  y: [-10, 10, -10],
  rotate: [0, 5, -5, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

// Animación de surgimiento (La "Invocación" desde abajo)
// FIX: Tipamos el retorno de la función como "any"
const surgeVariant = (delay: number, xOffset: number = 0): any => ({
  hidden: {
    y: 300,
    x: xOffset,
    opacity: 0,
    scale: 0.4,
  },
  visible: {
    y: 0,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      delay: delay,
    },
  },
});

// --- COMPONENTES UI ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0d1117]/80 backdrop-blur-xl border-b border-white/10 py-3' : 'bg-transparent py-6'}`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between text-white">
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white/70 transition-colors">
            <svg
              height="32"
              viewBox="0 0 16 16"
              width="32"
              className="fill-current"
            >
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
            </svg>
          </a>
          <div className="hidden md:flex gap-6 font-semibold text-[15px]">
            {['Product', 'Solutions', 'Open Source', 'Pricing'].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-gray-300 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center bg-[#24292f] border border-gray-600 rounded-md px-2 py-1 transition-all focus-within:border-white focus-within:w-64 w-56">
            <Search size={14} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search or jump to..."
              className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500 h-6"
            />
            <span className="border border-gray-600 rounded px-1.5 text-[10px] text-gray-400 ml-1">
              /
            </span>
          </div>
          <a
            href="/login"
            className="text-sm font-semibold hover:text-gray-300 px-2"
          >
            Sign in
          </a>
          <a
            href="/login"
            className="border border-white/70 rounded-md px-3 py-1.5 text-sm font-semibold hover:border-white hover:bg-white/10 transition-all"
          >
            Sign up
          </a>
        </div>
      </div>
    </nav>
  );
};

// --- COMPONENTE: MASCOTAS Y HAZ DE LUZ ---
const MascotsAndGlow = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible">
      {/* 1. EL HAZ DE LUZ CENTRAL (THE BEAM) */}
      <motion.div
        initial={{ height: '0%', opacity: 0 }}
        animate={{ height: '130%', opacity: 0.8 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[600px] bg-gradient-to-t from-[#7c3aed]/40 via-[#3b82f6]/10 to-transparent blur-[80px] mix-blend-screen"
      />

      {/* Luz focal en la base */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[300px] h-[100px] bg-[#a855f7]/50 blur-[60px] rounded-full mix-blend-screen"
      />

      {/* 2. ESTRELLAS / PARTÍCULAS QUE SUBEN */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ y: 600, x: (Math.random() - 0.5) * 300, opacity: 0 }}
          animate={{ y: -200, opacity: [0, 1, 0] }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 1.5,
            ease: 'easeOut',
          }}
          className="absolute bottom-0 left-1/2 w-1 h-1 bg-white rounded-full blur-[1px] shadow-[0_0_10px_white]"
        />
      ))}

      {/* 3. LOS ELEMENTOS FLOTANTES */}
      <div className="relative w-full max-w-[1400px] mx-auto h-full">
        {/* -- OCTOCAT (Izquierda) -- */}
        <motion.div
          variants={surgeVariant(0.2, 150)}
          initial="hidden"
          animate="visible"
          className="absolute top-[28%] left-[5%] lg:left-[8%] w-32 h-32 md:w-40 md:h-40 z-10"
        >
          <motion.div animate={floatLoop} className="w-full h-full">
            <div className="w-full h-full rounded-[2rem] bg-gradient-to-br from-[#6366f1]/40 to-[#3b82f6]/10 backdrop-blur-md border border-white/20 shadow-[0_0_60px_rgba(99,102,241,0.3)] relative overflow-hidden transform rotate-12">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20"></div>
              {/* Ojos Robot */}
              <div className="absolute top-[35%] left-[25%] flex gap-4">
                <div className="w-3 h-3 bg-cyan-300 rounded-full shadow-[0_0_15px_cyan] animate-pulse"></div>
                <div className="w-3 h-3 bg-cyan-300 rounded-full shadow-[0_0_15px_cyan] animate-pulse"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* -- ESFERA (Arriba Derecha) -- */}
        <motion.div
          variants={surgeVariant(0.4, -100)}
          initial="hidden"
          animate="visible"
          className="absolute top-[18%] right-[5%] lg:right-[15%] w-20 h-20 md:w-28 md:h-28 z-10"
        >
          <motion.div animate={floatLoop} className="w-full h-full">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-[#ec4899]/40 to-[#db2777]/10 backdrop-blur-md border border-white/20 shadow-[0_0_50px_rgba(236,72,153,0.3)] relative">
              <div className="absolute top-3 right-5 w-6 h-6 bg-white/30 rounded-full blur-md"></div>
            </div>
          </motion.div>
        </motion.div>

        {/* -- PATO (Abajo Derecha) -- */}
        <motion.div
          variants={surgeVariant(0.6, -120)}
          initial="hidden"
          animate="visible"
          className="absolute top-[55%] right-[8%] lg:right-[10%] w-24 h-24 md:w-32 md:h-32 z-10"
        >
          <motion.div animate={floatLoop} className="w-full h-full">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-[#f59e0b]/40 to-[#d97706]/10 backdrop-blur-md border border-white/20 shadow-[0_0_40px_rgba(245,158,11,0.3)] transform -rotate-[20deg]">
              <div className="absolute bottom-3 -left-1 w-6 h-6 bg-orange-500/50 rounded-full blur-sm"></div>
              <div className="absolute top-1/2 -right-2 w-4 h-4 bg-orange-500/80 rounded-full"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// --- COMPONENTE: EDITOR HERO ---
const HeroEditor = () => {
  return (
    <motion.div
      initial={{ y: 200, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className="relative w-full max-w-[1248px] mx-auto mt-20 z-20 perspective-[2000px]"
    >
      {/* GLOW TRASERO */}
      <div className="absolute -inset-[1px] bg-gradient-to-r from-[#7c3aed] via-[#2563eb] to-[#db2777] rounded-2xl blur-sm opacity-50"></div>

      {/* VENTANA PRINCIPAL */}
      <div className="relative bg-[#0d1117]/40 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[650px]">
        {/* Barra Superior Ventana */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-[#161b22]/40">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]/80"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]/80"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]/80"></div>
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-md border border-white/10 bg-[#0d1117]/30 text-xs text-gray-400 font-mono">
            <Code size={12} className="text-blue-400" />
            mona-cat/sky-walker-game
          </div>
        </div>

        {/* Contenido Interior */}
        <div className="flex flex-1 overflow-hidden">
          {/* Panel Izquierdo (Código) */}
          <div className="flex-1 p-8 font-mono text-[15px] leading-8 text-gray-300 relative">
            <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-[#0d1117]/30 to-transparent z-10"></div>
            <div className="flex gap-6">
              <div className="flex flex-col text-right text-gray-600 select-none w-8">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <div className="flex-1">
                <p>
                  <span className="text-[#ff7b72]">import</span>{' '}
                  <span className="text-[#d2a8ff]">kaboom</span>{' '}
                  <span className="text-[#ff7b72]">from</span>{' '}
                  <span className="text-[#a5d6ff]">"kaboom"</span>;
                </p>
                <p className="mt-4">
                  <span className="text-[#8b949e]">// Initialize context</span>
                </p>
                <p>
                  <span className="text-[#d2a8ff]">kaboom</span>();
                </p>
                <p className="mt-4">
                  <span className="text-[#8b949e]">// Load assets</span>
                </p>
                <p>
                  <span className="text-[#d2a8ff]">loadSprite</span>(
                  <span className="text-[#a5d6ff]">"bean"</span>,{' '}
                  <span className="text-[#a5d6ff]">"sprites/bean.png"</span>);
                </p>
                <p>
                  <span className="text-[#d2a8ff]">loadSprite</span>(
                  <span className="text-[#a5d6ff]">"ghosty"</span>,{' '}
                  <span className="text-[#a5d6ff]">"sprites/ghosty.png"</span>);
                </p>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ delay: 2, duration: 0.8 }}
                  className="mt-6 relative"
                >
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#238636]"></div>
                  <p className="text-gray-400 opacity-60">
                    <span className="text-[#d2a8ff]">const</span> player ={' '}
                    <span className="text-[#d2a8ff]">add</span>([
                    <br />
                    &nbsp;&nbsp;<span className="text-[#d2a8ff]">sprite</span>(
                    <span className="text-[#a5d6ff]">"bean"</span>),
                    <br />
                    &nbsp;&nbsp;<span className="text-[#d2a8ff]">pos</span>(80,
                    40),
                    <br />
                    &nbsp;&nbsp;<span className="text-[#d2a8ff]">area</span>(),
                    <br />
                    ]);
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Panel Derecho (Chat Copilot) */}
          <div className="hidden lg:flex w-[380px] border-l border-white/10 bg-[#161b22]/20 backdrop-blur-md flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between text-white text-sm font-semibold">
              <div className="flex items-center gap-2">
                <Terminal size={14} /> GitHub Copilot
              </div>
            </div>
            <div className="flex-1 p-5 space-y-4">
              <div className="self-end bg-[#1f6feb] text-white p-3 rounded-xl rounded-tr-sm text-sm shadow-lg ml-8">
                How do I implement gravity for the player?
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="self-start bg-[#24292f]/80 border border-white/10 text-gray-300 p-4 rounded-xl rounded-tl-sm text-sm shadow-lg mr-4"
              >
                To add gravity, you can use the <code>body()</code> component in
                your player definition.
              </motion.div>
            </div>
            <div className="p-4 border-t border-white/10">
              <div className="relative">
                <input
                  className="w-full bg-[#0d1117]/50 border border-gray-600 rounded-lg py-2.5 px-4 text-sm text-white focus:border-blue-500 outline-none shadow-inner"
                  placeholder="Ask Copilot..."
                />
                <div className="absolute right-3 top-3 text-gray-500">
                  <Play size={14} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- SECCIONES DE CONTENIDO EXTRA ---

const Productivity = () => (
  <section className="py-32 bg-[#0d1117] relative z-10">
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1 rounded border border-green-500/50 text-green-400">
          <Zap size={20} />
        </div>
        <span className="text-xl font-medium text-white">Productivity</span>
      </div>
      <h2 className="text-5xl md:text-7xl font-bold text-white mb-16 max-w-4xl leading-tight">
        Accelerate your <span className="text-green-400">entire workflow</span>
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-[600px] bg-[#161b22] rounded-3xl border border-white/10 overflow-hidden relative group hover:border-green-500/50 transition-all duration-500">
          <div className="p-10 relative z-10">
            <h3 className="text-3xl font-bold text-white mb-2">
              GitHub Copilot
            </h3>
            <p className="text-xl text-gray-400">
              The world's most widely adopted AI developer tool.
            </p>
          </div>
          <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-green-900/20 to-transparent"></div>
          <div className="absolute top-1/2 left-10 right-10 bottom-0 bg-[#0d1117] rounded-t-xl border-t border-x border-white/10 p-6 shadow-2xl group-hover:-translate-y-4 transition-transform duration-500">
            <div className="h-3 w-1/3 bg-gray-700 rounded mb-4"></div>
            <div className="h-3 w-2/3 bg-green-500/40 rounded"></div>
          </div>
        </div>
        <div className="h-[600px] bg-[#161b22] rounded-3xl border border-white/10 overflow-hidden relative group hover:border-green-500/50 transition-all duration-500">
          <div className="p-10 relative z-10">
            <h3 className="text-3xl font-bold text-white mb-2">
              GitHub Actions
            </h3>
            <p className="text-xl text-gray-400">
              Automate your workflow from idea to production.
            </p>
          </div>
          <div className="absolute bottom-10 left-0 w-full flex justify-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-16 h-16 rounded-xl bg-[#238636]/20 border border-green-500/30 flex items-center justify-center text-green-400 backdrop-blur-sm"
              >
                <CheckCircle2 />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Security = () => (
  <section className="py-32 bg-[#0d1117] relative z-10">
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute top-40 left-0 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full"></div>
    </div>
    <div className="container mx-auto px-6 max-w-7xl relative">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1 rounded border border-blue-500/50 text-blue-400">
          <Shield size={20} />
        </div>
        <span className="text-xl font-medium text-white">Security</span>
      </div>
      <h2 className="text-5xl md:text-7xl font-bold text-white mb-16 max-w-4xl leading-tight">
        Built-in security{' '}
        <span className="text-blue-400">where found means fixed</span>
      </h2>
      <div className="bg-[#161b22] rounded-3xl border border-white/10 p-12 relative overflow-hidden group hover:border-blue-500/50 transition-colors duration-500">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 relative z-10">
            <h3 className="text-4xl font-bold text-white">
              GitHub Advanced Security
            </h3>
            <p className="text-xl text-gray-400">
              Use AI to find and fix vulnerabilities in your code while you
              write it.
            </p>
            <button className="text-blue-400 font-bold hover:underline flex items-center gap-2 text-lg">
              Explore GHAS <ChevronDown className="-rotate-90" size={18} />
            </button>
          </div>
          <div className="flex-1 w-full perspective-[1000px]">
            <div className="bg-[#0d1117] rounded-xl border border-white/10 p-6 shadow-2xl transform rotate-y-[-5deg] group-hover:rotate-y-0 transition-transform duration-700">
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <Lock size={14} /> Vulnerability Detected
                </span>
                <span className="text-xs text-gray-500">Just now</span>
              </div>
              <div className="h-2 w-full bg-gray-800 rounded mb-2"></div>
              <div className="h-2 w-3/4 bg-gray-800 rounded mb-6"></div>
              <div className="flex gap-3">
                <button className="flex-1 py-2 bg-blue-600 rounded-md text-white text-xs font-bold">
                  Fix with Copilot
                </button>
                <button className="flex-1 py-2 bg-gray-800 rounded-md text-gray-300 text-xs font-bold">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Collaboration = () => (
  <section className="py-32 bg-[#0d1117] relative border-b border-white/5 z-10">
    <div className="container mx-auto px-6 max-w-7xl">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-1 rounded border border-pink-500/50 text-pink-400">
          <GitPullRequest size={20} />
        </div>
        <span className="text-xl font-medium text-white">Collaboration</span>
      </div>
      <h2 className="text-5xl md:text-7xl font-bold text-white mb-16 max-w-4xl leading-tight">
        Work together, <span className="text-pink-400">achieve more</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Issues', desc: 'Plan and track work.' },
          { title: 'Discussions', desc: 'Collaborate outside the code.' },
          { title: 'Pull Requests', desc: 'Review code like a pro.' },
        ].map((card, i) => (
          <div
            key={i}
            className="h-80 bg-[#161b22] border border-white/10 rounded-2xl p-8 hover:border-pink-500/30 transition-colors"
          >
            <h3 className="text-2xl font-bold text-white mb-2">{card.title}</h3>
            <p className="text-gray-400">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- APP PRINCIPAL ---
export default function GitHubReplicaFinal() {
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 400], [0, 100]);
  const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="bg-[#0d1117] min-h-screen text-gray-400 font-sans selection:bg-purple-500/30 overflow-x-hidden">
      <Navbar />

      <section className="relative pt-48 pb-40 px-6">
        <MascotsAndGlow />

        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="container mx-auto text-center max-w-5xl relative z-10 mb-20"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm text-gray-300 mb-8 cursor-pointer hover:border-white/20 transition-colors">
            <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <span className="font-medium">
              GitHub Universe: Dive in to AI, security, and DevEx
            </span>
            <ChevronDown size={14} className="-rotate-90 text-gray-500" />
          </div>

          <h1 className="text-7xl md:text-[100px] font-medium tracking-tight text-white leading-[1.05] mb-8">
            The future of building <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-[#db2777] to-[#e11d48]">
              happens together
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Tools and trends evolve, but collaboration endures. With GitHub,
            developers, agents, and code come together on one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-lg mx-auto">
            <div className="flex-1 relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full py-3.5 px-4 rounded-md text-black font-semibold focus:ring-2 focus:ring-purple-500 outline-none h-12"
              />
            </div>
            <button className="px-8 py-3.5 rounded-md bg-[#238636] text-white font-bold hover:bg-[#2ea043] transition-colors whitespace-nowrap h-12 border border-white/10">
              Sign up for GitHub
            </button>
            <button className="px-8 py-3.5 rounded-md bg-[#6e40c9] text-white font-bold hover:bg-[#7c3aed] transition-colors whitespace-nowrap h-12 border border-purple-400/20">
              Start a free trial
            </button>
          </div>
        </motion.div>

        <HeroEditor />
      </section>

      <div className="py-24 border-y border-white/5 bg-[#0d1117] relative z-10">
        <div className="container mx-auto px-6">
          <p className="text-gray-500 mb-8 font-medium">
            Trusted by the world's leading organizations
          </p>
          <div className="flex flex-wrap justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
            <h3 className="text-2xl font-bold text-white">Stripe</h3>
            <h3 className="text-2xl font-bold text-white">Pinterest</h3>
            <h3 className="text-2xl font-bold text-white">Netflix</h3>
            <h3 className="text-2xl font-bold text-white">Telus</h3>
            <h3 className="text-2xl font-bold text-white">Ford</h3>
            <h3 className="text-2xl font-bold text-white">Mercedes-Benz</h3>
          </div>
        </div>
      </div>

      <Productivity />
      <Security />
      <Collaboration />

      <section className="py-40 bg-[#0d1117] text-center border-b border-white/10 relative z-10">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-10 max-w-5xl mx-auto tracking-tight">
          Millions of developers and businesses call GitHub home
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-xl mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 py-4 px-6 rounded-md border border-gray-600 bg-transparent text-white font-medium focus:border-white outline-none"
          />
          <button className="py-4 px-8 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors">
            Sign up for GitHub
          </button>
        </div>
      </section>

      <footer className="py-20 bg-[#0d1117] text-xs text-gray-500 relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between">
          <div className="mb-4 md:mb-0">
            <span className="block mb-2 text-gray-400">
              © 2026 GitHub, Inc.
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div>
              <h4 className="font-bold text-gray-300 mb-4">Product</h4>
              <ul className="space-y-2">
                <li>Features</li>
                <li>Security</li>
                <li>Team</li>
                <li>Enterprise</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-300 mb-4">Platform</h4>
              <ul className="space-y-2">
                <li>Developer API</li>
                <li>Partners</li>
                <li>Atom</li>
                <li>Electron</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-300 mb-4">Support</h4>
              <ul className="space-y-2">
                <li>Docs</li>
                <li>Community Forum</li>
                <li>Professional Services</li>
                <li>Status</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-300 mb-4">Company</h4>
              <ul className="space-y-2">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Press</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
