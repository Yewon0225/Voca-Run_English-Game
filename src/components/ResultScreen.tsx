import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { UserAnswer, CostumeItem } from '../types';
import { soundManager, speakEnglish } from '../utils/audio';
import { RotateCcw, Home, Award, CheckCircle2, XCircle, AlertCircle, BookOpen, Sparkles, Shirt } from 'lucide-react';
import { GoogleSheetsLogger } from './GoogleSheetsLogger';
import { AppsScriptSyncCard } from './AppsScriptSyncCard';

interface ResultScreenProps {
  answers: UserAnswer[];
  finalScore: number;
  totalScore: number;
  newlyUnlockedItems: CostumeItem[];
  totalQuestions: number;
  category: string;
  playCount: number;
  onRetryAll: () => void;
  onRetryWrongOnly: (wrongAnswers: UserAnswer[]) => void;
  onGoHome: () => void;
  onOpenWardrobe: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  answers,
  finalScore,
  totalScore,
  newlyUnlockedItems,
  totalQuestions,
  category,
  playCount,
  onRetryAll,
  onRetryWrongOnly,
  onGoHome,
  onOpenWardrobe
}) => {
  const correctCount = answers.filter(a => a.isCorrect).length;
  const wrongCount = answers.length - correctCount;
  // Deduplicate wrongAnswers by questionId to guarantee unique entries
  const wrongAnswers = React.useMemo(() => {
    const map = new Map<number, UserAnswer>();
    answers.filter(a => !a.isCorrect).forEach(ans => {
      if (!map.has(ans.questionId)) {
        map.set(ans.questionId, ans);
      }
    });
    return Array.from(map.values());
  }, [answers]);
  const isPerfect = correctCount === totalQuestions;
  const isGood = correctCount >= Math.ceil(totalQuestions * 0.7);

  // Calculate highest consecutive correct streak
  const maxStreak = React.useMemo(() => {
    return answers.reduce((acc, curr) => {
      if (curr.isCorrect) {
        acc.curr += 1;
        acc.max = Math.max(acc.max, acc.curr);
      } else {
        acc.curr = 0;
      }
      return acc;
    }, { curr: 0, max: 0 }).max;
  }, [answers]);

  useEffect(() => {
    soundManager.playFanfare();

    // Trigger colorful confetti celebration
    if (correctCount >= Math.ceil(totalQuestions * 0.5) || newlyUnlockedItems.length > 0) {
      try {
        confetti({
          particleCount: isPerfect || newlyUnlockedItems.length > 0 ? 120 : 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if not supported in some iframe
      }
    }
  }, [correctCount, totalQuestions, isPerfect, newlyUnlockedItems.length]);

  return (
    <div className="w-full h-full flex flex-col justify-between items-center px-4 py-4 select-none overflow-y-auto bg-gradient-to-b from-amber-50/70 via-pink-50/60 to-rose-50/70">
      {/* 1. Title: 결 과 */}
      <div className="w-full text-center mt-0.5">
        <h1 className="text-3xl font-black text-slate-900 tracking-wider">
          결 과
        </h1>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          동아(윤정미) 중1 영어 • 3과 & 5과 레이스 완료!
        </p>
      </div>

      {/* 2. Highlight Yellow Box: 맞힌개수 & 점수 누적 표시 */}
      <div className="w-full my-2">
        <div className="w-full bg-amber-50/95 border-4 border-amber-300 rounded-3xl p-4 text-center shadow-xs relative">
          <div className="text-xs font-bold text-amber-900 mb-1 flex items-center justify-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            <span>학습 성적 & 누적 랭킹</span>
          </div>

          <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            맞힌개수 <span className="text-pink-600">{correctCount}</span>/{totalQuestions}
          </div>

          <div className="flex items-center justify-center gap-3 text-xs font-bold text-slate-600 mt-1.5">
            <span>이번 판 획득: <strong className="text-emerald-600 font-black">+{finalScore}점</strong></span>
            <span className="text-slate-300">|</span>
            <span>총 누적 점수: <strong className="text-amber-700 font-black">{totalScore}점</strong></span>
          </div>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-amber-200/90 text-amber-950 border border-amber-300">
              {isPerfect
                ? '🌟 완벽해요! 모든 교과서 단어 완벽 마스터!'
                : isGood
                ? '👍 훌륭해요! 조금만 더 하면 만점!'
                : '💪 틀린 단어를 복습하고 다시 도전해보세요!'}
            </span>
            {maxStreak >= 5 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-slate-950 border border-yellow-200 shadow-xs">
                <span>🔥</span>
                <span>최고 {maxStreak}연속 피버 모드 달성!</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2.5 Google Apps Script Web App Log: 문장별 탭 빈도 및 평균 (.env.local NEXT_PUBLIC_GOOGLE_SCRIPT_URL) */}
      <AppsScriptSyncCard
        answers={answers}
        playCount={playCount}
        correctCount={correctCount}
        wrongCount={wrongCount}
        category={category}
      />

      {/* 2.6 Personal Google Drive OAuth Logger (Optional individual sheet sync) */}
      <GoogleSheetsLogger
        playCount={playCount}
        correctCount={correctCount}
        wrongCount={wrongCount}
        category={category}
      />

      {/* 3. New Reward Unlocked Banner (150점, 200점, 250점... 보상 달성 시) */}
      {newlyUnlockedItems.length > 0 ? (
        <div className="w-full mb-2 bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 p-3 rounded-2xl text-white shadow-lg animate-bounce-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-200 shrink-0" />
              <div>
                <div className="text-xs font-black text-yellow-100">🎉 축하합니다! 새로운 의상 해금!</div>
                <div className="text-sm font-black">
                  {newlyUnlockedItems.map(i => i.name).join(', ')}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenWardrobe();
              }}
              className="px-3 py-1.5 bg-white text-pink-600 font-black text-xs rounded-xl shadow hover:bg-amber-50 active:scale-95 transition cursor-pointer"
            >
              착용하러 가기
            </button>
          </div>
        </div>
      ) : (
        /* Wardrobe Quick Access Bar */
        <div className="w-full mb-2 bg-white/80 border border-amber-200 p-2 px-3 rounded-2xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Shirt className="w-4 h-4 text-pink-500" />
            <span>캐릭터 옷장에서 획득한 의상을 갈아입어보세요!</span>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenWardrobe();
            }}
            className="text-xs font-black text-pink-700 bg-pink-100 hover:bg-pink-200 px-2.5 py-1 rounded-xl transition cursor-pointer"
          >
            옷장 열기
          </button>
        </div>
      )}

      {/* 4. 틀린 단어 목록 (사용자의 오답과 정답 비교하는 표) */}
      <div className="w-full flex-1 my-1">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1 text-xs font-black text-slate-800">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>틀린 단어 복습 노트 ({wrongAnswers.length}개)</span>
          </div>
          <span className="text-[10px] text-slate-500">스피커 터치 시 발음 듣기</span>
        </div>

        {wrongAnswers.length === 0 ? (
          <div className="w-full py-6 text-center bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-1.5" />
            <div className="text-sm font-bold text-slate-800">틀린 단어가 없습니다!</div>
            <div className="text-xs text-slate-500 mt-0.5">모든 문장 빈칸을 정확하게 맞혔습니다. 대단해요!</div>
          </div>
        ) : (
          <div className="w-full bg-white rounded-2xl border-2 border-slate-800 overflow-hidden shadow-xs">
            <div className="grid grid-cols-12 bg-slate-100 border-b-2 border-slate-800 text-xs font-black text-slate-800 py-2 px-3 text-center">
              <div className="col-span-2">번호</div>
              <div className="col-span-5 text-rose-700">고른 답 (오답)</div>
              <div className="col-span-5 text-emerald-700">정답 (알맞은 단어)</div>
            </div>

            <div className="divide-y divide-slate-200 max-h-[170px] overflow-y-auto">
              {wrongAnswers.map((item, idx) => (
                <div key={`wrong-ans-${item.questionId}-${idx}`} className="p-2.5 hover:bg-slate-50 transition-colors">
                  <div className="grid grid-cols-12 items-center text-center text-sm mb-1">
                    <div className="col-span-2 font-black text-slate-500 text-xs">
                      {idx + 1}.
                    </div>
                    <div className="col-span-5 font-bold text-rose-600 flex items-center justify-center gap-1 text-xs sm:text-sm">
                      <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{item.selectedWord}</span>
                    </div>
                    <div className="col-span-5 font-black text-emerald-600 flex items-center justify-center gap-1 text-xs sm:text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{item.question.correctWord}</span>
                      <button
                        id={`btn-speak-wrong-${item.questionId}`}
                        onClick={() => speakEnglish(item.question.correctWord)}
                        className="text-slate-400 hover:text-sky-600 p-0.5 cursor-pointer"
                        title="단어 발음 듣기"
                      >
                        🔊
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-2 text-xs text-left">
                    <div className="font-semibold text-slate-800 flex items-center justify-between">
                      <span>{item.question.sentence.replace('______', `[ ${item.question.correctWord} ]`)}</span>
                      <button
                        onClick={() => speakEnglish(item.question.sentence.replace('______', item.question.correctWord))}
                        className="text-sky-600 hover:underline text-[10px] shrink-0 ml-1 cursor-pointer"
                      >
                        문장 듣기
                      </button>
                    </div>
                    <div className="text-slate-500 text-[10px] mt-0.5">
                      {item.question.koreanSentence.replace('______', item.question.correctMeaning)}
                    </div>
                    <div className="text-amber-900 text-[10px] mt-1 bg-amber-50 p-1.5 rounded border border-amber-200/70">
                      💡 <strong>해설:</strong> {item.question.explanation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 5. Bottom Buttons: [다시하기] & [처음으로] */}
      <div className="w-full space-y-2 mt-2">
        {wrongAnswers.length > 0 && (
          <button
            id="btn-retry-wrong"
            onClick={() => {
              soundManager.playClick();
              onRetryWrongOnly(wrongAnswers);
            }}
            className="w-full py-2.5 rounded-2xl font-black text-sm bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-white shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            틀린 문제만 다시 풀기 ({wrongAnswers.length}문제)
          </button>
        )}

        <button
          id="btn-retry-game"
          onClick={() => {
            soundManager.playClick();
            onRetryAll();
          }}
          className="w-full py-3 rounded-2xl font-black text-base bg-pink-500 hover:bg-pink-400 active:bg-pink-600 text-white shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          다시하기 (15문제)
        </button>

        <button
          id="btn-go-home"
          onClick={() => {
            soundManager.playClick();
            onGoHome();
          }}
          className="w-full py-2.5 rounded-2xl font-bold text-sm bg-white/95 hover:bg-amber-50 active:bg-amber-100 text-slate-800 border-2 border-slate-700 flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <Home className="w-4 h-4 text-pink-500" />
          처음으로
        </button>
      </div>
    </div>
  );
};
