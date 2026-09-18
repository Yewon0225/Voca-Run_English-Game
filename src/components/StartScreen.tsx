import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RunningCharacter } from './RunningCharacter';
import { CHAPTERS } from '../data/vocabularyData';
import { soundManager } from '../utils/audio';
import { Volume2, VolumeX, BookOpen, Play, HelpCircle, Trophy, Sparkles } from 'lucide-react';
import { Chapter, CharacterCostume } from '../types';
import { DEFAULT_COSTUME } from '../data/costumeData';

interface StartScreenProps {
  onStartGame: (chapter: Chapter | null) => void;
  onOpenReview: () => void;
  onOpenWardrobe: () => void;
  wrongAnswerCount: number;
  totalScore: number;
  costume?: CharacterCostume;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  onOpenReview,
  onOpenWardrobe,
  wrongAnswerCount,
  totalScore,
  costume = DEFAULT_COSTUME
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>('lesson3-core');
  const [showHowTo, setShowHowTo] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.isMuted);

  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) soundManager.playClick();
  };

  const handleStart = () => {
    soundManager.playClick();
    if (selectedChapterId === 'all') {
      onStartGame(null);
    } else {
      const chapter = CHAPTERS.find(c => c.id === selectedChapterId) || CHAPTERS[0];
      onStartGame(chapter);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center px-5 py-5 text-slate-800 select-none bg-gradient-to-b from-amber-50/70 via-pink-50/60 to-rose-50/70">
      {/* Top utility row: Chapter Badge & Cumulative Score & Sound */}
      <div className="w-full flex items-center justify-between">
        <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full flex items-center gap-1.5 border border-amber-300/60">
          <Trophy className="w-3.5 h-3.5 text-amber-700" />
          동아(윤정미) 중1
        </span>

        {/* Cumulative Score Badge */}
        <button
          onClick={() => {
            soundManager.playClick();
            onOpenWardrobe();
          }}
          className="text-xs font-black text-amber-950 bg-gradient-to-r from-amber-200 to-pink-200 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5 shadow-xs hover:brightness-105 active:scale-95 transition cursor-pointer"
          title="누적 점수 & 옷장 열기"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>누적 {totalScore}점</span>
        </button>

        <div className="flex items-center gap-1">
          <button
            id="btn-how-to"
            onClick={() => {
              soundManager.playClick();
              setShowHowTo(!showHowTo);
            }}
            className="p-1.5 rounded-full text-slate-500 hover:text-pink-600 hover:bg-pink-100/60 transition-colors"
            title="게임 방법"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <button
            id="btn-sound-toggle"
            onClick={handleToggleSound}
            className="p-1.5 rounded-full text-slate-500 hover:text-pink-600 hover:bg-pink-100/60 transition-colors"
            title={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-pink-600" />}
          </button>
        </div>
      </div>

      {/* Main Sketch Title Section */}
      <div className="w-full flex flex-col items-center mt-0.5">
        <div className="relative flex items-center justify-center">
          <div className="absolute -top-3 -left-6 w-16 h-10 bg-amber-200/70 rounded-full blur-xs -z-0 pointer-events-none" />
          <div className="absolute -bottom-2 -right-5 w-16 h-10 bg-pink-200/70 rounded-full blur-xs -z-0 pointer-events-none" />
          <h1 className="text-4xl font-black text-slate-800 tracking-tight z-10">
            보 카 런
          </h1>
        </div>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          동아(윤정미) 중1 • 3과 & 5과 문장 완성 달리기
        </p>
      </div>

      {/* Runner Character Illustration with equipped costume + Wardrobe CTA */}
      <div className="relative my-1.5 flex flex-col items-center justify-center">
        <div
          onClick={() => {
            soundManager.playClick();
            onOpenWardrobe();
          }}
          className="w-30 h-30 rounded-full bg-gradient-to-tr from-amber-100/80 via-pink-100/70 to-rose-100/80 flex items-center justify-center border-2 border-dashed border-pink-300/80 relative overflow-hidden shadow-inner cursor-pointer group hover:border-pink-500 transition"
          title="클릭하여 캐릭터 꾸미기"
        >
          <div className="absolute bottom-5 left-0 right-0 h-1 bg-pink-300/60" />
          <div className="absolute bottom-4 left-4 right-4 flex justify-around">
            <span className="w-4 h-0.5 bg-amber-300 rounded" />
            <span className="w-4 h-0.5 bg-pink-300 rounded" />
            <span className="w-4 h-0.5 bg-rose-300 rounded" />
          </div>

          <RunningCharacter state="running" size={80} costume={costume} />
        </div>

        {/* Wardrobe Access Button */}
        <button
          id="btn-open-wardrobe-hero"
          onClick={() => {
            soundManager.playClick();
            onOpenWardrobe();
          }}
          className="mt-1 text-xs font-black text-pink-700 bg-pink-100 hover:bg-pink-200 active:scale-95 border border-pink-300 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs transition cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>캐릭터 꾸미기 & 옷장</span>
        </button>
      </div>

      {/* How-to banner */}
      {showHowTo && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full bg-amber-100/95 border border-amber-300 rounded-2xl p-3 text-xs text-amber-950 mb-1 shadow-sm"
        >
          <div className="font-bold flex items-center gap-1 mb-1">
            <span>💡 보카런 룰 & 보상 시스템</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-amber-900 font-medium">
            <li>단어 카드를 터치하면 영어 단어와 한국어 뜻이 크게 확대되며 원어민 발음이 재생돼요!</li>
            <li><strong>3문제마다 긴급 장애물(바위, 울타리, 동물)</strong>이 출현! 5초 안에 돌파하세요!</li>
            <li>획득 점수는 계속 누적되어 <strong>150점, 200점, 250점...</strong>마다 캐릭터 의상이 해금돼요!</li>
          </ul>
        </motion.div>
      )}

      {/* Chapter Selection Pill Buttons */}
      <div className="w-full space-y-1.5 mb-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 px-1">
          <span>학습 단원 선택</span>
          <span className="text-pink-600 font-extrabold">15문제 코스</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {CHAPTERS.map(ch => {
            const isSelected = selectedChapterId === ch.id;
            return (
              <button
                key={ch.id}
                id={`chapter-${ch.id}`}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedChapterId(ch.id);
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-pink-400 bg-pink-50 text-pink-950 shadow-sm ring-2 ring-pink-300/70'
                    : 'border-slate-200/80 bg-white/90 text-slate-700 hover:border-pink-200'
                }`}
              >
                <div className="text-[11px] font-bold text-pink-600 truncate">{ch.badge}</div>
                <div className="text-xs font-bold truncate mt-0.5">{ch.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="w-full space-y-2">
        <button
          id="btn-start-game"
          onClick={handleStart}
          className="w-full py-3.5 rounded-2xl font-black text-lg bg-pink-500 hover:bg-pink-400 active:bg-pink-600 text-white shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] cursor-pointer"
        >
          <Play className="w-5 h-5 fill-white" />
          시작하기
        </button>

        <div className="flex gap-2">
          <button
            id="btn-review-words"
            onClick={() => {
              soundManager.playClick();
              onOpenReview();
            }}
            className="flex-1 py-2.5 rounded-2xl font-bold text-sm bg-white/95 hover:bg-amber-50 active:bg-amber-100 text-slate-800 border-2 border-slate-700 flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-pink-500" />
            복습하기
            {wrongAnswerCount > 0 && (
              <span className="ml-1 bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-extrabold">
                {wrongAnswerCount}
              </span>
            )}
          </button>

          <button
            id="btn-wardrobe"
            onClick={() => {
              soundManager.playClick();
              onOpenWardrobe();
            }}
            className="flex-1 py-2.5 rounded-2xl font-bold text-sm bg-amber-100 hover:bg-amber-200 active:bg-amber-300 text-amber-950 border-2 border-amber-400 flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            옷장 꾸미기
          </button>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 text-center mt-1 font-medium">
        동아(윤정미) 중1 영어 • 3과 & 5과 단어장 반영
      </div>
    </div>
  );
};
