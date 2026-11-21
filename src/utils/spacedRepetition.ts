import { PHASES, WEEKS } from '../data';
import type {
  Phase,
  PromptFocusMode,
  ReviewIntervalDays,
  RoadmapWeek,
  SpacedReviewItem,
  SpacedReviewQueue,
} from '../types/roadmap';

export const REVIEW_INTERVALS: readonly ReviewIntervalDays[] = [1, 7, 21] as const;

/**
 * Calcula a diferença em dias inteiros entre duas chaves locais YYYY-MM-DD,
 * imune a horário de verão ou deslocamento de fuso.
 */
export function daysBetweenDateKeys(fromKey: string, toKey: string): number {
  const parse = (key: string): Date | null => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    return new Date(year, month, day, 12, 0, 0, 0);
  };

  const fromDate = parse(fromKey);
  const toDate = parse(toKey);
  if (!fromDate || !toDate) return 0;

  return Math.round((toDate.getTime() - fromDate.getTime()) / 86_400_000);
}

/**
 * Monta a fila de revisão espaçada (1, 7 e 21 dias) a partir dos tópicos
 * efetivamente concluídos pelo usuário na Trilha por Fase.
 */
export function computeSpacedReviewQueue(
  completedTasks: Record<string, boolean>,
  taskCompletedAt: Record<string, string>,
  taskReviews: Record<string, ReviewIntervalDays[]>,
  weekNotes: Record<number, string>,
  todayKey: string,
  phases: Phase[] = PHASES,
  weeks: RoadmapWeek[] = WEEKS,
): SpacedReviewQueue {
  const phaseMap = new Map<number, Phase>(phases.map((p) => [p.id, p]));
  const dueToday: SpacedReviewItem[] = [];
  const upcoming: SpacedReviewItem[] = [];
  let masteredCount = 0;
  let totalTracked = 0;

  for (const weekObj of weeks) {
    const phase = phaseMap.get(weekObj.phaseId);
    const phaseCode = phase ? phase.code : `Fase ${weekObj.phaseId}`;
    const weekNote = (weekNotes[weekObj.week] ?? '').trim();

    for (const task of weekObj.tasks) {
      if (!completedTasks[task.id]) continue;
      totalTracked += 1;

      const completedDate = taskCompletedAt[task.id] ?? todayKey;
      const daysSince = Math.max(0, daysBetweenDateKeys(completedDate, todayKey));
      const completedIntervals = (taskReviews[task.id] ?? []).filter((d): d is ReviewIntervalDays =>
        REVIEW_INTERVALS.includes(d),
      );

      const nextInterval = REVIEW_INTERVALS.find(
        (interval) => !completedIntervals.includes(interval),
      );

      if (!nextInterval) {
        masteredCount += 1;
        continue;
      }

      const daysUntilDue = nextInterval - daysSince;
      const item: SpacedReviewItem = {
        task,
        week: weekObj.week,
        weekTitle: weekObj.title,
        phaseId: weekObj.phaseId,
        phaseCode,
        completedDate,
        daysSince,
        nextInterval,
        daysUntilDue,
        completedIntervals,
        weekNote,
      };

      if (daysUntilDue <= 0) {
        dueToday.push(item);
      } else {
        upcoming.push(item);
      }
    }
  }

  // Mais atrasados primeiro; empate pelo menor intervalo (D+1 antes de D+7)
  dueToday.sort((a, b) => a.daysUntilDue - b.daysUntilDue || a.nextInterval - b.nextInterval);
  upcoming.sort((a, b) => a.daysUntilDue - b.daysUntilDue || a.nextInterval - b.nextInterval);

  return {
    dueToday,
    upcoming,
    masteredCount,
    totalTracked,
  };
}

export interface BuildReviewPromptInput {
  focus: PromptFocusMode;
  currentPhase: Phase;
  dueItems: SpacedReviewItem[];
  recentCompletedTitles: string[];
}

/**
 * Gera um prompt sob medida para colar no Claude ou ChatGPT durante o bloco
 * de 15 minutos de revisão ativa, adaptado à fase atual e às revisões pendentes.
 */
