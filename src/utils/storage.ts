import { DEFAULT_STUDY_SCHEDULE } from '../data';
import type {
  ProjectStepKey,
  ReviewIntervalDays,
  RoadmapState,
  RoutineDayId,
  StudySchedule,
  WeekdayIndex,
} from '../types/roadmap';
import { getLocalDateKey } from './metrics';

// Mantém exatamente a mesma chave da versão HTML original para preservar progresso existente
export const STORAGE_KEY = 'ai_engineer_roadmap_2026_spa_v2';

const DATE_KEY_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const VALID_REVIEW_INTERVALS = new Set<ReviewIntervalDays>([1, 7, 21]);

export function getDefaultState(): RoadmapState {
  return {
    completedTasks: {},
    taskCompletedAt: {},
    taskReviews: {},
    dailyReviewDates: {},
    weekNotes: {},
    projectSteps: {},
    projectLinks: {},
    studiedResources: {},
    favoriteResources: {},
    weeklyDays: {},
    consistentWeeks: 0,
    studySchedule: {
      ...DEFAULT_STUDY_SCHEDULE,
      studyDays: [...DEFAULT_STUDY_SCHEDULE.studyDays],
    },
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toBooleanMap(value: unknown): Record<string, boolean> {
  if (!isPlainObject(value)) return {};
  const result: Record<string, boolean> = {};
  for (const [k, v] of Object.entries(value)) {
    if (v === true) result[k] = true;
  }
  return result;
}

function toStringMap(value: unknown): Record<string, string> {
  if (!isPlainObject(value)) return {};
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(value)) {
    if (typeof v === 'string') result[k] = v;
  }
  return result;
}

function toDateKeyMap(value: unknown): Record<string, string> {
  if (!isPlainObject(value)) return {};
  const result: Record<string, string> = {};
  for (const [k, v] of Object.entries(value)) {
    if (typeof v === 'string' && DATE_KEY_REGEX.test(v)) {
      result[k] = v;
    }
  }
  return result;
}

function toTaskReviewsMap(value: unknown): Record<string, ReviewIntervalDays[]> {
  if (!isPlainObject(value)) return {};
  const result: Record<string, ReviewIntervalDays[]> = {};
  for (const [taskId, list] of Object.entries(value)) {
    if (!Array.isArray(list)) continue;
    const unique = new Set<ReviewIntervalDays>();
    for (const item of list) {
      if (typeof item === 'number' && VALID_REVIEW_INTERVALS.has(item as ReviewIntervalDays)) {
        unique.add(item as ReviewIntervalDays);
      }
    }
    if (unique.size > 0) {
      result[taskId] = Array.from(unique).sort((a, b) => a - b);
    }
  }
  return result;
}

function toDailyReviewDates(
  dailyDatesRaw: unknown,
  legacyActiveReviewLog: unknown,
): Record<string, boolean> {
  const result: Record<string, boolean> = {};

  if (isPlainObject(dailyDatesRaw)) {
    for (const [dateKey, flag] of Object.entries(dailyDatesRaw)) {
      if (DATE_KEY_REGEX.test(dateKey) && flag === true) {
        result[dateKey] = true;
      }
    }
  }

  // Migração transparente da estrutura antiga activeReviewLog -> dailyReviewDates
  if (isPlainObject(legacyActiveReviewLog)) {
    for (const [dateKey, ids] of Object.entries(legacyActiveReviewLog)) {
      if (DATE_KEY_REGEX.test(dateKey) && Array.isArray(ids) && ids.length > 0) {
        result[dateKey] = true;
      }
    }
  }

  return result;
}

function toWeekNotesMap(value: unknown): Record<number, string> {
  if (!isPlainObject(value)) return {};
  const result: Record<number, string> = {};
  for (const [k, v] of Object.entries(value)) {
    const num = Number(k);
    if (Number.isInteger(num) && typeof v === 'string') {
      result[num] = v;
    }
  }
  return result;
}

function toProjectStepsMap(
  value: unknown,
): Record<string, Partial<Record<ProjectStepKey, boolean>>> {
  if (!isPlainObject(value)) return {};
  const validKeys: ProjectStepKey[] = ['code', 'variation', 'github', 'linkedin'];
  const result: Record<string, Partial<Record<ProjectStepKey, boolean>>> = {};
  for (const [projId, steps] of Object.entries(value)) {
    if (!isPlainObject(steps)) continue;
    const cleaned: Partial<Record<ProjectStepKey, boolean>> = {};
    for (const key of validKeys) {
      if (steps[key] === true) cleaned[key] = true;
    }
    result[projId] = cleaned;
  }
  return result;
}

function toWeeklyDaysMap(value: unknown): Partial<Record<RoutineDayId, boolean>> {
  if (!isPlainObject(value)) return {};
  const validDays: RoutineDayId[] = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
  const result: Partial<Record<RoutineDayId, boolean>> = {};
  for (const day of validDays) {
    if (value[day] === true) result[day] = true;
  }
  return result;
}

export function sanitizeStudySchedule(value: unknown): StudySchedule {
  if (!isPlainObject(value)) {
    return {
      ...DEFAULT_STUDY_SCHEDULE,
      studyDays: [...DEFAULT_STUDY_SCHEDULE.studyDays],
    };
  }

  const mode = value.mode === 'free' ? 'free' : 'fixed';

  const rawHours =
    typeof value.hoursPerDay === 'number' ? value.hoursPerDay : DEFAULT_STUDY_SCHEDULE.hoursPerDay;
  const clampedHours = Number.isFinite(rawHours)
    ? Math.min(12, Math.max(0.5, Math.round(rawHours * 2) / 2))
    : DEFAULT_STUDY_SCHEDULE.hoursPerDay;

  let studyDays: WeekdayIndex[] = [];
  if (Array.isArray(value.studyDays)) {
    const validSet = new Set<WeekdayIndex>();
    for (const item of value.studyDays) {
      if (typeof item === 'number' && Number.isInteger(item) && item >= 0 && item <= 6) {
        validSet.add(item as WeekdayIndex);
      }
    }
    studyDays = Array.from(validSet).sort((a, b) => a - b);
  }

  if (studyDays.length === 0) {
    studyDays = [...DEFAULT_STUDY_SCHEDULE.studyDays];
  }

  return {
    mode,
    hoursPerDay: clampedHours,
    studyDays,
  };
}

export function sanitizeState(raw: unknown, fallbackDateKey: string = getLocalDateKey()): RoadmapState {
  if (!isPlainObject(raw)) return getDefaultState();

  const consistentWeeks =
    typeof raw.consistentWeeks === 'number' && Number.isFinite(raw.consistentWeeks)
      ? Math.max(0, Math.floor(raw.consistentWeeks))
      : 0;

  const completedTasks = toBooleanMap(raw.completedTasks);
  const rawCompletedAt = toDateKeyMap(raw.taskCompletedAt);
  const taskCompletedAt: Record<string, string> = {};

  // Mantém datas apenas de tarefas concluídas; se uma tarefa antiga não tinha data, inicia o ciclo hoje
  for (const taskId of Object.keys(completedTasks)) {
    taskCompletedAt[taskId] = rawCompletedAt[taskId] ?? fallbackDateKey;
  }

  const rawReviews = toTaskReviewsMap(raw.taskReviews);
  const taskReviews: Record<string, ReviewIntervalDays[]> = {};
  for (const taskId of Object.keys(completedTasks)) {
    if (rawReviews[taskId]) {
      taskReviews[taskId] = rawReviews[taskId];
    }
  }

  return {
    completedTasks,
    taskCompletedAt,
    taskReviews,
    dailyReviewDates: toDailyReviewDates(raw.dailyReviewDates, raw.activeReviewLog),
    weekNotes: toWeekNotesMap(raw.weekNotes),
    projectSteps: toProjectStepsMap(raw.projectSteps),
    projectLinks: toStringMap(raw.projectLinks),
    studiedResources: toBooleanMap(raw.studiedResources),
    favoriteResources: toBooleanMap(raw.favoriteResources),
    weeklyDays: toWeeklyDaysMap(raw.weeklyDays),
    consistentWeeks,
    studySchedule: sanitizeStudySchedule(raw.studySchedule),
  };
}

export function loadState(): RoadmapState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    return sanitizeState(JSON.parse(raw));
  } catch (err) {
    console.error('Erro ao carregar localStorage:', err);
    return getDefaultState();
  }
}

