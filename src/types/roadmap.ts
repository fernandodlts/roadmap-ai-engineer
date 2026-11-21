export type TabId = 'dashboard' | 'roadmap' | 'projetos' | 'biblioteca' | 'rotina' | 'ritmo';

export interface NavTab {
  id: Exclude<TabId, 'ritmo'>;
  label: string;
}

export type ScheduleMode = 'fixed' | 'free';

/** Dia da semana seguindo Date.prototype.getDay(): 0 = Dom ... 6 = Sáb */
export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface StudySchedule {
  mode: ScheduleMode;
  hoursPerDay: number;
  studyDays: WeekdayIndex[];
}

export interface Phase {
  id: number;
  code: string;
  title: string;
  weeksLabel: string;
  hours: number;
  isMilestoneTarget: boolean;
  objective: string;
}

export interface RoadmapTask {
  id: string;
  hours: number;
  tag: string;
  text: string;
}

export interface RoadmapWeek {
  week: number;
  phaseId: number;
  title: string;
  isProjectWeek?: boolean;
  isMilestoneWeek?: boolean;
  tasks: RoadmapTask[];
}

export type ProjectStepKey = 'code' | 'variation' | 'github' | 'linkedin';

export interface ProjectStep {
  key: ProjectStepKey;
  label: string;
}

export interface Project {
  id: string;
  number: number;
  phaseId: number;
  week: number;
  requiredForJobs: boolean;
  title: string;
  subtitle: string;
  description: string;
}

export type ResourceType =
  | 'Vídeo / Curso'
  | 'Guia / Doc'
  | 'GitHub / Arquivo'
  | 'Livro'
  | 'Plataforma / Fonte';

export interface StudyResource {
  id: string;
  phaseId: number;
  type: ResourceType;
  title: string;
  source: string;
  url: string;
}

export type RoutineDayId = 'dom' | 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab';

export interface RoutineDay {
  id: RoutineDayId;
  weekday: WeekdayIndex;
  short: string;
  name: string;
  focus: string;
}

export type TimerPresetId = 'review' | 'theory' | 'practice' | 'pomodoro';

export interface TimerPreset {
  id: TimerPresetId;
  label: string;
  shortLabel: string;
  minutes: number;
  desc: string;
}

export type ReviewIntervalDays = 1 | 7 | 21;

export type PromptFocusMode = 'python-sql' | 'python' | 'sql' | 'due-topics';

export interface PracticePlatform {
  id: string;
  name: string;
  badge: string;
  description: string;
  url: string;
}

export interface SpacedReviewItem {
  task: RoadmapTask;
  week: number;
  weekTitle: string;
  phaseId: number;
  phaseCode: string;
  completedDate: string;
  daysSince: number;
  nextInterval: ReviewIntervalDays;
  daysUntilDue: number;
  completedIntervals: ReviewIntervalDays[];
  weekNote: string;
}

export interface SpacedReviewQueue {
  dueToday: SpacedReviewItem[];
  upcoming: SpacedReviewItem[];
  masteredCount: number;
  totalTracked: number;
}

export interface CareerTip {
  id: string;
  title: string;
  accent: 'cyan' | 'indigo' | 'emerald' | 'amber';
  body: string;
  highlight?: string;
}

export interface RoadmapState {
  completedTasks: Record<string, boolean>;
  taskCompletedAt: Record<string, string>;
  taskReviews: Record<string, ReviewIntervalDays[]>;
  dailyReviewDates: Record<string, boolean>;
  weekNotes: Record<number, string>;
  projectSteps: Record<string, Partial<Record<ProjectStepKey, boolean>>>;
  projectLinks: Record<string, string>;
  studiedResources: Record<string, boolean>;
  favoriteResources: Record<string, boolean>;
  weeklyDays: Partial<Record<RoutineDayId, boolean>>;
  consistentWeeks: number;
  studySchedule: StudySchedule;
}

export interface EstimatedDateResult {
  text: string;
  isDone: boolean;
  isFreePace: boolean;
  studyDaysNeeded: number;
}

export interface GoalMetrics {
  totalHours: number;
  doneHours: number;
  remainingHours: number;
  remainingDays: number | null;
  remainingWeeks: number | null;
  totalWeeksAtPace: number | null;
  percent: number;
  totalTasks: number;
  doneTasks: number;
  eta: EstimatedDateResult;
}

export interface MilestoneMetrics extends GoalMetrics {
  isReady: boolean;
}

export interface OverallMetrics extends GoalMetrics {
  isDone: boolean;
}

export interface PhaseStat {
  totalHours: number;
  doneHours: number;
  totalTasks: number;
  doneTasks: number;
  percent: number;
}

export interface NextPendingTask {
  task: RoadmapTask;
  week: number;
  weekTitle: string;
  phaseId: number;
  phase: Phase;
}

export interface ScheduleMetricsSummary {
  mode: ScheduleMode;
  hoursPerDay: number;
  daysPerWeek: number;
  hoursPerWeek: number;
  daysShortLabel: string;
  summaryLabel: string;
}

export interface RoadmapMetrics {
  schedule: ScheduleMetricsSummary;
  milestone: MilestoneMetrics;
  overall: OverallMetrics;
  phaseStats: Record<number, PhaseStat>;
  nextPendingTask: NextPendingTask | null;
}

export type ToastVariant = 'indigo' | 'emerald' | 'rose' | 'amber';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
}
