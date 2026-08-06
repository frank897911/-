import React, { useState } from 'react';
import { JournalEntry, GroupMember } from '../types';
import { BookOpen, Plus, Heart, MapPin, Smile, Image as ImageIcon, Calendar, Trash2, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageLightboxModal } from './Modals';

interface JournalViewProps {
  journals: JournalEntry[];
  members: GroupMember[];
  onAddJournal: (entry: Omit<JournalEntry, 'id' | 'likesCount'>) => void;
  onDeleteJournal: (id: string) => void;
  onLikeJournal: (id: string) => void;
}

export const JournalView: React.FC<JournalViewProps> = ({
  journals,
  members,
  onAddJournal,
  onDeleteJournal,
  onLikeJournal,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(members[0]?.name || '007 (隊長)');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [moodEmoji, setMoodEmoji] = useState('🍣');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');

  const moodEmojis = ['🍣', '🥩', '🌸', '🎏', '🍵', '🍶', '⛩️', '🎒', '❄️', '♨️'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrlInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddJournal({
      title: title.trim(),
      author,
      date,
      moodEmoji,
      content: content.trim(),
      location: location.trim(),
      imageUrls: imageUrlInput ? [imageUrlInput] : [],
    });

    // Reset Form
    setTitle('');
    setContent('');
    setLocation('');
    setImageUrlInput('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Lightbox for Journal Photos */}
      <ImageLightboxModal
        isOpen={!!lightboxUrl}
        onClose={() => setLightboxUrl(null)}
        imageUrl={lightboxUrl || ''}
        title="旅行手帳照片"
      />

      {/* Header Banner */}
      <div className="bg-[#FFFDF7] p-4 rounded-2xl border border-[#EBE3D5] shadow-[3px_3px_0px_#E2DDD0] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E2EAD8] text-[#3B523A] border border-[#C5D5B5] flex items-center justify-center font-bold text-xl">
            📖
          </div>
          <div>
            <h2 className="text-base font-bold text-[#3E3A37]">日系旅行手帳與隨筆記錄</h2>
            <p className="text-xs text-[#8C827A] mt-0.5">
              紀錄旅行中的感動瞬間、美食驚喜與照片回憶
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1 px-3.5 py-2 bg-[#3B523A] hover:bg-[#2C3E2B] text-white text-xs font-bold rounded-xl shadow-[2px_2px_0px_#223322] active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>寫日誌</span>
        </button>
      </div>

      {/* Add Journal Modal */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#FFFDF7] rounded-3xl p-5 border border-[#EBE3D5] shadow-2xl max-w-md w-full space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-[#EBE3D5] pb-3">
                <h3 className="text-base font-bold text-[#3E3A37] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#3B523A]" />
                  <span>新增旅行手帳隨筆</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="text-stone-400 hover:text-stone-600 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitJournal} className="space-y-3">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">標題</label>
                  <input
                    type="text"
                    required
                    placeholder="例如：終於吃到神級閣牛舌！"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                  />
                </div>

                {/* Author & Mood Row */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-[#4E7C59] mb-1">記錄作者</label>
                    <select
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A] bg-white font-medium"
                    >
                      {members.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4E7C59] mb-1">心情貼紙</label>
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                      {moodEmojis.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => setMoodEmoji(e)}
                          className={`p-1 text-base rounded-lg transition-all ${
                            moodEmoji === e ? 'bg-[#E2EAD8] scale-110 border border-[#C5D5B5]' : 'opacity-70'
                          }`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">打卡打卡地點 (選填)</label>
                  <input
                    type="text"
                    placeholder="例如：牛たん料理 閣 ブランドーム本店"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                  />
                </div>

                {/* Photo Upload / URL */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">上傳照片或貼上網址</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="貼上圖片網址 https://..."
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                    />
                    <label className="px-3 py-1.5 bg-[#F7F4EB] hover:bg-[#EBE3D5] text-[#3E3A37] text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1 border border-[#EBE3D5]">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>上傳</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                  {imageUrlInput && (
                    <div className="mt-2 relative w-20 h-20 rounded-xl overflow-hidden border border-[#EBE3D5]">
                      <img src={imageUrlInput} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-bold text-[#4E7C59] mb-1">日誌內文</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="寫下今天的旅遊故事與心情吧..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#EBE3D5] rounded-xl focus:outline-none focus:border-[#3B523A]"
                  />
                </div>

                {/* Submit / Cancel */}
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
                    發布日誌
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Journal Cards Stream */}
      <div className="space-y-4">
        {journals.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#EBE3D5] p-6 text-[#8C827A] text-xs space-y-2">
            <div>📖 還沒有任何旅行日誌</div>
            <div>點擊右上角「寫日誌」為大家記錄當下的感動吧！</div>
          </div>
        ) : (
          journals.map((j) => (
            <div
              key={j.id}
              className="bg-white rounded-2xl border border-[#EBE3D5] shadow-[3px_3px_0px_#E2DDD0] overflow-hidden"
            >
              {/* Top Card Header */}
              <div className="p-4 bg-[#FFFDF7] border-b border-[#EBE3D5]/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E2EAD8] text-[#3B523A] border border-[#C5D5B5] flex items-center justify-center font-bold text-sm">
                    {j.moodEmoji || '🌸'}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#3E3A37] block">{j.author}</span>
                    <span className="text-[10px] text-[#8C827A] font-mono">{j.date}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onDeleteJournal(j.id)}
                  className="p-1 text-stone-300 hover:text-rose-500 transition-colors"
                  title="刪除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Main Photo (if available) */}
              {j.imageUrls && j.imageUrls.length > 0 && (
                <div className="relative group cursor-pointer" onClick={() => setLightboxUrl(j.imageUrls[0])}>
                  <img
                    src={j.imageUrls[0]}
                    alt={j.title}
                    className="w-full max-h-72 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>
              )}

              {/* Card Body */}
              <div className="p-4 space-y-2">
                <h3 className="text-base font-bold text-[#3E3A37]">{j.title}</h3>

                <p className="text-xs text-[#554F4A] leading-relaxed whitespace-pre-wrap font-sans">
                  {j.content}
                </p>

                {j.location && (
                  <div className="pt-1 flex items-center gap-1 text-[11px] text-[#D45068] font-medium">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span>{j.location}</span>
                  </div>
                )}

                {/* Footer Interaction */}
                <div className="pt-3 border-t border-[#EBE3D5]/60 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => onLikeJournal(j.id)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[#FFFDF7] hover:bg-rose-50 text-[#D45068] border border-[#EBE3D5] rounded-xl text-xs font-bold transition-all active:scale-95"
                  >
                    <Heart className="w-3.5 h-3.5 fill-[#D45068]" />
                    <span>讚 {j.likesCount || 0}</span>
                  </button>

                  <span className="text-[10px] text-[#8C827A]">愛心代表這篇紀錄太讚啦！</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
