import {
  ArrowRight,
  CheckCircle2,
  Download,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  Upload,
} from 'lucide-react';
import { PHASES } from '../../data';
import type { RoadmapMetrics, TabId } from '../../types/roadmap';
import { formatHours } from '../../utils/metrics';

interface DashboardTabProps {
  metrics: RoadmapMetrics;
  onNavigateTab: (tab: TabId) => void;
  onOpenPhase: (phaseId: number) => void;
  onExportBackup: () => void;
  onTriggerImport: () => void;
  onOpenResetModal: () => void;
}

export function DashboardTab({
  metrics: m,
  onNavigateTab,
  onOpenPhase,
  onExportBackup,
  onTriggerImport,
  onOpenResetModal,
}: DashboardTabProps) {
  const isFree = m.schedule.mode === 'free';
  const mRemainingTasks = Math.max(0, m.milestone.totalTasks - m.milestone.doneTasks);
  const allRemainingTasks = Math.max(0, m.overall.totalTasks - m.overall.doneTasks);

  return (
    <div className="space-y-6">
      {/* Banner Dinâmico */}
      {m.milestone.isReady ? (
        <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-emerald-950/90 via-emerald-900/50 to-cyan-950/70 border border-emerald-500/50 shadow-xl shadow-emerald-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% DAS FASES 0 A 5 CONCLUÍDAS</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-white">
              🎉 Marco Atingido! Você já está pronto para aplicar às vagas de AI Engineer!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90">
              Envie seu portfólio com os 3 projetos no GitHub e continue avançando pelas Fases 6 e
              7 enquanto participa das entrevistas.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('projetos')}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            <span>Revisar meu Portfólio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
              <span>JORNADA RUMO À SUA VAGA</span>
              <span>•</span>
              <span className="text-cyan-400">{m.milestone.percent}% concluído</span>
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight">
              Faltam <span className="text-cyan-400">{m.milestone.remainingHours}h</span>
              {!isFree && m.milestone.remainingWeeks !== null && (
                <> ({m.milestone.remainingWeeks} semanas)</>
              )}{' '}
              para você começar a aplicar às vagas
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              {isFree ? (
                <>
                  Modo atual:{' '}
                  <strong className="text-emerald-300">No seu ritmo (sem dias fixos)</strong>.
                  Conclua até a Fase 5 com 3 projetos no GitHub no tempo que funcionar melhor para
                  você.
                </>
              ) : (
                <>
                  Ritmo configurado:{' '}
                  <strong className="text-slate-200">
                    {formatHours(m.schedule.hoursPerDay)}/dia • {m.schedule.daysShortLabel} (
                    {formatHours(m.schedule.hoursPerWeek)}/semana)
                  </strong>
                  . Conclua até a Fase 5 com 3 projetos no GitHub.
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigateTab('ritmo')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Personalizar ritmo</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenPhase(m.nextPendingTask ? m.nextPendingTask.phaseId : 0)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-colors cursor-pointer"
            >
              <span>Continuar Estudos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2 Cards Principais de Cálculo de Tempo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Meta 1: Fases 0 a 5 */}
        <section className="rounded-2xl p-5 sm:p-6 bg-slate-900/90 border border-indigo-500/40 shadow-xl flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                META 1 • MARCO DE VAGAS
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Fases 0 a 5 ({m.milestone.totalHours}h
                {!isFree && m.milestone.totalWeeksAtPace !== null
                  ? ` / ${m.milestone.totalWeeksAtPace} sem`
                  : ''}
                )
              </span>
            </div>
            <div className="flex items-end justify-between mt-3 mb-2 gap-2">
              <div>
                <span className="text-3xl font-black text-white">{m.milestone.percent}%</span>
                <span className="text-xs text-slate-400 ml-2">
                  {m.milestone.doneTasks}/{m.milestone.totalTasks} tópicos
                </span>
              </div>
              <span className="text-xs font-semibold text-cyan-300 text-right">
                {m.milestone.doneHours}h concluídas • {m.milestone.remainingHours}h restantes
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${m.milestone.percent}%` }}
              />
            </div>
          </div>

          {!isFree ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-base font-extrabold text-white">
                  {m.milestone.remainingHours}h
                </div>
                <div className="text-[11px] text-slate-400">Horas rest.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-base font-extrabold text-cyan-400">
                  {m.milestone.remainingDays}
                </div>
                <div className="text-[11px] text-slate-400">
                  Dias ({formatHours(m.schedule.hoursPerDay)}/dia)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-base font-extrabold text-indigo-300">
                  {m.milestone.remainingWeeks}
                </div>
                <div className="text-[11px] text-slate-400">
                  Semanas ({formatHours(m.schedule.hoursPerWeek)})
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30">
                <div className="text-xs sm:text-sm font-extrabold text-emerald-400 leading-tight">
                  {m.milestone.eta.text}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Previsão ({m.schedule.daysShortLabel})
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-base font-extrabold text-emerald-400">
                  {m.milestone.doneHours}h
                </div>
                <div className="text-[11px] text-slate-400">Concluídas</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-base font-extrabold text-white">
                  {m.milestone.remainingHours}h
                </div>
                <div className="text-[11px] text-slate-400">Horas rest.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-base font-extrabold text-cyan-400">{mRemainingTasks}</div>
                <div className="text-[11px] text-slate-400">Tópicos rest.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-emerald-500/30">
                <div className="text-xs sm:text-sm font-extrabold text-emerald-400 leading-tight">
                  {m.milestone.eta.text}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Sem prazo fixo</div>
              </div>
            </div>
          )}
        </section>

        {/* Meta 2: Fases 0 a 7 */}
        <section className="rounded-2xl p-5 sm:p-6 bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between gap-5">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                META 2 • DOMÍNIO COMPLETO
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Fases 0 a 7 ({m.overall.totalHours}h
                {!isFree && m.overall.totalWeeksAtPace !== null
                  ? ` / ${m.overall.totalWeeksAtPace} sem`
                  : ''}
                )
              </span>
            </div>
            <div className="flex items-end justify-between mt-3 mb-2 gap-2">
              <div>
                <span className="text-3xl font-black text-white">{m.overall.percent}%</span>
                <span className="text-xs text-slate-400 ml-2">
                  {m.overall.doneTasks}/{m.overall.totalTasks} tópicos
                </span>
              </div>
              <span className="text-xs font-semibold text-emerald-300 text-right">
                {m.overall.doneHours}h concluídas • {m.overall.remainingHours}h restantes
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700/70">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${m.overall.percent}%` }}
              />
            </div>
          </div>

          {!isFree ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-base font-extrabold text-white">
                  {m.overall.remainingHours}h
                </div>
                <div className="text-[11px] text-slate-400">Horas rest.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-base font-extrabold text-cyan-400">
                  {m.overall.remainingDays}
                </div>
                <div className="text-[11px] text-slate-400">
                  Dias ({formatHours(m.schedule.hoursPerDay)}/dia)
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-base font-extrabold text-indigo-300">
                  {m.overall.remainingWeeks}
                </div>
                <div className="text-[11px] text-slate-400">
                  Semanas ({formatHours(m.schedule.hoursPerWeek)})
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-xs sm:text-sm font-extrabold text-slate-200 leading-tight">
                  {m.overall.eta.text}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Previsão Final</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-800">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-base font-extrabold text-emerald-400">
                  {m.overall.doneHours}h
                </div>
                <div className="text-[11px] text-slate-400">Concluídas</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-base font-extrabold text-white">
                  {m.overall.remainingHours}h
                </div>
                <div className="text-[11px] text-slate-400">Horas rest.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-base font-extrabold text-cyan-400">{allRemainingTasks}</div>
                <div className="text-[11px] text-slate-400">Tópicos rest.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90">
                <div className="text-xs sm:text-sm font-extrabold text-slate-200 leading-tight">
                  {m.overall.eta.text}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">Sem prazo fixo</div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Próximo Passo Agora */}
      {m.nextPendingTask ? (
        <div className="rounded-2xl p-5 bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold uppercase tracking-wider">
                Próximo Passo Agora
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {m.nextPendingTask.phase.code} • Semana {m.nextPendingTask.week} • [
                {m.nextPendingTask.task.hours}h]
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              {m.nextPendingTask.task.text}
            </h3>
            <p className="text-xs text-slate-400">Módulo: {m.nextPendingTask.weekTitle}</p>
          </div>
          <button
            type="button"
            onClick={() => onOpenPhase(m.nextPendingTask!.phaseId)}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-white border border-slate-700 hover:border-indigo-500 text-xs font-bold transition-all cursor-pointer"
          >
            <span>Ir direto para esta fase</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="rounded-2xl p-5 bg-emerald-950/30 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Roadmap 100% Finalizado
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Todos os tópicos das 19 semanas foram concluídos!
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('projetos')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Ver Projetos
          </button>
        </div>
      )}

      {/* Mapa das 8 Fases (Grid 2x4) */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base sm:text-lg font-extrabold text-white">
            Mapa das 8 Fases do Roadmap
          </h2>
          <p className="text-xs text-slate-400">
            Clique em qualquer fase para abrir diretamente os tópicos e semanas daquela etapa.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHASES.map((phase) => {
            const st = m.phaseStats[phase.id];
            const isComplete = st.percent === 100;
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => onOpenPhase(phase.id)}
                className={`text-left group rounded-2xl p-4 bg-slate-900/90 hover:bg-slate-900 border transition-all flex flex-col justify-between gap-3 cursor-pointer ${
                  phase.isMilestoneTarget
                    ? 'border-indigo-500/50 hover:border-indigo-400 shadow-lg shadow-indigo-950/30'
                    : isComplete
                      ? 'border-emerald-500/40 hover:border-emerald-400'
                      : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                        phase.isMilestoneTarget
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : isComplete
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {phase.code}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {phase.weeksLabel}
                    </span>
                  </div>

                  {phase.isMilestoneTarget && (
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                      🎯 Marco para Vagas
                    </div>
                  )}

                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug">
                    {phase.title}
                  </h4>
                </div>

                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      {st.doneHours}h / {st.totalHours}h
                    </span>
                    <span
                      className={`font-bold ${isComplete ? 'text-emerald-400' : 'text-indigo-300'}`}
                    >
                      {st.percent}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isComplete
                          ? 'bg-emerald-400'
                          : phase.isMilestoneTarget
                            ? 'bg-gradient-to-r from-indigo-500 to-emerald-400'
                            : 'bg-gradient-to-r from-indigo-500 to-cyan-400'
                      }`}
                      style={{ width: `${st.percent}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Gerenciamento de Dados e Backup Local */}
      <section className="rounded-2xl p-4 sm:p-5 bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200">Backup &amp; Sincronização Manual</h3>
          <p className="text-xs text-slate-400">
            Seu progresso e seu ritmo personalizado ficam salvos automaticamente neste navegador.
            Exporte o arquivo JSON para usar em outro PC ou celular.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onExportBackup}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Backup (JSON)</span>
          </button>
          <button
            type="button"
            onClick={onTriggerImport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importar Backup (JSON)</span>
          </button>
          <button
            type="button"
            onClick={onOpenResetModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar Progresso</span>
          </button>
        </div>
      </section>
    </div>
  );
}
