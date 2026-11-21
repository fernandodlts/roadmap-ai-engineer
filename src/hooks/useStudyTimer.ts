import { useCallback, useEffect, useRef, useState } from 'react';
import { TIMER_PRESETS } from '../data';
import type { TimerPresetId } from '../types/roadmap';
import { formatClock, playCompletionSound } from '../utils/audio';

const DEFAULT_TITLE = 'AI Engineer Roadmap';

interface UseStudyTimerOptions {
  onComplete: () => void;
}

export function useStudyTimer({ onComplete }: UseStudyTimerOptions) {
  const defaultPreset = TIMER_PRESETS[0];
  const [presetId, setPresetId] = useState<TimerPresetId>(defaultPreset.id);
  const [totalSeconds, setTotalSeconds] = useState<number>(defaultPreset.minutes * 60);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(defaultPreset.minutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [finishedBanner, setFinishedBanner] = useState<boolean>(false);

  const endTimestampRef = useRef<number | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const stopLoop = useCallback(() => {
    endTimestampRef.current = null;
    setIsRunning(false);
  }, []);

  // Sincronização precisa baseada em relógio real (não atrasa ao alternar abas/VS Code)
  useEffect(() => {
    if (!isRunning) {
      document.title = DEFAULT_TITLE;
      return;
    }

    const syncClock = () => {
      if (endTimestampRef.current === null) return;
      const msLeft = endTimestampRef.current - Date.now();
      const nextSeconds = Math.max(0, Math.ceil(msLeft / 1000));
      setRemainingSeconds(nextSeconds);

      if (nextSeconds <= 0) {
        stopLoop();
        setFinishedBanner(true);
        document.title = '🔔 Bloco finalizado! — AI Engineer Roadmap';
        playCompletionSound();
        onCompleteRef.current();
      } else {
        document.title = `⏱ ${formatClock(nextSeconds)} — AI Engineer Roadmap`;
      }
    };

    syncClock();
    const intervalId = window.setInterval(syncClock, 250);
    window.addEventListener('visibilitychange', syncClock);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('visibilitychange', syncClock);
    };
  }, [isRunning, stopLoop]);

  useEffect(() => {
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, []);

  const selectPreset = useCallback(
    (nextPresetId: TimerPresetId, autoStart = false) => {
      const preset = TIMER_PRESETS.find((p) => p.id === nextPresetId);
      if (!preset) return;
      const secs = preset.minutes * 60;
      setPresetId(preset.id);
      setTotalSeconds(secs);
      setRemainingSeconds(secs);
      setFinishedBanner(false);

      if (autoStart) {
        endTimestampRef.current = Date.now() + secs * 1000;
        setIsRunning(true);
      } else {
        stopLoop();
      }
    },
    [stopLoop],
  );

  const start = useCallback(() => {
    if (isRunning) return;
    const baseSeconds = remainingSeconds <= 0 ? totalSeconds : remainingSeconds;
    setRemainingSeconds(baseSeconds);
    setFinishedBanner(false);
    endTimestampRef.current = Date.now() + baseSeconds * 1000;
    setIsRunning(true);
  }, [isRunning, remainingSeconds, totalSeconds]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    if (endTimestampRef.current !== null) {
      const nextSeconds = Math.max(0, Math.ceil((endTimestampRef.current - Date.now()) / 1000));
      setRemainingSeconds(nextSeconds);
    }
    stopLoop();
  }, [isRunning, stopLoop]);

  const reset = useCallback(() => {
    stopLoop();
    setRemainingSeconds(totalSeconds);
    setFinishedBanner(false);
  }, [stopLoop, totalSeconds]);

  const activePreset = TIMER_PRESETS.find((p) => p.id === presetId) ?? defaultPreset;
  const progressPercent =
    totalSeconds > 0
      ? Math.min(100, Math.max(0, Math.round(((totalSeconds - remainingSeconds) / totalSeconds) * 100)))
      : 0;

  return {
    presetId,
    activePreset,
    totalSeconds,
    remainingSeconds,
    isRunning,
    finishedBanner,
    progressPercent,
    selectPreset,
    start,
    pause,
    reset,
  };
}
