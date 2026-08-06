import React, { useState } from 'react';
import { ExpenseItem, ExpenseCategory, PaymentMethod, GroupMember } from '../types';
import { Wallet, Plus, CreditCard, DollarSign, Calculator, Trash2, PieChart, Users, ArrowRightLeft, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ExpenseViewProps {
  expenses: ExpenseItem[];
  members: GroupMember[];
  exchangeRate: number;
  totalBudgetTwd: number;
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseView: React.FC<ExpenseViewProps> = ({
  expenses,
  members,
  exchangeRate,
  totalBudgetTwd,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [itemTitle, setItemTitle] = useState('');
  const [amountJpyInput, setAmountJpyInput] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [payer, setPayer] = useState<string>(members[0]?.name || '阿呆');
  const [selectedSplitMembers, setSelectedSplitMembers] = useState<string[]>(
    members.map((m) => m.name)
  );

  const handleOpenAddModal = () => {
    if (members.length > 0) {
      if (!members.some((m) => m.name === payer)) {
        setPayer(members[0].name);
      }
      setSelectedSplitMembers(members.map((m) => m.name));
    }
    setIsAddOpen(true);
  };
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Calculations
  const totalSpentJpy = expenses.reduce((sum, e) => sum + e.amountJpy, 0);
  const totalSpentTwd = Math.round(totalSpentJpy * exchangeRate);
  const budgetLeftTwd = totalBudgetTwd - totalSpentTwd;
  const budgetUsagePercent = Math.min(100, Math.round((totalSpentTwd / totalBudgetTwd) * 100));

  // Category Colors
  const categoryMeta: Record<ExpenseCategory, { label: string; icon: string; bg: string; text: string }> = {
    food: { label: '餐飲美食', icon: '🍜', bg: 'bg-[#FDE08E]/30', text: 'text-[#9E6B00]' },
    transport: { label: '交通車資', icon: '🚗', bg: 'bg-[#A5DEE4]/30', text: 'text-[#2B7A82]' },
    shopping: { label: '購物採買', icon: '🛍️', bg: 'bg-[#F8C3CD]/30', text: 'text-[#D45068]' },
    accommodation: { label: '飯店住宿', icon: '🏨', bg: 'bg-[#E2D4F0]/30', text: 'text-[#7B42A6]' },
    ticket: { label: '門票體驗', icon: '🎫', bg: 'bg-[#E2EAD8]', text: 'text-[#3B523A]' },
    other: { label: '其他雜項', icon: '🎈', bg: 'bg-stone-100', text: 'text-stone-700' },
  };

  const handleQuickAddAmount = (addVal: number) => {
    const current = parseFloat(amountJpyInput) || 0;
    setAmountJpyInput(String(current + addVal));
  };

  const handleToggleSplitMember = (memberName: string) => {
    if (selectedSplitMembers.includes(memberName)) {
      if (selectedSplitMembers.length > 1) {
        setSelectedSplitMembers(selectedSplitMembers.filter((m) => m !== memberName));
      }
    } else {
      setSelectedSplitMembers([...selectedSplitMembers, memberName]);
    }
  };

  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const valJpy = parseFloat(amountJpyInput);
    if (!itemTitle.trim() || isNaN(valJpy) || valJpy <= 0) return;

    onAddExpense({
      itemTitle: itemTitle.trim(),
      amountJpy: valJpy,
      amountTwd: Math.round(valJpy * exchangeRate),
      category,
      paymentMethod,
      payer,
      splitType: 'equal',
      splitMembers: selectedSplitMembers,
      date,
      notes: notes.trim(),
    });

    // Reset Form
    setItemTitle('');
    setAmountJpyInput('');
    setNotes('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Total Expense Dashboard Card */}
      <div className="bg-[#FFFDF7] p-4 rounded-2xl border border-[#EBE3D5] shadow-[3px_3px_0px_#E2DDD0] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#E2EAD8] text-[#3B523A] border border-[#C5D5B5] flex items-center justify-center font-bold text-lg">
              💰
            </div>
            <div>
              <span className="text-xs font-bold text-[#4E7C59]">旅行總支出儀表板</span>
              <h2 className="text-xl font-extrabold text-[#3E3A37] font-mono leading-none mt-0.5">
                NT$ {totalSpentTwd.toLocaleString()}{' '}
                <span className="text-xs text-[#8C827A] font-normal font-sans">
                  (¥{totalSpentJpy.toLocaleString()})
                </span>
              </h2>
            </div>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#3B523A] hover:bg-[#2C3E2B] text-white text-xs font-bold rounded-xl shadow-[2px_2px_0px_#223322] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>記一筆</span>
          </button>
        </div>

        {/* Budget Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-[#78716C] font-medium">
            <span>預算剩餘：NT$ {budgetLeftTwd.toLocaleString()}</span>
            <span>總預算：NT$ {totalBudgetTwd.toLocaleString()} ({budgetUsagePercent}%)</span>
          </div>
          <div className="w-full bg-[#EBE3D5] h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetUsagePercent > 90 ? 'bg-rose-500' : 'bg-[#4E7C59]'
              }`}
              style={{ width: `${Math.min(100, budgetUsagePercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FFFDF7] rounded-3xl p-5 border border-[#EBE3D5] shadow-2xl max-w-sm w-full space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#EBE3D5] pb-3">
                <h3 className="text-base font-bold text-[#3E3A37] flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#3B523A]" />
                  <span>新增旅行記帳</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="text-stone-400 hover:text-stone-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitExpense} className="space-y-3">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">消費項目名稱</label>
                  <input
                    type="text"
                    required
                    placeholder="例如：閣 牛舌晚餐、JR新幹線車票..."
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                  />
                </div>

                {/* Amount JPY + Quick Add Buttons */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">金額 (日圓 JPY)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-stone-400">¥</span>
                    <input
                      type="number"
                      required
                      placeholder="0"
                      value={amountJpyInput}
                      onChange={(e) => setAmountJpyInput(e.target.value)}
                      className="w-full pl-8 pr-24 py-2 text-lg font-bold font-mono border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#78716C] font-mono">
                      ≈ NT${Math.round((parseFloat(amountJpyInput) || 0) * exchangeRate)}
                    </span>
                  </div>

                  {/* Preset Amount Chips */}
                  <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar">
                    {[500, 1000, 3000, 5000, 10000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleQuickAddAmount(val)}
                        className="px-2.5 py-1 bg-[#F7F4EB] hover:bg-[#EBE3D5] text-[#3E3A37] text-xs font-mono font-bold rounded-lg transition-all"
                      >
                        +¥{val.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category Pills */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">消費類別</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(Object.keys(categoryMeta) as ExpenseCategory[]).map((catKey) => {
                      const meta = categoryMeta[catKey];
                      const isSelected = category === catKey;
                      return (
                        <button
                          key={catKey}
                          type="button"
                          onClick={() => setCategory(catKey)}
                          className={`py-1.5 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                            isSelected
                              ? 'bg-[#3B523A] text-white border-[#3B523A]'
                              : 'bg-white text-[#78716C] border-[#EBE3D5]'
                          }`}
                        >
                          <span>{meta.icon}</span>
                          <span>{meta.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payer Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">先付代墊人</label>
                  <select
                    value={payer}
                    onChange={(e) => setPayer(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A] bg-white font-medium"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Split Members Selection */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">分攤成員 (平分)</label>
                  <div className="flex flex-wrap gap-1.5">
                    {members.map((m) => {
                      const isSelected = selectedSplitMembers.includes(m.name);
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => handleToggleSplitMember(m.name)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
                            isSelected
                              ? 'bg-[#E2EAD8] text-[#3B523A] border-[#C5D5B5] font-bold'
                              : 'bg-white text-stone-400 border-stone-200'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 text-[#3B523A]" />}
                          <span>{m.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">支付方式</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'cash', label: '💴 現金' },
                      { id: 'credit_card', label: '💳 信用卡' },
                      { id: 'ic_card', label: '🐧 Suica / IC卡' },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                          paymentMethod === pm.id
                            ? 'bg-[#3B523A] text-white border-[#3B523A]'
                            : 'bg-white text-[#78716C] border-[#EBE3D5]'
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 py-2 bg-stone-100 text-stone-600 rounded-xl text-xs font-bold"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-[#3B523A] hover:bg-[#2C3E2B] text-white rounded-xl text-xs font-bold shadow-[2px_2px_0px_#223322]"
                  >
                    儲存記帳
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Expense List */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-[#4E7C59] tracking-wider uppercase pl-1">
          支出明細紀錄 ({expenses.length} 筆)
        </h3>

        {expenses.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-[#EBE3D5] text-[#8C827A] text-xs">
            尚無記帳資料，點擊右上角「記一筆」新增吧！
          </div>
        ) : (
          expenses.map((item) => {
            const meta = categoryMeta[item.category] || categoryMeta.other;
            const perPersonJpy = item.splitMembers && item.splitMembers.length > 0
              ? Math.round(item.amountJpy / item.splitMembers.length)
              : item.amountJpy;

            return (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-2xl border border-[#EBE3D5] shadow-[3px_3px_0px_#E2DDD0] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${meta.bg} flex items-center justify-center text-lg`}>
                    {meta.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#3E3A37]">{item.itemTitle}</h4>
                    <div className="flex items-center gap-2 text-xs text-[#8C827A] mt-0.5 font-medium">
                      <span>{item.payer || '007'} 先付</span>
                      <span>‧</span>
                      <span>{item.splitMembers?.length || 4}人平分 (每人 ¥{perPersonJpy.toLocaleString()})</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="text-base font-extrabold text-[#D45068] font-mono">
                    ¥{item.amountJpy.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#8C827A] font-mono">
                    約 NT${item.amountTwd || Math.round(item.amountJpy * exchangeRate)}
                  </div>
                  <button
                    onClick={() => onDeleteExpense(item.id)}
                    className="mt-1 p-0.5 text-stone-300 hover:text-rose-500 transition-colors"
                    title="刪除記帳"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
