import React, { Suspense, useState } from 'react';
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

export default function App(): React.ReactElement {
  const [tab, setTab] = useState<'home'|'chat'|'dash'|'about'|'docs'|'inspo'>('home');
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="p-4 shadow bg-white sticky top-0 z-10 flex items-center justify-between" role="banner">
        <div className="flex items-center gap-3">
          <BrandLogo size={64} />
          <span className="text-xl font-semibold tracking-tight text-gradient select-none">CareMate</span>
        </div>
        <nav className="space-x-2" role="tablist" aria-label="Primary">
          <button
            role="tab"
            aria-selected={tab==='home'}
            aria-controls="panel-home"
            className={`px-3 py-1 rounded btn-outline hover-tint ${tab==='home'?'active':''}`}
            onClick={()=>setTab('home')}
          >Home</button>
          <button
            role="tab"
            aria-selected={tab==='chat'}
            aria-controls="panel-chat"
            className={`px-3 py-1 rounded btn-outline hover-tint ${tab==='chat'?'active':''}`}
            onClick={()=>setTab('chat')}
          >Triage</button>
          <button
            role="tab"
            aria-selected={tab==='dash'}
            aria-controls="panel-dash"
            className={`px-3 py-1 rounded btn-outline hover-tint ${tab==='dash'?'active':''}`}
            onClick={()=>setTab('dash')}
          >Logs</button>
          <button
            role="tab"
            aria-selected={tab==='about'}
            aria-controls="panel-about"
            className={`px-3 py-1 rounded btn-outline hover-tint ${tab==='about'?'active':''}`}
            onClick={()=>setTab('about')}
          >About</button>
          <button
            role="tab"
            aria-selected={tab==='docs'}
            aria-controls="panel-docs"
            className={`px-3 py-1 rounded btn-outline hover-tint ${tab==='docs'?'active':''}`}
            onClick={()=>setTab('docs')}
          >Docs</button>
          <button
            role="tab"
            aria-selected={tab==='inspo'}
            aria-controls="panel-inspo"
            className={`px-3 py-1 rounded btn-outline hover-tint ${tab==='inspo'?'active':''}`}
            onClick={()=>setTab('inspo')}
          >Inspire</button>
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
