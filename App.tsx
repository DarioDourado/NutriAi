
import React, { useState } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { Assistant } from './components/Assistant';
import { BottomNav } from './components/Navigation';
import { OnboardingData } from './types';

export type View = 'dashboard' | 'goals' | 'assistant' | 'profile';
export type AssistantMode = 'chat' | 'voice' | 'photo';

function App() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [assistantMode, setAssistantMode] = useState<AssistantMode>('chat');

  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data);
  };
  
  const handleNavigate = (view: View, mode: AssistantMode = 'chat') => {
    setAssistantMode(mode);
    setCurrentView(view);
  };

  const isOnboardingComplete = onboardingData !== null;

  const renderView = () => {
    if (!onboardingData) return null;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'assistant':
        return <Assistant onboardingData={onboardingData} initialMode={assistantMode} onModeReset={() => setAssistantMode('chat')} />;
      case 'profile':
        return <Profile onboardingData={onboardingData} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F8FAFC] max-w-md mx-auto shadow-2xl overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        {isOnboardingComplete ? (
          <>
            <div className="pb-24 h-full">
              {renderView()}
            </div>
            <BottomNav activeView={currentView} onViewChange={(view) => handleNavigate(view)} />
          </>
        ) : (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
      </div>
    </div>
  );
}

export default App;
