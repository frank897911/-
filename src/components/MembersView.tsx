import React, { useState, useRef } from 'react';
import { GroupMember } from '../types';
import { Users, Plus, Phone, ShieldAlert, Edit2, Trash2, Info, Camera, Upload, Image, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MembersViewProps {
  members: GroupMember[];
  onAddMember: (member: Omit<GroupMember, 'id'>) => void;
  onEditMember?: (id: string, updated: Partial<GroupMember>) => void;
  onDeleteMember: (id: string) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  members,
  onAddMember,
  onEditMember,
  onDeleteMember,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('團員');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('🐱');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [avatarTab, setAvatarTab] = useState<'emoji' | 'upload' | 'url'>('emoji');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarOptions = ['🐱', '🐥', '🐶', '🦊', '🐻', '🐼', '🐰', '🦁', '🦉', '🍙', '🍣', '🐸', '🐤', '🐷'];

  const handleOpenAdd = () => {
    setEditingMemberId(null);
    setName('');
    setRole('團員');
    setPhone('');
    setAvatar('🐱');
    setAvatarUrl('');
    setNotes('');
    setAvatarTab('emoji');
    setIsAddOpen(true);
  };

  const handleOpenEdit = (m: GroupMember) => {
    setEditingMemberId(m.id);
    setName(m.name);
    setRole(m.role || '團員');
    setPhone(m.phone || '');
    setAvatar(m.avatar || '🐱');
    setAvatarUrl(m.avatarUrl || '');
    setNotes(m.notes || '');
    setAvatarTab(m.avatarUrl ? 'upload' : 'emoji');
    setIsAddOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('照片檔案較大，請選擇 5MB 以下的照片');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updatedData: Omit<GroupMember, 'id'> = {
      name: name.trim(),
      role: role.trim(),
      phone: phone.trim(),
      avatar: avatar,
      avatarUrl: avatarUrl.trim() || undefined,
      notes: notes.trim(),
    };

    if (editingMemberId && onEditMember) {
      onEditMember(editingMemberId, updatedData);
    } else {
      onAddMember(updatedData);
    }

    setName('');
    setPhone('');
    setAvatarUrl('');
    setNotes('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="bg-[#FFFDF7] p-4 rounded-2xl border border-[#EBE3D5] shadow-[3px_3px_0px_#E2DDD0] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E2EAD8] text-[#3B523A] border border-[#C5D5B5] flex items-center justify-center font-bold text-xl">
            👥
          </div>
          <div>
            <h2 className="text-base font-bold text-[#3E3A37]">同行團員 ‧ 角色分工</h2>
            <p className="text-xs text-[#8C827A] mt-0.5">
              成員聯絡電話、職責分工與海外緊急救援專線
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1 px-3.5 py-2 bg-[#3B523A] hover:bg-[#2C3E2B] text-white text-xs font-bold rounded-xl shadow-[2px_2px_0px_#223322] active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>加成員</span>
        </button>
      </div>

      {/* Add / Edit Member Modal */}
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
                  <Users className="w-5 h-5 text-[#3B523A]" />
                  <span>{editingMemberId ? '編輯同行成員' : '新增同行成員'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="text-stone-400 font-bold hover:text-[#3E3A37]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Avatar Mode Selection */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-[#4E7C59]">成員頭像造型</label>
                    <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg text-[11px]">
                      <button
                        type="button"
                        onClick={() => setAvatarTab('emoji')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                          avatarTab === 'emoji' ? 'bg-white text-[#3E3A37] shadow-xs' : 'text-stone-500'
                        }`}
                      >
                        Emoji
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatarTab('upload')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                          avatarTab === 'upload' ? 'bg-white text-[#3E3A37] shadow-xs' : 'text-stone-500'
                        }`}
                      >
                        上傳照片
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatarTab('url')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                          avatarTab === 'url' ? 'bg-white text-[#3E3A37] shadow-xs' : 'text-stone-500'
                        }`}
                      >
                        圖片網址
                      </button>
                    </div>
                  </div>

                  {avatarTab === 'emoji' && (
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                      {avatarOptions.map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => {
                            setAvatar(a);
                            setAvatarUrl('');
                          }}
                          className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all flex-shrink-0 ${
                            avatar === a && !avatarUrl
                              ? 'bg-[#E2EAD8] scale-110 border border-[#3B523A] shadow-xs'
                              : 'bg-white opacity-70 hover:opacity-100 border border-[#EBE3D5]'
                          }`}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  )}

                  {avatarTab === 'upload' && (
                    <div className="space-y-2 py-1">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#E2EAD8] border border-[#C5D5B5] flex items-center justify-center overflow-hidden flex-shrink-0">
                          {avatarUrl ? (
                            <img src={avatarUrl} alt="預覽" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl">{avatar}</span>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#E2EAD8] hover:bg-[#C5D5B5] text-[#3B523A] font-bold text-xs rounded-xl border border-[#C5D5B5] transition-all"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>選擇本地相片上傳</span>
                          </button>
                          {avatarUrl && (
                            <button
                              type="button"
                              onClick={() => setAvatarUrl('')}
                              className="text-[11px] text-rose-500 font-medium hover:underline block"
                            >
                              清除相片 (改用 Emoji)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {avatarTab === 'url' && (
                    <div className="space-y-2 py-1">
                      <div className="flex items-center gap-2">
                        <input
                          type="url"
                          placeholder="貼上圖片網址 https://..."
                          value={avatarUrl}
                          onChange={(e) => setAvatarUrl(e.target.value)}
                          className="flex-1 px-3 py-1.5 text-xs border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                        />
                        {avatarUrl && (
                          <div className="w-8 h-8 rounded-xl overflow-hidden border border-[#EBE3D5] flex-shrink-0">
                            <img src={avatarUrl} alt="網址預覽" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Name & Role */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">姓名 / 暱稱</label>
                  <input
                    type="text"
                    required
                    placeholder="例如：小雞"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">團體分工角色</label>
                  <input
                    type="text"
                    placeholder="例如：隊長 / 總召、財務長、攝影師、副駕駛..."
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">緊急聯絡電話</label>
                  <input
                    type="tel"
                    placeholder="0912-345-678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">備註/飲食禁忌 (選填)</label>
                  <input
                    type="text"
                    placeholder="例如：不吃牛肉、對甲殼類過敏..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                  />
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
                    {editingMemberId ? '儲存修改' : '新增成員'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Group Members List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {members.map((m) => (
          <div
            key={m.id}
            className="bg-white p-4 rounded-2xl border border-[#EBE3D5] shadow-[3px_3px_0px_#E2DDD0] space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#E2EAD8] border border-[#C5D5B5] flex items-center justify-center text-2xl overflow-hidden flex-shrink-0">
                  {m.avatarUrl ? (
                    <img src={m.avatarUrl} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{m.avatar || '🐱'}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#3E3A37]">{m.name}</h3>
                  <span className="text-[11px] font-bold bg-[#FFFDF7] text-[#4E7C59] px-2 py-0.5 rounded-md border border-[#C5D5B5] inline-block mt-0.5">
                    {m.role || '團員'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(m)}
                  className="p-1 text-stone-300 hover:text-[#3B523A] transition-colors"
                  title="編輯成員"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteMember(m.id)}
                  className="p-1 text-stone-300 hover:text-rose-500 transition-colors"
                  title="刪除成員"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {m.phone && (
              <a
                href={`tel:${m.phone}`}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#F7F4EB] hover:bg-[#EBE3D5] text-[#3E3A37] rounded-xl text-xs font-mono font-bold transition-all w-full"
              >
                <Phone className="w-3.5 h-3.5 text-[#2B7A82]" />
                <span>{m.phone}</span>
              </a>
            )}

            {m.notes && (
              <p className="text-xs text-[#8C827A] bg-[#FFFDF7] p-2 rounded-xl border border-[#EBE3D5] flex items-start gap-1 font-medium">
                <Info className="w-3.5 h-3.5 text-[#8C827A] flex-shrink-0 mt-0.5" />
                <span>{m.notes}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Emergency Hotline Card */}
      <div className="bg-[#FFFDF7] p-4 rounded-2xl border border-rose-200 shadow-[3px_3px_0px_#FFE4E6] space-y-3">
        <div className="flex items-center gap-2 text-rose-700 font-bold text-xs">
          <ShieldAlert className="w-4 h-4" />
          <span>日本海外緊急救援與通報求助電話</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <a
            href="tel:110"
            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-900 rounded-xl border border-rose-200 flex items-center justify-between font-bold"
          >
            <span>警察局報案 🚓</span>
            <span className="text-sm font-extrabold">110</span>
          </a>

          <a
            href="tel:119"
            className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-900 rounded-xl border border-rose-200 flex items-center justify-between font-bold"
          >
            <span>火災救護車 🚑</span>
            <span className="text-sm font-extrabold">119</span>
          </a>
        </div>

        <div className="text-[11px] text-[#78716C] bg-white p-2.5 rounded-xl border border-[#EBE3D5]">
          <span className="font-bold text-[#3E3A37] block">台北駐日經濟文化代表處（東京專線）：</span>
          <span className="font-mono text-[#2B7A82] block mt-0.5">+81-3-3280-7111 (緊急: +81-90-3200-0077)</span>
        </div>
      </div>
    </div>
  );
};
