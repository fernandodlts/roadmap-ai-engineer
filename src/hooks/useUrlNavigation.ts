import { useCallback, useEffect, useState } from 'react';
import { NAV_TABS, PHASES } from '../data';
import type { TabId } from '../types/roadmap';

const VALID_TABS = new Set<TabId>([...NAV_TABS.map((t) => t.id), 'ritmo']);
const VALID_PHASE_IDS = new Set<number>(PHASES.map((p) => p.id));

function readLocationState(): { tab: TabId; phaseId: number } {
  if (typeof window === 'undefined') {
    return { tab: 'dashboard', phaseId: 0 };
  }

  const params = new URLSearchParams(window.location.search);
  const rawTab = params.get('tab') as TabId | null;
  const rawPhase = params.get('phase');

  const tab: TabId = rawTab && VALID_TABS.has(rawTab) ? rawTab : 'dashboard';
  const parsedPhase = rawPhase !== null ? Number(rawPhase) : 0;
  const phaseId = Number.isInteger(parsedPhase) && VALID_PHASE_IDS.has(parsedPhase) ? parsedPhase : 0;

  return { tab, phaseId };
}

function writeLocationState(tab: TabId, phaseId: number, mode: 'push' | 'replace' = 'push'): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (tab === 'dashboard') {
    url.searchParams.delete('tab');
    url.searchParams.delete('phase');
  } else {
    url.searchParams.set('tab', tab);
    if (tab === 'roadmap') {
      url.searchParams.set('phase', String(phaseId));
    } else {
      url.searchParams.delete('phase');
    }
  }

  if (mode === 'push') {
    window.history.pushState({ tab, phaseId }, '', url.toString());
  } else {
    window.history.replaceState({ tab, phaseId }, '', url.toString());
  }
}

export function useUrlNavigation() {
  const initial = readLocationState();
  const [activeTab, setActiveTab] = useState<TabId>(initial.tab);
  const [activePhaseId, setActivePhaseId] = useState<number>(initial.phaseId);

  useEffect(() => {
    const onPopState = () => {
      const next = readLocationState();
      setActiveTab(next.tab);
      setActivePhaseId(next.phaseId);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateToTab = useCallback(
    (tab: TabId) => {
      setActiveTab(tab);
      writeLocationState(tab, activePhaseId, 'push');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [activePhaseId],
  );

  const selectPhase = useCallback((phaseId: number) => {
    if (!VALID_PHASE_IDS.has(phaseId)) return;
    setActivePhaseId(phaseId);
    writeLocationState('roadmap', phaseId, 'push');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openPhaseInRoadmap = useCallback((phaseId: number) => {
    if (!VALID_PHASE_IDS.has(phaseId)) return;
    setActivePhaseId(phaseId);
    setActiveTab('roadmap');
    writeLocationState('roadmap', phaseId, 'push');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    activeTab,
    activePhaseId,
    navigateToTab,
    selectPhase,
    openPhaseInRoadmap,
  };
}
