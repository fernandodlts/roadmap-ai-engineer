import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { WEEKDAYS_META } from '../../data';
import type {
  RoadmapMetrics,
  ScheduleMode,
  StudySchedule,
  TabId,
  ToastVariant,
  WeekdayIndex,
} from '../../types/roadmap';
import { formatHours } from '../../utils/metrics';

interface ScheduleTabProps {
  schedule: StudySchedule;
  metrics: RoadmapMetrics;
  onUpdateSchedule: (next: StudySchedule) => void;
  onResetSchedule: () => void;
  onNavigateTab: (tab: TabId) => void;
  showToast: (message: string, variant?: ToastVariant) => void;
}

const HOUR_PRESETS = [1, 1.5, 2, 3, 4, 6];

const DAY_PRESETS: Array<{ label: string; days: WeekdayIndex[] }> = [
  { label: 'Seg a Sáb (Padrão)', days: [1, 2, 3, 4, 5, 6] },
  { label: 'Seg a Sex', days: [1, 2, 3, 4, 5] },
  { label: 'Seg, Qua e Sex', days: [1, 3, 5] },
  { label: 'Todos os dias', days: [0, 1, 2, 3, 4, 5, 6] },
  { label: 'Fins de semana', days: [0, 6] },
];

function isSameDaysSet(a: WeekdayIndex[], b: WeekdayIndex[]): boolean {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every((day) => setA.has(day));
}

