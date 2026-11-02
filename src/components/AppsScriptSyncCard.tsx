import React, { useState, useEffect, useCallback } from 'react';
import { UserAnswer } from '../types';
import {
  calculateTapAnalytics,
  sendTapDataToGoogleAppsScript,
  getAppsScriptUrl,
  TapAnalytics,
  SendScriptResult
} from '../services/appsScriptService';
import { soundManager } from '../utils/audio';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MousePointerClick,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface AppsScriptSyncCardProps {
  answers: UserAnswer[];
  playCount: number;
  correctCount: number;
  wrongCount: number;
  category: string;
}

export const AppsScriptSyncCard: React.FC<AppsScriptSyncCardProps> = ({
  answers,
  playCount,
  correctCount,
  wrongCount,
  category
}) => {
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendResult, setSendResult] = useState<SendScriptResult | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [hasAttempted, setHasAttempted] = useState<boolean>(false);

  const scriptUrl = getAppsScriptUrl();
  const analytics: TapAnalytics = React.useMemo(() => {
    return calculateTapAnalytics(answers);
  }, [answers]);

  const handleSend = useCallback(async () => {
    setIsSending(true);
    setSendError(null);
    try {
      const result = await sendTapDataToGoogleAppsScript({
        answers,
        playCount,
        category,
        correctCount,
        wrongCount
      });
      setSendResult(result);
      setHasAttempted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '구글 시트 전송 중 오류가 발생했습니다.';
      setSendError(message);
      setHasAttempted(true);
    } finally {
      setIsSending(false);
    }
  }, [answers, playCount, category, correctCount, wrongCount]);

  // Auto-send once when result screen is shown
  useEffect(() => {
    if (!hasAttempted && !isSending) {
      handleSend();
    }
  }, [hasAttempted, isSending, handleSend]);

  return (
    <div className="w-full bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border-2 border-emerald-400/90 rounded-2xl p-3.5 sm:p-4 shadow-sm my-2 text-left select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-1.5">
              <span>구글 시트 문장별 탭(Tap) 빈도 & 평균 저장</span>
              <span className="text-[10px] font-bold bg-emerald-200/90 text-emerald-900 px-1.5 py-0.5 rounded-md">
                .env.local 연동
              </span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-800">
              Apps Script 웹 앱으로 각 문장별 탭 횟수와 전체 평균 자동 저장
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 p-1 bg-white/70 rounded-lg border border-emerald-300 cursor-pointer transition hover:bg-white"
        >
          <span>{showDetails ? '요약 보기' : '문장별 상세'}</span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Stats: Average Taps & Total Taps */}
      <div className="grid grid-cols-2 gap-2 my-2">
        <div className="bg-white/95 rounded-xl p-2.5 border border-emerald-300 shadow-2xs">
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mb-0.5">
            <MousePointerClick className="w-3.5 h-3.5 text-emerald-600" />
            <span>문장당 평균 탭 빈도</span>
          </div>
          <div className="text-2xl font-black text-emerald-950 flex items-baseline gap-1">
            <span>{analytics.averageTaps}</span>
            <span className="text-xs font-bold text-slate-500">회 / 문장</span>
          </div>
        </div>

        <div className="bg-white/95 rounded-xl p-2.5 border border-emerald-300 shadow-2xs">
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>총 탭 횟수 / 문제 수</span>
          </div>
          <div className="text-2xl font-black text-slate-900 flex items-baseline gap-1">
            <span>{analytics.totalTaps}</span>
            <span className="text-xs font-bold text-slate-500">회 ({analytics.sentences.length}문제)</span>
          </div>
        </div>
      </div>

      {/* Transmission Status Feedback */}
      <div className="mt-2 pt-2 border-t border-emerald-200/80">
        {isSending && (
          <div className="flex items-center justify-between bg-white/80 p-2 rounded-xl text-xs font-bold text-emerald-800 border border-emerald-200">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
              <span>구글 시트(Apps Script)로 탭 빈도 및 평균 전송 중...</span>
            </div>
            <span className="text-[10px] text-emerald-600">잠시만 기다려주세요</span>
          </div>
        )}

        {!isSending && sendResult && (
          <div className="flex items-center justify-between bg-emerald-100/90 p-2.5 rounded-xl text-xs font-bold text-emerald-950 border border-emerald-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <div>구글 시트에 각 문장별 탭 빈도 & 평균 저장 완료!</div>
                <div className="text-[10px] text-emerald-800 font-medium">
                  기록 시각: {sendResult.timestamp} • 누적 {playCount}회차
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                handleSend();
              }}
              className="text-[10px] font-bold bg-white text-emerald-800 px-2 py-1 rounded-lg border border-emerald-300 hover:bg-emerald-50 active:scale-95 transition cursor-pointer"
            >
              다시 전송
            </button>
          </div>
        )}

        {!isSending && sendError && (
          <div className="bg-rose-50 border border-rose-300 p-2.5 rounded-xl text-xs text-rose-900 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>구글 시트 전송 상태 확인</span>
              </div>
              <button
                onClick={() => {
                  soundManager.playClick();
                  handleSend();
                }}
                className="text-[10px] font-bold bg-rose-600 text-white px-2 py-0.5 rounded-lg hover:bg-rose-700 cursor-pointer"
              >
                재시도
              </button>
            </div>
            <p className="text-[11px] text-rose-700">{sendError}</p>
          </div>
        )}

        {/* Web App URL Info */}
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-emerald-800/80 px-1">
          <span className="truncate max-w-[280px]">
            키: NEXT_PUBLIC_GOOGLE_SCRIPT_URL
          </span>
          <a
            href={scriptUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-0.5 underline hover:text-emerald-950 font-bold"
          >
            <span>웹 앱 링크</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>

      {/* Collapsible Per-sentence Tap Detail Table */}
      {showDetails && (
        <div className="mt-3 bg-white/95 rounded-xl border border-emerald-300 overflow-hidden shadow-xs">
          <div className="bg-emerald-100/70 px-3 py-1.5 text-xs font-black text-emerald-950 border-b border-emerald-200 flex justify-between">
            <span>문장 번호 및 내용</span>
            <span>탭(Tap) 빈도</span>
          </div>

          <div className="max-h-52 overflow-y-auto divide-y divide-emerald-100 text-xs">
            {analytics.sentences.map((item) => (
              <div
                key={`sent-tap-${item.questionId}-${item.questionNumber}`}
                className="p-2.5 hover:bg-emerald-50/50 flex items-center justify-between gap-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-extrabold text-emerald-900 bg-emerald-100 px-1.5 py-0.2 rounded text-[10px]">
                      {item.questionNumber}번
                    </span>
                    <span className="font-bold text-slate-800 truncate">
                      {item.sentence}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    정답: <strong className="text-emerald-700">{item.correctWord}</strong>
                    {item.isCorrect ? ' (맞힘)' : ` (고른 답: ${item.selectedWord})`}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-black text-xs shadow-2xs">
                    {item.tapCount}회 탭
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 border-t border-slate-200 flex justify-between">
            <span>총 {analytics.sentences.length}개 문장 평균</span>
            <span className="text-emerald-700 font-black">{analytics.averageTaps}회</span>
          </div>
        </div>
      )}
    </div>
  );
};
