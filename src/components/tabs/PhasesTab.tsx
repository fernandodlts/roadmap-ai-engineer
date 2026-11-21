import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  NotebookPen,
} from 'lucide-react';
import { PHASES, RESOURCES, WEEKS } from '../../data';
import type { RoadmapMetrics, RoadmapState } from '../../types/roadmap';

interface PhasesTabProps {
  activePhaseId: number;
  state: RoadmapState;
  metrics: RoadmapMetrics;
  onSelectPhase: (phaseId: number) => void;
  onToggleTask: (taskId: string) => void;
  onToggleWholeWeek: (weekNum: number) => void;
  onUpdateWeekNote: (weekNum: number, value: string) => void;
}

export function PhasesTab({
  activePhaseId,
  state,
  metrics,
  onSelectPhase,
  onToggleTask,
  onToggleWholeWeek,
  onUpdateWeekNote,
}: PhasesTabProps) {
  const [expandedMaterials, setExpandedMaterials] = useState<Record<number, boolean>>({});

  const currentPhase = PHASES.find((p) => p.id === activePhaseId) ?? PHASES[0];
  const phaseStat = metrics.phaseStats[currentPhase.id];
  const phaseWeeks = WEEKS.filter((w) => w.phaseId === currentPhase.id);
  const phaseResources = RESOURCES.filter((r) => r.phaseId === currentPhase.id);

  const hasPrev = currentPhase.id > 0;
  const hasNext = currentPhase.id < PHASES.length - 1;

  const toggleMaterials = (weekNum: number) => {
    setExpandedMaterials((prev) => ({
      ...prev,
      [weekNum]: !prev[weekNum],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Barra de Sub-abas das 8 Fases */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-3">
        <div
          role="tablist"
          aria-label="Fases do Roadmap"
          className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5"
        >
          {PHASES.map((phase) => {
            const isActive = phase.id === currentPhase.id;
            const ps = metrics.phaseStats[phase.id];
            const isDone = ps.percent === 100;
            return (
              <button
                key={phase.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectPhase(phase.id)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg shadow-indigo-600/25'
                    : isDone
                      ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30 hover:border-emerald-400'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                }`}
              >
                <span>
                  {phase.code}
                  {phase.isMilestoneTarget ? ' 🎯' : ''}
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {ps.percent}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Cabeçalho da Fase Selecionada */}
      <section
        className={`rounded-2xl p-5 sm:p-6 border ${
          currentPhase.isMilestoneTarget
            ? 'bg-gradient-to-r from-indigo-950/70 via-slate-900 to-emerald-950/50 border-indigo-500/50'
            : 'bg-slate-900/90 border-slate-800'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-extrabold">
                {currentPhase.code}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {currentPhase.weeksLabel} • {currentPhase.hours}h totais
              </span>
              {currentPhase.isMilestoneTarget && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                  🎯 MARCO PARA APLICAR ÀS VAGAS
                </span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">{currentPhase.title}</h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentPhase.objective}
            </p>
          </div>

          <div className="shrink-0 md:w-56 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">Progresso da Fase</span>
              <span className="font-extrabold text-cyan-400">{phaseStat.percent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden mb-1.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${phaseStat.percent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400">
              {phaseStat.doneHours}h de {phaseStat.totalHours}h concluídas
            </div>
          </div>
        </div>
      </section>

      {/* Semanas da Fase Selecionada */}
      <div className="space-y-5">
        {phaseWeeks.map((weekObj) => {
          const weekDoneHours = weekObj.tasks.reduce(
            (acc, t) => acc + (state.completedTasks[t.id] ? t.hours : 0),
            0,
          );
          const weekTotalHours = weekObj.tasks.reduce((acc, t) => acc + t.hours, 0);
          const weekPct = weekTotalHours > 0 ? Math.round((weekDoneHours / weekTotalHours) * 100) : 0;
          const allWeekDone = weekDoneHours === weekTotalHours;
          const materialsOpen = Boolean(expandedMaterials[weekObj.week]);
          const savedNote = state.weekNotes[weekObj.week] ?? '';

          return (
            <article
              key={weekObj.week}
              className={`rounded-2xl bg-slate-900/90 border overflow-hidden transition-colors ${
                allWeekDone
                  ? 'border-emerald-500/40'
                  : weekObj.isMilestoneWeek
                    ? 'border-indigo-500/60 shadow-xl shadow-indigo-950/30'
                    : 'border-slate-800'
              }`}
            >
              {weekObj.isMilestoneWeek && (
                <div className="px-5 py-2 bg-gradient-to-r from-indigo-600 via-cyan-600 to-emerald-600 text-xs font-bold text-white flex items-center justify-between gap-2">
                  <span>
                    🎯 SEMANA DO MARCO: Ao concluir esta semana, comece a aplicar para a sua vaga!
                  </span>
                  <span className="hidden sm:inline shrink-0">180h acumuladas</span>
                </div>
              )}

              <div className="p-5 sm:p-6 space-y-4">
                {/* Topo da Semana */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/90">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 text-cyan-300 border border-slate-700 text-xs font-extrabold">
                        SEMANA {weekObj.week}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {weekDoneHours}h / {weekTotalHours}h ({weekPct}%)
                      </span>
                      {weekObj.isProjectWeek && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                          🚀 Entrega de Projeto
                        </span>
                      )}
                      {allWeekDone && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                          ✓ Semana Concluída
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{weekObj.title}</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => onToggleWholeWeek(weekObj.week)}
                    className={`self-start sm:self-center shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border cursor-pointer ${
                      allWeekDone
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                        : 'bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border-indigo-500/40'
                    }`}
                  >
                    {!allWeekDone && <Check className="w-3.5 h-3.5" />}
                    <span>{allWeekDone ? 'Desmarcar semana' : 'Concluir semana'}</span>
                  </button>
                </div>

                {/* Lista de Tópicos */}
                <div className="space-y-2.5">
                  {weekObj.tasks.map((task) => {
                    const checked = Boolean(state.completedTasks[task.id]);
                    return (
                      <label
                        key={task.id}
                        className={`group flex items-start gap-3.5 p-3.5 rounded-xl border transition-colors cursor-pointer select-none ${
                          checked
                            ? 'bg-emerald-950/20 border-emerald-500/30'
                            : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800/90'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggleTask(task.id)}
                          className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-900 accent-indigo-500 cursor-pointer shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-sm leading-relaxed ${
                              checked ? 'line-through text-slate-400' : 'text-slate-100'
                            }`}
                          >
                            {task.text}
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/80">
                            {task.tag}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                              checked
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                            }`}
                          >
                            [{task.hours}h]
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Seção Expansível: Materiais Recomendados */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => toggleMaterials(weekObj.week)}
                    aria-expanded={materialsOpen}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/70 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      <span>
                        Materiais recomendados ({phaseResources.length} recursos da{' '}
                        {currentPhase.code})
                      </span>
                    </span>
                    <span className="inline-flex items-center gap-1 text-cyan-400">
                      <span>{materialsOpen ? 'Ocultar' : 'Ver materiais'}</span>
                      {materialsOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  {materialsOpen && (
                    <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {phaseResources.map((res) => (
                        <a
                          key={res.id}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-xs transition-colors group"
                        >
                          <div className="min-w-0">
                            <span className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                              {res.title}
                            </span>
                            <span className="text-slate-500 ml-1.5">— {res.source}</span>
                          </div>
                          <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-semibold">
                            <span>{res.type}</span>
                            <ExternalLink className="w-3 h-3" />
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {/* Anotações Pessoais */}
                <div className="pt-1">
                  <label
                    htmlFor={`week-note-${weekObj.week}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1.5"
                  >
                    <NotebookPen className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Anotações pessoais da Semana {weekObj.week} (salvo automaticamente)</span>
                  </label>
                  <textarea
                    id={`week-note-${weekObj.week}`}
                    rows={2}
                    value={savedNote}
                    onChange={(e) => onUpdateWeekNote(weekObj.week, e.target.value)}
                    placeholder="Anote aprendizados, dúvidas de código, links úteis ou rascunho do seu post de sábado no LinkedIn..."
                    className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:outline-none p-3 text-xs sm:text-sm text-slate-200 placeholder-slate-500 transition-colors"
                  />
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Rodapé de Navegação entre Fases */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          type="button"
          disabled={!hasPrev}
          onClick={() => hasPrev && onSelectPhase(currentPhase.id - 1)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
            hasPrev
              ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 cursor-pointer'
              : 'bg-slate-900/40 text-slate-600 border-slate-800/60 cursor-not-allowed'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Fase Anterior</span>
        </button>

        <span className="text-xs text-slate-500 hidden sm:inline">
          Visualizando {currentPhase.code} de {PHASES.length - 1}
        </span>

        <button
          type="button"
          disabled={!hasNext}
          onClick={() => hasNext && onSelectPhase(currentPhase.id + 1)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
            hasNext
              ? 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-600/20 cursor-pointer'
              : 'bg-slate-900/40 text-slate-600 border-slate-800/60 cursor-not-allowed'
          }`}
        >
          <span>Próxima Fase</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
