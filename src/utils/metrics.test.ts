import { describe, expect, it } from 'vitest';
import { DEFAULT_STUDY_SCHEDULE, PHASES, WEEKS } from '../data';
import type { StudySchedule } from '../types/roadmap';
import {
  calculateEstimatedDate,
  computeMetrics,
  formatHours,
  formatStudyDaysShort,
  getLocalDateKey,
} from './metrics';

describe('roadmap data integrity & metrics', () => {
  it('sums exactly 180h for milestone (Phases 0-5) and 228h overall (Phases 0-7)', () => {
    const metrics = computeMetrics(
      {},
      DEFAULT_STUDY_SCHEDULE,
      PHASES,
      WEEKS,
      new Date('2026-11-19T12:00:00'),
    );

    expect(metrics.milestone.totalHours).toBe(180);
    expect(metrics.milestone.remainingHours).toBe(180);
    expect(metrics.milestone.remainingDays).toBe(90);
    expect(metrics.milestone.remainingWeeks).toBe(15);
    expect(metrics.milestone.percent).toBe(0);
    expect(metrics.milestone.isReady).toBe(false);

    expect(metrics.overall.totalHours).toBe(228);
    expect(metrics.overall.remainingHours).toBe(228);
    expect(metrics.overall.remainingDays).toBe(114);
    expect(metrics.overall.remainingWeeks).toBe(19);
    expect(metrics.overall.percent).toBe(0);
    expect(metrics.overall.isDone).toBe(false);

    expect(metrics.nextPendingTask?.task.id).toBe('w1-t1');
  });

  it('matches each phase declared hours with the sum of its week tasks', () => {
    const metrics = computeMetrics(
      {},
      DEFAULT_STUDY_SCHEDULE,
      PHASES,
      WEEKS,
      new Date('2026-11-19T12:00:00'),
    );
    for (const phase of PHASES) {
      expect(metrics.phaseStats[phase.id].totalHours).toBe(phase.hours);
    }
  });

  it('marks milestone ready when all tasks in Phases 0 to 5 are checked', () => {
    const completed: Record<string, boolean> = {};
    for (const week of WEEKS) {
      if (week.phaseId <= 5) {
        for (const task of week.tasks) {
          completed[task.id] = true;
        }
      }
    }

    const metrics = computeMetrics(
      completed,
      DEFAULT_STUDY_SCHEDULE,
      PHASES,
      WEEKS,
      new Date('2026-11-19T12:00:00'),
    );
    expect(metrics.milestone.isReady).toBe(true);
    expect(metrics.milestone.remainingHours).toBe(0);
    expect(metrics.milestone.eta.isDone).toBe(true);

    expect(metrics.overall.isDone).toBe(false);
    expect(metrics.overall.remainingHours).toBe(48);
    expect(metrics.overall.remainingWeeks).toBe(4);
    expect(metrics.nextPendingTask?.phaseId).toBe(6);
  });

  it('skips Sundays on default schedule (2h/day Mon-Sat)', () => {
    const sat = new Date(2026, 10, 21, 12, 0, 0); // Saturday
    expect(sat.getDay()).toBe(6);

    const oneDay = calculateEstimatedDate(2, DEFAULT_STUDY_SCHEDULE, sat);
    expect(oneDay.studyDaysNeeded).toBe(1);
    expect(oneDay.text).toContain('21');

    const twoDays = calculateEstimatedDate(4, DEFAULT_STUDY_SCHEDULE, sat);
    expect(twoDays.studyDaysNeeded).toBe(2);
    expect(twoDays.text).toContain('23');

    const sun = new Date(2026, 10, 22, 12, 0, 0); // Sunday
    expect(sun.getDay()).toBe(0);
    const fromSunday = calculateEstimatedDate(2, DEFAULT_STUDY_SCHEDULE, sun);
    expect(fromSunday.text).toContain('23');
  });

  it('recalculates hours/days/weeks/date for custom weekdays and daily hours', () => {
    // 3h/day on Mon, Wed, Fri = 9h/week
    const customSchedule: StudySchedule = {
      mode: 'fixed',
      hoursPerDay: 3,
      studyDays: [1, 3, 5],
    };

    const mon = new Date(2026, 10, 23, 12, 0, 0); // Monday 23 Nov 2026
    expect(mon.getDay()).toBe(1);

    // 6h remaining -> 2 study days -> Mon 23 (day 1) + skips Tue 24 + Wed 25 (day 2)
    const eta = calculateEstimatedDate(6, customSchedule, mon);
    expect(eta.studyDaysNeeded).toBe(2);
    expect(eta.text).toContain('25');

    const metrics = computeMetrics({}, customSchedule, PHASES, WEEKS, mon);
    expect(metrics.schedule.hoursPerWeek).toBe(9);
    expect(metrics.schedule.daysShortLabel).toBe('Seg, Qua, Sex');
    expect(metrics.milestone.remainingDays).toBe(60);
    expect(metrics.milestone.remainingWeeks).toBe(20);
  });

  it('handles free-pace mode without fixed dates or weekly pressure', () => {
    const freeSchedule: StudySchedule = {
      mode: 'free',
      hoursPerDay: 2,
      studyDays: [1, 2, 3, 4, 5, 6],
    };

    const metrics = computeMetrics(
      { 'w1-t1': true },
      freeSchedule,
      PHASES,
      WEEKS,
      new Date(2026, 10, 19, 12, 0, 0),
    );

    expect(metrics.schedule.mode).toBe('free');
    expect(metrics.milestone.doneHours).toBe(6);
    expect(metrics.milestone.remainingHours).toBe(174);
    expect(metrics.milestone.remainingDays).toBeNull();
    expect(metrics.milestone.remainingWeeks).toBeNull();
    expect(metrics.milestone.eta.isFreePace).toBe(true);
    expect(metrics.milestone.eta.text).toBe('No seu ritmo');
  });

  it('formats weekdays labels, hours and local date keys cleanly', () => {
    expect(formatStudyDaysShort([1, 2, 3, 4, 5, 6])).toBe('Seg–Sáb');
    expect(formatStudyDaysShort([1, 2, 3, 4, 5])).toBe('Seg–Sex');
    expect(formatStudyDaysShort([0, 1, 2, 3, 4, 5, 6])).toBe('Todos os dias');
    expect(formatStudyDaysShort([0, 6])).toBe('Sáb, Dom');
    expect(formatHours(2)).toBe('2h');
    expect(formatHours(1.5)).toBe('1,5h');
    expect(getLocalDateKey(new Date(2026, 10, 5, 22, 30, 0))).toBe('2026-11-05');
  });
});
