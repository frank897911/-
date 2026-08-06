import React from 'react';
import { ActiveTab } from '../types';
import { Calendar, Ticket, Wallet, BookOpen, CheckSquare, Users, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'itinerary', label: '行程', icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'bookings', label: '預訂', icon: <Ticket className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'expense', label: '記帳', icon: <Wallet className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'journal', label: '日誌', icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'planning', label: '準備', icon: <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'members', label: '成員', icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'ai', label: 'AI助手', icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-t border-[#EBE3D5] shadow-lg pb-safe">
      <div className="max-w-md mx-auto px-1.5 py-1.5 flex items-center justify-between overflow-x-auto no-scrollbar gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all flex-1 min-w-[50px] ${
                isActive ? 'text-[#3B523A] font-bold' : 'text-[#8C827A] hover:text-[#4A4A4A]'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-[#E2EAD8] border border-[#C5D5B5] rounded-xl -z-10 shadow-[2px_2px_0px_#C5D5B5]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <div className="relative">
                {item.icon}
              </div>
              <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight font-medium whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

