import React from 'react';
import { ActiveTab } from '../types';
import { CalendarRange, CloudSun, UtensilsCrossed, ShoppingBag, Wrench, Bot } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'itinerary', label: '每日行程', icon: <CalendarRange className="w-5 h-5" /> },
    { id: 'weather', label: '天氣預報', icon: <CloudSun className="w-5 h-5" /> },
    { id: 'gourmet', label: '美食清單', icon: <UtensilsCrossed className="w-5 h-5" /> },
    { id: 'shopping', label: '購物清單', icon: <ShoppingBag className="w-5 h-5" /> },
    { id: 'tools', label: '實用資訊', icon: <Wrench className="w-5 h-5" /> },
    { id: 'ai', label: 'AI 助手', icon: <Bot className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F1E9DB] shadow-xs pb-safe">
      <div className="max-w-md mx-auto px-2 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all ${
                isActive ? 'text-[#332C2B] font-bold' : 'text-[#8C827A] hover:text-[#4A4A4A]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-[#F8C3CD]/20 border border-[#F8C3CD]/40 rounded-2xl -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <div className="relative">
                {item.icon}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
