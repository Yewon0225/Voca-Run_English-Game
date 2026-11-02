import React, { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  auth,
  signInWithGoogle,
  signOutGoogle,
  appendGameRecordToSheet,
  getCachedAccessToken,
  getSavedSpreadsheetId,
  saveSpreadsheetId,
  SheetLogResult
} from '../services/googleSheets';
import { soundManager } from '../utils/audio';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  RefreshCw,
  Edit2,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface GoogleSheetsLoggerProps {
  playCount: number;
  correctCount: number;
  wrongCount: number;
  category: string;
}

export const GoogleSheetsLogger: React.FC<GoogleSheetsLoggerProps> = ({
  playCount,
  correctCount,
  wrongCount,
  category
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [logResult, setLogResult] = useState<SheetLogResult | null>(null);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [customSheetId, setCustomSheetId] = useState<string>(() => getSavedSpreadsheetId() || '');
  const [isEditingSheetId, setIsEditingSheetId] = useState<boolean>(false);

  // Sync auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Save entry to sheets
  const handleSaveToSheet = useCallback(async (token: string, targetId?: string) => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const result = await appendGameRecordToSheet(
        token,
        {
          playCount,
          correctCount,
          wrongCount,
          category
        },
        targetId
      );
      setLogResult(result);
      setSaveSuccess(true);
      setCustomSheetId(result.spreadsheetId);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '구글 시트 저장 중 오류가 발생했습니다.';
      setSaveError(message);
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
    }
  }, [playCount, correctCount, wrongCount, category]);

  // Auto-save if already signed in and token is cached
  useEffect(() => {
    const token = getCachedAccessToken();
    if (currentUser && token && !saveSuccess && !isSaving && !saveError) {
      handleSaveToSheet(token);
    }
  }, [currentUser, saveSuccess, isSaving, saveError, handleSaveToSheet]);

  // Handle Google Sign-in
  const handleLogin = async () => {
    soundManager.playClick();
    setIsLoggingIn(true);
    setSaveError(null);
    try {
      const { user, accessToken } = await signInWithGoogle();
      setCurrentUser(user);
      // Immediately log the record
      await handleSaveToSheet(accessToken);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '구글 로그인 중 문제가 발생했습니다.';
      setSaveError(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Sign-out
  const handleLogout = async () => {
    soundManager.playClick();
    try {
      await signOutGoogle();
      setCurrentUser(null);
      setSaveSuccess(false);
      setLogResult(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '로그아웃 중 문제가 발생했습니다.';
      setSaveError(message);
    }
  };

  // Handle custom spreadsheet ID update
  const handleSaveCustomSheetId = () => {
    soundManager.playClick();
    const cleanId = customSheetId.trim();
    if (cleanId) {
      saveSpreadsheetId(cleanId);
    }
    setIsEditingSheetId(false);
  };

  const spreadsheetUrl = logResult?.spreadsheetUrl ||
    (customSheetId ? `https://docs.google.com/spreadsheets/d/${customSheetId}/edit` : null);

  return (
    <div className="w-full bg-emerald-50/90 border-2 border-emerald-400/80 rounded-2xl p-3 sm:p-3.5 shadow-xs transition-all my-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
              <span>구글 시트 학습 기록장 (Google Sheets Log)</span>
            </div>
            <div className="text-[10px] font-semibold text-emerald-700">
              플레이 횟수 · 정답 · 오답 · 학습 단원 자동 로깅
            </div>
          </div>
        </div>

        {currentUser && (
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-0.5 p-1 cursor-pointer"
            title="시트 설정"
          >
            {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Case 1: Not Logged In */}
      {!currentUser ? (
        <div className="space-y-2 pt-0.5">
          <p className="text-xs text-emerald-900 font-medium leading-relaxed">
            구글 계정으로 연결하면 이번 게임 결과가 스프레드시트에 저장됩니다.
          </p>

          <button
            id="btn-google-sheets-signin"
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-full py-2.5 px-3 bg-white hover:bg-emerald-50 active:scale-[0.99] text-slate-700 font-bold text-xs rounded-xl border border-emerald-300 shadow-sm flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-60"
          >
            {isLoggingIn ? (
              <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>{isLoggingIn ? '구글 계정 연결 중...' : 'Google 계정으로 로그인하여 기록하기'}</span>
          </button>
        </div>
      ) : (
        /* Case 2: Signed In */
        <div className="space-y-2">
          {/* User Profile Bar */}
          <div className="flex items-center justify-between bg-white/90 rounded-xl px-2.5 py-1.5 border border-emerald-200">
            <div className="flex items-center gap-2 truncate">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  className="w-5 h-5 rounded-full border border-emerald-300 shrink-0"
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="text-xs font-bold text-slate-800 truncate">
                {currentUser.displayName || currentUser.email}
              </span>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-300">
                연결됨
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-[10px] font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 p-1 cursor-pointer shrink-0"
              title="로그아웃"
            >
              <LogOut className="w-3 h-3" />
              <span>연동 해제</span>
            </button>
          </div>

          {/* Save Status & Details */}
          {isSaving && (
            <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-emerald-800 bg-emerald-100/60 rounded-xl">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>구글 스프레드시트에 기록 추가 중...</span>
            </div>
          )}

          {saveSuccess && (
            <div className="bg-white/95 border border-emerald-300 rounded-xl p-2.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-emerald-800">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>학습 기록이 구글 시트에 기록되었습니다!</span>
                </div>
                {spreadsheetUrl && (
                  <a
                    href={spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5"
                  >
                    <span>시트 열기</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Data Row Values Preview (timestamp, play_count, correct_count, wrong_count, category) */}
              <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1">
                <div className="bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-200">
                  <span className="text-emerald-700 font-semibold block text-[10px]">총 플레이 횟수 (play_count)</span>
                  <span className="font-extrabold text-emerald-950">제 {playCount}회차</span>
                </div>
                <div className="bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-200">
                  <span className="text-emerald-700 font-semibold block text-[10px]">정답 / 오답 (correct / wrong)</span>
                  <span className="font-extrabold text-emerald-950">
                    <span className="text-emerald-600 font-black">{correctCount}개</span> / <span className="text-rose-600 font-black">{wrongCount}개</span>
                  </span>
                </div>
                <div className="col-span-2 bg-emerald-50/70 p-1.5 rounded-lg border border-emerald-200">
                  <span className="text-emerald-700 font-semibold block text-[10px]">학습 단원 (category)</span>
                  <span className="font-bold text-emerald-950 truncate block">{category}</span>
                </div>
              </div>
            </div>
          )}

          {saveError && (
            <div className="bg-rose-50 border border-rose-300 rounded-xl p-2.5 text-xs text-rose-800 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>기록 저장 중 오류가 발생했습니다.</span>
              </div>
              <p className="text-[11px] text-rose-700">{saveError}</p>
              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => {
                    const token = getCachedAccessToken();
                    if (token) {
                      handleSaveToSheet(token);
                    } else {
                      handleLogin();
                    }
                  }}
                  className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}

          {/* Expandable Spreadsheet Config / Custom ID */}
          {showConfig && (
            <div className="bg-white/80 border border-emerald-200 rounded-xl p-2.5 text-xs space-y-2 mt-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">기록 대상 스프레드시트 ID</span>
                {!isEditingSheetId ? (
                  <button
                    onClick={() => setIsEditingSheetId(true)}
                    className="text-[10px] text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                    <span>변경하기</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveCustomSheetId}
                    className="text-[10px] text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer font-black"
                  >
                    <Check className="w-3 h-3" />
                    <span>저장</span>
                  </button>
                )}
              </div>

              {isEditingSheetId ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={customSheetId}
                    onChange={e => setCustomSheetId(e.target.value)}
                    placeholder="구글 시트 ID 또는 URL에서 ID 추출하여 입력"
                    className="w-full text-xs font-mono p-1.5 border border-emerald-300 rounded-lg bg-white text-slate-800"
                  />
                  <p className="text-[10px] text-slate-500">
                    비워두면 새 스프레드시트를 자동으로 생성합니다.
                  </p>
                </div>
              ) : (
                <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-1.5 rounded truncate border border-slate-200">
                  {customSheetId || '(자동 생성된 시트 사용 중)'}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
