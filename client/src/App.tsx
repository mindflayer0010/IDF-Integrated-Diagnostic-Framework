import React, { useState } from 'react';
import Chat from './pages/Chat';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import BrandLogo from './components/BrandLogo';

export default function App(): React.ReactElement {
  const [tab, setTab] = useState<'home'|'chat'|'dash'>('home');
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="p-4 shadow bg-white sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo size={64} />
          <span className="sr-only">CareMate</span>
        </div>
        <nav className="space-x-2">
          <button className={`px-3 py-1 rounded btn-outline hover-tint ${tab==='home'?'active':''}`} onClick={()=>setTab('home')}>Home</button>
          <button className={`px-3 py-1 rounded btn-outline hover-tint ${tab==='chat'?'active':''}`} onClick={()=>setTab('chat')}>Triage</button>
          <button className={`px-3 py-1 rounded btn-outline hover-tint ${tab==='dash'?'active':''}`} onClick={()=>setTab('dash')}>Logs</button>
        </nav>
      </header>
      <main className="max-w-4xl mx-auto p-4">
        {tab==='home' ? (
          <Landing onStartTriage={()=>setTab('chat')} onViewLogs={()=>setTab('dash')} />
        ) : tab==='chat' ? (
          <Chat/>
        ) : (
          <Dashboard/>
        )}
      </main>
      <footer className="text-center text-xs text-zinc-500 p-4">For demonstration only. Not medical advice.</footer>
    </div>
  )
}
