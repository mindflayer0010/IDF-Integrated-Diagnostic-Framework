import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Activity, AlertCircle, ArrowRight } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import Reveal from '../components/Reveal';
import HeroScene from '../components/HeroScene';
import { cn } from '../lib/utils';

export default function Landing({ onStartTriage, onViewLogs }: { onStartTriage: () => void; onViewLogs: () => void }) {
  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col gap-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="absolute inset-0 z-0">
          <Suspense fallback={<div className="w-full h-full bg-slate-50" />}>
            <HeroScene />
          </Suspense>
        </div>

        <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-24 lg:px-16 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <Reveal>
              <div className="flex items-center gap-4 mb-4">
                <BrandLogo size={64} />
                <div className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-semibold tracking-wide uppercase border border-brand-primary/20">
                  AI-Powered Triage
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1]">
                Smart Healthcare <br />
                <span className="text-gradient">Simplified.</span>
              </h1>
            </Reveal>

            <Reveal delay={100}>
              <p className="text-lg sm:text-xl text-slate-600 max-w-lg leading-relaxed">
                Fast, consistent, and secure patient triage. Enter symptoms, get instant urgency scores, and streamline your medical workflow.
              </p>
            </Reveal>

            <Reveal delay={200}>
              <div className="flex flex-wrap gap-4 mt-4">
                <button onClick={onStartTriage} className="btn-primary group">
                  Start Triage
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={onViewLogs} className="btn-secondary">
                  View Logs
                </button>
              </div>
            </Reveal>
          </div>

          <div className="lg:justify-self-end w-full max-w-md">
            <Reveal delay={300}>
              <motion.div
                whileHover={{ y: -5 }}
                className="glass-card p-6 sm:p-8 space-y-6"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="font-semibold text-slate-900">System Status</span>
                  <span className="flex items-center gap-2 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Operational
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 flex flex-col items-center text-center gap-2">
                    <Stethoscope className="w-8 h-8 text-sky-600" />
                    <span className="text-sm font-medium text-slate-700">Symptom Analysis</span>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center text-center gap-2">
                    <Activity className="w-8 h-8 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">Urgency Scoring</span>
                  </div>
                </div>

                <div className="text-xs text-slate-500 text-center pt-2">
                  Securely processed on compliant servers.
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: 'Intelligent Triage',
            desc: 'Advanced algorithms analyze symptoms to predict urgency with high accuracy.',
            icon: Stethoscope,
            color: 'text-sky-500'
          },
          {
            title: 'Real-time Dashboard',
            desc: 'Monitor patient influx and case severity in real-time for better resource allocation.',
            icon: Activity,
            color: 'text-emerald-500'
          },
          {
            title: 'Secure & Private',
            desc: 'Enterprise-grade security ensures patient data remains protected and confidential.',
            icon: AlertCircle,
            color: 'text-purple-500'
          },
        ].map((f, i) => (
          <Reveal key={f.title} delay={i * 100}>
            <div className="glass-card p-6 h-full hover:bg-white/80">
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center bg-slate-50 mb-4", f.color)}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </section>
    </div>
  );
}