export function buildActiveReviewPrompt({
  focus,
  currentPhase,
  dueItems,
  recentCompletedTitles,
}: BuildReviewPromptInput): string {
  const phaseContext = `${currentPhase.code} — ${currentPhase.title}`;
  const recentLine =
    recentCompletedTitles.length > 0
      ? `Tópicos que já estudei recentemente: ${recentCompletedTitles.slice(0, 4).join('; ')}.`
      : 'Estou no início da trilha (revisando fundamentos de Python e SQL).';

  const socraticRule =
    'Regras importantes:\n' +
    '- NÃO mostre a resposta nem o código pronto antes de eu tentar.\n' +
    '- Espere eu enviar minha solução e então avalie lógica, clareza, edge cases e boas práticas.\n' +
    '- Mantenha o escopo enxuto para eu resolver tudo em até 15 minutos.';

  if (focus === 'due-topics' && dueItems.length > 0) {
    const topicList = dueItems
      .slice(0, 3)
      .map((item) => `- [Revisão D+${item.nextInterval} • ${item.phaseCode}] ${item.task.text}`)
      .join('\n');

    return (
      `Atue como mentor técnico sênior de AI Engineering. Hoje tenho 15 minutos para minha Revisão Espaçada (recordação ativa).\n\n` +
      `Tópicos que preciso revisar hoje:\n${topicList}\n\n` +
      `Crie:\n` +
      `1. 2 perguntas conceituais diretas (sem múltipla escolha) para testar se realmente entendi os porquês.\n` +
      `2. 1 mini-exercício prático de código/arquitetura combinando esses temas.\n\n` +
      socraticRule
    );
  }

  if (focus === 'python') {
    return (
      `Atue como mentor técnico de AI Engineering. Tenho 15 minutos de revisão ativa diária de Python (já sei o básico, mas preciso praticar sem cola para não esquecer).\n\n` +
      `Fase atual do meu roadmap: ${phaseContext}.\n` +
      `${recentLine}\n\n` +
      `Crie 2 mini-desafios INÉDITOS de Python contextualizados em IA/dados:\n` +
      `1. Um desafio rápido de sintaxe e estruturas de dados (listas, dicts, funções, tipagem ou tratamento de erros).\n` +
      `2. Um desafio curto conectado ao tema da minha fase atual.\n\n` +
      `Forneça apenas o enunciado e um exemplo pequeno de entrada/saída esperada.\n\n` +
      socraticRule
    );
  }

  if (focus === 'sql') {
    return (
      `Atue como mentor técnico de Dados e AI Engineering. Tenho 15 minutos de revisão ativa diária de SQL (já sei o básico, mas quero treinar leitura crítica e queries sem cola).\n\n` +
      `Fase atual do meu roadmap: ${phaseContext}.\n` +
      `${recentLine}\n\n` +
      `Monte um pequeno esquema de 2 tabelas realistas (ex.: logs de LLM, documentos RAG ou usuários) com nomes de colunas claros e crie 2 desafios INÉDITOS de SQL:\n` +
      `1. Uma query de filtragem/agregação (JOIN, GROUP BY, HAVING ou CASE WHEN).\n` +
      `2. Uma query um pouco mais analítica (CTE, subquery, janela temporal ou ROW_NUMBER).\n\n` +
      socraticRule
    );
  }

  // Default: 'python-sql'
  return (
    `Atue como mentor técnico de AI Engineering. Tenho 15 minutos de revisão ativa diária para não esquecer Python e SQL.\n\n` +
    `Fase atual do meu roadmap: ${phaseContext}.\n` +
    `${recentLine}\n\n` +
    `Crie um aquecimento INÉDITO com exatamente 2 mini-desafios práticos:\n` +
    `1. [Python — 8 min]: um exercício prático de código (estruturas de dados, funções, JSON, tipagem ou regex) aplicado a um cenário realista de IA.\n` +
    `2. [SQL — 7 min]: um esquema curto de 2 tabelas + 1 pergunta de negócio para eu escrever a query do zero.\n\n` +
    socraticRule
  );
}
