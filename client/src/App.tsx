import React, { Suspense, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Home, Stethoscope, FileText, Info, Sparkles, Activity } from 'lucide-react';
import BrandLogo from './components/BrandLogo';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import ThreeBackground from './components/ThreeBackground';
import { cn } from './lib/utils';

const Landing = React.lazy(() => import('./pages/Landing'));
const Chat = React.lazy(() => import('./pages/Chat'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const About = React.lazy(() => import('./pages/About'));
const Docs = React.lazy(() => import('./pages/Docs'));
const Inspiration = React.lazy(() => import('./pages/Inspiration'));

export default function App(): React.ReactElement {
  const [tab, setTab] = useState<'home' | 'chat' | 'dash' | 'about' | 'docs' | 'inspo'>('home');

  const tabs = [
    { key: 'home', label: 'Home', icon: Home },
    { key: 'chat', label: 'Triage', icon: Stethoscope },
    { key: 'dash', label: 'Logs', icon: Activity },
    { key: 'about', label: 'About', icon: Info },
    { key: 'docs', label: 'Docs', icon: FileText },
    { key: 'inspo', label: 'Inspire', icon: Sparkles },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-primary/20 selection:text-brand-primary">
      <ThreeBackground />

      {/* Floating Navigation Dock */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit">
        <nav className="glass p-2 rounded-full flex items-center gap-1 shadow-lg shadow-black/5 ring-1 ring-white/50">
          <div className="px-4 flex items-center gap-2 border-r border-slate-200/50 mr-2">
            <BrandLogo size={24} />
            <span className="font-bold tracking-tight text-slate-800 hidden sm:inline-block">CareMate</span>
          </div>

          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200",
                tab === t.key ? "text-white" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
              )}
            >
              {tab === t.key && (
                <motion.div
                  layoutId="active-tab"
                  className="absolute inset-0 bg-brand-primary rounded-full shadow-md shadow-brand-primary/25"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <t.icon className="w-4 h-4" />
                <span className="hidden md:inline">{t.label}</span>
              </span>
            </button>
          ))}
        </nav>
      </header>

      <main className="pt-32 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
        <ErrorBoundary fallback={<div className="p-8 border border-red-100 rounded-2xl bg-red-50 text-red-800 text-center">Failed to load section. Please refresh.</div>}>
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[60vh]">
              <LoadingSpinner label="Loading..." />
            </div>
          }>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-full"
              >
                {tab === 'home' && <Landing onStartTriage={() => setTab('chat')} onViewLogs={() => setTab('dash')} />}
                {tab === 'chat' && <Chat />}
                {tab === 'dash' && <Dashboard />}
                {tab === 'about' && <About />}
                {tab === 'docs' && <Docs />}
                {tab === 'inspo' && <Inspiration />}
              </motion.div>
            </AnimatePresence>
          </Suspense>
        </ErrorBoundary>
      </main>

      <footer className="py-8 text-center text-sm text-slate-400">
        <p>© {new Date().getFullYear()} CareMate. For demonstration only.</p>
      </footer>
    </div>
  );
}
