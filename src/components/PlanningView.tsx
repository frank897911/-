import React, { useState } from 'react';
import { ChecklistItem, GroupMember } from '../types';
import { CheckSquare, ShoppingBag, Plus, Check, Trash2, User, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageLightboxModal } from './Modals';

interface PlanningViewProps {
  checklists: ChecklistItem[];
  members: GroupMember[];
  onToggleChecklist: (id: string) => void;
  onAddChecklist: (item: Omit<ChecklistItem, 'id' | 'completed'>) => void;
  onDeleteChecklist: (id: string) => void;
}

export const PlanningView: React.FC<PlanningViewProps> = ({
  checklists,
  members,
  onToggleChecklist,
  onAddChecklist,
  onDeleteChecklist,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'todo' | 'packing' | 'shopping' | 'gourmet'>('packing');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'todo' | 'packing' | 'shopping' | 'gourmet'>('shopping');
  const [assignee, setAssignee] = useState('全體');
  const [imageUrl, setImageUrl] = useState('');
  const [targetStore, setTargetStore] = useState('');

  const filteredItems = checklists.filter((item) => {
    if (activeTab === 'all') return true;
    const cat = item.category || (item as any).type;
    return cat === activeTab;
  });

  const handleOpenAddModal = () => {
    const cat = activeTab === 'all' ? 'shopping' : activeTab;
    setCategory(cat as any);
    setIsAddOpen(true);
  };

  const completedCount = filteredItems.filter((i) => i.completed).length;
  const totalCount = filteredItems.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!title.trim()) return;

    onAddChecklist({
      title: title.trim(),
      category,
      type: category as any,
      assignee,
      assignedTo: assignee,
      imageUrl: imageUrl.trim() || undefined,
      targetStore: targetStore.trim() || undefined,
    } as any);

    setTitle('');
    setImageUrl('');
    setTargetStore('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-4 pb-20">
      <ImageLightboxModal
        isOpen={!!lightboxUrl}
        onClose={() => setLightboxUrl(null)}
        imageUrl={lightboxUrl || ''}
        title="預定採買/美食參考圖"
      />

      {/* Header Banner */}
      <div className="bg-[#FFFDF7] p-3.5 sm:p-4 rounded-2xl border border-[#EBE3D5] shadow-[3px_3px_0px_#E2DDD0] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-xl bg-[#E2EAD8] text-[#3B523A] border border-[#C5D5B5] flex items-center justify-center font-bold text-xl flex-shrink-0">
            📋
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm sm:text-base font-bold text-[#3E3A37] truncate">行前準備 ‧ 行李清單 ‧ 採買</h2>
            <p className="text-[11px] sm:text-xs text-[#8C827A] mt-0.5 line-clamp-1">
              分配團員任務、行李點檢與必買藥妝採買清單
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-[#3B523A] hover:bg-[#2C3E2B] text-white text-xs font-bold rounded-xl shadow-[2px_2px_0px_#223322] active:scale-95 transition-all whitespace-nowrap flex-shrink-0"
        >
          <Plus className="w-4 h-4 flex-shrink-0" />
          <span className="whitespace-nowrap">新增項目</span>
        </button>
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#EBE3D5] overflow-x-auto no-scrollbar">
        {[
          { id: 'packing', label: '🎒 行李清單' },
          { id: 'shopping', label: '🛍️ 購物採買' },
          { id: 'gourmet', label: '🍜 美食願望' },
          { id: 'todo', label: '📌 行前待辦' },
          { id: 'all', label: '全部' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[70px] py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#3B523A] text-white font-bold shadow-xs'
                : 'text-[#78716C] hover:bg-[#F7F4EB]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-[#FFFDF7] p-3 rounded-xl border border-[#EBE3D5] shadow-xs space-y-1">
        <div className="flex justify-between text-xs text-[#78716C] font-bold">
          <span>完成進度：{completedCount} / {totalCount} 項</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="w-full bg-[#EBE3D5] h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4E7C59] transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add Item Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FFFDF7] rounded-3xl p-5 border border-[#EBE3D5] shadow-2xl max-w-sm w-full space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#EBE3D5] pb-2.5">
                <h3 className="text-base font-bold text-[#3E3A37] flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-[#3B523A]" />
                  <span>新增準備項目</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="text-stone-400 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">項目名稱</label>
                  <input
                    type="text"
                    required
                    placeholder="例如：護照、日本SIM卡、EVE止痛藥..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                  />
                </div>

                {/* Category & Assignee */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#4E7C59] mb-1">分組類別</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs border border-[#EBE3D5] rounded-xl bg-white font-medium"
                    >
                      <option value="packing">🎒 行李清單</option>
                      <option value="shopping">🛍️ 購物採買</option>
                      <option value="gourmet">🍜 美食願望</option>
                      <option value="todo">📌 行前待辦</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4E7C59] mb-1">負責成員</label>
                    <select
                      value={assignee}
                      onChange={(e) => setAssignee(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-[#EBE3D5] rounded-xl bg-white font-medium"
                    >
                      <option value="全體">全體</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Target Store (Optional for Shopping/Gourmet) */}
                {(category === 'shopping' || category === 'gourmet') && (
                  <div>
                    <label className="block text-xs font-bold text-[#4E7C59] mb-1">預定購買/用餐店家 (選填)</label>
                    <input
                      type="text"
                      placeholder="例如：唐吉訶德、松本清、仙台車站S-PAL"
                      value={targetStore}
                      onChange={(e) => setTargetStore(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                    />
                  </div>
                )}

                {/* Reference Image Attachment */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">附圖網址/檔案 (選填)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="圖片網址 https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                    />
                    <label className="px-2.5 py-1.5 bg-[#F7F4EB] text-[#3E3A37] text-xs font-bold rounded-xl cursor-pointer border border-[#EBE3D5]">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

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
                    加入清單
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Checklist Grid */}
      <div className="space-y-2">
        {filteredItems.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-[#EBE3D5] text-[#8C827A] text-xs">
            此分類尚無項目，點擊右上角「新增項目」加入！
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white p-3.5 rounded-2xl border border-[#EBE3D5] shadow-[2px_2px_0px_#E2DDD0] flex items-center justify-between gap-3 transition-all ${
                item.completed ? 'opacity-60 bg-stone-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onToggleChecklist(item.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    item.completed
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white border-stone-300 hover:border-[#3B523A]'
                  }`}
                >
                  {item.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </button>

                <div>
                  <span
                    className={`text-sm font-bold text-[#3E3A37] block ${
                      item.completed ? 'line-through text-stone-400' : ''
                    }`}
                  >
                    {item.title}
                  </span>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#8C827A] mt-0.5">
                    {(item.assignee || (item as any).assignedTo) && (
                      <span className="bg-[#E2EAD8] text-[#3B523A] px-1.5 py-0.5 rounded font-bold border border-[#C5D5B5]">
                        👤 {item.assignee || (item as any).assignedTo}
                      </span>
                    )}
                    {item.targetStore && <span>📍 {item.targetStore}</span>}
                  </div>
                </div>
              </div>

              {/* Photo Thumbnail if attached & Delete button */}
              <div className="flex items-center gap-2">
                {item.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setLightboxUrl(item.imageUrl!)}
                    className="w-9 h-9 rounded-lg overflow-hidden border border-[#EBE3D5] flex-shrink-0"
                  >
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onDeleteChecklist(item.id)}
                  className="p-1 text-stone-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
