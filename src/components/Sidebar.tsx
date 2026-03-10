import React from 'react';
import { LayoutDashboard, BrainCircuit, History, Settings, LogOut } from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
    { id: 'ai-analysis', label: 'AI 분석', icon: BrainCircuit },
    { id: 'history', label: '시청 기록', icon: History },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-[#1a0b0b] border-r border-white/5 flex flex-col p-6">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/20">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-red-600 ml-0.5" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">TubeDiet</h1>
          <p className="text-[10px] text-red-500 font-medium uppercase tracking-widest">튜브다이어트</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
              activeTab === item.id 
                ? "bg-red-600/10 text-red-500" 
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
            )}
          >
            <item.icon size={20} className={cn(
              "transition-colors",
              activeTab === item.id ? "text-red-500" : "text-zinc-500 group-hover:text-zinc-300"
            )} />
            <span className="font-medium">{item.label}</span>
            {activeTab === item.id && (
              <motion.div 
                layoutId="active-pill"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
              />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 mb-6">
          <img 
            src="https://picsum.photos/seed/user/100/100" 
            alt="User" 
            className="w-10 h-10 rounded-xl object-cover border border-white/10"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">김튜브</p>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">Premium Member</p>
          </div>
          <button className="text-zinc-500 hover:text-white transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
