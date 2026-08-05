import React, { useState } from 'react';
import { ItineraryDay, ItineraryItem, ItemCategory } from '../types';
import {
  MapPin,
  Car,
  Utensils,
  Camera,
  Clock,
  Ticket,
  Plus,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  CloudSun,
  Navigation,
  Edit2,
  Trash2,
  Train,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DailyItineraryViewProps {
  days: ItineraryDay[];
  activeDayId: string;
  onSelectDay: (dayId: string) => void;
  onToggleComplete: (dayId: string, itemId: string) => void;
  onOpenAddItemModal: (dayId: string) => void;
  onOpenEditItemModal: (dayId: string, item: ItineraryItem) => void;
  onDeleteItem: (dayId: string, itemId: string) => void;
  onAddDay: () => void;
}

export const DailyItineraryView: React.FC<DailyItineraryViewProps> = ({
  days,
  activeDayId,
  onSelectDay,
  onToggleComplete,
  onOpenAddItemModal,
  onOpenEditItemModal,
  onDeleteItem,
  onAddDay,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [copiedMapCodeId, setCopiedMapCodeId] = useState<string | null>(null);

  const activeDay = days.find((d) => d.id === activeDayId) || days[0];

  if (!activeDay) return null;

  const filteredItems = activeDay.items.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleCopyMapCode = (itemId: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedMapCodeId(itemId);
    setTimeout(() => setCopiedMapCodeId(null), 2000);
  };

  const openGoogleMaps = (locationName: string, address?: string, mode: 'driving' | 'transit' | 'walking' = 'driving') => {
    const query = encodeURIComponent(address || locationName);
    const travelMode = mode === 'driving' ? 'driving' : mode === 'transit' ? 'transit' : 'walking';
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}&travelmode=${travelMode}`, '_blank');
  };

  const getCategoryTheme = (category: ItemCategory) => {
    switch (category) {
      case 'spot':
        return {
          cardBg: 'bg-white',
          borderColor: 'border-[#F1E9DB]',
          tagBg: 'bg-[#F8C3CD]/20',
          tagText: 'text-[#D45068]',
          badgeText: '📍 景點',
          icon: <Camera className="w-4 h-4 text-[#D45068]" />,
        };
      case 'restaurant':
        return {
          cardBg: 'bg-white',
          borderColor: 'border-[#F1E9DB]',
          tagBg: 'bg-[#FDE08E]/30',
          tagText: 'text-[#9E6B00]',
          badgeText: '🍜 美食',
          icon: <Utensils className="w-4 h-4 text-[#9E6B00]" />,
        };
      case 'transport':
        return {
          cardBg: 'bg-white',
          borderColor: 'border-[#F1E9DB]',
          tagBg: 'bg-[#A5DEE4]/30',
          tagText: 'text-[#2B7A82]',
          badgeText: '🚗 交通',
          icon: <Car className="w-4 h-4 text-[#2B7A82]" />,
        };
      case 'activity':
      default:
        return {
          cardBg: 'bg-white',
          borderColor: 'border-[#F1E9DB]',
          tagBg: 'bg-[#E2D4F0]/30',
          tagText: 'text-[#7B42A6]',
          badgeText: '🛍️ 活動',
          icon: <MapPin className="w-4 h-4 text-[#7B42A6]" />,
        };
    }
  };

  const weather = activeDay.weather;

  return (
    <div className="space-y-4 pb-20">
      {/* Day Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
        {days.map((day) => {
          const isSelected = day.id === activeDay.id;
          return (
            <button
              key={day.id}
              onClick={() => onSelectDay(day.id)}
              className={`flex-shrink-0 flex flex-col items-center px-4 py-2 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-[#4A4A4A] text-white border-[#4A4A4A] font-medium'
                  : 'bg-white text-[#5C554E] border-[#F1E9DB] hover:bg-[#FFF9F2]'
              }`}
            >
              <span className="text-[11px] opacity-80">Day {day.dayNumber}</span>
              <span className="text-xs font-semibold whitespace-nowrap mt-0.5">{day.date.slice(5)}</span>
            </button>
          );
        })}

        <button
          onClick={onAddDay}
          title="新增一天行程"
          className="flex-shrink-0 flex items-center justify-center p-2.5 rounded-xl bg-white border border-dashed border-[#F1E9DB] text-[#8C827A] hover:bg-[#FFF9F2] transition-all"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Weather Forecast Banner */}
      {weather && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3.5 rounded-xl border border-[#F1E9DB]"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFF9F2] rounded-lg border border-[#F1E9DB]">
                <CloudSun className="w-5 h-5 text-[#D49E24]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#4A4A4A]">{weather.city} 天氣</span>
                  <span className="text-xs px-2 py-0.5 bg-[#FDE08E]/25 text-[#9E6B00] font-medium rounded-md border border-[#FDE08E]/50">
                    降雨機率 {weather.rainProb}%
                  </span>
                </div>
                <div className="text-xs text-[#78716C] mt-0.5 flex items-center gap-2">
                  <span className="font-semibold text-[#D45068]">{weather.tempHigh}°C</span>
                  <span>/</span>
                  <span className="font-semibold text-[#2B7A82]">{weather.tempLow}°C</span>
                  <span>｜ {weather.clothesTip}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Filter Pills & Add Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {[
            { id: 'all', label: '全部' },
            { id: 'spot', label: '📍 景點' },
            { id: 'restaurant', label: '🍜 美食' },
            { id: 'transport', label: '🚗 交通' },
            { id: 'activity', label: '🛍️ 活動' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-[#4A4A4A] text-white border-[#4A4A4A]'
                  : 'bg-white text-[#5C554E] border-[#F1E9DB] hover:bg-[#FFF9F2]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Add Item Button */}
        <button
          onClick={() => onOpenAddItemModal(activeDay.id)}
          className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-[#4A4A4A] hover:bg-[#333333] text-white rounded-lg text-xs font-medium transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新增行程</span>
        </button>
      </div>

      {/* Day Title Summary Header */}
      <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-[#F1E9DB]">
        <div>
          <h2 className="text-base font-bold text-[#4A4A4A]">{activeDay.title}</h2>
          <p className="text-xs text-[#8C827A] mt-0.5">
            {activeDay.items.length === 0
              ? '尚未安排行程，可點擊上方「新增行程」加入'
              : `共 ${activeDay.items.length} 個行程 ‧ 已完成 ${activeDay.items.filter((i) => i.completed).length} 個`}
          </p>
        </div>
      </div>

      {/* Itinerary Cards List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl border border-dashed border-[#F1E9DB] p-6 flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFF9F2] border border-[#F1E9DB] flex items-center justify-center text-[#8C827A]">
                <Plus className="w-5 h-5 text-[#8C827A]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#4A4A4A]">尚未安排行程</p>
                <p className="text-xs text-[#8C827A] mt-1">點擊下方按鈕或右上角「新增行程」加入景點、美食或交通點</p>
              </div>
              <button
                onClick={() => onOpenAddItemModal(activeDay.id)}
                className="mt-2 inline-flex items-center gap-1 px-4 py-2 bg-[#4A4A4A] hover:bg-[#333333] text-white text-xs rounded-lg font-medium transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增行程卡片</span>
              </button>
            </motion.div>
          ) : (
            filteredItems.map((item) => {
              const theme = getCategoryTheme(item.category);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`relative p-4 rounded-xl border transition-all ${theme.cardBg} ${theme.borderColor} ${
                    item.completed ? 'opacity-70' : ''
                  }`}
                >
                  {/* Top Header: Time + Category Badge + Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-semibold text-[#4A4A4A] bg-[#FFF9F2] px-2.5 py-0.5 rounded-md border border-[#F1E9DB]">
                        <Clock className="w-3.5 h-3.5 text-[#D45068]" />
                        {item.time}
                      </span>
                      <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-md ${theme.tagBg} ${theme.tagText}`}>
                        {theme.badgeText}
                      </span>
                    </div>

                    {/* Status Checkbox & Edit/Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleComplete(activeDay.id, item.id)}
                        className="p-1.5 text-[#8C827A] hover:text-[#4A4A4A] transition-colors"
                        title={item.completed ? '標示為未完成' : '標示為已完成'}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                        ) : (
                          <Circle className="w-5 h-5 text-stone-300" />
                        )}
                      </button>

                      <button
                        onClick={() => onOpenEditItemModal(activeDay.id, item)}
                        className="p-1.5 text-[#8C827A] hover:text-[#4A4A4A]"
                        title="編輯行程"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteItem(activeDay.id, item.id)}
                        className="p-1.5 text-[#8C827A] hover:text-rose-500"
                        title="刪除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Item Main Title & Location */}
                  <div className="mt-2.5">
                    <h3 className={`text-base font-bold text-[#4A4A4A] ${item.completed ? 'line-through text-stone-400' : ''}`}>
                      {item.title}
                    </h3>

                    <p className="text-xs text-[#78716C] mt-1 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#D45068] flex-shrink-0" />
                      <span>{item.locationName}</span>
                      {item.address && <span className="text-[#8C827A] truncate">({item.address})</span>}
                    </p>
                  </div>

                  {/* Specific Category Rich Info */}
                  <div className="mt-2.5 text-xs space-y-1.5">
                    {/* Restaurant Specific Info */}
                    {item.category === 'restaurant' && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {item.mustEatDishes && (
                          <span className="bg-[#FDE08E]/20 text-[#9E6B00] px-2 py-0.5 rounded-md border border-[#FDE08E]/40 font-medium">
                            必吃：{item.mustEatDishes}
                          </span>
                        )}
                        {item.estimatedCostJpy && (
                          <span className="bg-[#FFF9F2] text-[#4A4A4A] px-2 py-0.5 rounded-md border border-[#F1E9DB]">
                            預算: ¥{item.estimatedCostJpy.toLocaleString()}
                          </span>
                        )}
                        {item.bookingStatus && (
                          <span className={`px-2 py-0.5 rounded-md font-medium ${
                            item.bookingStatus === 'booked' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {item.bookingStatus === 'booked' ? '已訂位' : '現場排隊'}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Spot Specific Info */}
                    {item.category === 'spot' && (item.openingHours || item.ticketInfo) && (
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[#78716C]">
                        {item.openingHours && (
                          <span className="bg-[#FFF9F2] px-2 py-0.5 rounded-md border border-[#F1E9DB] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#D45068]" />
                            {item.openingHours}
                          </span>
                        )}
                        {item.ticketInfo && (
                          <span className="bg-[#FFF9F2] px-2 py-0.5 rounded-md border border-[#F1E9DB] flex items-center gap-1">
                            <Ticket className="w-3 h-3 text-[#D49E24]" />
                            {item.ticketInfo}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Transport / Self-Drive Info */}
                    {item.category === 'transport' && (
                      <div className="bg-[#FFF9F2] p-2 rounded-lg border border-[#F1E9DB] space-y-1">
                        {item.carRentalCompany && (
                          <div className="font-semibold text-[#2B7A82] flex items-center gap-1">
                            <Car className="w-3.5 h-3.5" />
                            租車服務公司: {item.carRentalCompany}
                          </div>
                        )}
                        {item.drivingDistanceMinutes && (
                          <div className="text-[#4A4A4A]">
                            🚗 預計車程約 <span className="font-bold text-[#2B7A82]">{item.drivingDistanceMinutes} 分鐘</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* General Notes */}
                    {item.notes && (
                      <div className="bg-[#FFF9F2] p-2 rounded-lg text-[#78716C] flex items-start gap-1">
                        <Info className="w-3.5 h-3.5 text-[#8C827A] flex-shrink-0 mt-0.5" />
                        <span>{item.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Row: MapCode Copy & Direct Navigation Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-[#F1E9DB] flex flex-wrap items-center justify-between gap-2">
                    {/* Japan Car Rental MapCode Pill */}
                    {item.carMapCode ? (
                      <button
                        onClick={() => handleCopyMapCode(item.id, item.carMapCode!)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#FFF9F2] text-[#2B7A82] border border-[#A5DEE4]/50 rounded-lg text-xs font-mono font-medium transition-all active:scale-95"
                      >
                        {copiedMapCodeId === item.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>MapCode 已複製</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-[#2B7A82]" />
                            <span>MapCode: {item.carMapCode}</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <div />
                    )}

                    {/* Google Maps Navigation Buttons */}
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        onClick={() => openGoogleMaps(item.locationName, item.address, 'driving')}
                        className="flex items-center gap-1 px-3 py-1 bg-[#4A4A4A] hover:bg-[#333333] text-white rounded-lg text-xs font-medium transition-all active:scale-95"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>導航</span>
                      </button>

                      <button
                        onClick={() => openGoogleMaps(item.locationName, item.address, 'transit')}
                        className="p-1.5 bg-white hover:bg-[#FFF9F2] text-[#4A4A4A] border border-[#F1E9DB] rounded-lg text-xs font-medium transition-all"
                        title="開啟大眾運輸路線"
                      >
                        <Train className="w-3.5 h-3.5 text-[#2B7A82]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
