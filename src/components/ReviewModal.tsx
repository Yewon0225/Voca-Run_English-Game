import React from 'react';
import { UserAnswer, Question } from '../types';
import { soundManager, speakEnglish } from '../utils/audio';
import { X, Volume2, Play, Trash2, BookOpen, AlertCircle } from 'lucide-react';

interface ReviewModalProps {
  wrongAnswers: UserAnswer[];
  onClose: () => void;
  onStartReviewGame: (questions: Question[]) => void;
  onClearHistory: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  wrongAnswers,
  onClose,
  onStartReviewGame,
  onClearHistory
}) => {
  const [isConfirmingClear, setIsConfirmingClear] = React.useState<boolean>(false);

  const uniqueWrongMap = new Map<number, UserAnswer>();
  wrongAnswers.forEach(ans => {
    uniqueWrongMap.set(ans.questionId, ans);
  });
  const uniqueList = Array.from(uniqueWrongMap.values());

  const handleStartReview = () => {
    soundManager.playClick();
    const questions = uniqueList.map(item => item.question);
    onStartReviewGame(questions);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden border-2 border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-pink-200/70 bg-gradient-to-r from-amber-50/90 to-pink-50/90">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-pink-600" />
            <h2 className="text-lg font-black text-slate-800">나의 오답 복습 단어장</h2>
          </div>
          <button
            id="btn-close-review"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-pink-100/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-amber-50/30 to-pink-50/30">
          {uniqueList.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="font-bold text-slate-700">저장된 오답이 없습니다!</p>
              <p className="text-xs text-slate-400 mt-1">
                게임을 플레이하면서 헷갈렸던 문제가 여기에 자동으로 모입니다.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>총 <strong>{uniqueList.length}개</strong>의 복습 대상 단어</span>
                {isConfirmingClear ? (
                  <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-xl shadow-2xs">
                    <span className="text-[11px] text-rose-700 font-bold">전체 삭제할까요?</span>
                    <button
                      id="btn-confirm-clear"
                      onClick={() => {
                        soundManager.playClick();
                        onClearHistory();
                        setIsConfirmingClear(false);
                      }}
                      className="bg-rose-500 hover:bg-rose-600 text-white text-[11px] font-black px-2 py-0.5 rounded-lg transition active:scale-95 cursor-pointer shadow-2xs"
                    >
                      삭제
                    </button>
                    <button
                      onClick={() => setIsConfirmingClear(false)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[11px] font-bold px-2 py-0.5 rounded-lg transition cursor-pointer"
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <button
                    id="btn-clear-history"
                    onClick={() => {
                      soundManager.playClick();
                      setIsConfirmingClear(true);
                    }}
                    className="text-rose-500 hover:text-rose-700 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    비우기
                  </button>
                )}
              </div>

              {uniqueList.map((item, idx) => (
                <div
                  key={`review-item-${item.questionId}-${idx}`}
                  className="p-3 bg-white rounded-xl border border-pink-200/80 hover:border-pink-300 shadow-2xs transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center border border-amber-200">
                        {idx + 1}
                      </span>
                      <span className="text-base font-black text-slate-900">
                        {item.question.correctWord}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        ({item.question.correctMeaning})
                      </span>
                    </div>

                    <button
                      id={`btn-review-speak-${item.questionId}`}
                      onClick={() => speakEnglish(item.question.correctWord)}
                      className="p-1.5 rounded-full text-pink-600 hover:bg-pink-100/60"
                      title="발음 듣기"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Sentence */}
                  <div className="text-xs font-semibold text-slate-800 bg-amber-50/50 p-2 rounded-lg border border-amber-200/60 mb-1">
                    {item.question.sentence.replace('______', `[ ${item.question.correctWord} ]`)}
                  </div>
                  <div className="text-[11px] text-slate-500 px-1">
                    {item.question.koreanSentence.replace('______', item.question.correctMeaning)}
                  </div>

                  {/* Hint */}
                  <div className="text-[11px] text-amber-900 bg-amber-100/70 p-1.5 rounded mt-1.5 border border-amber-200">
                    💡 <strong>해설:</strong> {item.question.explanation}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-pink-200/70 bg-gradient-to-r from-amber-50/50 to-pink-50/50 flex gap-2">
          {uniqueList.length > 0 && (
            <button
              id="btn-start-review-runner"
              onClick={handleStartReview}
              className="flex-1 py-3 bg-pink-500 hover:bg-pink-400 active:bg-pink-600 text-white font-black rounded-xl shadow-md shadow-pink-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              오답 단어들로 복습 런 시작!
            </button>
          )}
          <button
            id="btn-close-modal-bottom"
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className={`${uniqueList.length > 0 ? 'w-24' : 'w-full'} py-3 bg-white hover:bg-amber-50 text-slate-700 font-bold rounded-xl border border-slate-300 transition-colors`}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
