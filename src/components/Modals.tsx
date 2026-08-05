import React, { useState } from 'react';
import { ItineraryItem, ItemCategory, GourmetItem, ShoppingItem } from '../types';
import { X, Plus, Sparkles } from 'lucide-react';

/* 1. Add / Edit Itinerary Modal */
interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayId: string;
  initialItem?: ItineraryItem | null;
  onSave: (dayId: string, item: Omit<ItineraryItem, 'id'>, editId?: string) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  dayId,
  initialItem,
  onSave,
}) => {
  if (!isOpen) return null;

  const [category, setCategory] = useState<ItemCategory>(initialItem?.category || 'spot');
  const [time, setTime] = useState(initialItem?.time || '10:00');
  const [title, setTitle] = useState(initialItem?.title || '');
  const [locationName, setLocationName] = useState(initialItem?.locationName || '');
  const [address, setAddress] = useState(initialItem?.address || '');
  const [carMapCode, setCarMapCode] = useState(initialItem?.carMapCode || '');
  const [notes, setNotes] = useState(initialItem?.notes || '');
  const [costJpy, setCostJpy] = useState<number>(initialItem?.estimatedCostJpy || 0);

  // Category specific
  const [mustEatDishes, setMustEatDishes] = useState(initialItem?.mustEatDishes || '');
  const [bookingStatus, setBookingStatus] = useState<'none' | 'booked' | 'walk-in'>(initialItem?.bookingStatus || 'none');
  const [carRentalCompany, setCarRentalCompany] = useState(initialItem?.carRentalCompany || '');
  const [drivingDistanceMinutes, setDrivingDistanceMinutes] = useState<number>(initialItem?.drivingDistanceMinutes || 30);
  const [openingHours, setOpeningHours] = useState(initialItem?.openingHours || '');
  const [ticketInfo, setTicketInfo] = useState(initialItem?.ticketInfo || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !locationName.trim()) return;

    onSave(
      dayId,
      {
        dayId,
        time,
        title,
        category,
        locationName,
        address,
        carMapCode,
        notes,
        estimatedCostJpy: Number(costJpy),
        completed: initialItem?.completed || false,
        mustEatDishes,
        bookingStatus,
        carRentalCompany,
        drivingDistanceMinutes: Number(drivingDistanceMinutes),
        openingHours,
        ticketInfo,
      },
      initialItem?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl border border-[#F1E9DB] shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1E9DB] pb-3">
          <h3 className="text-base font-bold text-[#4A4A4A] flex items-center gap-1.5">
            <span>{initialItem ? '✏️ 編輯行程卡片' : '➕ 新增每日行程卡片'}</span>
          </h3>
          <button onClick={onClose} className="p-1 text-[#8C827A] hover:text-[#4A4A4A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Category Selector */}
          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">行程分類</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { id: 'spot', label: '📍 景點' },
                { id: 'restaurant', label: '🍜 餐廳' },
                { id: 'transport', label: '🚗 交通' },
                { id: 'activity', label: '🛍️ 活動' },
              ].map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id as any)}
                  className={`py-2 px-1 rounded-xl font-bold border transition-all ${
                    category === cat.id
                      ? 'bg-[#4A4A4A] text-white border-[#4A4A4A] shadow-2xs'
                      : 'bg-white text-[#5C554E] border-[#F1E9DB]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">預計時間</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-2.5 py-1.5 bg-white border border-[#F1E9DB] rounded-xl outline-none font-mono"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-bold text-[#4A4A4A] mb-1">行程卡片標題</label>
              <input
                type="text"
                placeholder="例：新倉山淺間公園、敘敘苑燒肉"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">地標名稱 (Google 地圖搜尋)</label>
              <input
                type="text"
                placeholder="例：大石公園"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">日本自駕 MapCode (可選)</label>
              <input
                type="text"
                placeholder="例：161 301 228*11"
                value={carMapCode}
                onChange={(e) => setCarMapCode(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl font-mono outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">詳細地址 (導航備用)</label>
            <input
              type="text"
              placeholder="例：山梨県南都留郡富士河口湖町大石2585"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl outline-none"
            />
          </div>

          {/* Restaurant Specific fields */}
          {category === 'restaurant' && (
            <div className="grid grid-cols-2 gap-2 bg-[#FFF9F2] p-2.5 rounded-2xl border border-[#F1E9DB]">
              <div>
                <label className="block font-bold text-[#9E6B00] mb-1">招牌必點菜色</label>
                <input
                  type="text"
                  placeholder="例：柚子鹽拉麵"
                  value={mustEatDishes}
                  onChange={(e) => setMustEatDishes(e.target.value)}
                  className="w-full px-2.5 py-1 bg-white border border-[#F1E9DB] rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#9E6B00] mb-1">訂位狀態</label>
                <select
                  value={bookingStatus}
                  onChange={(e) => setBookingStatus(e.target.value as any)}
                  className="w-full px-2.5 py-1 bg-white border border-[#F1E9DB] rounded-lg outline-none"
                >
                  <option value="none">現場排隊</option>
                  <option value="booked">已訂位成功</option>
                  <option value="walk-in">排隊整理券</option>
                </select>
              </div>
            </div>
          )}

          {/* Transport Specific fields */}
          {category === 'transport' && (
            <div className="grid grid-cols-2 gap-2 bg-[#FFF9F2] p-2.5 rounded-2xl border border-[#F1E9DB]">
              <div>
                <label className="block font-bold text-[#2B7A82] mb-1">租車公司 / 路線</label>
                <input
                  type="text"
                  placeholder="例：Toyota Rent-a-Car"
                  value={carRentalCompany}
                  onChange={(e) => setCarRentalCompany(e.target.value)}
                  className="w-full px-2.5 py-1 bg-white border border-[#F1E9DB] rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2B7A82] mb-1">預計車程 (分鐘)</label>
                <input
                  type="number"
                  value={drivingDistanceMinutes}
                  onChange={(e) => setDrivingDistanceMinutes(Number(e.target.value))}
                  className="w-full px-2.5 py-1 bg-white border border-[#F1E9DB] rounded-lg outline-none font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">個人備註 / 小叮嚀</label>
            <textarea
              rows={2}
              placeholder="例：記得準備停車零錢，旁邊有全家便利商店。"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1E9DB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-[#5C554E] rounded-xl border border-[#F1E9DB]"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#4A4A4A] hover:bg-[#333333] text-white font-semibold rounded-xl shadow-2xs"
            >
              儲存行程卡片
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 2. Add Gourmet Modal */
interface AddGourmetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (gourmet: Omit<GourmetItem, 'id'>) => void;
}

export const AddGourmetModal: React.FC<AddGourmetModalProps> = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [japaneseName, setJapaneseName] = useState('');
  const [area, setArea] = useState('東京');
  const [cuisineCategory, setCuisineCategory] = useState('拉麵');
  const [priceRangeJpy, setPriceRangeJpy] = useState('¥1,500 - ¥3,000');
  const [mustOrder, setMustOrder] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name,
      japaneseName,
      area,
      cuisineCategory,
      rating: 5,
      priceRangeJpy,
      address,
      mapQuery: address || name,
      isReserved: false,
      visited: false,
      mustOrder,
      notes,
      googleRating: 4.6,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl border border-[#F1E9DB] shadow-xl w-full max-w-md p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#F1E9DB] pb-2">
          <h3 className="text-base font-bold text-[#4A4A4A]">🍡 新增美食夢幻清單</h3>
          <button onClick={onClose} className="p-1 text-[#8C827A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">餐廳中文名稱</label>
            <input
              type="text"
              required
              placeholder="例：敘敘苑 燒肉"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">地區 (地區標籤)</label>
              <input
                type="text"
                required
                placeholder="例：新宿, 澀谷"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">美食類別</label>
              <input
                type="text"
                placeholder="例：拉麵、燒肉、甜點"
                value={cuisineCategory}
                onChange={(e) => setCuisineCategory(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">招牌必點料理</label>
            <input
              type="text"
              placeholder="例：特選牛舌、柚子鹽拉麵"
              value={mustOrder}
              onChange={(e) => setMustOrder(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">地址 (地圖導航用)</label>
            <input
              type="text"
              placeholder="例：東京都新宿区新宿3-27-10"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1E9DB]">
            <button type="button" onClick={onClose} className="px-3 py-1.5 bg-white rounded-xl border border-[#F1E9DB] text-[#5C554E]">
              取消
            </button>
            <button type="submit" className="px-4 py-1.5 bg-[#4A4A4A] hover:bg-[#333333] text-white font-semibold rounded-xl shadow-2xs">
              儲存美食
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 3. Add Shopping Modal */
interface AddShoppingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (shopping: Omit<ShoppingItem, 'id'>) => void;
}

export const AddShoppingModal: React.FC<AddShoppingModalProps> = ({ isOpen, onClose, onAdd }) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'藥妝' | '電器' | '伴手禮' | '便利商店' | '服飾潮牌' | '其他'>('藥妝');
  const [preferredStore, setPreferredStore] = useState('Matsumoto Kiyoshi 松本清');
  const [priceJpy, setPriceJpy] = useState<number>(3000);
  const [quantity, setQuantity] = useState<number>(1);
  const [isTaxFree, setIsTaxFree] = useState(true);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name,
      category,
      preferredStore,
      priceJpy: Number(priceJpy),
      quantity: Number(quantity),
      isTaxFree,
      isBought: false,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl border border-[#F1E9DB] shadow-xl w-full max-w-md p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#F1E9DB] pb-2">
          <h3 className="text-base font-bold text-[#4A4A4A]">🛍️ 新增日本購物清單</h3>
          <button onClick={onClose} className="p-1 text-[#8C827A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2.5 text-xs">
          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">商品名稱</label>
            <input
              type="text"
              required
              placeholder="例：合立他命 EX 270錠、吹風機"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">分類</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl outline-none"
              >
                <option value="藥妝">藥妝</option>
                <option value="電器">電器</option>
                <option value="伴手禮">伴手禮</option>
                <option value="便利商店">便利商店</option>
                <option value="服飾潮牌">服飾潮牌</option>
                <option value="其他">其他</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">預計採購店家</label>
              <input
                type="text"
                placeholder="例：BicCamera / Donki"
                value={preferredStore}
                onChange={(e) => setPreferredStore(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">單價 (日幣 JPY)</label>
              <input
                type="number"
                required
                value={priceJpy}
                onChange={(e) => setPriceJpy(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl font-mono outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">數量</label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl font-mono outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#FFF9F2] p-2.5 rounded-xl border border-[#F1E9DB]">
            <input
              type="checkbox"
              id="taxFreeCheck"
              checked={isTaxFree}
              onChange={(e) => setIsTaxFree(e.target.checked)}
              className="w-4 h-4 accent-[#4A4A4A]"
            />
            <label htmlFor="taxFreeCheck" className="font-semibold text-[#4A4A4A] cursor-pointer select-none">
              計算免稅 10% (5000日圓以上適用)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1E9DB]">
            <button type="button" onClick={onClose} className="px-3 py-1.5 bg-white rounded-xl border border-[#F1E9DB] text-[#5C554E]">
              取消
            </button>
            <button type="submit" className="px-4 py-1.5 bg-[#4A4A4A] hover:bg-[#333333] text-white font-semibold rounded-xl shadow-2xs">
              新增到清單
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 4. Exchange Rate Setting Modal */
interface ExchangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  rate: number;
  budget: number;
  onSave: (newRate: number, newBudget: number) => void;
}

export const ExchangeModal: React.FC<ExchangeModalProps> = ({
  isOpen,
  onClose,
  rate,
  budget,
  onSave,
}) => {
  if (!isOpen) return null;

  const [currentRate, setCurrentRate] = useState(rate);
  const [currentBudget, setCurrentBudget] = useState(budget);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl border border-[#F1E9DB] shadow-xl w-full max-w-sm p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#F1E9DB] pb-2">
          <h3 className="text-base font-bold text-[#4A4A4A]">💱 匯率與旅遊總預算設定</h3>
          <button onClick={onClose} className="p-1 text-[#8C827A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">自訂日圓對台幣匯率 (1 JPY = ? TWD)</label>
            <input
              type="number"
              step="0.001"
              value={currentRate}
              onChange={(e) => setCurrentRate(Number(e.target.value))}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl font-mono font-bold outline-none"
            />
            <p className="text-[11px] text-[#8C827A] mt-1">預設參考匯率：0.215 (即 10,000 日圓 ≒ 2,150 台幣)</p>
          </div>

          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">旅程預算上限 (TWD 台幣)</label>
            <input
              type="number"
              step="1000"
              value={currentBudget}
              onChange={(e) => setCurrentBudget(Number(e.target.value))}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-xl font-mono font-bold outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1E9DB]">
            <button type="button" onClick={onClose} className="px-3 py-1.5 bg-white rounded-xl border border-[#F1E9DB] text-[#5C554E]">
              取消
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(currentRate, currentBudget);
                onClose();
              }}
              className="px-4 py-1.5 bg-[#4A4A4A] hover:bg-[#333333] text-white font-semibold rounded-xl shadow-2xs"
            >
              更新設定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
