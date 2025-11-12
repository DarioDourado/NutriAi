
import React, { useState } from 'react';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';

function App() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);

  return (
    <div className="h-screen w-screen bg-[#F8FAFC] max-w-md mx-auto shadow-2xl overflow-hidden">
      <div className="h-full w-full overflow-y-auto">
        {isOnboardingComplete ? (
          <Dashboard />
        ) : (
          <Onboarding onComplete={() => setIsOnboardingComplete(true)} />
        )}
      </div>
    </div>
  );
}

export default App;
