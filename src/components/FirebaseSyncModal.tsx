import React, { useState } from 'react';
import { Cloud, CloudCheck, Users, Copy, Check, QrCode, RefreshCw, Share2, LogIn, Info, ShieldCheck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FirebaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  onChangeRoomId: (newRoomId: string) => void;
  isSyncing: boolean;
  isOnline: boolean;
  lastSyncedTime: string | null;
  onManualUpload: () => void;
}

export const FirebaseSyncModal: React.FC<FirebaseSyncModalProps> = ({
  isOpen,
  onClose,
  roomId,
  onChangeRoomId,
  isSyncing,
  isOnline,
  lastSyncedTime,
  onManualUpload,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [inputRoomId, setInputRoomId] = useState('');
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const getShareUrl = (id: string) => {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?room=${encodeURIComponent(id)}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl(roomId);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = inputRoomId.trim();
    if (cleanId) {
      onChangeRoomId(cleanId);
      setInputRoomId('');
      setIsJoinOpen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-[#F1E9DB] space-y-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Title Header */}
          <div className="flex items-center justify-between border-b border-[#F1E9DB] pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#E2EAD8] rounded-xl text-[#3B523A]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#3E3A37] flex items-center gap-1.5">
                  <span>旅伴共同編輯與 Firebase 雲端同步</span>
                </h3>
                <p className="text-xs text-stone-500">多人即時連線 · 自動雲端備份</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 font-bold text-sm"
            >
              ✕
            </button>
          </div>

          {/* Current Connection Status Badge */}
          <div className="p-3 bg-[#FFF9F2] rounded-xl border border-[#F1E9DB] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                </span>
                <span className={`text-xs font-bold ${isOnline ? 'text-[#4E7C59]' : 'text-amber-800'}`}>
                  {isOnline ? 'Firebase 雲端連線正常 (即時同步中)' : '離線/本機模式 (資料已安全保存在瀏覽器)'}
                </span>
              </div>
              <button
                onClick={onManualUpload}
                disabled={isSyncing}
                className="flex items-center gap-1 text-[11px] font-bold text-[#3B523A] hover:bg-[#E2EAD8] px-2 py-1 rounded-lg transition-all"
                title="嘗試手動重新同步上雲"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? '同步中...' : '重新連線'}</span>
              </button>
            </div>

            <div className="text-[11px] text-stone-600 flex items-center justify-between pt-1 border-t border-[#F1E9DB]">
              <span>目前房間碼：<strong className="text-[#3B523A] font-mono">{roomId}</strong></span>
              {lastSyncedTime && <span>上次同步：{lastSyncedTime}</span>}
            </div>
          </div>

          {/* Step-by-Step Guide for User */}
          <div className="bg-[#F8FAF6] p-3.5 rounded-xl border border-[#D5E2C8] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#3B523A]">
              <Sparkles className="w-4 h-4 text-[#D49E24]" />
              <span>與旅伴共同編輯使用教學（簡單 3 步驟）</span>
            </div>
            <ol className="text-xs text-stone-700 space-y-1.5 pl-4 list-decimal">
              <li>
                <strong>一鍵分享邀請連結</strong>：點擊下方「複製邀請連結」發送給你的旅伴。
              </li>
              <li>
                <strong>旅伴直接點擊開啟</strong>：旅伴點開網址後會自動進入這個專屬行程房間（或輸入房間碼 <span className="font-mono bg-stone-200 px-1 rounded">{roomId}</span>）。
              </li>
              <li>
                <strong>即時同步共編</strong>：任何人新增景點、記帳、排行程或勾選清單，其他人畫面都會<strong>即時自動更新</strong>！
              </li>
            </ol>
          </div>

          {/* PWA Mobile App Installation Guide */}
          <div className="bg-[#FFF9F2] p-3.5 rounded-xl border border-[#F1E9DB] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#7A621E]">
              <QrCode className="w-4 h-4 text-[#D49E24]" />
              <span>📲 如何加到手機主畫面變成獨立 App？</span>
            </div>
            <div className="text-[11px] text-stone-700 space-y-1.5">
              <p><strong>iOS iPhone (Safari 瀏覽器)</strong>：開啟網頁後，點選下方選單列的「分享按鈕 ➔ 加到主畫面」，即可獲得桌面 App 圖示！</p>
              <p><strong>Android 手機 (Chrome 瀏覽器)</strong>：點選右上角選單「⋮ ➔ 安裝應用程式」或「加到主螢幕」即可全螢幕使用。</p>
            </div>
          </div>

          {/* Share Actions */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">邀請旅伴加入此行程</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#3B523A] hover:bg-[#2C3E2B] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? '已複製連結！' : '複製專屬邀請連結'}</span>
              </button>

              <button
                onClick={handleCopyCode}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-[#FFF9F2] hover:bg-[#FFF2E0] text-[#3B523A] border border-[#C5D5B5] font-bold text-xs rounded-xl transition-all active:scale-95"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#3B523A]" />}
                <span>{copiedCode ? '已複製代碼！' : '複製房間碼'}</span>
              </button>
            </div>
          </div>

          {/* Switch / Join Another Room */}
          <div className="pt-2 border-t border-[#F1E9DB]">
            {!isJoinOpen ? (
              <button
                onClick={() => setIsJoinOpen(true)}
                className="w-full text-center text-xs text-[#3B523A] font-bold hover:underline py-1 flex items-center justify-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>輸入旅伴給我的房間碼（切換房間）</span>
              </button>
            ) : (
              <form onSubmit={handleJoinRoom} className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                <label className="block text-xs font-bold text-stone-700">輸入旅伴的房間邀請碼：</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    placeholder="例: japan-2026 或 sendai-trip"
                    value={inputRoomId}
                    onChange={(e) => setInputRoomId(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#3B523A] font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#3B523A] text-white text-xs font-bold rounded-xl hover:bg-[#2C3E2B]"
                  >
                    加入
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsJoinOpen(false)}
                    className="px-2 py-1.5 text-stone-500 text-xs font-medium hover:text-stone-700"
                  >
                    取消
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer note */}
          <div className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>資料儲存於 Google Firebase 雲端資料庫 · 繁體中文版本</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
