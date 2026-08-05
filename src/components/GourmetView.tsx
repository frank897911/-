import React, { useState } from 'react';
import { GourmetItem } from '../types';
import { Utensils, Star, Navigation, Plus, Search, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GourmetViewProps {
  gourmetList: GourmetItem[];
  onToggleVisited: (id: string) => void;
  onOpenAddModal: () => void;
  onDeleteGourmet: (id: string) => void;
}

export const GourmetView: React.FC<GourmetViewProps> = ({
  gourmetList,
  onToggleVisited,
  onOpenAddModal,
  onDeleteGourmet,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('all');

  const areas = Array.from(new Set(gourmetList.map((g) => g.area)));

  const filteredList = gourmetList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.japaneseName && item.japaneseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.cuisineCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mustOrder.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesArea = selectedArea === 'all' || item.area === selectedArea;

    return matchesSearch && matchesArea;
  });

  const openGoogleMaps = (name: string, address: string) => {
    const query = encodeURIComponent(address || name);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-xl border border-[#F1E9DB] flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#4A4A4A] flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-[#9E6B00]" />
            <span>美食收藏與口袋名單</span>
            <span className="text-xs bg-[#FDE08E]/30 text-[#9E6B00] px-2 py-0.5 rounded-md font-medium">
              {gourmetList.length} 家
            </span>
          </h2>
          <p className="text-xs text-[#8C827A] mt-0.5">
            紀錄仙台牛舌、拉麵與私房名店
          </p>
        </div>
      </div>

      {/* Search & Area Filter Row */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-[#8C827A] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜尋餐廳名稱、種類、地區..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#F1E9DB] focus:border-[#4A4A4A] rounded-xl text-xs outline-none font-medium placeholder:text-[#8C827A]"
          />
        </div>

        {/* Area Pills & Add Button */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setSelectedArea('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              selectedArea === 'all'
                ? 'bg-[#4A4A4A] text-white border-[#4A4A4A]'
                : 'bg-white text-[#5C554E] border-[#F1E9DB] hover:bg-[#FFF9F2]'
            }`}
          >
            全部 ({gourmetList.length})
          </button>

          {areas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                selectedArea === area
                  ? 'bg-[#4A4A4A] text-white border-[#4A4A4A]'
                  : 'bg-white text-[#5C554E] border-[#F1E9DB] hover:bg-[#FFF9F2]'
              }`}
            >
              📍 {area}
            </button>
          ))}

          <button
            onClick={onOpenAddModal}
            className="ml-auto flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-[#4A4A4A] hover:bg-[#333333] text-white rounded-lg text-xs font-medium shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增美食</span>
          </button>
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-xl border border-dashed border-[#F1E9DB] p-6 flex flex-col items-center justify-center space-y-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#FFF9F2] border border-[#F1E9DB] flex items-center justify-center text-[#8C827A]">
                <Utensils className="w-5 h-5 text-[#8C827A]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#4A4A4A]">口袋清單為空</p>
                <p className="text-xs text-[#8C827A] mt-1">點擊下方按鈕加入美食餐廳與特色店家</p>
              </div>
              <button
                onClick={onOpenAddModal}
                className="mt-2 inline-flex items-center gap-1 px-4 py-2 bg-[#4A4A4A] hover:bg-[#333333] text-white text-xs rounded-lg font-medium transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增餐廳與美食</span>
              </button>
            </motion.div>
          ) : (
            filteredList.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 rounded-xl border transition-all bg-white border-[#F1E9DB] ${
                  item.visited ? 'opacity-70 bg-stone-50/60' : ''
                }`}
              >
                {/* Top Row: Category + Area + Visited Toggle */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#9E6B00] bg-[#FDE08E]/25 px-2.5 py-0.5 rounded-md border border-[#FDE08E]/40">
                      {item.cuisineCategory}
                    </span>
                    <span className="text-xs font-medium text-[#5C554E] bg-[#FFF9F2] px-2.5 py-0.5 rounded-md border border-[#F1E9DB]">
                      📍 {item.area}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleVisited(item.id)}
                      className="p-1 text-[#8C827A] hover:text-[#4A4A4A] transition-colors"
                      title={item.visited ? '取消造訪記號' : '標示為已品嚐'}
                    >
                      {item.visited ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                      ) : (
                        <Circle className="w-5 h-5 text-stone-300" />
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteGourmet(item.id)}
                      className="p-1 text-[#8C827A] hover:text-rose-500"
                      title="刪除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Name & Japanese Name */}
                <div className="mt-2">
                  <h3 className={`text-base font-bold text-[#4A4A4A] ${item.visited ? 'line-through text-stone-400' : ''}`}>
                    {item.name}
                  </h3>
                  {item.japaneseName && (
                    <p className="text-xs text-[#8C827A] font-mono mt-0.5">{item.japaneseName}</p>
                  )}
                </div>

                {/* Rating & Budget Row */}
                <div className="mt-2.5 flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-[#D49E24] font-semibold">
                    <Star className="w-3.5 h-3.5 fill-[#D49E24]" />
                    <span>{item.googleRating || item.rating}</span>
                  </div>
                  <span className="text-[#F1E9DB]">｜</span>
                  <span className="font-medium text-[#4A4A4A]">預算：{item.priceRangeJpy}</span>
                </div>

                {/* Must Order Dish */}
                {item.mustOrder && (
                  <div className="mt-2.5 bg-[#FFF9F2] p-2 rounded-lg border border-[#F1E9DB] text-xs text-[#9E6B00]">
                    <span className="font-semibold">招牌必點：</span>
                    <span>{item.mustOrder}</span>
                  </div>
                )}

                {/* Notes */}
                {item.notes && (
                  <p className="mt-2 text-xs text-[#78716C]">
                    {item.notes}
                  </p>
                )}

                {/* Footer Action: Navigation Button */}
                <div className="mt-3 pt-2.5 border-t border-[#F1E9DB] flex items-center justify-between">
                  <span className="text-[11px] text-[#8C827A] truncate max-w-[200px]">
                    {item.address}
                  </span>

                  <button
                    onClick={() => openGoogleMaps(item.name, item.address)}
                    className="flex items-center gap-1 px-3 py-1 bg-[#4A4A4A] hover:bg-[#333333] text-white rounded-lg text-xs font-medium transition-all active:scale-95 ml-auto"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>地圖導航</span>
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
