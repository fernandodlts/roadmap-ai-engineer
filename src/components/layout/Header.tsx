import { useEffect, useState } from 'react';
import {
  BookOpen,
  Clock,
  Code2,
  FlaskConical,
  LayoutGrid,
  Map as MapIcon,
  Menu,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { NAV_TABS } from '../../data';
import type { RoadmapMetrics, TabId } from '../../types/roadmap';
import { formatClock } from '../../utils/audio';

interface HeaderProps {
  activeTab: TabId;
  metrics: RoadmapMetrics;
  timerRunning: boolean;
  timerRemainingSeconds: number;
  onNavigateTab: (tab: TabId) => void;
}

function NavIcon({ id }: { id: TabId }) {
  const cls = 'w-4 h-4 shrink-0';
  switch (id) {
    case 'dashboard':
      return <LayoutGrid className={cls} />;
    case 'roadmap':
      return <MapIcon className={cls} />;
    case 'projetos':
      return <Code2 className={cls} />;
    case 'biblioteca':
      return <BookOpen className={cls} />;
    case 'rotina':
      return <Clock className={cls} />;
    case 'ritmo':
      return <SlidersHorizontal className={cls} />;
  }
}

export function Header({
  activeTab,
  metrics,
  timerRunning,
  timerRemainingSeconds,
  onNavigateTab,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleSelect = (tab: TabId) => {
    setMobileMenuOpen(false);
    onNavigateTab(tab);
  };

  const isScheduleActive = activeTab === 'ritmo';

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Título */}
          <button
            type="button"
            onClick={() => handleSelect('dashboard')}
            className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-xl cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-cyan-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-5 h-5 text-slate-950" strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-extrabold tracking-tight text-white">
                  AI Engineer Roadmap
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {metrics.schedule.mode === 'free'
                  ? 'No seu ritmo'
                  : metrics.schedule.summaryLabel}{' '}
                • Python, RAG &amp; Agentes
              </p>
            </div>
          </button>

          {/* Abas Principais (Desktop) */}
          <nav
            role="tablist"
            aria-label="Navegação Principal"
            className="hidden xl:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shrink-0"
          >
            {NAV_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelect(tab.id)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                  }`}
                >
                  <NavIcon id={tab.id} />
                  <span>{tab.label}</span>
                  {tab.id === 'rotina' && timerRunning && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      {formatClock(timerRemainingSeconds)}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Botão Meu Ritmo + Indicador Resumido de Progresso + Menu Mobile */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => handleSelect('ritmo')}
              title="Personalizar horas por dia, dias da semana ou modo livre"
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border transition-colors cursor-pointer ${
                isScheduleActive
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:border-indigo-500/40'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Meu Ritmo</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelect('dashboard')}
              title="Progresso rumo ao Marco de Vagas (Fases 0 a 5)"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-colors cursor-pointer"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  metrics.milestone.isReady ? 'bg-emerald-400' : 'bg-cyan-400 animate-pulse'
                }`}
              />
              <div className="text-xs font-semibold text-slate-200 whitespace-nowrap">
                <span className="text-cyan-400 font-bold">{metrics.milestone.percent}%</span>
                <span className="text-slate-500 mx-1">•</span>
                <span className="text-slate-300">
                  {metrics.milestone.doneHours}/{metrics.milestone.totalHours}h
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
              className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden pb-4 pt-2 border-t border-slate-800/80">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5" role="tablist">
              {NAV_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleSelect(tab.id)}
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2.5 transition-all border cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <NavIcon id={tab.id} />
                      <span>{tab.label}</span>
                    </span>
                    {tab.id === 'rotina' && timerRunning && (
                      <span className="font-mono text-[11px] text-emerald-300">
                        {formatClock(timerRemainingSeconds)}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                type="button"
                role="tab"
                aria-selected={isScheduleActive}
                onClick={() => handleSelect('ritmo')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all border cursor-pointer ${
                  isScheduleActive
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-900 text-cyan-300 border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                <span>Personalizar Meu Ritmo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
