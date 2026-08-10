import React from 'react';
import { MapPin, Calendar, ArrowRightLeft, Smartphone, Monitor, Edit3, Users, Cloud } from 'lucide-react';

interface NavbarProps {
  tripTitle: string;
  startDate: string;
  endDate: string;
  exchangeRate: number;
  onOpenExchangeModal: () => void;
  onOpenEditTripModal?: () => void;
  onOpenSyncModal?: () => void;
  isSyncing?: boolean;
  isOnline?: boolean;
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
  onOpenEditTripModal,
  onOpenSyncModal,
  isSyncing = false,
  isOnline = true,
  isMobileFrameMode,
  onToggleFrameMode,
  onSelectTab,
}) => {
  const formatShortDate = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}`;
    }
    return dateStr;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#F1E9DB] px-4 py-3 transition-all">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Left: App Logo & Title */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full bg-[#FFF9F2] border border-[#F1E9DB] flex items-center justify-center text-[#4A4A4A] cursor-pointer"
            onClick={() => onSelectTab('itinerary')}
          >
            <MapPin className="w-4 h-4 text-[#D45068]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1
                className="text-sm sm:text-base font-bold text-[#4A4A4A] leading-tight cursor-pointer"
                onClick={() => onSelectTab('itinerary')}
              >
                {tripTitle}
              </h1>
              {onOpenEditTripModal && (
                <button
                  onClick={onOpenEditTripModal}
                  className="p-0.5 text-[#8C827A] hover:text-[#4A4A4A] transition-colors"
                  title="編輯行程標題與日期"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="text-[11px] text-[#8C827A] flex items-center gap-1 font-medium mt-0.5 font-mono">
              <Calendar className="w-3 h-3 text-[#2B7A82]" />
              <span>
                {formatShortDate(startDate)} ～ {formatShortDate(endDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions: Firebase Co-editing, Currency Converter & View Mode */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Firebase Co-editing Button */}
          {onOpenSyncModal && (
            <button
              onClick={onOpenSyncModal}
              title="旅伴共同編輯與雲端同步設定"
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E2EAD8] hover:bg-[#C5D5B5] text-[#3B523A] rounded-full border border-[#C5D5B5] text-xs font-bold transition-all active:scale-95 shadow-2xs"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <Users className="w-3.5 h-3.5 text-[#3B523A]" />
              <span className="hidden sm:inline">旅伴共同編輯</span>
              <span className="sm:hidden">共編</span>
            </button>
          )}

          {/* Currency Pill */}
          <button
            onClick={onOpenExchangeModal}
            title="匯率試算與設定"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF9F2] hover:bg-[#FFF2E0] text-[#7A621E] rounded-full border border-[#F1E9DB] text-xs font-semibold transition-all active:scale-95"
          >
            <ArrowRightLeft className="w-3 h-3 text-[#D49E24]" />
            <span className="hidden sm:inline">1 JPY = {exchangeRate} TWD</span>
            <span className="sm:hidden">{exchangeRate}</span>
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


