
import React, { useState } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { BottomNav } from './components/Navigation';
import { OnboardingData } from './types';

export type View = 'dashboard' | 'goals' | 'assistant' | 'profile';

function App() {
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data);
  };
  
  const isOnboardingComplete = onboardingData !== null;

  const renderView = () => {
    if (!onboardingData) return null;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'profile':
        return <Profile onboardingData={onboardingData} />;
      // Add other views here later
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F8FAFC] max-w-md mx-auto shadow-2xl overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        {isOnboardingComplete ? (
          <>
            <div className="pb-24">
              {renderView()}
            </div>
            <BottomNav activeView={currentView} onViewChange={setCurrentView} />
          </>
        ) : (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}
      </div>
    </div>
  );
}

export default App;
