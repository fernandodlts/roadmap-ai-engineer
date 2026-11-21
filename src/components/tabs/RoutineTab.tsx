import { useMemo } from 'react';
import {
  Bell,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  SlidersHorizontal,
} from 'lucide-react';
import { CAREER_TIPS, ROUTINE_DAYS, TIMER_PRESETS } from '../../data';
import type {
  ReviewIntervalDays,
  RoadmapMetrics,
  RoadmapState,
  RoutineDayId,
  SpacedReviewQueue,
  TabId,
  TimerPreset,
  TimerPresetId,
  ToastVariant,
} from '../../types/roadmap';
import { formatClock } from '../../utils/audio';
import { formatHours } from '../../utils/metrics';
import { ActiveReviewHub } from '../routine/ActiveReviewHub';

interface TimerControlProps {
  presetId: TimerPresetId;
  activePreset: TimerPreset;
  remainingSeconds: number;
  isRunning: boolean;
  finishedBanner: boolean;
  progressPercent: number;
  selectPreset: (presetId: TimerPresetId, autoStart?: boolean) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

interface RoutineTabProps {
  state: RoadmapState;
  metrics: RoadmapMetrics;
  spacedReviewQueue: SpacedReviewQueue;
  timer: TimerControlProps;
  onToggleWeeklyDay: (dayId: RoutineDayId) => void;
  onStartNewWeek: () => void;
  onCompleteTaskReview: (taskId: string, interval: ReviewIntervalDays) => void;
  onToggleTodayDailyReview: () => void;
  onNavigateTab: (tab: TabId) => void;
  onOpenPhase: (phaseId: number) => void;
  showToast: (message: string, variant?: ToastVariant) => void;
}

const TIP_ACCENT: Record<'cyan' | 'indigo' | 'emerald' | 'amber', string> = {
  cyan: 'text-cyan-400',
  indigo: 'text-indigo-300',
  emerald: 'text-emerald-400',
  amber: 'text-amber-300',
};

export function RoutineTab({
  state,
  metrics,
  spacedReviewQueue,
  timer,
  onToggleWeeklyDay,
  onStartNewWeek,
  onCompleteTaskReview,
  onToggleTodayDailyReview,
  onNavigateTab,
  onOpenPhase,
  showToast,
}: RoutineTabProps) {
  const scheduleSummary = metrics.schedule;
  const isFree = state.studySchedule.mode === 'free';

  const visibleDays = useMemo(() => {
    if (isFree) return ROUTINE_DAYS;
    return ROUTINE_DAYS.filter((d) => state.studySchedule.studyDays.includes(d.weekday));
  }, [isFree, state.studySchedule.studyDays]);

  const daysDone = visibleDays.filter((d) => Boolean(state.weeklyDays[d.id])).length;
  const doneWeekHours = Number((daysDone * state.studySchedule.hoursPerDay).toFixed(1));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cronômetro Interativo de Sessão */}
        <section className="lg:col-span-7 rounded-2xl p-5 sm:p-6 bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {isFree
                  ? 'Sessão no Seu Ritmo'
                  : `Sessão Diária (${formatHours(scheduleSummary.hoursPerDay)}/dia)`}
              </span>
              <h1 className="text-lg sm:text-xl font-extrabold text-white">
                Cronômetro Anti-Esquecimento
              </h1>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              15m Revisão + 30m Teoria + 75m Código
            </span>
          </div>

          {/* Presets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TIMER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => timer.selectPreset(preset.id)}
                className={`p-3 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                  timer.presetId === preset.id
                    ? 'bg-indigo-600/20 text-white border-indigo-500 shadow-md shadow-indigo-950/40'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Display Central do Timer */}
          <div className="rounded-2xl p-6 bg-slate-950/90 border border-slate-800 text-center space-y-4">
            <p className="text-xs text-slate-400">{timer.activePreset.desc}</p>

            <div
              className={`text-5xl sm:text-6xl font-black font-mono tracking-tight tabular-nums ${
                timer.finishedBanner
                  ? 'text-emerald-400'
                  : timer.isRunning
                    ? 'text-cyan-400'
                    : 'text-white'
              }`}
            >
              {formatClock(timer.remainingSeconds)}
            </div>

            {timer.finishedBanner && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <Bell className="w-3.5 h-3.5" />
                <span>Bloco finalizado! Faça uma pausa rápida ou avance para o próximo bloco.</span>
              </div>
            )}

            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden max-w-md mx-auto">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${timer.progressPercent}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={timer.isRunning ? timer.pause : timer.start}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
                  timer.isRunning
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{timer.isRunning ? 'Pausar' : 'Iniciar'}</span>
              </button>
              <button
                type="button"
                onClick={timer.reset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Resetar</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Sincronizado com relógio real — continua preciso mesmo com o VS Code ou outra aba em
              primeiro plano.
            </p>
          </div>
        </section>

        {/* Tracker Semanal (Adaptado ao ritmo personalizado) */}
        <section className="lg:col-span-5 rounded-2xl p-5 sm:p-6 bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between gap-5">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {isFree ? 'Registro Livre' : 'Consistência'}
                </span>
                <h2 className="text-lg font-extrabold text-white">
                  {isFree
                    ? 'Dias Estudados (Livre)'
                    : `Tracker Semanal (${scheduleSummary.daysShortLabel})`}
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigateTab('ritmo')}
                  className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Personalizar dias e horas</span>
                </button>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-center shrink-0">
                <div className="text-base font-black text-emerald-400">
                  {state.consistentWeeks}
                </div>
                <div className="text-[10px] font-semibold text-emerald-200">Sem. consistentes</div>
              </div>
            </div>

            <div className="space-y-2">
              {visibleDays.map((day) => {
                const done = Boolean(state.weeklyDays[day.id]);
                return (
                  <label
                    key={day.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer select-none transition-colors ${
                      done
                        ? 'bg-emerald-950/25 border-emerald-500/40'
                        : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => onToggleWeeklyDay(day.id)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-900 accent-emerald-500 cursor-pointer shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`text-xs sm:text-sm font-bold ${
                          done ? 'text-emerald-300 line-through' : 'text-white'
                        }`}
                      >
                        {day.name}
                      </div>
                      <div className="text-[11px] text-slate-400">{day.focus}</div>
                    </div>
                    <span
                      className={`text-[11px] font-bold ${done ? 'text-emerald-400' : 'text-slate-500'}`}
                    >
                      {isFree ? 'Livre' : formatHours(scheduleSummary.hoursPerDay)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              {isFree ? (
                <>
                  Semana atual: <strong className="text-white">{daysDone} dia(s)</strong> registrado(s)
                </>
              ) : (
                <>
                  Semana atual:{' '}
                  <strong className="text-white">
                    {daysDone}/{visibleDays.length} dias
                  </strong>{' '}
                  ({formatHours(doneWeekHours)})
                </>
              )}
            </span>
            <button
              type="button"
              onClick={onStartNewWeek}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Nova Semana</span>
            </button>
          </div>
        </section>
      </div>

      {/* Hub Combinado: Revisão Espaçada (D+1/D+7/D+21) + Prática Infinita (Prompt IA + Plataformas) */}
      <ActiveReviewHub
        completedTasks={state.completedTasks}
        dailyReviewDates={state.dailyReviewDates}
        metrics={metrics}
        spacedReviewQueue={spacedReviewQueue}
        onCompleteTaskReview={onCompleteTaskReview}
        onToggleTodayDailyReview={onToggleTodayDailyReview}
        onStartReviewTimer={() => timer.selectPreset('review', true)}
        onOpenPhase={onOpenPhase}
        showToast={showToast}
      />

      {/* Guia Rápido de Estratégia para Conquistar a Vaga */}
      <section className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
            ESTRATÉGIA DE CARREIRA
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-white">
            Guia Rápido para Conquistar sua Vaga como AI Engineer
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs leading-relaxed">
          {CAREER_TIPS.map((tip) => (
            <div
              key={tip.id}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-1.5"
            >
              <div className={`font-bold ${TIP_ACCENT[tip.accent]}`}>{tip.title}</div>
              <p className="text-slate-300">
                {tip.body}
                {tip.highlight && <strong className="text-white">{tip.highlight}</strong>}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
