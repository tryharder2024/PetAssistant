import React from 'react';
import { Home, Activity, MessageCircle, User } from 'lucide-react';
import { Tab } from '../types';

interface TabBarProps {
  activeTab: Tab;
  onTabChange?: (tab: Tab) => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: Tab.COMMUNITY, label: '社区', icon: Home },
    { id: Tab.HEALTH, label: '档案', icon: Activity },
    { id: Tab.AI_DOCTOR, label: '问诊', icon: MessageCircle },
    { id: Tab.PROFILE, label: '我的', icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-orange-100/50 pb-safe pt-2 px-6 pb-6 flex justify-between items-end z-40 h-[84px] shadow-[0_-5px_20px_rgba(255,136,83,0.03)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange && onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-16 transition-all duration-200 active:scale-90 ${
              isActive ? 'text-primary' : 'text-stone-300'
            }`}
          >
            <div className={`p-1.5 rounded-2xl transition-all duration-300 ${isActive ? '-translate-y-1 bg-primary/10' : ''}`}>
               <Icon size={isActive ? 24 : 24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'drop-shadow-sm' : ''} />
            </div>
            <span className={`text-[10px] font-bold mt-0.5 transition-opacity ${isActive ? 'opacity-100' : 'opacity-70'}`}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default TabBar;