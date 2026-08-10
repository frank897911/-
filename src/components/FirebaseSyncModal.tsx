import React, { useState, useEffect } from 'react';
import { Cloud, Users, Copy, Check, QrCode, RefreshCw, Share2, LogIn, ShieldCheck, Sparkles, HardDrive, Download, Upload, FileText, CheckCircle2, AlertCircle, ExternalLink, Link2, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TravelAppData } from '../types';
import { saveToGoogleDrive, listGoogleDriveBackups, loadFromGoogleDrive, exportLocalJson, importLocalJson, extractDriveFileId, getDriveFileMetadata, DriveFileInfo } from '../lib/googleDrive';

interface FirebaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: TravelAppData;
  onUpdateData: (newData: TravelAppData) => void;
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
  data,
  onUpdateData,
  roomId,
  onChangeRoomId,
  isSyncing,
  isOnline,
  lastSyncedTime,
  onManualUpload,
}) => {
  const [activeTab, setActiveTab] = useState<'drive' | 'local' | 'firebase'>('drive');
  
  // Google Drive states
  const [driveToken, setDriveToken] = useState<string>(() => localStorage.getItem('google_drive_token') || '');
  const [activeFileId, setActiveFileId] = useState<string>(() => localStorage.getItem('google_drive_active_file_id') || '');
  const [isDriveSaving, setIsDriveSaving] = useState(false);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [driveMsg, setDriveMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [driveFiles, setDriveFiles] = useState<DriveFileInfo[]>([]);
  const [showDriveFileList, setShowDriveFileList] = useState(false);
  const [manualTokenInput, setManualTokenInput] = useState('');
  const [showTokenField, setShowTokenField] = useState(false);

  // Drive Co-editing Join State
  const [joinFileIdInput, setJoinFileIdInput] = useState('');
  const [copiedFileId, setCopiedFileId] = useState(false);
  const [isAutoDriveSync, setIsAutoDriveSync] = useState<boolean>(() => localStorage.getItem('google_drive_auto_sync') === 'true');

  // Firebase states
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [inputRoomId, setInputRoomId] = useState('');
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  // Local File states
  const [fileImportError, setFileImportError] = useState<string | null>(null);
  const [fileImportSuccess, setFileImportSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (driveToken && activeTab === 'drive') {
      fetchDriveFiles(driveToken);
    }
  }, [driveToken, activeTab]);

  const fetchDriveFiles = async (token: string) => {
    const files = await listGoogleDriveBackups(token);
    setDriveFiles(files);
  };

  const handleSaveToDrive = async () => {
    if (!driveToken) {
      setDriveMsg({ type: 'error', text: '請先授權或填寫 Google Drive Token' });
      setShowTokenField(true);
      return;
    }

    setIsDriveSaving(true);
    setDriveMsg({ type: 'info', text: '正在將行程寫入 Google 雲端硬碟...' });

    const fileName = `行程助手_${data.tripTitle || '日本旅遊'}_共編備份.json`;
    const res = await saveToGoogleDrive(driveToken, data, fileName, activeFileId || undefined);

    setIsDriveSaving(false);
    if (res.success && res.fileId) {
      setActiveFileId(res.fileId);
      localStorage.setItem('google_drive_active_file_id', res.fileId);
      setDriveMsg({ type: 'success', text: `已成功儲存至 Google Drive！(File ID: ${res.fileId.substring(0, 12)}...)` });
      fetchDriveFiles(driveToken);
    } else {
      setDriveMsg({ type: 'error', text: res.error || '儲存失敗，請確認 Token 效期' });
      if (res.error?.includes('401') || res.error?.includes('token')) {
        setShowTokenField(true);
      }
    }
  };

  const handleRestoreFromDrive = async (fileId: string) => {
    if (!driveToken) return;
    setIsDriveLoading(true);
    setDriveMsg({ type: 'info', text: '正在從 Google Drive 讀取最新行程資料...' });

    const restoredData = await loadFromGoogleDrive(driveToken, fileId);
    setIsDriveLoading(false);

    if (restoredData) {
      setActiveFileId(fileId);
      localStorage.setItem('google_drive_active_file_id', fileId);
      onUpdateData(restoredData);
      setDriveMsg({ type: 'success', text: '已成功載入 Google Drive 最新共編行程！' });
    } else {
      setDriveMsg({ type: 'error', text: '載入失敗，請確認檔案權限或 File ID 是否正確' });
    }
  };

  const handleJoinCompanionDriveFile = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedId = extractDriveFileId(joinFileIdInput);
    if (!parsedId) return;

    if (!driveToken) {
      setDriveMsg({ type: 'error', text: '請先設定 Google Drive Token 以存取該檔案' });
      setShowTokenField(true);
      return;
    }

    await handleRestoreFromDrive(parsedId);
    setJoinFileIdInput('');
  };

  const handleToggleAutoSync = () => {
    const nextVal = !isAutoDriveSync;
    setIsAutoDriveSync(nextVal);
    localStorage.setItem('google_drive_auto_sync', String(nextVal));
  };

  const handleCopyActiveFileId = () => {
    if (!activeFileId) return;
    navigator.clipboard.writeText(activeFileId);
    setCopiedFileId(true);
    setTimeout(() => setCopiedFileId(false), 2000);
  };

  const handleSetToken = () => {
    const clean = manualTokenInput.trim();
    if (clean) {
      setDriveToken(clean);
      localStorage.setItem('google_drive_token', clean);
      setManualTokenInput('');
      setShowTokenField(false);
      setDriveMsg({ type: 'success', text: '已成功套用 Google Drive Token！' });
      fetchDriveFiles(clean);
    }
  };

  const handleClearToken = () => {
    setDriveToken('');
    localStorage.removeItem('google_drive_token');
    localStorage.removeItem('google_drive_active_file_id');
    setActiveFileId('');
    setDriveFiles([]);
    setDriveMsg({ type: 'info', text: '已解除 Google Drive 連結' });
  };

  // Local JSON Import
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
      setFileImportError(err.message || '匯入失敗');
    }
  };

  const handleLocalExport = () => {
    exportLocalJson(data);
  };

  // Firebase actions
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
              <div className="p-2.5 bg-[#E2EAD8] rounded-xl text-[#3B523A]">
                <HardDrive className="w-5 h-5 text-[#2B7A82]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#3E3A37] flex items-center gap-1.5">
                  <span>Google Drive 雲端共同編輯</span>
                </h3>
                <p className="text-xs text-stone-500">免受資料庫每日上限影響 · 安全無界限同步</p>
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
          <div className="grid grid-cols-3 gap-1 bg-[#F8FAF6] p-1 rounded-xl border border-[#E2EAD8] text-xs font-bold">
            <button
              onClick={() => setActiveTab('drive')}
              className={`py-2 px-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'drive'
                  ? 'bg-white text-[#3B523A] shadow-xs font-bold border border-[#D5E2C8]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-[#2B7A82]" />
              <span>Google Drive 雲端</span>
            </button>

            <button
              onClick={() => setActiveTab('local')}
              className={`py-2 px-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'local'
                  ? 'bg-white text-[#3B523A] shadow-xs font-bold border border-[#D5E2C8]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Download className="w-3.5 h-3.5 text-[#D49E24]" />
              <span>離線 JSON 檔</span>
            </button>

            <button
              onClick={() => setActiveTab('firebase')}
              className={`py-2 px-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                activeTab === 'firebase'
                  ? 'bg-white text-[#3B523A] shadow-xs font-bold border border-[#D5E2C8]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#3B523A]" />
              <span>Firebase 共編</span>
            </button>
          </div>

          {/* TAB 1: GOOGLE DRIVE COLLABORATIVE EDITING */}
          {activeTab === 'drive' && (
            <div className="space-y-3">
              <div className="bg-[#F4F8F1] p-3.5 rounded-xl border border-[#D5E2C8] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#2B7A82]">
                    <Sparkles className="w-4 h-4 text-[#D49E24]" />
                    <span>Google Drive 共同編輯流程</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                    無限容量
                  </span>
                </div>
                <ol className="text-xs text-stone-700 space-y-1 list-decimal pl-4">
                  <li><strong>建立/同步檔案</strong>：點擊「立即儲存至 Google Drive」產生雲端行程 JSON。</li>
                  <li><strong>分享給旅伴</strong>：將目前的 <strong>File ID</strong> 複製給旅伴，或在 Google Drive 開啟分享權限為「知道連結者皆可編輯」。</li>
                  <li><strong>旅伴加入共編</strong>：旅伴在下方貼上此 File ID 即可同步載入與共同更新！</li>
                </ol>
              </div>

              {/* Status Message Banner */}
              {driveMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                    driveMsg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium'
                      : driveMsg.type === 'error'
                      ? 'bg-amber-50 border-amber-200 text-amber-800 font-medium'
                      : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}
                >
                  {driveMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{driveMsg.text}</span>
                </div>
              )}

              {/* Active Linked File Info */}
              {activeFileId && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-[#2B7A82]" />
                      <span>目前連線共編檔案：</span>
                    </span>
                    <a
                      href={`https://drive.google.com/file/d/${activeFileId}/view`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#2B7A82] hover:underline font-bold flex items-center gap-1"
                    >
                      <span>開啟 Drive 開放權限</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-stone-200 text-xs">
                    <span className="font-mono text-stone-600 truncate max-w-[240px]">{activeFileId}</span>
                    <button
                      onClick={handleCopyActiveFileId}
                      className="flex items-center gap-1 px-2 py-1 bg-[#F8FAF6] hover:bg-[#E2EAD8] text-[#3B523A] font-bold text-[11px] rounded-md transition-colors"
                    >
                      {copiedFileId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedFileId ? '已複製 ID' : '複製 File ID'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons for Drive */}
              <div className="p-4 bg-[#FFF9F2] rounded-xl border border-[#F1E9DB] space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleSaveToDrive}
                    disabled={isDriveSaving}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#3B523A] hover:bg-[#2C3E2B] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isDriveSaving ? '儲存中...' : '立即儲存至 Google Drive'}</span>
                  </button>

                  <button
                    onClick={() => {
                      if (activeFileId) {
                        handleRestoreFromDrive(activeFileId);
                      } else if (driveToken) {
                        fetchDriveFiles(driveToken);
                        setShowDriveFileList(true);
                      } else {
                        setShowTokenField(true);
                      }
                    }}
                    disabled={isDriveLoading}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-[#FFF9F2] hover:bg-[#FFF2E0] text-[#3B523A] border border-[#C5D5B5] font-bold text-xs rounded-xl transition-all active:scale-95 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isDriveLoading ? 'animate-spin' : ''}`} />
                    <span>讀取雲端最新版本</span>
                  </button>
                </div>

                {/* Join Companion File Form */}
                <form onSubmit={handleJoinCompanionDriveFile} className="pt-2 border-t border-[#F1E9DB] space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    貼上旅伴分享的 Google Drive 檔案 ID / 網址：
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="例: 1a2b3c4d5e... 或 雲端網址"
                      value={joinFileIdInput}
                      onChange={(e) => setJoinFileIdInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#3B523A]"
                    />
                    <button
                      type="submit"
                      disabled={isDriveLoading}
                      className="px-3 py-1.5 bg-[#2B7A82] text-white text-xs font-bold rounded-xl hover:bg-[#226369] transition-colors"
                    >
                      載入共編檔
                    </button>
                  </div>
                </form>

                {/* Drive File List View Toggle */}
                <div className="pt-2 border-t border-[#F1E9DB] flex items-center justify-between">
                  <button
                    onClick={() => {
                      if (driveToken) {
                        fetchDriveFiles(driveToken);
                        setShowDriveFileList(!showDriveFileList);
                      } else {
                        setShowTokenField(true);
                      }
                    }}
                    className="text-xs text-[#3B523A] font-bold hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{showDriveFileList ? '隱藏歷史備份檔' : '檢視 Google Drive 上的所有行程檔案'}</span>
                  </button>

                  <button
                    onClick={handleToggleAutoSync}
                    className="text-xs text-stone-600 font-bold flex items-center gap-1 hover:text-stone-900"
                    title="當資料變更時是否手動提示或連線"
                  >
                    {isAutoDriveSync ? (
                      <ToggleRight className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-stone-400" />
                    )}
                    <span>{isAutoDriveSync ? '自動提醒儲存: 開啟' : '自動提醒儲存: 關閉'}</span>
                  </button>
                </div>

                {/* Drive File List Dropdown */}
                {showDriveFileList && driveToken && (
                  <div className="mt-2 p-3 bg-white rounded-xl border border-stone-200 space-y-2">
                    <p className="text-xs font-bold text-stone-700">選擇我的 Google Drive 備份檔：</p>
                    {driveFiles.length === 0 ? (
                      <p className="text-xs text-stone-400 py-2 text-center">尚無雲端檔案，請先點擊上方「立即儲存至 Google Drive」</p>
                    ) : (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {driveFiles.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between p-2 hover:bg-[#F8FAF6] rounded-lg border border-stone-100 text-xs"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <p className="font-bold text-stone-800 truncate">{file.name}</p>
                              <p className="text-[10px] text-stone-400 font-mono">
                                ID: {file.id.substring(0, 10)}... · {new Date(file.modifiedTime).toLocaleString('zh-TW')}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRestoreFromDrive(file.id)}
                              disabled={isDriveLoading}
                              className="px-2.5 py-1 bg-[#3B523A] text-white text-[11px] font-bold rounded-lg hover:bg-[#2C3E2B]"
                            >
                              載入共編
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Token Config Section */}
                <div className="pt-2 border-t border-[#F1E9DB]">
                  {!showTokenField ? (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setShowTokenField(true)}
                        className="text-[11px] text-[#2B7A82] font-bold hover:underline"
                      >
                        {driveToken ? '⚙️ 變更 Google OAuth Access Token' : '🔑 貼上 Google Drive Access Token'}
                      </button>
                      {driveToken && (
                        <button
                          onClick={handleClearToken}
                          className="text-[11px] text-rose-600 hover:underline font-medium"
                        >
                          解除 Token
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200">
                      <label className="block text-xs font-bold text-stone-700">
                        貼上您的 Google OAuth Access Token：
                      </label>
                      <input
                        type="password"
                        placeholder="ya29.a0A..."
                        value={manualTokenInput}
                        onChange={(e) => setManualTokenInput(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#3B523A] font-mono"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowTokenField(false)}
                          className="px-2.5 py-1 text-xs text-stone-500 hover:text-stone-700"
                        >
                          取消
                        </button>
                        <button
                          onClick={handleSetToken}
                          className="px-3 py-1 bg-[#3B523A] text-white text-xs font-bold rounded-xl hover:bg-[#2C3E2B]"
                        >
                          儲存 Token
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOCAL JSON FILE */}
          {activeTab === 'local' && (
            <div className="space-y-3">
              <div className="bg-[#FFF9F2] p-3.5 rounded-xl border border-[#F1E9DB] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#7A621E]">
                  <Download className="w-4 h-4 text-[#D49E24]" />
                  <span>100% 完全離線單機 JSON 備份</span>
                </div>
                <p className="text-xs text-stone-600">
                  不需要任何雲端帳號或資料庫！您可以直接將目前的整份行程匯出為 `.json` 檔案備份在手機或電腦中，或是將先前的備份檔載入進來。
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
                  <span className="text-[10px] text-stone-500">讀取先前下載的備份</span>
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

          {/* TAB 3: FIREBASE REALTIME CO-EDITING */}
          {activeTab === 'firebase' && (
            <div className="space-y-3">
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
            </div>
          )}

          {/* Footer note */}
          <div className="text-[11px] text-stone-400 text-center flex items-center justify-center gap-1 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>支援 Google Drive 共同編輯、JSON 檔匯出入與 Firebase 雲端同步</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