export function ScheduleTab({
  schedule,
  metrics,
  onUpdateSchedule,
  onResetSchedule,
  onNavigateTab,
  showToast,
}: ScheduleTabProps) {
  const isFree = schedule.mode === 'free';

  const setMode = (mode: ScheduleMode) => {
    onUpdateSchedule({ ...schedule, mode });
  };

  const setHoursPerDay = (hours: number) => {
    const clamped = Math.min(12, Math.max(0.5, Math.round(hours * 2) / 2));
    onUpdateSchedule({ ...schedule, mode: 'fixed', hoursPerDay: clamped });
  };

  const toggleDay = (dayIndex: WeekdayIndex) => {
    const exists = schedule.studyDays.includes(dayIndex);
    if (exists && schedule.studyDays.length <= 1) {
      showToast(
        'Mantenha pelo menos 1 dia selecionado ou alterne para o modo "No meu ritmo".',
        'amber',
      );
      return;
    }

    const nextDays = exists
      ? schedule.studyDays.filter((d) => d !== dayIndex)
      : [...schedule.studyDays, dayIndex].sort((a, b) => a - b);

    onUpdateSchedule({ ...schedule, mode: 'fixed', studyDays: nextDays });
  };

  const applyDaysPreset = (days: WeekdayIndex[]) => {
    onUpdateSchedule({ ...schedule, mode: 'fixed', studyDays: [...days] });
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <section className="rounded-2xl p-5 sm:p-6 bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => onNavigateTab('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Painel Geral</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            Personalizar Ritmo de Estudos
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Escolha quantas horas por dia e quais dias da semana você quer estudar — ou ative o modo
            livre para avançar no seu próprio ritmo sem calendário fixo.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start md:self-center px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shrink-0">
          <Check className="w-3.5 h-3.5" />
          <span>Salvo automaticamente</span>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Configurações */}
        <div className="lg:col-span-7 space-y-6">
          {/* Passo 1: Modo de Estudo */}
          <section className="rounded-2xl p-5 sm:p-6 bg-slate-900/90 border border-slate-800 space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Passo 1 • Modalidade
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                Como você quer organizar seus estudos?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button
                type="button"
                onClick={() => setMode('fixed')}
                aria-pressed={!isFree}
                className={`text-left rounded-2xl p-4 border transition-all space-y-2.5 cursor-pointer ${
                  !isFree
                    ? 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-950/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      !isFree
                        ? 'bg-indigo-500/25 text-indigo-300 border border-indigo-400/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <CalendarClock className="w-5 h-5" />
                  </div>
                  {!isFree && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
                      Ativo
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Dias e horas definidos</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Escolha horas/dia e os dias exatos da semana. Recalcula dias, semanas e data
                    estimada automaticamente.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('free')}
                aria-pressed={isFree}
                className={`text-left rounded-2xl p-4 border transition-all space-y-2.5 cursor-pointer ${
                  isFree
                    ? 'bg-emerald-600/15 border-emerald-500 shadow-lg shadow-emerald-950/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isFree
                        ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  {isFree && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold">
                      Ativo
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">No meu ritmo (sem dias fixos)</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Estude quando puder, sem prender a dias obrigatórios nem datas de prazo. Foco
                    total em horas e tópicos concluídos.
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* Passo 2: Detalhes conforme o modo escolhido */}
          {!isFree ? (
            <>
              {/* Horas por dia */}
              <section className="rounded-2xl p-5 sm:p-6 bg-slate-900/90 border border-slate-800 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                      Passo 2 • Carga Diária
                    </span>
                    <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                      Quantas horas por dia de estudo?
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setHoursPerDay(schedule.hoursPerDay - 0.5)}
                      disabled={schedule.hoursPerDay <= 0.5}
                      aria-label="Diminuir meia hora"
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="min-w-[78px] text-center text-lg font-black text-cyan-400 tabular-nums">
                      {formatHours(schedule.hoursPerDay)}/dia
                    </span>
                    <button
                      type="button"
                      onClick={() => setHoursPerDay(schedule.hoursPerDay + 0.5)}
                      disabled={schedule.hoursPerDay >= 12}
                      aria-label="Aumentar meia hora"
                      className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-slate-200 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Slider */}
                <div className="space-y-2">
                  <input
                    type="range"
                    min={0.5}
                    max={10}
                    step={0.5}
                    value={Math.min(10, schedule.hoursPerDay)}
                    onChange={(e) => setHoursPerDay(Number(e.target.value))}
                    aria-label="Horas de estudo por dia"
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>0,5h</span>
                    <span>2h</span>
                    <span>4h</span>
                    <span>6h</span>
                    <span>8h</span>
                    <span>10h+</span>
                  </div>
                </div>

                {/* Atalhos rápidos */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 mr-1">Atalhos:</span>
                  {HOUR_PRESETS.map((presetHours) => {
                    const active = schedule.hoursPerDay === presetHours;
                    return (
                      <button
                        key={presetHours}
                        type="button"
                        onClick={() => setHoursPerDay(presetHours)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                          active
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {formatHours(presetHours)}/dia
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Dias da semana */}
              <section className="rounded-2xl p-5 sm:p-6 bg-slate-900/90 border border-slate-800 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      Passo 3 • Dias da Semana
                    </span>
                    <h2 className="text-base sm:text-lg font-extrabold text-white mt-0.5">
                      Quais dias você vai estudar?
                    </h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300">
                    {schedule.studyDays.length} dia(s)/semana
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                  {WEEKDAYS_META.map((day) => {
                    const selected = schedule.studyDays.includes(day.index);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => toggleDay(day.index)}
                        aria-pressed={selected}
                        className={`rounded-xl p-3 border text-center transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          selected
                            ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-950/40'
                            : 'bg-slate-950/70 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        <span className="text-sm font-extrabold">{day.short}</span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                            selected
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-900 text-slate-500'
                          }`}
                        >
                          {selected ? 'Estudo' : 'Folga'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
                  <span className="text-xs font-semibold text-slate-400 mr-1">Combinações:</span>
                  {DAY_PRESETS.map((preset) => {
                    const active = isSameDaysSet(schedule.studyDays, preset.days);
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => applyDaysPreset(preset.days)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                          active
                            ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          ) : (
            <section className="rounded-2xl p-5 sm:p-6 bg-emerald-950/20 border border-emerald-500/35 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">
                    Modo Livre ativado — Estude no seu ritmo
                  </h2>
                  <p className="text-xs text-emerald-200/80">
                    Sem dias obrigatórios e sem pressão de prazo fixo.
                  </p>
                </div>
              </div>

              <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span>
                    O <strong className="text-white">Painel Geral</strong> acompanha horas
                    concluídas, horas restantes, percentual e tópicos sem impor datas fixas.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span>
                    O <strong className="text-white">Tracker Semanal</strong> fica aberto para os 7
                    dias (Seg–Dom) apenas para registrar os dias em que você estudou.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span>
                    Você pode voltar para dias e horas definidos quando quiser, mantendo 100% do seu
                    progresso intacto.
                  </span>
                </li>
              </ul>
            </section>
          )}
        </div>

        {/* Coluna Direita: Prévia em Tempo Real */}
        <aside className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl p-5 sm:p-6 bg-slate-900/90 border border-indigo-500/35 shadow-xl space-y-5 lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Prévia em Tempo Real
                </span>
                <h2 className="text-lg font-extrabold text-white">Impacto nas suas Metas</h2>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold text-cyan-300">
                {isFree ? 'Modo Livre' : `${formatHours(metrics.schedule.hoursPerWeek)}/sem`}
              </span>
            </div>

            {/* Resumo da rotina */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Ritmo Selecionado
              </div>
              <div className="text-base font-extrabold text-white">
                {metrics.schedule.summaryLabel}
              </div>
              {!isFree ? (
                <p className="text-xs text-slate-400">
                  {metrics.schedule.daysPerWeek} dia(s) por semana ×{' '}
                  {formatHours(metrics.schedule.hoursPerDay)} ={' '}
                  <strong className="text-cyan-300">
                    {formatHours(metrics.schedule.hoursPerWeek)} por semana
                  </strong>
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  Você decide em quais dias e por quanto tempo estudar.
                </p>
              )}
            </div>

            {/* Simulação Meta 1 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-indigo-500/30 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-indigo-300">
                  META 1 • Marco de Vagas (Fases 0–5)
                </span>
                <span className="text-xs font-extrabold text-white">
                  {metrics.milestone.remainingHours}h rest.
                </span>
              </div>

              {!isFree ? (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-sm font-extrabold text-cyan-400">
                      {metrics.milestone.remainingDays}
                    </div>
                    <div className="text-[10px] text-slate-400">Dias</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-sm font-extrabold text-indigo-300">
                      {metrics.milestone.remainingWeeks}
                    </div>
                    <div className="text-[10px] text-slate-400">Semanas</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-emerald-500/30">
                    <div className="text-xs font-extrabold text-emerald-400 leading-tight">
                      {metrics.milestone.eta.text}
                    </div>
                    <div className="text-[10px] text-slate-400">Previsão</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <span>Progresso atual: {metrics.milestone.percent}%</span>
                  <span className="font-bold text-emerald-400">{metrics.milestone.eta.text}</span>
                </div>
              )}
            </div>

            {/* Simulação Meta 2 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-emerald-300">
                  META 2 • Domínio Completo (Fases 0–7)
                </span>
                <span className="text-xs font-extrabold text-white">
                  {metrics.overall.remainingHours}h rest.
                </span>
              </div>

              {!isFree ? (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-sm font-extrabold text-cyan-400">
                      {metrics.overall.remainingDays}
                    </div>
                    <div className="text-[10px] text-slate-400">Dias</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-sm font-extrabold text-indigo-300">
                      {metrics.overall.remainingWeeks}
                    </div>
                    <div className="text-[10px] text-slate-400">Semanas</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700">
                    <div className="text-xs font-extrabold text-slate-200 leading-tight">
                      {metrics.overall.eta.text}
                    </div>
                    <div className="text-[10px] text-slate-400">Previsão</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                  <span>Progresso atual: {metrics.overall.percent}%</span>
                  <span className="font-bold text-emerald-400">{metrics.overall.eta.text}</span>
                </div>
              )}
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={onResetSchedule}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar padrão</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('dashboard')}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-colors cursor-pointer"
              >
                <span>Ver no Painel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
