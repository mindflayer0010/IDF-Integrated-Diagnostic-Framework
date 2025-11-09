import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import BrandLogo from './components/BrandLogo';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

const Landing = React.lazy(() => import('./pages/Landing'));
const Chat = React.lazy(() => import('./pages/Chat'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const About = React.lazy(() => import('./pages/About'));
const Docs = React.lazy(() => import('./pages/Docs'));
const Inspiration = React.lazy(() => import('./pages/Inspiration'));
import PageTransition from './components/PageTransition';
import { IconBook, IconChart, IconHome, IconInfo, IconSparkles, IconStethoscope } from './components/icons';

export default function App(): React.ReactElement {
  const [tab, setTab] = useState<'home'|'chat'|'dash'|'about'|'docs'|'inspo'>('home');
  const navRef = useRef<HTMLDivElement|null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [indicator, setIndicator] = useState<{x:number;width:number}>({ x: 0, width: 0 });

  const tabs: Array<{key: typeof tab, label: string, icon: React.ReactNode}> = useMemo(() => ([
    { key: 'home', label: 'Home', icon: <IconHome className="h-4 w-4" /> },
    { key: 'chat', label: 'Triage', icon: <IconStethoscope className="h-4 w-4" /> },
    { key: 'dash', label: 'Logs', icon: <IconChart className="h-4 w-4" /> },
    { key: 'about', label: 'About', icon: <IconInfo className="h-4 w-4" /> },
    { key: 'docs', label: 'Docs', icon: <IconBook className="h-4 w-4" /> },
    { key: 'inspo', label: 'Inspire', icon: <IconSparkles className="h-4 w-4" /> },
  ]), []);

  useEffect(() => {
    const update = () => {
      const container = navRef.current;
      const active = btnRefs.current[tab];
      if (!container || !active) return;
      const cRect = container.getBoundingClientRect();
      const aRect = active.getBoundingClientRect();
      const x = aRect.left - cRect.left;
      const width = aRect.width;
      setIndicator({ x, width });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [tab]);
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="p-4 shadow bg-white sticky top-0 z-10 flex items-center justify-between" role="banner">
        <div className="flex items-center gap-3">
          <BrandLogo size={64} />
          <span className="text-xl font-semibold tracking-tight text-gradient select-none">CareMate</span>
        </div>
        <nav className="fun-tabs" role="tablist" aria-label="Primary" ref={navRef}>
          <div
            className="indicator"
            style={{ transform: `translateX(${indicator.x}px)`, width: indicator.width }}
            aria-hidden
          />
          {tabs.map(t => (
            <button
              key={t.key}
              ref={(el) => { btnRefs.current[t.key] = el; }}
              role="tab"
              aria-selected={tab===t.key}
              aria-controls={`panel-${t.key}`}
              className="fun-tab flex items-center gap-2"
              onClick={()=>setTab(t.key)}
            >
              <span className="opacity-80">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        <ErrorBoundary fallback={<div className="p-4 border rounded bg-red-50 text-red-800">Failed to load section. Please try again.</div>}>
          <Suspense fallback={<LoadingSpinner label="Loading section…" /> }>
            {tab==='home' && (
              <section id="panel-home" role="tabpanel" aria-labelledby="home">
                <PageTransition>
                  <Landing onStartTriage={()=>setTab('chat')} onViewLogs={()=>setTab('dash')} />
                </PageTransition>
              </section>
            )}
            {tab==='chat' && (
              <section id="panel-chat" role="tabpanel" aria-labelledby="chat">
                <PageTransition>
                  <Chat />
                </PageTransition>
              </section>
            )}
            {tab==='dash' && (
              <section id="panel-dash" role="tabpanel" aria-labelledby="dash">
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              </section>
            )}
            {tab==='about' && (
              <section id="panel-about" role="tabpanel" aria-labelledby="about">
                <PageTransition>
                  <About />
                </PageTransition>
              </section>
            )}
            {tab==='docs' && (
              <section id="panel-docs" role="tabpanel" aria-labelledby="docs">
                <PageTransition>
                  <Docs />
                </PageTransition>
              </section>
            )}
            {tab==='inspo' && (
              <section id="panel-inspo" role="tabpanel" aria-labelledby="inspo">
                <PageTransition>
                  <Inspiration />
                </PageTransition>
              </section>
            )}
          </Suspense>
        </ErrorBoundary>
      </main>
      <footer className="text-center text-xs text-zinc-500 p-4">For demonstration only. Not medical advice.</footer>
    </div>
  )
}