export function saveState(state: RoadmapState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Erro ao salvar localStorage:', err);
  }
}

/**
 * Normaliza e valida uma URL externa (bloqueia protocolos inseguros como javascript:/data:).
 */
export function normalizeExternalUrl(rawUrl: string): string {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return '';

  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed) && !/^https?:\/\//i.test(trimmed)) {
    return '';
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    if (!parsed.hostname.includes('.')) {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

export interface BackupPayload {
  app: string;
  version: number;
  exportedAt: string;
  data: RoadmapState;
}

export function buildBackupPayload(state: RoadmapState): BackupPayload {
  return {
    app: 'AI Engineer Roadmap',
    version: 3,
    exportedAt: new Date().toISOString(),
    data: state,
  };
}

export function parseBackupJson(rawText: string, fallbackDateKey?: string): RoadmapState {
  const parsed: unknown = JSON.parse(rawText);
  if (!isPlainObject(parsed)) {
    throw new Error('Formato JSON inválido');
  }
  const candidate = 'data' in parsed && isPlainObject(parsed.data) ? parsed.data : parsed;
  return sanitizeState(candidate, fallbackDateKey);
}

export function downloadBackupJson(state: RoadmapState): void {
  const payload = buildBackupPayload(state);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `roadmap-ai-engineer-backup-${getLocalDateKey()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
