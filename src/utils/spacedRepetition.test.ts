import { describe, expect, it } from 'vitest';
import { PHASES, WEEKS } from '../data';
import {
  buildActiveReviewPrompt,
  computeSpacedReviewQueue,
  daysBetweenDateKeys,
} from './spacedRepetition';

describe('spaced repetition queue (D+1, D+7, D+21) & AI review prompt builder', () => {
  it('computes exact integer day differences between YYYY-MM-DD keys', () => {
    expect(daysBetweenDateKeys('2026-11-19', '2026-11-19')).toBe(0);
    expect(daysBetweenDateKeys('2026-11-19', '2026-11-20')).toBe(1);
    expect(daysBetweenDateKeys('2026-11-01', '2026-11-22')).toBe(21);
  });

  it('schedules upcoming, due today, overdue, and mastered items accurately', () => {
    const completedTasks = {
      'w1-t1': true, // completed today -> upcoming D+1 (in 1 day)
      'w1-t2': true, // completed 1 day ago -> due today (D+1)
      'w2-t1': true, // completed 10 days ago, D+1 done -> overdue D+7 (-3 days)
      'w2-t2': true, // completed 25 days ago, [1, 7, 21] done -> mastered
    };
    const taskCompletedAt = {
      'w1-t1': '2026-11-20',
      'w1-t2': '2026-11-19',
      'w2-t1': '2026-11-10',
      'w2-t2': '2026-10-26',
    };
    const taskReviews = {
      'w2-t1': [1 as const],
      'w2-t2': [1 as const, 7 as const, 21 as const],
    };
    const weekNotes = {
      1: 'Lembrar de usar venv antes de instalar pacotes.',
    };

    const queue = computeSpacedReviewQueue(
      completedTasks,
      taskCompletedAt,
      taskReviews,
      weekNotes,
      '2026-11-20',
      PHASES,
      WEEKS,
    );

    expect(queue.totalTracked).toBe(4);
    expect(queue.masteredCount).toBe(1);

    // Most overdue item comes first: w2-t1 (D+7 overdue by 3 days), then w1-t2 (D+1 due today)
    expect(queue.dueToday.map((i) => i.task.id)).toEqual(['w2-t1', 'w1-t2']);
    expect(queue.dueToday[0].nextInterval).toBe(7);
    expect(queue.dueToday[0].daysUntilDue).toBe(-3);
    expect(queue.dueToday[1].nextInterval).toBe(1);
    expect(queue.dueToday[1].weekNote).toContain('venv');

    // Upcoming: w1-t1 in 1 day
    expect(queue.upcoming).toHaveLength(1);
    expect(queue.upcoming[0].task.id).toBe('w1-t1');
    expect(queue.upcoming[0].daysUntilDue).toBe(1);
  });

  it('builds contextual Socratic prompts without revealing answers upfront', () => {
    const promptPySql = buildActiveReviewPrompt({
      focus: 'python-sql',
      currentPhase: PHASES[3],
      dueItems: [],
      recentCompletedTitles: ['Revisão de SQL essencial'],
    });
    expect(promptPySql).toContain('Fase 3');
    expect(promptPySql).toContain('NÃO mostre a resposta');
    expect(promptPySql).toContain('Python');
    expect(promptPySql).toContain('SQL');

    const queue = computeSpacedReviewQueue(
      { 'w1-t1': true },
      { 'w1-t1': '2026-11-19' },
      {},
      {},
      '2026-11-20',
    );
    const promptDue = buildActiveReviewPrompt({
      focus: 'due-topics',
      currentPhase: PHASES[0],
      dueItems: queue.dueToday,
      recentCompletedTitles: [],
    });
    expect(promptDue).toContain('Revisão D+1');
    expect(promptDue).toContain('Revisão prática de Python');
  });
});
