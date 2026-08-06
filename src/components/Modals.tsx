import React, { useState, useEffect } from 'react';
import { ItineraryItem, ItemCategory, GourmetItem, ShoppingItem, ItineraryDay, FlightDetail, HotelDetail, BookingVoucher } from '../types';
import { X, Plus, Image as ImageIcon, Upload, Calendar, Edit3, Trash2 } from 'lucide-react';

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
      <div className="bg-white rounded-xl border border-[#F1E9DB] shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#F1E9DB] pb-3">
          <h3 className="text-base font-bold text-[#4A4A4A] flex items-center gap-1.5">
            <span>{initialItem ? '編輯行程卡片' : '新增每日行程卡片'}</span>
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
                  className={`py-2 px-1 rounded-lg font-bold border transition-all ${
                    category === cat.id
                      ? 'bg-[#4A4A4A] text-white border-[#4A4A4A]'
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
                className="w-full px-2.5 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none font-mono"
              />
            </div>

            <div className="col-span-2">
              <label className="block font-bold text-[#4A4A4A] mb-1">行程卡片標題</label>
              <input
                type="text"
                placeholder="例：仙台城跡、牛舌炭燒"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">地標名稱 (Google 地圖搜尋)</label>
              <input
                type="text"
                placeholder="例：仙台車站"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                required
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">日本自駕 MapCode (可選)</label>
              <input
                type="text"
                placeholder="例：110 585 304*88"
                value={carMapCode}
                onChange={(e) => setCarMapCode(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">詳細地址 (導航備用)</label>
            <input
              type="text"
              placeholder="例：宮城縣仙台市青葉區..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
            />
          </div>

          {/* Restaurant Specific fields */}
          {category === 'restaurant' && (
            <div className="grid grid-cols-2 gap-2 bg-[#FFF9F2] p-2.5 rounded-xl border border-[#F1E9DB]">
              <div>
                <label className="block font-bold text-[#9E6B00] mb-1">招牌必點菜色</label>
                <input
                  type="text"
                  placeholder="例：極上牛舌定食"
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
            <div className="grid grid-cols-2 gap-2 bg-[#FFF9F2] p-2.5 rounded-xl border border-[#F1E9DB]">
              <div>
                <label className="block font-bold text-[#2B7A82] mb-1">租車公司 / 路線</label>
                <input
                  type="text"
                  placeholder="例：Times Car Rental"
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
              placeholder="例：記得準備零錢、確認休館時間。"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1E9DB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-[#5C554E] rounded-lg border border-[#F1E9DB]"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#4A4A4A] hover:bg-[#333333] text-white font-medium rounded-lg"
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
  const [area, setArea] = useState('仙台');
  const [cuisineCategory, setCuisineCategory] = useState('牛舌');
  const [priceRangeJpy, setPriceRangeJpy] = useState('¥2,000 - ¥4,000');
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
      <div className="bg-white rounded-xl border border-[#F1E9DB] shadow-xl w-full max-w-md p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#F1E9DB] pb-2">
          <h3 className="text-base font-bold text-[#4A4A4A]">新增美食口袋名單</h3>
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
              placeholder="例：閣 牛舌、善治郎"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">地區標籤</label>
              <input
                type="text"
                required
                placeholder="例：仙台車站, 松島"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">美食類別</label>
              <input
                type="text"
                placeholder="例：牛舌、拉麵、毛豆甜點"
                value={cuisineCategory}
                onChange={(e) => setCuisineCategory(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">招牌必點料理</label>
            <input
              type="text"
              placeholder="例：厚切炭燒牛舌、毛豆奶昔"
              value={mustOrder}
              onChange={(e) => setMustOrder(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">地址 (地圖導航用)</label>
            <input
              type="text"
              placeholder="例：宮城縣仙台市青葉區..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1E9DB]">
            <button type="button" onClick={onClose} className="px-3 py-1.5 bg-white rounded-lg border border-[#F1E9DB] text-[#5C554E]">
              取消
            </button>
            <button type="submit" className="px-4 py-1.5 bg-[#4A4A4A] hover:bg-[#333333] text-white font-medium rounded-lg">
              儲存美食
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 3. Add / Edit Shopping Modal with Image Upload & URL */
interface AddShoppingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (shopping: Omit<ShoppingItem, 'id'>) => void;
  initialItem?: ShoppingItem | null;
  onUpdate?: (id: string, shopping: Partial<ShoppingItem>) => void;
}

export const AddShoppingModal: React.FC<AddShoppingModalProps> = ({ isOpen, onClose, onAdd, initialItem, onUpdate }) => {
  if (!isOpen) return null;

  const [name, setName] = useState(initialItem?.name || '');
  const [japaneseName, setJapaneseName] = useState(initialItem?.japaneseName || '');
  const [category, setCategory] = useState<'藥妝' | '電器' | '伴手禮' | '便利商店' | '服飾潮牌' | '其他'>(initialItem?.category || '藥妝');
  const [preferredStore, setPreferredStore] = useState(initialItem?.preferredStore || '松本清 / Donki');
  const [priceJpy, setPriceJpy] = useState<number>(initialItem?.priceJpy || 3000);
  const [quantity, setQuantity] = useState<number>(initialItem?.quantity || 1);
  const [isTaxFree, setIsTaxFree] = useState(initialItem?.isTaxFree ?? true);
  const [notes, setNotes] = useState(initialItem?.notes || '');
  const [imageUrl, setImageUrl] = useState(initialItem?.imageUrl || '');
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name);
      setJapaneseName(initialItem.japaneseName || '');
      setCategory(initialItem.category);
      setPreferredStore(initialItem.preferredStore || '');
      setPriceJpy(initialItem.priceJpy);
      setQuantity(initialItem.quantity);
      setIsTaxFree(initialItem.isTaxFree);
      setNotes(initialItem.notes || '');
      setImageUrl(initialItem.imageUrl || '');
    }
  }, [initialItem]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (initialItem && onUpdate) {
      onUpdate(initialItem.id, {
        name,
        japaneseName,
        category,
        preferredStore,
        priceJpy: Number(priceJpy),
        quantity: Number(quantity),
        isTaxFree,
        notes,
        imageUrl,
      });
    } else {
      onAdd({
        name,
        japaneseName,
        category,
        preferredStore,
        priceJpy: Number(priceJpy),
        quantity: Number(quantity),
        isTaxFree,
        isBought: false,
        notes,
        imageUrl,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-xl border border-[#F1E9DB] shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#F1E9DB] pb-2">
          <h3 className="text-base font-bold text-[#4A4A4A]">
            {initialItem ? '編輯購物商品' : '新增日本購物清單'}
          </h3>
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
              placeholder="例：合立他命 EX 270錠、大正感冒藥"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">日文/原文名稱 (可選)</label>
            <input
              type="text"
              placeholder="例：アリナミンEXプラス"
              value={japaneseName}
              onChange={(e) => setJapaneseName(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">分類</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
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
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
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
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
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
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
              />
            </div>
          </div>

          {/* Image Attachment Section */}
          <div className="bg-[#FFF9F2] p-3 rounded-lg border border-[#F1E9DB] space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#4A4A4A] flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-[#2B7A82]" />
                商品參考照片 (可貼照片/圖片網址)
              </label>
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={`px-2 py-0.5 rounded ${imageInputMode === 'upload' ? 'bg-[#4A4A4A] text-white' : 'text-[#8C827A]'}`}
                >
                  上傳照片
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`px-2 py-0.5 rounded ${imageInputMode === 'url' ? 'bg-[#4A4A4A] text-white' : 'text-[#8C827A]'}`}
                >
                  網址貼上
                </button>
              </div>
            </div>

            {imageInputMode === 'upload' ? (
              <label className="flex flex-col items-center justify-center p-3 border border-dashed border-[#F1E9DB] bg-white rounded-lg cursor-pointer hover:bg-[#FFF2E0]/40 transition-all">
                <Upload className="w-5 h-5 text-[#8C827A] mb-1" />
                <span className="text-[11px] text-[#78716C] font-medium">點擊選擇手機或電腦中的照片文件</span>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            ) : (
              <input
                type="url"
                placeholder="貼上圖片網址 (https://...)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none font-mono"
              />
            )}

            {/* Image Preview */}
            {imageUrl && (
              <div className="relative mt-2 inline-block">
                <img
                  src={imageUrl}
                  alt="預覽"
                  className="w-24 h-24 object-cover rounded-lg border border-[#F1E9DB]"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 shadow-xs hover:bg-rose-600"
                  title="移除照片"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">備註說明 / 規格規格細節</label>
            <input
              type="text"
              placeholder="例：買金色包裝的，270錠才有划算"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-[#FFF9F2] p-2.5 rounded-lg border border-[#F1E9DB]">
            <input
              type="checkbox"
              id="taxFreeCheck"
              checked={isTaxFree}
              onChange={(e) => setIsTaxFree(e.target.checked)}
              className="w-4 h-4 accent-[#4A4A4A]"
            />
            <label htmlFor="taxFreeCheck" className="font-medium text-[#4A4A4A] cursor-pointer select-none">
              計算免稅 10% (5000日圓以上適用)
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1E9DB]">
            <button type="button" onClick={onClose} className="px-3 py-1.5 bg-white rounded-lg border border-[#F1E9DB] text-[#5C554E]">
              取消
            </button>
            <button type="submit" className="px-4 py-1.5 bg-[#4A4A4A] hover:bg-[#333333] text-white font-medium rounded-lg">
              {initialItem ? '儲存修改' : '新增到清單'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 4. Edit Trip Details Modal */
interface EditTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripTitle: string;
  startDate: string;
  endDate: string;
  onSave: (title: string, start: string, end: string) => void;
}

export const EditTripModal: React.FC<EditTripModalProps> = ({
  isOpen,
  onClose,
  tripTitle,
  startDate,
  endDate,
  onSave,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(tripTitle);
  const [start, setStart] = useState(startDate);
  const [end, setEnd] = useState(endDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title, start, end);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-xl border border-[#F1E9DB] shadow-xl w-full max-w-sm p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#F1E9DB] pb-2">
          <h3 className="text-base font-bold text-[#4A4A4A] flex items-center gap-1.5">
            <Edit3 className="w-4 h-4 text-[#2B7A82]" />
            <span>編輯旅程標題與日期</span>
          </h3>
          <button onClick={onClose} className="p-1 text-[#8C827A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">行程名稱</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-bold outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">出發日期</label>
              <input
                type="date"
                required
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#4A4A4A] mb-1">結束日期</label>
              <input
                type="date"
                required
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1E9DB]">
            <button type="button" onClick={onClose} className="px-3 py-1.5 bg-white rounded-lg border border-[#F1E9DB] text-[#5C554E]">
              取消
            </button>
            <button type="submit" className="px-4 py-1.5 bg-[#4A4A4A] hover:bg-[#333333] text-white font-medium rounded-lg">
              更新旅程
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 5. Edit Day Info Modal */
interface EditDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: ItineraryDay | null;
  onSave: (dayId: string, updated: Partial<ItineraryDay>) => void;
  onDeleteDay?: (dayId: string) => void;
}

export const EditDayModal: React.FC<EditDayModalProps> = ({ isOpen, onClose, day, onSave, onDeleteDay }) => {
  if (!isOpen || !day) return null;

  const [date, setDate] = useState(day.date);
  const [title, setTitle] = useState(day.title);
  const [cityRegion, setCityRegion] = useState(day.cityRegion);
  const [tempHigh, setTempHigh] = useState(day.weather?.tempHigh ?? 22);
  const [tempLow, setTempLow] = useState(day.weather?.tempLow ?? 14);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(day.id, {
      date,
      title,
      cityRegion,
      weather: {
        ...day.weather,
        city: cityRegion,
        tempHigh: Number(tempHigh),
        tempLow: Number(tempLow),
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-xl border border-[#F1E9DB] shadow-xl w-full max-w-sm p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#F1E9DB] pb-2">
          <h3 className="text-base font-bold text-[#4A4A4A] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#D45068]" />
            <span>編輯 Day {day.dayNumber} 日期與地點</span>
          </h3>
          <button onClick={onClose} className="p-1 text-[#8C827A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">當天日期 (YYYY-MM-DD)</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">當天行程主題標題</label>
            <input
              type="text"
              required
              placeholder="例：Day 1: 抵達仙台 ‧ 仙台車站與經典牛舌巡禮"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block font-bold text-[#4A4A4A] mb-1">主要地區/城市</label>
            <input
              type="text"
              required
              placeholder="例：仙台 Sendai、松島 Matsushima"
              value={cityRegion}
              onChange={(e) => setCityRegion(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 bg-[#FFF9F2] p-2.5 rounded-lg border border-[#F1E9DB]">
            <div>
              <label className="block font-semibold text-[#D45068] mb-1">最高溫 (°C)</label>
              <input
                type="number"
                value={tempHigh}
                onChange={(e) => setTempHigh(Number(e.target.value))}
                className="w-full px-2 py-1 bg-white border border-[#F1E9DB] rounded-lg outline-none font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#2B7A82] mb-1">最低溫 (°C)</label>
              <input
                type="number"
                value={tempLow}
                onChange={(e) => setTempLow(Number(e.target.value))}
                className="w-full px-2 py-1 bg-white border border-[#F1E9DB] rounded-lg outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#F1E9DB]">
            {onDeleteDay ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`確定要刪除 Day ${day.dayNumber} 的整天行程嗎？`)) {
                    onDeleteDay(day.id);
                    onClose();
                  }
                }}
                className="px-2.5 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1 text-xs font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>刪除此日</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button type="button" onClick={onClose} className="px-3 py-1.5 bg-white rounded-lg border border-[#F1E9DB] text-[#5C554E]">
                取消
              </button>
              <button type="submit" className="px-4 py-1.5 bg-[#4A4A4A] hover:bg-[#333333] text-white font-medium rounded-lg">
                儲存
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

/* 6. Image Lightbox Modal */
interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const ImageLightboxModal: React.FC<LightboxModalProps> = ({ isOpen, onClose, imageUrl, title }) => {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
      onClick={onClose}
    >
      <div className="relative max-w-2xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-stone-300 p-1 bg-black/40 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
        <img src={imageUrl} alt={title} className="max-h-[80vh] w-auto object-contain rounded-lg shadow-2xl border border-white/20" />
        <p className="text-white text-sm font-medium mt-3 text-center">{title}</p>
      </div>
    </div>
  );
};

/* 7. Exchange Rate Setting Modal */
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
      <div className="bg-white rounded-xl border border-[#F1E9DB] shadow-xl w-full max-w-sm p-5 space-y-3">
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
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono font-bold outline-none"
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
              className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono font-bold outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F1E9DB]">
            <button type="button" onClick={onClose} className="px-3 py-1.5 bg-white rounded-lg border border-[#F1E9DB] text-[#5C554E]">
              取消
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(currentRate, currentBudget);
                onClose();
              }}
              className="px-4 py-1.5 bg-[#4A4A4A] hover:bg-[#333333] text-white font-medium rounded-lg"
            >
              更新設定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 8. Add / Edit Booking Modal (Flight / Hotel / Voucher) */
export type BookingItemType = 'flight' | 'hotel' | 'voucher';

interface AddEditBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: BookingItemType;
  initialData?: any; // FlightDetail | HotelDetail | BookingVoucher
  onSaveFlight?: (flight: Omit<FlightDetail, 'id'>, editId?: string) => void;
  onSaveHotel?: (hotel: Omit<HotelDetail, 'id'>, editId?: string) => void;
  onSaveVoucher?: (voucher: Omit<BookingVoucher, 'id'>, editId?: string) => void;
}

export const AddEditBookingModal: React.FC<AddEditBookingModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'flight',
  initialData,
  onSaveFlight,
  onSaveHotel,
  onSaveVoucher,
}) => {
  if (!isOpen) return null;

  const [bookingType, setBookingType] = useState<BookingItemType>(defaultType);

  // Flight states
  const [airline, setAirline] = useState(initialData?.airline || '星宇航空 Starlux');
  const [flightNo, setFlightNo] = useState(initialData?.flightNo || 'JX800');
  const [flightType, setFlightType] = useState<'outbound' | 'inbound'>(initialData?.type || 'outbound');
  const [flightDate, setFlightDate] = useState(initialData?.date || '2026-10-15');
  const [departureAirport, setDepartureAirport] = useState(initialData?.departureAirport || 'TPE 桃園 T1');
  const [departureTime, setDepartureTime] = useState(initialData?.departureTime || '08:30');
  const [arrivalAirport, setArrivalAirport] = useState(initialData?.arrivalAirport || 'SDJ 仙台');
  const [arrivalTime, setArrivalTime] = useState(initialData?.arrivalTime || '12:50');
  const [gate, setGate] = useState(initialData?.gate || 'A9');
  const [terminal, setTerminal] = useState(initialData?.terminal || '1');
  const [seatNo, setSeatNo] = useState(initialData?.seatNo || '12A');
  const [pnr, setPnr] = useState(initialData?.bookingReference || 'JX9988');

  // Hotel states
  const [hotelName, setHotelName] = useState(initialData?.name || '');
  const [hotelJapaneseName, setHotelJapaneseName] = useState(initialData?.japaneseName || '');
  const [hotelAddress, setHotelAddress] = useState(initialData?.address || '');
  const [hotelPhone, setHotelPhone] = useState(initialData?.phone || '');
  const [checkInDate, setCheckInDate] = useState(initialData?.checkInDate || '2026-10-15');
  const [checkOutDate, setCheckOutDate] = useState(initialData?.checkOutDate || '2026-10-20');
  const [checkInTime, setCheckInTime] = useState(initialData?.checkInTime || '15:00');
  const [checkOutTime, setCheckOutTime] = useState(initialData?.checkOutTime || '11:00');
  const [hotelBookingRef, setHotelBookingRef] = useState(initialData?.bookingRef || '');
  const [hotelMapCode, setHotelMapCode] = useState(initialData?.mapCode || '');

  // Voucher states
  const [voucherTitle, setVoucherTitle] = useState(initialData?.title || '');
  const [voucherType, setVoucherType] = useState<'flight' | 'hotel' | 'ticket' | 'car' | 'other'>(initialData?.type || 'ticket');
  const [voucherRef, setVoucherRef] = useState(initialData?.referenceNo || '');
  const [voucherNotes, setVoucherNotes] = useState(initialData?.notes || '');

  useEffect(() => {
    if (initialData) {
      if ('airline' in initialData) {
        setBookingType('flight');
        setAirline(initialData.airline);
        setFlightNo(initialData.flightNo);
        setFlightType(initialData.type);
        setFlightDate(initialData.date);
        setDepartureAirport(initialData.departureAirport);
        setDepartureTime(initialData.departureTime);
        setArrivalAirport(initialData.arrivalAirport);
        setArrivalTime(initialData.arrivalTime);
        setGate(initialData.gate || '');
        setTerminal(initialData.terminal || '');
        setSeatNo(initialData.seatNo || '');
        setPnr(initialData.bookingReference);
      } else if ('checkInDate' in initialData) {
        setBookingType('hotel');
        setHotelName(initialData.name);
        setHotelJapaneseName(initialData.japaneseName || '');
        setHotelAddress(initialData.address || '');
        setHotelPhone(initialData.phone || '');
        setCheckInDate(initialData.checkInDate);
        setCheckOutDate(initialData.checkOutDate);
        setCheckInTime(initialData.checkInTime || '15:00');
        setCheckOutTime(initialData.checkOutTime || '11:00');
        setHotelBookingRef(initialData.bookingRef || '');
        setHotelMapCode(initialData.mapCode || '');
      } else if ('referenceNo' in initialData) {
        setBookingType('voucher');
        setVoucherTitle(initialData.title);
        setVoucherType(initialData.type);
        setVoucherRef(initialData.referenceNo);
        setVoucherNotes(initialData.notes || '');
      }
    } else {
      setBookingType(defaultType);
    }
  }, [initialData, defaultType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (bookingType === 'flight' && onSaveFlight) {
      onSaveFlight(
        {
          type: flightType,
          airline,
          flightNo,
          date: flightDate,
          departureAirport,
          departureTime,
          arrivalAirport,
          arrivalTime,
          gate,
          terminal,
          seatNo,
          bookingReference: pnr,
        },
        initialData?.id
      );
    } else if (bookingType === 'hotel' && onSaveHotel) {
      onSaveHotel(
        {
          name: hotelName,
          japaneseName: hotelJapaneseName,
          address: hotelAddress,
          phone: hotelPhone,
          checkInDate,
          checkOutDate,
          checkInTime,
          checkOutTime,
          bookingRef: hotelBookingRef,
          mapCode: hotelMapCode,
          mapQuery: hotelAddress || hotelName,
        },
        initialData?.id
      );
    } else if (bookingType === 'voucher' && onSaveVoucher) {
      onSaveVoucher(
        {
          title: voucherTitle,
          type: voucherType,
          referenceNo: voucherRef,
          isPinProtected: false,
          notes: voucherNotes,
        },
        initialData?.id
      );
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-white rounded-xl border border-[#F1E9DB] shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F1E9DB] pb-3">
          <h3 className="text-base font-bold text-[#4A4A4A]">
            {initialData ? '編輯預訂紀錄' : '新增預訂憑證 / 機票 / 飯店'}
          </h3>
          <button onClick={onClose} className="p-1 text-[#8C827A] hover:text-[#4A4A4A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking Category Switcher */}
        {!initialData && (
          <div className="grid grid-cols-3 gap-1.5 bg-[#F7F4EB] p-1 rounded-xl border border-[#EBE3D5]">
            <button
              type="button"
              onClick={() => setBookingType('flight')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                bookingType === 'flight' ? 'bg-[#3B523A] text-white shadow-xs' : 'text-[#5C554E]'
              }`}
            >
              ✈️ 航班機票
            </button>
            <button
              type="button"
              onClick={() => setBookingType('hotel')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                bookingType === 'hotel' ? 'bg-[#3B523A] text-white shadow-xs' : 'text-[#5C554E]'
              }`}
            >
              🏨 飯店住宿
            </button>
            <button
              type="button"
              onClick={() => setBookingType('voucher')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                bookingType === 'voucher' ? 'bg-[#3B523A] text-white shadow-xs' : 'text-[#5C554E]'
              }`}
            >
              🎫 預約憑證
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* FLIGHT FORM */}
          {bookingType === 'flight' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#4A4A4A] mb-1">航空公司</label>
                  <input
                    type="text"
                    required
                    placeholder="例：星宇航空 Starlux"
                    value={airline}
                    onChange={(e) => setAirline(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4A4A4A] mb-1">班機號碼</label>
                  <input
                    type="text"
                    required
                    placeholder="例：JX800"
                    value={flightNo}
                    onChange={(e) => setFlightNo(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#4A4A4A] mb-1">航段分類</label>
                  <select
                    value={flightType}
                    onChange={(e) => setFlightType(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none font-medium"
                  >
                    <option value="outbound">去程航班</option>
                    <option value="inbound">回程航班</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#4A4A4A] mb-1">搭乘日期</label>
                  <input
                    type="date"
                    required
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-[#FFF9F2] p-2.5 rounded-xl border border-[#F1E9DB]">
                <div>
                  <label className="block font-bold text-[#4A4A4A] mb-1">出發機場與航廈</label>
                  <input
                    type="text"
                    required
                    placeholder="例：TPE 桃園 T1"
                    value={departureAirport}
                    onChange={(e) => setDepartureAirport(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-[#F1E9DB] rounded-lg outline-none"
                  />
                  <label className="block font-bold text-[#4A4A4A] mt-2 mb-1">出發起飛時間</label>
                  <input
                    type="time"
                    required
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4A4A4A] mb-1">抵達機場與地區</label>
                  <input
                    type="text"
                    required
                    placeholder="例：SDJ 仙台"
                    value={arrivalAirport}
                    onChange={(e) => setArrivalAirport(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-[#F1E9DB] rounded-lg outline-none"
                  />
                  <label className="block font-bold text-[#4A4A4A] mt-2 mb-1">抵達降落時間</label>
                  <input
                    type="time"
                    required
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                <div>
                  <label className="block font-bold text-[#8C827A] mb-1">登機門</label>
                  <input
                    type="text"
                    placeholder="例：A9"
                    value={gate}
                    onChange={(e) => setGate(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none text-center"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#8C827A] mb-1">航廈</label>
                  <input
                    type="text"
                    placeholder="例：1"
                    value={terminal}
                    onChange={(e) => setTerminal(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none text-center"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#8C827A] mb-1">座位號</label>
                  <input
                    type="text"
                    placeholder="例：12A"
                    value={seatNo}
                    onChange={(e) => setSeatNo(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none text-center"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#8C827A] mb-1">PNR 代號</label>
                  <input
                    type="text"
                    required
                    placeholder="例：JX988"
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-[#F1E9DB] rounded-lg font-mono font-bold outline-none text-center"
                  />
                </div>
              </div>
            </>
          )}

          {/* HOTEL FORM */}
          {bookingType === 'hotel' && (
            <>
              <div>
                <label className="block font-bold text-[#4A4A4A] mb-1">飯店名稱 (中文)</label>
                <input
                  type="text"
                  required
                  placeholder="例：JR東日本飯店 仙台"
                  value={hotelName}
                  onChange={(e) => setHotelName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#4A4A4A] mb-1">飯店日文名稱 (現場計程車/問路用)</label>
                <input
                  type="text"
                  placeholder="例：ホテルメトロポリタン仙台"
                  value={hotelJapaneseName}
                  onChange={(e) => setHotelJapaneseName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#4A4A4A] mb-1">入住日期 (Check-In)</label>
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4A4A4A] mb-1">退房日期 (Check-Out)</label>
                  <input
                    type="date"
                    required
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#4A4A4A] mb-1">飯店地址</label>
                  <input
                    type="text"
                    required
                    placeholder="例：宮城縣仙台市青葉區中央1-1-1"
                    value={hotelAddress}
                    onChange={(e) => setHotelAddress(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4A4A4A] mb-1">飯店電話</label>
                  <input
                    type="text"
                    placeholder="例：+81-22-268-2525"
                    value={hotelPhone}
                    onChange={(e) => setHotelPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#4A4A4A] mb-1">訂房確認代號</label>
                  <input
                    type="text"
                    required
                    placeholder="例：AGD-9812450"
                    value={hotelBookingRef}
                    onChange={(e) => setHotelBookingRef(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#4A4A4A] mb-1">MapCode (自駕導航)</label>
                  <input
                    type="text"
                    placeholder="例：110 585 120*11"
                    value={hotelMapCode}
                    onChange={(e) => setHotelMapCode(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* VOUCHER FORM */}
          {bookingType === 'voucher' && (
            <>
              <div>
                <label className="block font-bold text-[#4A4A4A] mb-1">憑證/預約單名稱</label>
                <input
                  type="text"
                  required
                  placeholder="例：Times Car 租車確認單、松島遊覽船門票"
                  value={voucherTitle}
                  onChange={(e) => setVoucherTitle(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#4A4A4A] mb-1">憑證種類</label>
                  <select
                    value={voucherType}
                    onChange={(e) => setVoucherType(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none font-medium"
                  >
                    <option value="ticket">🎫 門票/票券</option>
                    <option value="car">🚗 租車憑證</option>
                    <option value="flight">✈️ 機票紀錄</option>
                    <option value="hotel">🏨 住宿憑證</option>
                    <option value="other">📑 其他憑證</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#4A4A4A] mb-1">預約編號 / 憑證碼</label>
                  <input
                    type="text"
                    required
                    placeholder="例：KK-8839210"
                    value={voucherRef}
                    onChange={(e) => setVoucherRef(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono font-bold outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4A4A4A] mb-1">備註說明 / 取票注意事項</label>
                <textarea
                  rows={2}
                  placeholder="例：取車地點在仙台站東口，需出示譯本與護照"
                  value={voucherNotes}
                  onChange={(e) => setVoucherNotes(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1E9DB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-[#5C554E] rounded-lg border border-[#F1E9DB]"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#3B523A] hover:bg-[#2C3E2B] text-white font-medium rounded-lg shadow-xs"
            >
              {initialData ? '儲存修改' : '新增預訂'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


