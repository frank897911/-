import React from 'react';
import { UsagiAvatar, PiskeAvatar } from './UsagiPiskeAvatars';
import { Sparkles, Calendar, ArrowRightLeft, Smartphone, Monitor } from 'lucide-react';

interface NavbarProps {
  tripTitle: string;
  startDate: string;
  endDate: string;
  exchangeRate: number;
  onOpenExchangeModal: () => void;
  isMobileFrameMode: boolean;
  onToggleFrameMode: () => void;
  onSelectTab: (tab: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  tripTitle,
  startDate,
  endDate,
  exchangeRate,
  onOpenExchangeModal,
  isMobileFrameMode,
  onToggleFrameMode,
  onSelectTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#F1E9DB] px-4 py-3 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: App Logo & Avatars */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectTab('itinerary')}>
          <div className="flex items-center -space-x-1.5 bg-[#FFF9F2] p-1 rounded-full border border-[#F1E9DB]">
            <UsagiAvatar size={32} mood="excited" />
            <PiskeAvatar size={28} mood="happy" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-bold text-[#4A4A4A] leading-tight flex items-center gap-1.5">
              <span>{tripTitle}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#F8C3CD]" />
            </h1>
            <div className="text-[11px] text-[#8C827A] flex items-center gap-1 font-medium">
              <Calendar className="w-3 h-3 text-[#A5DEE4]" />
              <span>{startDate} ～ {endDate}</span>
            </div>
          </div>
        </div>

        {/* Right Actions: Currency Converter Pill & View Mode Toggle */}
        <div className="flex items-center gap-2">
          {/* Currency Pill */}
          <button
            onClick={onOpenExchangeModal}
            title="匯率試算與設定"
            className="flex items-center gap-1.5 px-3 py-1 bg-[#FFF9F2] hover:bg-[#FFF2E0] text-[#7A621E] rounded-full border border-[#F1E9DB] text-xs font-semibold transition-all active:scale-95"
          >
            <ArrowRightLeft className="w-3 h-3 text-[#D49E24]" />
            <span>1 JPY = {exchangeRate} TWD</span>
          </button>

          {/* Desktop Responsive Frame Toggle */}
          <button
            onClick={onToggleFrameMode}
            title={isMobileFrameMode ? '切換為全螢幕模式' : '切換為手機模擬器模式'}
            className="hidden md:flex items-center justify-center p-1.5 rounded-full bg-white hover:bg-[#FFF9F2] text-[#4A4A4A] border border-[#F1E9DB] text-xs transition-all"
          >
            {isMobileFrameMode ? <Monitor className="w-4 h-4 text-[#4A4A4A]" /> : <Smartphone className="w-4 h-4 text-[#4A4A4A]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
