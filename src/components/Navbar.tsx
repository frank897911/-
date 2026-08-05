import React from 'react';
import { MapPin, Calendar, ArrowRightLeft, Smartphone, Monitor } from 'lucide-react';

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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#F1E9DB] px-4 py-3 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: App Logo & Title */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectTab('itinerary')}>
          <div className="w-8 h-8 rounded-full bg-[#FFF9F2] border border-[#F1E9DB] flex items-center justify-center text-[#4A4A4A]">
            <MapPin className="w-4 h-4 text-[#D45068]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-bold text-[#4A4A4A] leading-tight flex items-center gap-1.5">
              <span>{tripTitle}</span>
            </h1>
            <div className="text-[11px] text-[#8C827A] flex items-center gap-1 font-medium">
              <Calendar className="w-3 h-3 text-[#2B7A82]" />
              <span>10/08 ～ 10/13</span>
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
