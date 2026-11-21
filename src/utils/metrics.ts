import { DEFAULT_STUDY_SCHEDULE, PHASES, WEEKDAYS_META, WEEKS } from '../data';
import type {
  EstimatedDateResult,
  NextPendingTask,
  Phase,
  PhaseStat,
  RoadmapMetrics,
  RoadmapWeek,
  ScheduleMetricsSummary,
  StudySchedule,
  WeekdayIndex,
} from '../types/roadmap';

export const MILESTONE_MAX_PHASE_ID = 5;

/**
 * Formata horas sem zeros desnecessários (ex.: 2 -> "2h", 1.5 -> "1,5h").
 */
export function formatHours(hours: number): string {
  const rounded = Number(hours.toFixed(1));
  return `${String(rounded).replace('.', ',')}h`;
}

/**
 * Formata um resumo legível dos dias de estudo escolhidos (ex.: "Seg–Sáb", "Seg–Sex", "Seg, Qua, Sex").
 */
export function formatStudyDaysShort(studyDays: WeekdayIndex[]): string {
  const unique = new Set(studyDays);
  if (unique.size === 0) return 'Sem dias fixos';
  if (unique.size === 7) return 'Todos os dias';

  const ordered = WEEKDAYS_META.filter((d) => unique.has(d.index));
  const indices = ordered.map((d) => WEEKDAYS_META.findIndex((m) => m.index === d.index));

  // Verifica se formam uma faixa contínua na ordem Seg..Dom (ex.: Seg–Sáb ou Seg–Sex)
  const isContiguous =
    indices.length >= 3 && indices.every((val, idx) => idx === 0 || val === indices[idx - 1] + 1);

  if (isContiguous) {
    return `${ordered[0].short}–${ordered[ordered.length - 1].short}`;
  }

  return ordered.map((d) => d.short).join(', ');
}

export function buildScheduleSummary(schedule: StudySchedule): ScheduleMetricsSummary {
  if (schedule.mode === 'free' || schedule.studyDays.length === 0) {
    return {
      mode: 'free',
      hoursPerDay: schedule.hoursPerDay,
      daysPerWeek: 0,
      hoursPerWeek: 0,
      daysShortLabel: 'No seu ritmo',
      summaryLabel: 'No seu ritmo (sem dias fixos)',
    };
  }

  const daysPerWeek = schedule.studyDays.length;
  const hoursPerWeek = Number((schedule.hoursPerDay * daysPerWeek).toFixed(1));
  const daysShortLabel = formatStudyDaysShort(schedule.studyDays);

  return {
    mode: 'fixed',
    hoursPerDay: schedule.hoursPerDay,
    daysPerWeek,
    hoursPerWeek,
    daysShortLabel,
    summaryLabel: `${formatHours(schedule.hoursPerDay)}/dia (${daysShortLabel})`,
  };
}

/**
 * Retorna a chave de data local no formato YYYY-MM-DD (respeitando o fuso do navegador).
 */
export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calcula a data estimada de término respeitando as horas/dia e os dias da semana configurados.
 * No modo livre ("free"), não impõe data fixa e retorna "No seu ritmo".
 */
export function calculateEstimatedDate(
  remainingHours: number,
  schedule: StudySchedule = DEFAULT_STUDY_SCHEDULE,
  referenceDate: Date = new Date(),
): EstimatedDateResult {
  if (remainingHours <= 0) {
    return {
      text: 'Meta concluída! 🎉',
      isDone: true,
      isFreePace: schedule.mode === 'free',
      studyDaysNeeded: 0,
    };
  }

  if (schedule.mode === 'free' || schedule.studyDays.length === 0 || schedule.hoursPerDay <= 0) {
    return {
      text: 'No seu ritmo',
      isDone: false,
      isFreePace: true,
      studyDaysNeeded: 0,
    };
  }

  const studyDaySet = new Set<number>(schedule.studyDays);
  const studyDaysNeeded = Math.ceil(remainingHours / schedule.hoursPerDay);
  const cursor = new Date(referenceDate.getTime());
  cursor.setHours(12, 0, 0, 0);

  let countedStudyDays = studyDaySet.has(cursor.getDay()) ? 1 : 0;

  while (countedStudyDays < studyDaysNeeded) {
    cursor.setDate(cursor.getDate() + 1);
    if (studyDaySet.has(cursor.getDay())) {
      countedStudyDays += 1;
    }
  }

  const formatted = cursor.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return {
    text: formatted,
    isDone: false,
    isFreePace: false,
    studyDaysNeeded,
  };
}

/**
 * Calcula todas as métricas em tempo real: Meta 1 (Fases 0-5), Meta 2 (Fases 0-7),
 * progresso por fase e próximo passo pendente com base no ritmo personalizado.
 */
