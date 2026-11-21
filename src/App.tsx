import { useCallback, useRef, useState } from 'react';
import { Header } from './components/layout/Header';
import { ResetModal } from './components/layout/ResetModal';
import { ToastContainer } from './components/layout/ToastContainer';
import { DashboardTab } from './components/tabs/DashboardTab';
import { LibraryTab } from './components/tabs/LibraryTab';
import { PhasesTab } from './components/tabs/PhasesTab';
import { ProjectsTab } from './components/tabs/ProjectsTab';
import { RoutineTab } from './components/tabs/RoutineTab';
import { ScheduleTab } from './components/tabs/ScheduleTab';
import { useRoadmapState } from './hooks/useRoadmapState';
import { useStudyTimer } from './hooks/useStudyTimer';
import { useToasts } from './hooks/useToasts';
import { useUrlNavigation } from './hooks/useUrlNavigation';

export function App() {
  const { toasts, showToast, dismissToast } = useToasts();
  const { activeTab, activePhaseId, navigateToTab, selectPhase, openPhaseInRoadmap } =
    useUrlNavigation();

  const roadmap = useRoadmapState({ showToast });

  const handleTimerComplete = useCallback(() => {
    showToast('🔔 Bloco de estudo finalizado! Excelente foco!', 'emerald');
  }, [showToast]);

  const timer = useStudyTimer({ onComplete: handleTimerComplete });

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleTriggerImport = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.value = '';
    fileInputRef.current.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = typeof ev.target?.result === 'string' ? ev.target.result : '';
      roadmap.importBackupFromText(content);
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    roadmap.resetAllProgress();
    setResetModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        activeTab={activeTab}
        metrics={roadmap.metrics}
        timerRunning={timer.isRunning}
        timerRemainingSeconds={timer.remainingSeconds}
        onNavigateTab={navigateToTab}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div key={activeTab} className="tab-fade">
          {activeTab === 'dashboard' && (
            <DashboardTab
              metrics={roadmap.metrics}
              onNavigateTab={navigateToTab}
              onOpenPhase={openPhaseInRoadmap}
              onExportBackup={roadmap.exportBackup}
              onTriggerImport={handleTriggerImport}
              onOpenResetModal={() => setResetModalOpen(true)}
            />
          )}

          {activeTab === 'roadmap' && (
            <PhasesTab
              activePhaseId={activePhaseId}
              state={roadmap.state}
              metrics={roadmap.metrics}
              onSelectPhase={selectPhase}
              onToggleTask={roadmap.toggleTask}
              onToggleWholeWeek={roadmap.toggleWholeWeek}
              onUpdateWeekNote={roadmap.updateWeekNote}
            />
          )}

          {activeTab === 'projetos' && (
            <ProjectsTab
              state={roadmap.state}
              onToggleProjectStep={roadmap.toggleProjectStep}
              onUpdateProjectLink={roadmap.updateProjectLink}
              onOpenPhase={openPhaseInRoadmap}
              showToast={showToast}
            />
          )}

          {activeTab === 'biblioteca' && (
            <LibraryTab
              state={roadmap.state}
              onToggleStudied={roadmap.toggleStudiedResource}
              onToggleFavorite={roadmap.toggleFavoriteResource}
            />
          )}

          {activeTab === 'rotina' && (
            <RoutineTab
              state={roadmap.state}
              metrics={roadmap.metrics}
              spacedReviewQueue={roadmap.spacedReviewQueue}
              timer={timer}
              onToggleWeeklyDay={roadmap.toggleWeeklyDay}
              onStartNewWeek={roadmap.startNewRoutineWeek}
              onCompleteTaskReview={roadmap.completeTaskReview}
              onToggleTodayDailyReview={roadmap.toggleTodayDailyReview}
              onNavigateTab={navigateToTab}
              onOpenPhase={openPhaseInRoadmap}
              showToast={showToast}
            />
          )}

          {activeTab === 'ritmo' && (
            <ScheduleTab
              schedule={roadmap.state.studySchedule}
              metrics={roadmap.metrics}
              onUpdateSchedule={roadmap.updateStudySchedule}
              onResetSchedule={roadmap.resetStudySchedule}
              onNavigateTab={navigateToTab}
              showToast={showToast}
            />
          )}
        </div>
      </main>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
        aria-hidden="true"
      />

      <ResetModal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
