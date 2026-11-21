import { useCallback, useEffect, useMemo, useState } from 'react';
import { DEFAULT_STUDY_SCHEDULE, ROUTINE_DAYS, WEEKS } from '../data';
import type {
  ProjectStepKey,
  ReviewIntervalDays,
  RoadmapState,
  RoutineDayId,
  StudySchedule,
  ToastVariant,
} from '../types/roadmap';
import { computeMetrics, getLocalDateKey } from '../utils/metrics';
import { computeSpacedReviewQueue } from '../utils/spacedRepetition';
import {
  STORAGE_KEY,
  downloadBackupJson,
  getDefaultState,
  loadState,
  parseBackupJson,
  sanitizeStudySchedule,
  saveState,
} from '../utils/storage';

interface UseRoadmapStateOptions {
  showToast: (message: string, variant?: ToastVariant) => void;
}

export function useRoadmapState({ showToast }: UseRoadmapStateOptions) {
  const [state, setState] = useState<RoadmapState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  // Mantém abas abertas no mesmo navegador sincronizadas
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setState(loadState());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const metrics = useMemo(
    () => computeMetrics(state.completedTasks, state.studySchedule),
    [state.completedTasks, state.studySchedule],
  );

  const todayKey = getLocalDateKey();

  const spacedReviewQueue = useMemo(
    () =>
      computeSpacedReviewQueue(
        state.completedTasks,
        state.taskCompletedAt,
        state.taskReviews,
        state.weekNotes,
        todayKey,
      ),
    [
      state.completedTasks,
      state.taskCompletedAt,
      state.taskReviews,
      state.weekNotes,
      todayKey,
    ],
  );

  const notifyMilestoneIfReached = useCallback(
    (
      prevTasks: Record<string, boolean>,
      nextTasks: Record<string, boolean>,
      schedule: StudySchedule,
    ) => {
      const wasReady = computeMetrics(prevTasks, schedule).milestone.isReady;
      const nowReady = computeMetrics(nextTasks, schedule).milestone.isReady;
      if (!wasReady && nowReady) {
        showToast(
          '🎉 Parabéns! Você atingiu 100% das Fases 0 a 5 e já pode aplicar às vagas!',
          'emerald',
        );
      }
    },
    [showToast],
  );

  const toggleTask = useCallback(
    (taskId: string) => {
      const dateKey = getLocalDateKey();
      setState((prev) => {
        const nextTasks = { ...prev.completedTasks };
        const nextCompletedAt = { ...prev.taskCompletedAt };
        const nextReviews = { ...prev.taskReviews };

        if (nextTasks[taskId]) {
          delete nextTasks[taskId];
          delete nextCompletedAt[taskId];
          delete nextReviews[taskId];
        } else {
          nextTasks[taskId] = true;
          nextCompletedAt[taskId] = dateKey;
        }

        notifyMilestoneIfReached(prev.completedTasks, nextTasks, prev.studySchedule);
        return {
          ...prev,
          completedTasks: nextTasks,
          taskCompletedAt: nextCompletedAt,
          taskReviews: nextReviews,
        };
      });
    },
    [notifyMilestoneIfReached],
  );

  const toggleWholeWeek = useCallback(
    (weekNum: number) => {
      const weekObj = WEEKS.find((w) => w.week === weekNum);
      if (!weekObj) return;

      const dateKey = getLocalDateKey();
      let wasAllDone = false;

      setState((prev) => {
        wasAllDone = weekObj.tasks.every((t) => Boolean(prev.completedTasks[t.id]));
        const nextTasks = { ...prev.completedTasks };
        const nextCompletedAt = { ...prev.taskCompletedAt };
        const nextReviews = { ...prev.taskReviews };

        for (const task of weekObj.tasks) {
          if (wasAllDone) {
            delete nextTasks[task.id];
            delete nextCompletedAt[task.id];
            delete nextReviews[task.id];
          } else {
            if (!nextTasks[task.id]) {
              nextCompletedAt[task.id] = dateKey;
            }
            nextTasks[task.id] = true;
          }
        }

        notifyMilestoneIfReached(prev.completedTasks, nextTasks, prev.studySchedule);
        return {
          ...prev,
          completedTasks: nextTasks,
          taskCompletedAt: nextCompletedAt,
          taskReviews: nextReviews,
        };
      });

      showToast(
        wasAllDone
          ? `Semana ${weekNum} desmarcada.`
          : `Semana ${weekNum} marcada como concluída!`,
        wasAllDone ? 'indigo' : 'emerald',
      );
    },
    [notifyMilestoneIfReached, showToast],
  );

  const updateWeekNote = useCallback((weekNum: number, value: string) => {
    setState((prev) => ({
      ...prev,
      weekNotes: {
        ...prev.weekNotes,
        [weekNum]: value,
      },
    }));
  }, []);

  const toggleProjectStep = useCallback((projId: string, stepKey: ProjectStepKey) => {
    setState((prev) => {
      const current = prev.projectSteps[projId] ?? {};
      return {
        ...prev,
        projectSteps: {
          ...prev.projectSteps,
          [projId]: {
            ...current,
            [stepKey]: !current[stepKey],
          },
        },
      };
    });
  }, []);

  const updateProjectLink = useCallback((projId: string, value: string) => {
    setState((prev) => ({
      ...prev,
      projectLinks: {
        ...prev.projectLinks,
        [projId]: value,
      },
    }));
  }, []);

  const toggleStudiedResource = useCallback((resId: string) => {
    setState((prev) => {
      const next = { ...prev.studiedResources };
      if (next[resId]) {
        delete next[resId];
      } else {
        next[resId] = true;
      }
      return { ...prev, studiedResources: next };
    });
  }, []);

  const toggleFavoriteResource = useCallback((resId: string) => {
    setState((prev) => {
      const next = { ...prev.favoriteResources };
      if (next[resId]) {
        delete next[resId];
      } else {
        next[resId] = true;
      }
      return { ...prev, favoriteResources: next };
    });
  }, []);

  const toggleWeeklyDay = useCallback((dayId: RoutineDayId) => {
    setState((prev) => ({
      ...prev,
      weeklyDays: {
        ...prev.weeklyDays,
        [dayId]: !prev.weeklyDays[dayId],
      },
    }));
  }, []);

  const startNewRoutineWeek = useCallback(() => {
    let doneDays = 0;
    let requiredDays = 1;
    let nextConsistent = 0;

    setState((prev) => {
      const activeDays =
        prev.studySchedule.mode === 'fixed'
          ? ROUTINE_DAYS.filter((d) => prev.studySchedule.studyDays.includes(d.weekday))
          : ROUTINE_DAYS;

      doneDays = activeDays.filter((d) => Boolean(prev.weeklyDays[d.id])).length;
      requiredDays =
        prev.studySchedule.mode === 'free'
          ? 1
          : Math.max(1, Math.ceil(activeDays.length * 0.65));

      nextConsistent =
        doneDays >= requiredDays ? (prev.consistentWeeks || 0) + 1 : prev.consistentWeeks || 0;

      return {
        ...prev,
        weeklyDays: {},
        consistentWeeks: nextConsistent,
      };
    });

    if (doneDays >= requiredDays) {
      showToast(
        `🔥 Semana registrada! Total de ${nextConsistent} semana(s) consistente(s).`,
        'emerald',
      );
    } else if (doneDays > 0) {
      showToast(
        `Nova semana iniciada! Marque pelo menos ${requiredDays} dia(s) para pontuar consistência.`,
        'indigo',
      );
    } else {
      showToast('Tracker semanal limpo para a nova semana.', 'indigo');
    }
  }, [showToast]);

  const completeTaskReview = useCallback(
    (taskId: string, interval: ReviewIntervalDays) => {
      const dateKey = getLocalDateKey();
      setState((prev) => {
        const current = prev.taskReviews[taskId] ?? [];
        if (current.includes(interval)) return prev;
        const nextIntervals = [...current, interval].sort((a, b) => a - b) as ReviewIntervalDays[];
        return {
          ...prev,
          taskReviews: {
            ...prev.taskReviews,
            [taskId]: nextIntervals,
          },
          dailyReviewDates: {
            ...prev.dailyReviewDates,
            [dateKey]: true,
          },
        };
      });

      const nextStageMsg =
        interval === 1
          ? 'Revisão D+1 concluída! Próxima revisão agendada para D+7.'
          : interval === 7
            ? 'Revisão D+7 concluída! Última revisão agendada para D+21.'
            : '🏆 Revisão D+21 concluída! Tópico consolidado na memória de longo prazo!';
      showToast(nextStageMsg, 'emerald');
    },
    [showToast],
  );

  const toggleTodayDailyReview = useCallback(() => {
    const dateKey = getLocalDateKey();
    setState((prev) => {
      const nextDates = { ...prev.dailyReviewDates };
      if (nextDates[dateKey]) {
        delete nextDates[dateKey];
      } else {
        nextDates[dateKey] = true;
      }
      return {
        ...prev,
        dailyReviewDates: nextDates,
      };
    });
  }, []);

  const updateStudySchedule = useCallback((nextSchedule: StudySchedule) => {
    setState((prev) => ({
      ...prev,
      studySchedule: sanitizeStudySchedule(nextSchedule),
    }));
  }, []);

  const resetStudySchedule = useCallback(() => {
    setState((prev) => ({
      ...prev,
      studySchedule: {
        ...DEFAULT_STUDY_SCHEDULE,
        studyDays: [...DEFAULT_STUDY_SCHEDULE.studyDays],
      },
    }));
    showToast('Ritmo restaurado para o padrão (2h/dia • Seg–Sáb).', 'indigo');
  }, [showToast]);

  const exportBackup = useCallback(() => {
    try {
      downloadBackupJson(state);
      showToast('Backup JSON exportado com sucesso!', 'emerald');
    } catch (err) {
      console.error(err);
      showToast('Não foi possível exportar o backup.', 'rose');
    }
  }, [state, showToast]);

  const importBackupFromText = useCallback(
    (rawText: string) => {
      try {
        const restored = parseBackupJson(rawText);
        setState(restored);
        showToast('Backup importado e progresso restaurado com sucesso!', 'emerald');
      } catch (err) {
        console.error(err);
        showToast('Arquivo JSON inválido. Verifique se é um backup gerado por este site.', 'rose');
      }
    },
    [showToast],
  );

  const resetAllProgress = useCallback(() => {
    setState(getDefaultState());
    showToast('Todo o progresso foi resetado.', 'rose');
  }, [showToast]);

  return {
    state,
    metrics,
    spacedReviewQueue,
    toggleTask,
    toggleWholeWeek,
    updateWeekNote,
    toggleProjectStep,
    updateProjectLink,
    toggleStudiedResource,
    toggleFavoriteResource,
    toggleWeeklyDay,
    startNewRoutineWeek,
    completeTaskReview,
    toggleTodayDailyReview,
    updateStudySchedule,
    resetStudySchedule,
    exportBackup,
    importBackupFromText,
    resetAllProgress,
  };
}
