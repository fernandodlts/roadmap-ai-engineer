import { describe, expect, it } from 'vitest';
import {
  buildBackupPayload,
  getDefaultState,
  normalizeExternalUrl,
  parseBackupJson,
  sanitizeStudySchedule,
} from './storage';

describe('storage utilities & URL sanitization', () => {
  it('normalizes valid URLs and blocks unsafe protocols', () => {
    expect(normalizeExternalUrl('github.com/user/repo')).toBe('https://github.com/user/repo');
    expect(normalizeExternalUrl('https://github.com/user/repo')).toBe(
      'https://github.com/user/repo',
    );
    expect(normalizeExternalUrl('javascript:alert(1)')).toBe('');
    expect(normalizeExternalUrl('data:text/html,<script>alert(1)</script>')).toBe('');
    expect(normalizeExternalUrl('   ')).toBe('');
    expect(normalizeExternalUrl('not-a-domain')).toBe('');
  });

  it('sanitizes custom studySchedule values safely', () => {
    expect(
      sanitizeStudySchedule({ mode: 'free', hoursPerDay: 3.2, studyDays: [1, 3, 3, 99] }),
    ).toEqual({
      mode: 'free',
      hoursPerDay: 3,
      studyDays: [1, 3],
    });
    expect(sanitizeStudySchedule({ mode: 'fixed', hoursPerDay: 0, studyDays: [] })).toEqual({
      mode: 'fixed',
      hoursPerDay: 0.5,
      studyDays: [1, 2, 3, 4, 5, 6],
    });
  });

  it('round-trips backup JSON and migrates legacy v2 backups smoothly', () => {
    const state = {
      ...getDefaultState(),
      completedTasks: { 'w1-t1': true, 'w2-t2': true },
      taskCompletedAt: { 'w1-t1': '2026-11-18', 'w2-t2': '2026-11-10' },
      taskReviews: { 'w2-t2': [1 as const, 7 as const] },
      dailyReviewDates: { '2026-11-19': true },
      weekNotes: { 1: 'Revisar list comprehensions' },
      consistentWeeks: 3,
      studySchedule: {
        mode: 'free' as const,
        hoursPerDay: 2.5,
        studyDays: [1, 3, 5] as Array<0 | 1 | 2 | 3 | 4 | 5 | 6>,
      },
    };

    const payload = buildBackupPayload(state);
    const restored = parseBackupJson(JSON.stringify(payload), '2026-11-20');
    expect(restored).toEqual(state);

    // Legacy backup with old activeReviewLog and without taskCompletedAt/studySchedule
    const legacy = JSON.stringify({
      app: 'AI Engineer Roadmap 2026',
      data: {
        completedTasks: { 'w1-t1': true },
        activeReviewLog: { '2026-11-19': ['py-dict-comp'] },
        consistentWeeks: 2,
      },
    });
    const restoredLegacy = parseBackupJson(legacy, '2026-11-20');
    expect(restoredLegacy.completedTasks).toEqual({ 'w1-t1': true });
    expect(restoredLegacy.taskCompletedAt).toEqual({ 'w1-t1': '2026-11-20' });
    expect(restoredLegacy.taskReviews).toEqual({});
    expect(restoredLegacy.dailyReviewDates).toEqual({ '2026-11-19': true });
    expect(restoredLegacy.consistentWeeks).toBe(2);
    expect(restoredLegacy.studySchedule).toEqual({
      mode: 'fixed',
      hoursPerDay: 2,
      studyDays: [1, 2, 3, 4, 5, 6],
    });
  });
});
