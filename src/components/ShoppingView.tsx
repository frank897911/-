import React, { useState } from 'react';
import { ShoppingItem } from '../types';
import { UsagiAvatar, PiskeAvatar, StampSticker } from './UsagiPiskeAvatars';
import { ShoppingBag, CheckCircle2, Circle, Plus, Calculator, Tag, Sparkles, Trash2, ArrowRightLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

interface ShoppingViewProps {
  shoppingList: ShoppingItem[];
  exchangeRate: number;
  onToggleBought: (id: string) => void;
  onOpenAddModal: () => void;
  onDeleteItem: (id: string) => void;
}

export const ShoppingView: React.FC<ShoppingViewProps> = ({
  shoppingList,
  exchangeRate,
  onToggleBought,
  onOpenAddModal,
  onDeleteItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [quickJpy, setQuickJpy] = useState<number>(10000);

  const categories = ['藥妝', '電器', '伴手禮', '便利商店', '服飾潮牌', '其他'];

  const handleItemToggle = (id: string, currentlyBought: boolean) => {
    onToggleBought(id);
    if (!currentlyBought) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#FF8FAB', '#FFE58F', '#B2EBF2'],
      });
    }
  };

  const filteredList = shoppingList.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const totalJpy = shoppingList.reduce((sum, item) => sum + item.priceJpy * item.quantity, 0);
  const boughtJpy = shoppingList
    .filter((item) => item.isBought)
    .reduce((sum, item) => sum + item.priceJpy * item.quantity, 0);

  const taxSavedJpy = shoppingList
    .filter((item) => item.isTaxFree)
    .reduce((sum, item) => sum + Math.round((item.priceJpy * item.quantity * 0.1)), 0);

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="bg-white p-4 rounded-2xl border border-[#F1E9DB] flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#4A4A4A] flex items-center gap-1.5">
            <span>日本必買購物清單</span>
            <span className="text-xs bg-[#E2D4F0]/30 text-[#7B42A6] px-2.5 py-0.5 rounded-full font-semibold">
              免稅 10% 試算
            </span>
          </h2>
          <p className="text-xs text-[#8C827A] mt-0.5">
            藥妝、家電折價券、伴手禮！自動計算匯率與免稅省下的金額 🛍️
          </p>
        </div>
        <PiskeAvatar size={42} mood="excited" />
      </div>

      {/* Summary Box & Instant Calculator */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Total Cost Stats */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#F1E9DB] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#4A4A4A]">
            <span>預計總金額 (JPY / TWD)</span>
            <span className="text-[#D45068]">約 NT$ {Math.round(totalJpy * exchangeRate).toLocaleString()}</span>
          </div>
          
          <div className="flex items-baseline justify-between">
            <p className="text-xl font-bold text-[#D45068]">
              ¥ {totalJpy.toLocaleString()}
            </p>
            <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              免稅省下約 ¥{taxSavedJpy.toLocaleString()} (NT${Math.round(taxSavedJpy * exchangeRate)})
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#FFF9F2] h-2 rounded-full overflow-hidden border border-[#F1E9DB]">
            <div
              className="bg-[#4A4A4A] h-full transition-all duration-500 rounded-full"
              style={{ width: `${totalJpy > 0 ? Math.min(100, (boughtJpy / totalJpy) * 100) : 0}%` }}
            />
          </div>
          <p className="text-[11px] text-[#8C827A] text-right font-medium">
            已購入 ¥{boughtJpy.toLocaleString()} / 未購 ¥{(totalJpy - boughtJpy).toLocaleString()}
          </p>
        </div>

        {/* Quick JPY -> TWD Converter */}
        <div className="bg-white p-3.5 rounded-2xl border border-[#F1E9DB] shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#9E6B00]">
            <span className="flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5" />
              即時日幣換算 (1 JPY = {exchangeRate} TWD)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="number"
                value={quickJpy}
                onChange={(e) => setQuickJpy(Number(e.target.value))}
                className="w-full pl-6 pr-2 py-1 bg-[#FFF9F2] border border-[#F1E9DB] rounded-xl text-xs font-mono font-semibold text-[#4A4A4A] outline-none"
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-[#9E6B00]">¥</span>
            </div>
            
            <ArrowRightLeft className="w-4 h-4 text-[#D49E24] flex-shrink-0" />

            <div className="bg-[#FFF9F2] px-3 py-1 rounded-xl border border-[#F1E9DB] text-xs font-bold text-[#D45068] whitespace-nowrap">
              NT$ {Math.round(quickJpy * exchangeRate).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
            {[1000, 5000, 10000, 30000, 50000].map((amt) => (
              <button
                key={amt}
                onClick={() => setQuickJpy(amt)}
                className="px-2 py-0.5 bg-white hover:bg-[#FFF9F2] border border-[#F1E9DB] rounded-lg text-[#9E6B00] font-medium"
              >
                ¥{amt / 1000}k
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            selectedCategory === 'all'
              ? 'bg-[#4A4A4A] text-white border-[#4A4A4A]'
              : 'bg-white text-[#5C554E] border-[#F1E9DB] hover:bg-[#FFF9F2]'
          }`}
        >
          全部品項 ({shoppingList.length})
        </button>

        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-[#4A4A4A] text-white border-[#4A4A4A]'
                : 'bg-white text-[#5C554E] border-[#F1E9DB] hover:bg-[#FFF9F2]'
            }`}
          >
            {cat}
          </button>
        ))}

        <button
          onClick={onOpenAddModal}
          className="ml-auto flex-shrink-0 flex items-center gap-1 px-3.5 py-1.5 bg-[#4A4A4A] hover:bg-[#333333] text-white rounded-full text-xs font-semibold shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>新增商品</span>
        </button>
      </div>

      {/* Shopping Checklist Items */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filteredList.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 bg-white rounded-2xl border border-dashed border-[#F1E9DB] p-6"
            >
              <ShoppingBag className="w-8 h-8 text-[#8C827A] mx-auto opacity-50" />
              <p className="text-sm font-bold text-[#4A4A4A] mt-2">購物清單是空的喔！</p>
              <p className="text-xs text-[#8C827A] mt-1">點擊上方「新增商品」新增藥妝或日系紀念品吧 🛍️</p>
            </motion.div>
          ) : (
            filteredList.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-3.5 rounded-2xl border transition-all bg-white border-[#F1E9DB] shadow-2xs hover:shadow-sm flex items-start justify-between gap-3 ${
                  item.isBought ? 'opacity-60 bg-stone-50/60' : ''
                }`}
              >
                {/* Left: Checkbox + Name + Details */}
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <button
                    onClick={() => handleItemToggle(item.id, item.isBought)}
                    className="mt-0.5 text-[#8C827A] hover:text-[#4A4A4A] transition-colors flex-shrink-0"
                  >
                    {item.isBought ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                    ) : (
                      <Circle className="w-5 h-5 text-stone-300" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-medium text-[#7B42A6] bg-[#E2D4F0]/30 px-2 py-0.5 rounded-md border border-[#E2D4F0]/50">
                        {item.category}
                      </span>
                      {item.preferredStore && (
                        <span className="text-xs font-medium text-[#4A4A4A] bg-[#FFF9F2] px-2 py-0.5 rounded-md border border-[#F1E9DB]">
                          🏪 {item.preferredStore}
                        </span>
                      )}
                      {item.isTaxFree && <StampSticker type="must_buy" text="免稅10%" />}
                    </div>

                    <h3 className={`text-sm font-bold text-[#4A4A4A] mt-1 ${item.isBought ? 'line-through text-stone-400' : ''}`}>
                      {item.name}
                    </h3>
                    {item.japaneseName && (
                      <p className="text-xs text-[#8C827A] font-mono">{item.japaneseName}</p>
                    )}

                    {item.notes && (
                      <p className="text-xs text-[#78716C] mt-1 italic">💡 {item.notes}</p>
                    )}
                  </div>
                </div>

                {/* Right: Price + Quantity + Delete */}
                <div className="flex flex-col items-end flex-shrink-0">
                  <span className="text-sm font-bold text-[#D45068]">
                    ¥{(item.priceJpy * item.quantity).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-[#8C827A] font-medium">
                    (約 NT${Math.round(item.priceJpy * item.quantity * exchangeRate)}) ‧ x{item.quantity}
                  </span>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    className="mt-2 p-1 text-[#8C827A] hover:text-rose-500 transition-colors"
                    title="刪除"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
