import React, { useState, useEffect } from 'react';
import { FlightDetail, HotelDetail, EmergencyContact, ExpenseItem, ExpenseCategory, PaymentMethod } from '../types';
import {
  Plane,
  Building2,
  PhoneCall,
  Wallet,
  MapPin,
  Copy,
  Check,
  Plus,
  Navigation,
  ShieldAlert,
  Trash2
} from 'lucide-react';
import { motion } from 'motion/react';

interface ToolsInfoViewProps {
  flights: FlightDetail[];
  hotels: HotelDetail[];
  emergencyContacts: EmergencyContact[];
  expenses: ExpenseItem[];
  exchangeRate: number;
  totalBudgetTwd: number;
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

export const ToolsInfoView: React.FC<ToolsInfoViewProps> = ({
  flights,
  hotels,
  emergencyContacts,
  expenses,
  exchangeRate,
  totalBudgetTwd,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [subTab, setSubTab] = useState<'flights' | 'hotels' | 'emergency' | 'budget'>('flights');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Expense modal state
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expAmountJpy, setExpAmountJpy] = useState<number>(1000);
  const [expCategory, setExpCategory] = useState<ExpenseCategory>('food');
  const [expPayment, setExpPayment] = useState<PaymentMethod>('cash');
  const [expNote, setExpNote] = useState('');

  // Flight Countdown Timer
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const nextFlight = flights[0];

  useEffect(() => {
    if (!nextFlight) return;
    const targetDate = new Date(`${nextFlight.date}T${nextFlight.departureTime}:00`);

    const updateTimer = () => {
      const now = new Date();
      const diffMs = targetDate.getTime() - now.getTime();
      if (diffMs > 0) {
        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
        const seconds = Math.floor((diffMs / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [nextFlight]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openGoogleMaps = (name: string, address: string) => {
    const query = encodeURIComponent(address || name);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  // Expense calculations
  const totalSpentJpy = expenses.reduce((sum, e) => sum + e.amountJpy, 0);
  const totalSpentTwd = Math.round(totalSpentJpy * exchangeRate);
  const budgetProgressPercent = Math.min(100, Math.round((totalSpentTwd / totalBudgetTwd) * 100));

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim()) return;
    onAddExpense({
      date: new Date().toISOString().slice(0, 10),
      itemTitle: expTitle,
      category: expCategory,
      amountJpy: Number(expAmountJpy),
      amountTwd: Math.round(Number(expAmountJpy) * exchangeRate),
      paymentMethod: expPayment,
      notes: expNote,
    });
    setExpTitle('');
    setExpAmountJpy(1000);
    setExpNote('');
    setIsAddingExpense(false);
  };

  const getCategoryLabel = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'food':
        return '餐飲美食';
      case 'transport':
        return '交通自駕';
      case 'shopping':
        return '購物採買';
      case 'accommodation':
        return '飯店住宿';
      case 'ticket':
        return '門票票券';
      case 'other':
      default:
        return '其他雜支';
    }
  };

  const getPaymentLabel = (pm: PaymentMethod) => {
    switch (pm) {
      case 'cash':
        return '現金支付';
      case 'credit_card':
        return '信用卡';
      case 'ic_card':
        return 'IC卡 / Suica';
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Tools Top Nav Sub-Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-white rounded-xl border border-[#F1E9DB]">
        {[
          { id: 'flights', label: '航班資訊', icon: <Plane className="w-4 h-4" /> },
          { id: 'hotels', label: '住宿資訊', icon: <Building2 className="w-4 h-4" /> },
          { id: 'emergency', label: '緊急電話', icon: <PhoneCall className="w-4 h-4" /> },
          { id: 'budget', label: '記帳預算', icon: <Wallet className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1 py-2 px-1 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#4A4A4A] text-white shadow-xs'
                  : 'text-[#5C554E] hover:bg-[#FFF9F2]'
              }`}
            >
              {tab.icon}
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ✈️ 1. FLIGHTS SECTION */}
      {subTab === 'flights' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {/* Flight Countdown Banner */}
          {nextFlight && (
            <div className="bg-white p-4 rounded-xl border border-[#F1E9DB] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#2B7A82] bg-[#A5DEE4]/20 px-2 py-0.5 rounded-md border border-[#A5DEE4]/40">
                  距離班機起飛時間
                </span>
                <div className="flex items-baseline gap-2 mt-1.5 font-mono text-[#4A4A4A]">
                  <span className="text-xl font-bold text-[#D45068]">{timeLeft.days}</span>
                  <span className="text-xs font-sans text-[#8C827A]">天</span>
                  <span className="text-xl font-bold text-[#D45068]">{timeLeft.hours}</span>
                  <span className="text-xs font-sans text-[#8C827A]">時</span>
                  <span className="text-xl font-bold text-[#D45068]">{timeLeft.minutes}</span>
                  <span className="text-xs font-sans text-[#8C827A]">分</span>
                  <span className="text-xl font-bold text-[#D45068]">{timeLeft.seconds}</span>
                  <span className="text-xs font-sans text-[#8C827A]">秒</span>
                </div>
              </div>
            </div>
          )}

          {/* Flight Cards */}
          {flights.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[#F1E9DB] p-6">
              <Plane className="w-8 h-8 text-[#8C827A] mx-auto opacity-50" />
              <p className="text-sm font-medium text-[#4A4A4A] mt-2">暫無航班資訊</p>
            </div>
          ) : (
            flights.map((flight) => (
              <div
                key={flight.id}
                className="bg-white p-4 rounded-xl border border-[#F1E9DB] space-y-3"
              >
                <div className="flex items-center justify-between border-b border-[#F1E9DB] pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-[#FFF9F2] text-[#D45068] rounded-lg border border-[#F1E9DB]">
                      <Plane className="w-4 h-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#4A4A4A]">{flight.airline}</h3>
                      <p className="text-xs text-[#8C827A] font-mono">班機代碼: {flight.flightNo}</p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${
                    flight.type === 'outbound' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-sky-50 text-sky-800 border-sky-200'
                  }`}>
                    {flight.type === 'outbound' ? '去程航班' : '回程航班'}
                  </span>
                </div>

                {/* Route & Times */}
                <div className="grid grid-cols-3 gap-2 text-center bg-[#FFF9F2] p-3 rounded-lg border border-[#F1E9DB]">
                  <div>
                    <p className="text-xs font-bold text-[#4A4A4A]">{flight.departureAirport}</p>
                    <p className="text-lg font-bold text-[#D45068] mt-0.5 font-mono">{flight.departureTime}</p>
                    <span className="text-[10px] text-[#8C827A]">{flight.date}</span>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <span className="text-[10px] font-medium text-[#8C827A]">直飛</span>
                    <div className="w-full h-0.5 bg-[#F1E9DB] relative my-1">
                      <Plane className="w-3.5 h-3.5 text-[#D45068] absolute left-1/2 -top-1.5 -translate-x-1/2 transform rotate-90" />
                    </div>
                    <span className="text-[10px] text-[#8C827A]">預訂號: {flight.bookingReference}</span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#4A4A4A]">{flight.arrivalAirport}</p>
                    <p className="text-lg font-bold text-[#4A4A4A] mt-0.5 font-mono">{flight.arrivalTime}</p>
                    <span className="text-[10px] text-[#8C827A]">{flight.date}</span>
                  </div>
                </div>

                {/* Seat & Terminal details */}
                <div className="flex items-center justify-between text-xs text-[#5C554E] bg-white p-2.5 rounded-lg border border-[#F1E9DB]">
                  <span>登機門: <strong className="text-[#4A4A4A]">{flight.gate || '未定'}</strong></span>
                  <span>座位號: <strong className="text-[#4A4A4A]">{flight.seatNo || '系統分配'}</strong></span>
                  <span>航廈: <strong className="text-[#4A4A4A]">{flight.terminal}</strong></span>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* 🏨 2. HOTELS SECTION */}
      {subTab === 'hotels' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {hotels.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[#F1E9DB] p-6">
              <Building2 className="w-8 h-8 text-[#8C827A] mx-auto opacity-50" />
              <p className="text-sm font-medium text-[#4A4A4A] mt-2">暫無住宿資訊</p>
            </div>
          ) : (
            hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white p-4 rounded-xl border border-[#F1E9DB] space-y-3"
              >
                <div className="flex items-start justify-between border-b border-[#F1E9DB] pb-2.5">
                  <div>
                    <h3 className="text-base font-bold text-[#4A4A4A]">{hotel.name}</h3>
                    <p className="text-xs text-[#8C827A] font-mono mt-0.5">{hotel.japaneseName}</p>
                  </div>
                  <span className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    已預訂
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-[#5C554E]">
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#D45068] flex-shrink-0" />
                    <span>{hotel.address}</span>
                  </p>
                  <p className="flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5 text-[#D49E24] flex-shrink-0" />
                    <span>飯店電話: {hotel.phone}</span>
                  </p>
                </div>

                {/* Check in / Check out Times */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-[#FFF9F2] p-2.5 rounded-lg border border-[#F1E9DB]">
                  <div>
                    <span className="text-[#8C827A]">入住時間 Check-in</span>
                    <p className="font-semibold text-[#D45068]">{hotel.checkInDate} ({hotel.checkInTime})</p>
                  </div>
                  <div>
                    <span className="text-[#8C827A]">退房時間 Check-out</span>
                    <p className="font-semibold text-[#4A4A4A]">{hotel.checkOutDate} ({hotel.checkOutTime})</p>
                  </div>
                </div>

                {/* MapCode & Navigation Action */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F1E9DB]">
                  {hotel.mapCode && (
                    <button
                      onClick={() => handleCopy(hotel.id, hotel.mapCode!)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-white border border-[#A5DEE4]/60 text-[#2B7A82] rounded-lg text-xs font-mono font-medium"
                    >
                      {copiedId === hotel.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>自駕 MapCode: {hotel.mapCode}</span>
                    </button>
                  )}

                  <button
                    onClick={() => openGoogleMaps(hotel.name, hotel.address)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#4A4A4A] hover:bg-[#333333] text-white rounded-lg text-xs font-medium shadow-xs ml-auto"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>開啟飯店導航</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* 🚨 3. EMERGENCY CONTACTS SECTION */}
      {subTab === 'emergency' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="bg-[#FFF9F2] p-3.5 rounded-xl border border-[#F1E9DB] flex items-center gap-2 text-xs text-[#4A4A4A]">
            <ShieldAlert className="w-5 h-5 text-[#D45068] flex-shrink-0" />
            <span>日本旅遊緊急應變、求助與通譯服務專線。</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {emergencyContacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white p-3.5 rounded-xl border border-[#F1E9DB] flex flex-col justify-between space-y-2"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#4A4A4A]">{contact.title}</h4>
                    <span className="text-[11px] font-semibold text-[#D45068] bg-[#F8C3CD]/20 px-2 py-0.5 rounded-md border border-[#F8C3CD]/40">
                      {contact.phone}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5C554E] mt-1 whitespace-pre-line leading-relaxed">
                    {contact.description}
                  </p>
                  {contact.tips && (
                    <p className="text-[10px] text-[#8C827A] mt-1">💡 {contact.tips}</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-[#F1E9DB]">
                  <button
                    onClick={() => handleCopy(contact.id, contact.phone)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#FFF9F2] border border-[#F1E9DB] text-[#4A4A4A] rounded-lg text-[11px] font-medium transition-colors"
                  >
                    {copiedId === contact.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>複製號碼</span>
                  </button>

                  <a
                    href={`tel:${contact.phone}`}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-medium transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>一鍵撥打</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 💰 4. EXPENSE TRACKER & BUDGET SECTION */}
      {subTab === 'budget' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          {/* Budget Overview Card */}
          <div className="bg-white p-4 rounded-xl border border-[#F1E9DB] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-[#8C827A]">總預算與記帳統計</span>
                <p className="text-xl font-bold text-[#D45068] mt-0.5">
                  已花費 NT$ {totalSpentTwd.toLocaleString()} <span className="text-xs text-[#8C827A] font-normal">(¥{totalSpentJpy.toLocaleString()})</span>
                </p>
              </div>

              <button
                onClick={() => setIsAddingExpense(!isAddingExpense)}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#4A4A4A] hover:bg-[#333333] text-white rounded-lg text-xs font-medium shadow-xs active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增記帳</span>
              </button>
            </div>

            {/* Budget Progress Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium text-[#5C554E]">
                <span>預算上限: NT$ {totalBudgetTwd.toLocaleString()}</span>
                <span className="font-bold text-[#D45068]">{budgetProgressPercent}%</span>
              </div>
              <div className="w-full bg-[#FFF9F2] h-2 rounded-full overflow-hidden border border-[#F1E9DB]">
                <div
                  className="bg-[#4A4A4A] h-full transition-all duration-500 rounded-full"
                  style={{ width: `${budgetProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* New Expense Modal Inline Form */}
          {isAddingExpense && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleCreateExpense}
              className="bg-[#FFF9F2] p-4 rounded-xl border border-[#F1E9DB] space-y-3 text-xs"
            >
              <h4 className="font-bold text-[#9E6B00] text-sm flex items-center gap-1">
                <Plus className="w-4 h-4" /> 記錄花費
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#4A4A4A] mb-1">花費項目</label>
                  <input
                    type="text"
                    required
                    placeholder="例：牛舌餐、Suica儲值"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#4A4A4A] mb-1">金額 (日幣 JPY)</label>
                  <input
                    type="number"
                    required
                    value={expAmountJpy}
                    onChange={(e) => setExpAmountJpy(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg font-mono outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-[#4A4A4A] mb-1">消費類別</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
                  >
                    <option value="food">餐飲美食</option>
                    <option value="transport">交通自駕</option>
                    <option value="shopping">購物採買</option>
                    <option value="accommodation">飯店住宿</option>
                    <option value="ticket">門票票券</option>
                    <option value="other">其他雜支</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#4A4A4A] mb-1">支付方式</label>
                  <select
                    value={expPayment}
                    onChange={(e) => setExpPayment(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-white border border-[#F1E9DB] rounded-lg outline-none"
                  >
                    <option value="cash">現金支付</option>
                    <option value="credit_card">信用卡</option>
                    <option value="ic_card">IC卡 / Suica</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingExpense(false)}
                  className="px-3 py-1.5 bg-white text-[#5C554E] rounded-lg border border-[#F1E9DB]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#4A4A4A] hover:bg-[#333333] text-white font-medium rounded-lg"
                >
                  儲存記帳
                </button>
              </div>
            </motion.form>
          )}

          {/* Expenses Log List */}
          <div className="space-y-2">
            {expenses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-[#F1E9DB] p-6">
                <Wallet className="w-8 h-8 text-[#8C827A] mx-auto opacity-50" />
                <p className="text-sm font-medium text-[#4A4A4A] mt-2">尚未新增任何記帳紀錄</p>
              </div>
            ) : (
              expenses.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-xl border border-[#F1E9DB] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#4A4A4A]">{item.itemTitle}</span>
                      <span className="text-[10px] bg-[#FFF9F2] text-[#9E6B00] px-2 py-0.5 rounded-md font-medium border border-[#F1E9DB]">
                        {getCategoryLabel(item.category)}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#8C827A] mt-0.5 flex items-center gap-2 font-medium">
                      <span>{item.date}</span>
                      <span>‧</span>
                      <span>{getPaymentLabel(item.paymentMethod)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-bold text-[#D45068] text-sm">¥{item.amountJpy.toLocaleString()}</p>
                      <p className="text-[10px] text-[#8C827A]">NT$ {item.amountTwd.toLocaleString()}</p>
                    </div>

                    <button
                      onClick={() => onDeleteExpense(item.id)}
                      className="p-1 text-[#8C827A] hover:text-rose-500"
                      title="刪除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