export function computeMetrics(
  completedTasks: Record<string, boolean>,
  schedule: StudySchedule = DEFAULT_STUDY_SCHEDULE,
  phases: Phase[] = PHASES,
  weeks: RoadmapWeek[] = WEEKS,
  referenceDate: Date = new Date(),
): RoadmapMetrics {
  const scheduleSummary = buildScheduleSummary(schedule);
  const isFixed = scheduleSummary.mode === 'fixed' && scheduleSummary.hoursPerWeek > 0;

  let mTotalHours = 0;
  let mDoneHours = 0;
  let mTotalTasks = 0;
  let mDoneTasks = 0;

  let allTotalHours = 0;
  let allDoneHours = 0;
  let allTotalTasks = 0;
  let allDoneTasks = 0;

  let nextPendingTask: NextPendingTask | null = null;

  const phaseMap = new Map<number, Phase>();
  const phaseStats: Record<number, PhaseStat> = {};
  for (const phase of phases) {
    phaseMap.set(phase.id, phase);
    phaseStats[phase.id] = {
      totalHours: 0,
      doneHours: 0,
      totalTasks: 0,
      doneTasks: 0,
      percent: 0,
    };
  }

  for (const weekObj of weeks) {
    const isMilestone = weekObj.phaseId <= MILESTONE_MAX_PHASE_ID;
    const pStat = phaseStats[weekObj.phaseId];

    for (const task of weekObj.tasks) {
      const isDone = Boolean(completedTasks[task.id]);

      allTotalHours += task.hours;
      allTotalTasks += 1;
      if (pStat) {
        pStat.totalHours += task.hours;
        pStat.totalTasks += 1;
      }

      if (isDone) {
        allDoneHours += task.hours;
        allDoneTasks += 1;
        if (pStat) {
          pStat.doneHours += task.hours;
          pStat.doneTasks += 1;
        }
      } else if (!nextPendingTask) {
        const phase = phaseMap.get(weekObj.phaseId);
        if (phase) {
          nextPendingTask = {
            task,
            week: weekObj.week,
            weekTitle: weekObj.title,
            phaseId: weekObj.phaseId,
            phase,
          };
        }
      }

      if (isMilestone) {
        mTotalHours += task.hours;
        mTotalTasks += 1;
        if (isDone) {
          mDoneHours += task.hours;
          mDoneTasks += 1;
        }
      }
    }
  }

  for (const phase of phases) {
    const ps = phaseStats[phase.id];
    ps.percent = ps.totalHours > 0 ? Math.round((ps.doneHours / ps.totalHours) * 100) : 0;
  }

  const mRemHours = Math.max(0, mTotalHours - mDoneHours);
  const mRemDays = isFixed ? Number((mRemHours / scheduleSummary.hoursPerDay).toFixed(1)) : null;
  const mRemWeeks = isFixed ? Number((mRemHours / scheduleSummary.hoursPerWeek).toFixed(1)) : null;
  const mTotalWeeksAtPace = isFixed
    ? Number((mTotalHours / scheduleSummary.hoursPerWeek).toFixed(1))
    : null;
  const mPct = mTotalHours > 0 ? Math.round((mDoneHours / mTotalHours) * 100) : 0;

  const allRemHours = Math.max(0, allTotalHours - allDoneHours);
  const allRemDays = isFixed
    ? Number((allRemHours / scheduleSummary.hoursPerDay).toFixed(1))
    : null;
  const allRemWeeks = isFixed
    ? Number((allRemHours / scheduleSummary.hoursPerWeek).toFixed(1))
    : null;
  const allTotalWeeksAtPace = isFixed
    ? Number((allTotalHours / scheduleSummary.hoursPerWeek).toFixed(1))
    : null;
  const allPct = allTotalHours > 0 ? Math.round((allDoneHours / allTotalHours) * 100) : 0;

  return {
    schedule: scheduleSummary,
    milestone: {
      totalHours: mTotalHours,
      doneHours: mDoneHours,
      remainingHours: mRemHours,
      remainingDays: mRemDays,
      remainingWeeks: mRemWeeks,
      totalWeeksAtPace: mTotalWeeksAtPace,
      percent: mPct,
      totalTasks: mTotalTasks,
      doneTasks: mDoneTasks,
      eta: calculateEstimatedDate(mRemHours, schedule, referenceDate),
      isReady: mRemHours === 0,
    },
    overall: {
      totalHours: allTotalHours,
      doneHours: allDoneHours,
      remainingHours: allRemHours,
      remainingDays: allRemDays,
      remainingWeeks: allRemWeeks,
      totalWeeksAtPace: allTotalWeeksAtPace,
      percent: allPct,
      totalTasks: allTotalTasks,
      doneTasks: allDoneTasks,
      eta: calculateEstimatedDate(allRemHours, schedule, referenceDate),
      isDone: allRemHours === 0,
    },
    phaseStats,
    nextPendingTask,
  };
}
