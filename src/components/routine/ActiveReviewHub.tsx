import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Brain,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  NotebookPen,
  Play,
  Sparkles,
} from 'lucide-react';
import { PHASES, PRACTICE_PLATFORMS, WEEKS } from '../../data';
import type {
  PromptFocusMode,
  ReviewIntervalDays,
  RoadmapMetrics,
  SpacedReviewQueue,
  ToastVariant,
} from '../../types/roadmap';
import { getLocalDateKey } from '../../utils/metrics';
import { REVIEW_INTERVALS, buildActiveReviewPrompt } from '../../utils/spacedRepetition';

interface ActiveReviewHubProps {
  completedTasks: Record<string, boolean>;
  dailyReviewDates: Record<string, boolean>;
  metrics: RoadmapMetrics;
  spacedReviewQueue: SpacedReviewQueue;
  onCompleteTaskReview: (taskId: string, interval: ReviewIntervalDays) => void;
  onToggleTodayDailyReview: () => void;
  onStartReviewTimer: () => void;
  onOpenPhase: (phaseId: number) => void;
  showToast: (message: string, variant?: ToastVariant) => void;
}

export function ActiveReviewHub({
  completedTasks,
  dailyReviewDates,
  metrics,
  spacedReviewQueue,
  onCompleteTaskReview,
  onToggleTodayDailyReview,
  onStartReviewTimer,
  onOpenPhase,
  showToast,
}: ActiveReviewHubProps) {
  const [promptFocus, setPromptFocus] = useState<PromptFocusMode>('python-sql');
  const [showPromptPreview, setShowPromptPreview] = useState(false);
  const [copiedRecently, setCopiedRecently] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);

  const todayKey = getLocalDateKey();
  const isTodayDone = Boolean(dailyReviewDates[todayKey]);
  const totalReviewDays = Object.keys(dailyReviewDates).length;

  const currentPhase = metrics.nextPendingTask?.phase ?? PHASES[PHASES.length - 1];

  const recentCompletedTitles = useMemo(() => {
    const titles: string[] = [];
    for (let i = WEEKS.length - 1; i >= 0; i -= 1) {
      const week = WEEKS[i];
      for (let j = week.tasks.length - 1; j >= 0; j -= 1) {
        const task = week.tasks[j];
        if (completedTasks[task.id]) {
          titles.push(task.text);
          if (titles.length >= 4) return titles;
        }
      }
    }
    return titles;
  }, [completedTasks]);

  const effectiveFocus: PromptFocusMode =
    promptFocus === 'due-topics' && spacedReviewQueue.dueToday.length === 0
      ? 'python-sql'
      : promptFocus;

  const generatedPrompt = useMemo(
    () =>
      buildActiveReviewPrompt({
        focus: effectiveFocus,
        currentPhase,
        dueItems: spacedReviewQueue.dueToday,
        recentCompletedTitles,
      }),
    [effectiveFocus, currentPhase, spacedReviewQueue.dueToday, recentCompletedTitles],
  );

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopiedRecently(true);
      showToast('Prompt copiado! Cole no Claude ou ChatGPT para iniciar seus 15 min.', 'emerald');
      window.setTimeout(() => setCopiedRecently(false), 2400);
    } catch {
      setShowPromptPreview(true);
      showToast('Não foi possível copiar automaticamente — copie direto da prévia abaixo.', 'amber');
    }
  };

  const toggleNote = (taskId: string) => {
    setExpandedNotes((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const upcomingVisible = showAllUpcoming
    ? spacedReviewQueue.upcoming
    : spacedReviewQueue.upcoming.slice(0, 4);

  const promptOptions: Array<{ id: PromptFocusMode; label: string }> = [
    { id: 'python-sql', label: 'Python + SQL' },
    { id: 'python', label: 'Só Python' },
    { id: 'sql', label: 'Só SQL' },
    ...(spacedReviewQueue.dueToday.length > 0
      ? [{ id: 'due-topics' as const, label: `Revisões de Hoje (${spacedReviewQueue.dueToday.length})` }]
      : []),
  ];

  return (
    <section className="rounded-2xl p-5 sm:p-6 bg-slate-900/90 border border-cyan-500/30 shadow-xl space-y-6">
      {/* Cabeçalho Unificado */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/90">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold">
              <Brain className="w-3.5 h-3.5" />
              <span>REVISÃO ATIVA &amp; ESPAÇADA (15 MIN)</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[11px] font-semibold text-slate-300">
              {totalReviewDays} dia(s) com revisão registrada
            </span>
            {spacedReviewQueue.masteredCount > 0 && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300">
                🏆 {spacedReviewQueue.masteredCount} tópico(s) consolidado(s)
              </span>
            )}
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-white">
            Anti-Esquecimento: Curva de Revisão + Prática Infinita
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Revise os tópicos que você concluiu em <strong className="text-slate-200">1, 7 e 21 dias</strong>{' '}
            e gere desafios inéditos de Python &amp; SQL sob medida para sua fase atual — sem nunca
            repetir questões fixas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onStartReviewTimer}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Iniciar 15 min</span>
          </button>

          <button
            type="button"
            onClick={onToggleTodayDailyReview}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isTodayDone
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isTodayDone ? 'Revisão de hoje feita' : 'Marcar revisão de hoje'}</span>
          </button>
        </div>
      </div>

      {/* Corpo em 2 colunas: Esquerda = Revisão Espaçada | Direita = Prompt Infinito + Plataformas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUNA 1: Revisão Espaçada do Próprio Roadmap */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Curva do Esquecimento (D+1 • D+7 • D+21)
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                Revisões dos seus Tópicos Concluídos
              </h3>
            </div>
            {spacedReviewQueue.dueToday.length > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                {spacedReviewQueue.dueToday.length} para hoje
              </span>
            )}
          </div>

          {spacedReviewQueue.totalTracked === 0 ? (
            <div className="rounded-xl p-5 bg-slate-950/70 border border-slate-800 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">
                    A fila cresce conforme você avança no Roadmap
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Assim que você marcar tópicos como concluídos na <strong className="text-slate-200">Trilha por Fase</strong>,
                    eles entram automaticamente aqui para revisão ativa após <strong className="text-cyan-300">1 dia</strong>,{' '}
                    <strong className="text-cyan-300">7 dias</strong> e <strong className="text-cyan-300">21 dias</strong>,
                    trazendo junto suas anotações pessoais da semana.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenPhase(currentPhase.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Ir para {currentPhase.code}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pendentes hoje */}
              {spacedReviewQueue.dueToday.length > 0 ? (
                <div className="space-y-2.5">
                  {spacedReviewQueue.dueToday.map((item) => {
                    const noteOpen = Boolean(expandedNotes[item.task.id]);
                    const overdueDays = Math.abs(item.daysUntilDue);
                    return (
                      <div
                        key={item.task.id}
                        className="rounded-xl p-4 bg-slate-950/80 border border-amber-500/35 space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold">
                              REVISÃO D+{item.nextInterval}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
                              {item.phaseCode} • Sem {item.week}
                            </span>
                            {overdueDays > 0 && (
                              <span className="text-[10px] font-semibold text-rose-300">
                                ({overdueDays}d em atraso)
                              </span>
                            )}
                          </div>

                          {/* Indicador de etapas 1 / 7 / 21 */}
                          <div className="flex items-center gap-1">
                            {REVIEW_INTERVALS.map((step) => {
                              const done = item.completedIntervals.includes(step);
                              const isCurrent = step === item.nextInterval;
                              return (
                                <span
                                  key={step}
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                                    done
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                      : isCurrent
                                        ? 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                                        : 'bg-slate-900 text-slate-500 border-slate-800'
                                  }`}
                                >
                                  {step}d
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
                          {item.task.text}
                        </p>

                        {item.weekNote && (
                          <div>
                            <button
                              type="button"
                              onClick={() => toggleNote(item.task.id)}
                              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-indigo-300 hover:text-indigo-200 cursor-pointer"
                            >
                              <NotebookPen className="w-3.5 h-3.5" />
                              <span>
                                {noteOpen
                                  ? 'Ocultar suas anotações da semana'
                                  : `Ver suas anotações da Semana ${item.week}`}
                              </span>
                            </button>
                            {noteOpen && (
                              <div className="mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap">
                                {item.weekNote}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                          <button
                            type="button"
                            onClick={() => onOpenPhase(item.phaseId)}
                            className="text-[11px] font-semibold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                          >
                            Abrir {item.phaseCode} ↗
                          </button>

                          <button
                            type="button"
                            onClick={() => onCompleteTaskReview(item.task.id, item.nextInterval)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 text-xs font-bold transition-colors cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Concluir revisão D+{item.nextInterval}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl p-4 bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div className="text-xs text-emerald-100/90">
                    <strong className="text-emerald-300">Revisões espaçadas em dia!</strong> Nenhum
                    tópico vencido hoje — aproveite os 15 min no bloco ao lado para praticar Python
                    &amp; SQL inéditos.
                  </div>
                </div>
              )}

              {/* Próximas revisões agendadas */}
              {spacedReviewQueue.upcoming.length > 0 && (
                <div className="rounded-xl p-4 bg-slate-950/60 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Próximas Revisões Agendadas ({spacedReviewQueue.upcoming.length})
                    </span>
                    {spacedReviewQueue.upcoming.length > 4 && (
                      <button
                        type="button"
                        onClick={() => setShowAllUpcoming((prev) => !prev)}
                        className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                      >
                        {showAllUpcoming ? 'Ver menos' : 'Ver todas'}
                      </button>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {upcomingVisible.map((item) => (
                      <div
                        key={item.task.id}
                        className="flex items-center justify-between gap-3 py-1.5 px-2.5 rounded-lg bg-slate-900/70 border border-slate-800/80 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="text-slate-400 font-semibold mr-1.5">
                            {item.phaseCode}:
                          </span>
                          <span className="text-slate-200 truncate">{item.task.text}</span>
                        </div>
                        <span className="shrink-0 px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 text-[10px] font-bold whitespace-nowrap">
                          {item.daysUntilDue === 1
                            ? `Amanhã • D+${item.nextInterval}`
                            : `Em ${item.daysUntilDue}d • D+${item.nextInterval}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* COLUNA 2: Hub Infinito (Gerador de Prompt para IA + Plataformas Reais) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Gerador de Prompt para Claude / ChatGPT */}
          <div className="rounded-xl p-4 bg-slate-950/80 border border-indigo-500/35 space-y-3.5">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Desafios Infinitos com IA</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  Contexto: {currentPhase.code}
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-white">
                Prompt de Revisão Ativa (Claude / ChatGPT)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Copie um prompt adaptado à sua fase atual que cria desafios inéditos sem revelar a
                resposta antes de você codar.
              </p>
            </div>

            {/* Seletor de Foco */}
            <div className="flex flex-wrap gap-1.5">
              {promptOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPromptFocus(opt.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                    effectiveFocus === opt.id
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyPrompt}
                className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  copiedRecently
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25'
                }`}
              >
                {copiedRecently ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedRecently ? 'Prompt copiado!' : 'Copiar Prompt (15 min)'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPromptPreview((prev) => !prev)}
                className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors cursor-pointer"
              >
                <span>{showPromptPreview ? 'Ocultar' : 'Prévia'}</span>
                {showPromptPreview ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {showPromptPreview && (
              <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono whitespace-pre-wrap break-words max-h-56 overflow-y-auto leading-relaxed">
                {generatedPrompt}
              </pre>
            )}
          </div>

          {/* Plataformas Reais com Centenas de Exercícios */}
          <div className="rounded-xl p-4 bg-slate-950/70 border border-slate-800 space-y-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                Prática com Correção Automática
              </span>
              <h3 className="text-sm font-extrabold text-white">
                Bancos Reais (Sem Repetição)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRACTICE_PLATFORMS.map((platform) => (
                <a
                  key={platform.id}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between gap-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {platform.name}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">{platform.description}</p>
                  <span className="self-start px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-semibold text-indigo-300">
                    {platform.badge}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
