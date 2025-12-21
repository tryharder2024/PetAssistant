import React, { useState } from 'react';
import TabBar from './components/TabBar';
import CommunityView from './views/CommunityView';
import HealthView from './views/HealthView';
import AIView from './views/AIView';
import ProfileView from './views/ProfileView';
import { Tab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.COMMUNITY);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.COMMUNITY:
        return <CommunityView />;
      case Tab.HEALTH:
        // Pass the visibility toggler to HealthView
        return <HealthView onToggleTabBar={setIsTabBarVisible} />;
      case Tab.AI_DOCTOR:
        return <AIView />;
      case Tab.PROFILE:
        return <ProfileView />;
      default:
        return <CommunityView />;
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#e0e0e0] sm:py-10">
      <div className="w-full sm:max-w-[430px] h-[100dvh] sm:h-[852px] bg-background sm:rounded-[2.5rem] relative shadow-2xl overflow-hidden flex flex-col border-4 border-gray-300 sm:border-8 sm:border-gray-800 box-border">
        {/* Main Content Area */}
        <main className="flex-1 h-full overflow-hidden relative">
          {renderContent()}
        </main>

        {/* Tab Navigation - Conditionally rendered */}
        {isTabBarVisible && (
           <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        )}
      </div>
    </div>
  );
};

export default App;