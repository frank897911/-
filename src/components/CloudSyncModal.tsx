import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, Download, Upload, QrCode, Sparkles, ShieldCheck, CheckCircle2, AlertCircle, MessageCircle, Link2, FileJson, RefreshCw, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TravelAppData } from '../types';
import { generateShareableUrl, shortenUrl } from '../lib/shareUrl';
import { exportLocalJson, importLocalJson } from '../lib/googleDrive';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TravelAppData;
  onUpdateData: (newData: TravelAppData) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  data,
  onUpdateData,
}) => {
  const [activeTab, setActiveTab] = useState<'share' | 'file'>('share');

  // Share States
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isShortening, setIsShortening] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  // File Import States
  const [fileImportError, setFileImportError] = useState<string | null>(null);
  const [fileImportSuccess, setFileImportSuccess] = useState<boolean>(false);

  // Auto-generate shortened URL on modal open
  useEffect(() => {
    if (isOpen && activeTab === 'share') {
      handleGenerateShareUrl();
    }
  }, [isOpen, activeTab]);

  const handleGenerateShareUrl = async () => {
    setIsShortening(true);
    const longUrl = generateShareableUrl(data);
    setShareUrl(longUrl); // set long URL immediately as fallback

    try {
      const short = await shortenUrl(longUrl);
      setShareUrl(short);
    } catch (e) {
      console.warn('Auto shorten URL error:', e);
    } finally {
      setIsShortening(false);
    }
  };

  const handleCopyLink = () => {
    const urlToCopy = shareUrl || generateShareableUrl(data);

    navigator.clipboard.writeText(urlToCopy);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleLineShare = () => {
    const urlToShare = shareUrl || generateShareableUrl(data);

    const message = `🇯🇵 我更新了我們的旅遊行程「${data.tripTitle || '日本旅遊'}」！點擊連結即可直接開啓最新行程：\n${urlToShare}`;
    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(message)}`;
    window.open(lineUrl, '_blank');
  };

  const handleNativeShare = async () => {
    const urlToShare = shareUrl || generateShareableUrl(data);

    if (navigator.share) {
      try {
        await navigator.share({
          title: data.tripTitle || '日本旅遊行程',
          text: `🇯🇵 這是「${data.tripTitle || '日本旅遊'}」最新行程，快打開看看！`,
          url: urlToShare,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      handleCopyLink();
    }
  };

  // Local JSON File Export & Import
  const handleLocalExport = () => {
    exportLocalJson(data);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileImportError(null);
    setFileImportSuccess(false);

    try {
      const importedData = await importLocalJson(file);
      onUpdateData(importedData);
      setFileImportSuccess(true);
      setTimeout(() => setFileImportSuccess(false), 4000);
    } catch (err: any) {
      setFileImportError(err.message || '匯入失敗，請確認檔案格式是否正確');
    }
  };

  if (!isOpen) return null;

  const activeUrl = shareUrl || generateShareableUrl(data);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-[#F1E9DB] space-y-4 max-h-[90vh] overflow-y-auto"
        >
          {/* Header Title */}
          <div className="flex items-center justify-between border-b border-[#F1E9DB] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-[#E2EAD8] rounded-xl text-[#2B7A82]">
                <Share2 className="w-5 h-5 text-[#2B7A82]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#3E3A37] flex items-center gap-1.5">
                  <span>儲存與分享行程給旅伴</span>
                </h3>
                <p className="text-xs text-stone-500">100% 完全免費 · 免帳號免登入 · 傳送連結即可載入</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 font-bold text-sm transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-[#F8FAF6] p-1 rounded-xl border border-[#E2EAD8] text-xs font-bold">
            <button
              onClick={() => setActiveTab('share')}
              className={`py-2 px-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'share'
                  ? 'bg-white text-[#2B7A82] shadow-xs font-bold border border-[#C5D5B5]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Link2 className="w-4 h-4 text-[#2B7A82]" />
              <span>一鍵產生分享連結</span>
            </button>

            <button
              onClick={() => setActiveTab('file')}
              className={`py-2 px-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'file'
                  ? 'bg-white text-[#7A621E] shadow-xs font-bold border border-[#F1E9DB]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <FileJson className="w-4 h-4 text-[#D49E24]" />
              <span>匯出 / 匯入 JSON 檔</span>
            </button>
          </div>

          {/* TAB 1: ONE-CLICK SHARE LINK */}
          {activeTab === 'share' && (
            <div className="space-y-3">
              <div className="bg-[#F4F8F1] p-3.5 rounded-xl border border-[#D5E2C8] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2B7A82]">
                    <Sparkles className="w-4 h-4 text-[#D49E24]" />
                    <span>免設定、完全免費分享流程</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                    0元免付費
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  您修改完行程後，只需點擊下方<strong>「產生最新分享連結」</strong>，然後將連結傳給旅伴。旅伴點開後就會自動載入您的最新行程！
                </p>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-[#FFF9F2] rounded-xl border border-[#F1E9DB] space-y-3">
                <button
                  onClick={handleGenerateShareUrl}
                  disabled={isShortening}
                  className="w-full py-3 px-4 bg-[#3B523A] hover:bg-[#2C3E2B] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-75"
                >
                  {isShortening ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                      <span>正在自動壓縮與縮短網址...</span>
                    </>
                  ) : (
                    <>
                      <Scissors className="w-4 h-4 text-emerald-300" />
                      <span>儲存當前修改並重新產生短網址</span>
                    </>
                  )}
                </button>

                {/* Share Actions Grid */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <button
                    onClick={handleCopyLink}
                    disabled={isShortening}
                    className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-[#F8FAF6] border border-[#C5D5B5] rounded-xl text-[#3B523A] transition-all active:scale-95 space-y-1 disabled:opacity-50"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#2B7A82]" />}
                    <span className="text-[11px] font-bold">{copiedLink ? '已複製短網址！' : '複製短網址'}</span>
                  </button>

                  <button
                    onClick={handleLineShare}
                    disabled={isShortening}
                    className="flex flex-col items-center justify-center p-2.5 bg-[#06C755] hover:bg-[#05b34c] text-white rounded-xl transition-all active:scale-95 space-y-1 disabled:opacity-50"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-[11px] font-bold">LINE 傳送</span>
                  </button>

                  <button
                    onClick={handleNativeShare}
                    disabled={isShortening}
                    className="flex flex-col items-center justify-center p-2.5 bg-[#2B7A82] hover:bg-[#226369] text-white rounded-xl transition-all active:scale-95 space-y-1 disabled:opacity-50"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-[11px] font-bold">手機分享</span>
                  </button>
                </div>

                {/* Display Current Link Field */}
                <div className="space-y-1.5 pt-1 border-t border-[#F1E9DB]">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-stone-600 flex items-center gap-1">
                      <Scissors className="w-3.5 h-3.5 text-[#2B7A82]" />
                      <span>精簡極短分享連結 (可直接點擊複製)：</span>
                    </label>
                    {isShortening && (
                      <span className="text-[10px] text-[#2B7A82] font-bold animate-pulse">
                        縮網址處理中...
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={activeUrl}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-xl font-mono text-[#2B7A82] font-bold select-all focus:outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3.5 py-1.5 bg-[#3B523A] text-white text-xs font-bold rounded-xl hover:bg-[#2C3E2B] transition-colors flex-shrink-0"
                    >
                      {copiedLink ? '已複製' : '複製'}
                    </button>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="pt-2 border-t border-[#F1E9DB] flex flex-col items-center space-y-2">
                  <button
                    onClick={() => setShowQrCode(!showQrCode)}
                    className="text-xs text-[#2B7A82] font-bold hover:underline flex items-center gap-1"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>{showQrCode ? '隱藏 QR Code' : '顯示手機掃描 QR Code'}</span>
                  </button>

                  {showQrCode && (
                    <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center space-y-2">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(activeUrl)}`}
                        alt="Trip QR Code"
                        className="w-40 h-40 rounded-lg border border-stone-100"
                      />
                      <p className="text-[11px] text-stone-500 font-medium">請旅伴開啟手機相機掃描即可開啟行程</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOCAL JSON FILE */}
          {activeTab === 'file' && (
            <div className="space-y-3">
              <div className="bg-[#FFF9F2] p-3.5 rounded-xl border border-[#F1E9DB] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#7A621E]">
                  <Download className="w-4 h-4 text-[#D49E24]" />
                  <span>離線 JSON 檔備份與載入</span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  您可以直接將整份行程下載為 `.json` 檔案，透過通訊軟體 (LINE, Email) 傳給旅伴，旅伴點擊「匯入行程 JSON 檔案」即可載入。
                </p>
              </div>

              {fileImportSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>行程 JSON 檔案匯入成功！資料已更新。</span>
                </div>
              )}

              {fileImportError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>{fileImportError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1">
                {/* Export Button */}
                <button
                  onClick={handleLocalExport}
                  className="flex flex-col items-center justify-center p-4 bg-[#F8FAF6] hover:bg-[#E2EAD8] border border-[#C5D5B5] rounded-xl text-[#3B523A] transition-all active:scale-95 space-y-1.5 text-center"
                >
                  <Download className="w-6 h-6 text-[#3B523A]" />
                  <span className="text-xs font-bold">下載行程 JSON 備份檔</span>
                  <span className="text-[10px] text-stone-500">匯出至本機裝置</span>
                </button>

                {/* Import File Input */}
                <label className="flex flex-col items-center justify-center p-4 bg-[#FFF9F2] hover:bg-[#FFF2E0] border border-[#F1E9DB] rounded-xl text-[#7A621E] transition-all active:scale-95 space-y-1.5 text-center cursor-pointer">
                  <Upload className="w-6 h-6 text-[#D49E24]" />
                  <span className="text-xs font-bold">匯入行程 JSON 檔案</span>
                  <span className="text-[10px] text-stone-500">讀取旅伴分享的備份</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Footer note */}
          <div className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>完全免費 · 隨時修改隨時傳送 · 不需綁定任何付費雲端</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
