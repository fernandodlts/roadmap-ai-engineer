import { ExternalLink } from 'lucide-react';
import { PROJECTS, PROJECT_STEPS } from '../../data';
import type { Project, ProjectStepKey, RoadmapState, ToastVariant } from '../../types/roadmap';
import { normalizeExternalUrl } from '../../utils/storage';

interface ProjectsTabProps {
  state: RoadmapState;
  onToggleProjectStep: (projId: string, stepKey: ProjectStepKey) => void;
  onUpdateProjectLink: (projId: string, value: string) => void;
  onOpenPhase: (phaseId: number) => void;
  showToast: (message: string, variant?: ToastVariant) => void;
}

export function ProjectsTab({
  state,
  onToggleProjectStep,
  onUpdateProjectLink,
  onOpenPhase,
  showToast,
}: ProjectsTabProps) {
  const totalSteps = PROJECTS.length * PROJECT_STEPS.length;
  let completedSteps = 0;

  for (const proj of PROJECTS) {
    const st = state.projectSteps[proj.id] ?? {};
    for (const step of PROJECT_STEPS) {
      if (st[step.key]) completedSteps += 1;
    }
  }

  const pct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  const requiredProjects = PROJECTS.filter((p) => p.requiredForJobs);
  const bonusProjects = PROJECTS.filter((p) => !p.requiredForJobs);

  const renderProjectCard = (proj: Project) => {
    const stepsState = state.projectSteps[proj.id] ?? {};
    const doneCount = PROJECT_STEPS.filter((s) => Boolean(stepsState[s.key])).length;
    const projPct = Math.round((doneCount / PROJECT_STEPS.length) * 100);
    const savedUrl = state.projectLinks[proj.id] ?? '';
    const openUrl = normalizeExternalUrl(savedUrl);

    return (
      <article
        key={proj.id}
        className={`rounded-2xl p-5 sm:p-6 bg-slate-900/90 border flex flex-col justify-between gap-5 ${
          doneCount === PROJECT_STEPS.length
            ? 'border-emerald-500/40'
            : proj.requiredForJobs
              ? 'border-indigo-500/35'
              : 'border-slate-800'
        }`}
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-extrabold text-xs border border-slate-700">
                PROJETO #{proj.number}
              </span>
              <span
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                  proj.requiredForJobs
                    ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                    : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                }`}
              >
                {proj.requiredForJobs
                  ? '🎯 Obrigatório para Aplicar às Vagas'
                  : '⭐ Diferencial Pós-Fase 5'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onOpenPhase(proj.phaseId)}
              className="text-xs font-semibold text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
            >
              Fase {proj.phaseId} • Semana {proj.week} ↗
            </button>
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-white">{proj.title}</h3>
            <p className="text-xs font-semibold text-cyan-400 mt-0.5">{proj.subtitle}</p>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {proj.description}
            </p>
          </div>

          {/* Progresso do Projeto */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-400">Checklist de Entrega</span>
              <span
                className={`font-bold ${
                  doneCount === PROJECT_STEPS.length ? 'text-emerald-400' : 'text-indigo-300'
                }`}
              >
                {doneCount}/{PROJECT_STEPS.length} etapas ({projPct}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  doneCount === PROJECT_STEPS.length ? 'bg-emerald-400' : 'bg-indigo-500'
                }`}
                style={{ width: `${projPct}%` }}
              />
            </div>
          </div>

          {/* 4 Etapas Checkáveis */}
          <div className="space-y-2">
            {PROJECT_STEPS.map((step) => {
              const isChecked = Boolean(stepsState[step.key]);
              return (
                <label
                  key={step.key}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border cursor-pointer select-none transition-colors ${
                    isChecked
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400'
                      : 'bg-slate-950/60 hover:bg-slate-800/60 border-slate-800 text-slate-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggleProjectStep(proj.id, step.key)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-900 accent-emerald-500 cursor-pointer shrink-0"
                  />
                  <span className={`text-xs sm:text-sm ${isChecked ? 'line-through' : ''}`}>
                    {step.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* URL do Repositório GitHub */}
        <div className="pt-3 border-t border-slate-800/90">
          <label
            htmlFor={`repo-input-${proj.id}`}
            className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5"
          >
            Link do seu Repositório no GitHub
          </label>
          <div className="flex items-center gap-2">
            <input
              id={`repo-input-${proj.id}`}
              type="url"
              value={savedUrl}
              onChange={(e) => onUpdateProjectLink(proj.id, e.target.value)}
              placeholder={`https://github.com/seu-usuario/projeto-${proj.number}`}
              className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:outline-none text-xs text-slate-200 placeholder-slate-500"
            />
            {openUrl ? (
              <a
                href={openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500"
              >
                <span>Abrir</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <button
                type="button"
                onClick={() =>
                  showToast('Cole um link válido do seu repositório GitHub primeiro.', 'amber')
                }
                className="shrink-0 inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors border bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200 cursor-pointer"
              >
                <span>Abrir</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-8">
      {/* Cabeçalho da Aba Projetos */}
      <section className="rounded-2xl p-5 sm:p-6 bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Portfólio Prático de AI Engineer
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            5 Projetos que Comprovam sua Experiência
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Recrutadores contratam quem mostra código rodando. Conclua os{' '}
            <strong className="text-slate-200">3 primeiros projetos</strong> até a Fase 5 para
            começar a aplicar, e use os Projetos 4 e 5 como diferencial técnico.
          </p>
        </div>
        <div className="shrink-0 p-4 rounded-xl bg-slate-950/70 border border-slate-800 min-w-[210px]">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400">Entregas de Portfólio</span>
            <span className="font-extrabold text-emerald-400">{pct}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden mb-1">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-400">
            {completedSteps} de {totalSteps} marcos concluídos
          </div>
        </div>
      </section>

      {/* Bloco 1: Obrigatórios */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
          <h2 className="text-base sm:text-lg font-extrabold text-white">
            Obrigatórios para Aplicar às Vagas (Projetos 1 a 3)
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {requiredProjects.map(renderProjectCard)}
        </div>
      </section>

      {/* Bloco 2: Diferencial Pós-Fase 5 */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <h2 className="text-base sm:text-lg font-extrabold text-white">
            Diferencial Pós-Fase 5 — Avaliação &amp; Produção (Projetos 4 e 5)
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {bonusProjects.map(renderProjectCard)}
        </div>
      </section>
    </div>
  );
}
