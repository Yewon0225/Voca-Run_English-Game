import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, Lock, X, Shirt, Crown, Footprints, RotateCcw } from 'lucide-react';
import { CharacterCostume } from '../types';
import { COSTUME_ITEMS, saveCostume, DEFAULT_COSTUME } from '../data/costumeData';
import { RunningCharacter } from './RunningCharacter';
import { soundManager } from '../utils/audio';

interface WardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalScore: number;
  currentCostume: CharacterCostume;
  onUpdateCostume: (costume: CharacterCostume) => void;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  isOpen,
  onClose,
  totalScore,
  currentCostume,
  onUpdateCostume
}) => {
  const [activeTab, setActiveTab] = useState<'accessory' | 'top' | 'bottom'>('accessory');
  const [tempCostume, setTempCostume] = useState<CharacterCostume>(currentCostume);
  const [filterOnlyUnlocked, setFilterOnlyUnlocked] = useState<boolean>(false);

  // Synchronize when opened
  useEffect(() => {
    if (isOpen) {
      setTempCostume(currentCostume);
    }
  }, [isOpen, currentCostume]);

  if (!isOpen) return null;

  // Filter items by category
  const categoryItems = COSTUME_ITEMS.filter(item => item.category === activeTab);
  const unlockedCount = COSTUME_ITEMS.filter(item => totalScore >= item.requiredScore).length;

  const itemsToDisplay = categoryItems.filter(item => {
    if (filterOnlyUnlocked) {
      return totalScore >= item.requiredScore;
    }
    return true;
  });

  // Next unlock calculation
  const lockedItems = COSTUME_ITEMS.filter(item => item.requiredScore > totalScore);
  const nextItem = lockedItems.sort((a, b) => a.requiredScore - b.requiredScore)[0];
  const pointsToNext = nextItem ? nextItem.requiredScore - totalScore : 0;

  const handleEquip = (category: 'accessory' | 'top' | 'bottom', itemId: string) => {
    soundManager.playClick();
    const updated: CharacterCostume = {
      ...tempCostume,
      [category]: itemId
    };
    setTempCostume(updated);
    onUpdateCostume(updated);
    saveCostume(updated);
  };

  const handleUnequip = (category: 'accessory' | 'top' | 'bottom') => {
    soundManager.playClick();
    const updated: CharacterCostume = {
      ...tempCostume,
      [category]: category === 'accessory' ? 'none' : 'default'
    };
    setTempCostume(updated);
    onUpdateCostume(updated);
    saveCostume(updated);
  };

  const handleResetAll = () => {
    soundManager.playClick();
    setTempCostume(DEFAULT_COSTUME);
    onUpdateCostume(DEFAULT_COSTUME);
    saveCostume(DEFAULT_COSTUME);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          className="w-full max-w-md bg-gradient-to-b from-amber-50/95 via-pink-50/90 to-rose-50/95 border-4 border-amber-300 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-300 to-pink-400 flex items-center justify-center text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800">캐릭터 꾸미기 & 옷장</h2>
                <p className="text-xs font-semibold text-slate-500">
                  누적 점수: <span className="text-amber-600 font-bold">{totalScore}점</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-amber-200/60 text-slate-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Next Milestone Progress Pill */}
          <div className="mt-3 bg-white/80 border border-amber-200 rounded-2xl p-2.5 px-3 flex items-center justify-between text-xs">
            {nextItem ? (
              <>
                <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>다음 보상: <b className="text-slate-800">{nextItem.name}</b></span>
                </div>
                <span className="font-bold text-amber-600 bg-amber-100/80 px-2 py-0.5 rounded-full">
                  앞으로 {pointsToNext}점!
                </span>
              </>
            ) : (
              <span className="font-bold text-emerald-600 w-full text-center">
                🎉 모든 보상 아이템을 해금하셨습니다! 챔피언!
              </span>
            )}
          </div>

          {/* Character Live Preview Stage */}
          <div className="my-3 py-2 bg-gradient-to-b from-amber-100/50 to-pink-100/50 rounded-2xl border-2 border-dashed border-amber-200 flex flex-col items-center justify-center relative shadow-inner">
            <div className="absolute top-2 left-3 text-[10px] font-bold text-amber-700 bg-amber-200/70 px-2 py-0.5 rounded-md">
              실시간 착용 미리보기
            </div>
            <RunningCharacter
              state="running"
              size={94}
              costume={tempCostume}
              className="drop-shadow-lg"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-1.5 p-1 bg-amber-100/70 rounded-xl mb-2">
            <button
              onClick={() => setActiveTab('accessory')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === 'accessory'
                  ? 'bg-white text-slate-900 shadow-xs border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>악세서리</span>
            </button>
            <button
              onClick={() => setActiveTab('top')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === 'top'
                  ? 'bg-white text-slate-900 shadow-xs border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>상의</span>
            </button>
            <button
              onClick={() => setActiveTab('bottom')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                activeTab === 'bottom'
                  ? 'bg-white text-slate-900 shadow-xs border border-amber-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>하의/슈즈</span>
            </button>
          </div>

          {/* Filter & Reset Toolbar */}
          <div className="flex items-center justify-between px-1 mb-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-bold">
              <span>보유 아이템:</span>
              <span className="text-amber-800 bg-amber-200/90 px-2 py-0.5 rounded-full font-black text-[11px]">
                {unlockedCount}개
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterOnlyUnlocked(prev => !prev)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                  filterOnlyUnlocked
                    ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-50'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{filterOnlyUnlocked ? '보유 아이템만' : '보유 아이템만 보기'}</span>
              </button>
              <button
                onClick={handleResetAll}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-0.5 cursor-pointer underline"
                title="기본 복장으로 초기화"
              >
                <RotateCcw className="w-3 h-3" />
                <span>기본 복장</span>
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {/* Accessory "None" option */}
            {activeTab === 'accessory' && !filterOnlyUnlocked && (
              <div
                className={`p-2.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  tempCostume.accessory === 'none'
                    ? 'bg-amber-100/90 border-amber-400 ring-2 ring-amber-300 shadow-xs'
                    : 'bg-white/90 border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-500 font-bold shadow-xs">
                    <X className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">미착용 (단정한 헤어)</h4>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      머리 악세서리를 벗고 본래 헤어스타일로 달립니다
                    </p>
                  </div>
                </div>
                {tempCostume.accessory === 'none' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-black text-amber-700 bg-amber-200/90 px-3 py-1.5 rounded-xl border border-amber-300">
                    <Check className="w-3.5 h-3.5" />
                    착용 중
                  </span>
                ) : (
                  <button
                    onClick={() => handleUnequip('accessory')}
                    className="text-xs font-black text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer border border-slate-300"
                  >
                    벗기
                  </button>
                )}
              </div>
            )}

            {itemsToDisplay.map(item => {
              const isUnlocked = totalScore >= item.requiredScore;
              const isEquipped = tempCostume[item.category] === item.id;

              return (
                <div
                  key={`${item.category}-${item.id}`}
                  className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                    isEquipped
                      ? 'bg-amber-100/90 border-amber-400 ring-2 ring-amber-300 shadow-xs'
                      : isUnlocked
                      ? 'bg-white/90 border-slate-200 hover:border-amber-300'
                      : 'bg-slate-100/70 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Color Swatch / Category Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-xs border border-black/10 shrink-0"
                      style={{ backgroundColor: item.previewColor }}
                    >
                      {item.category === 'accessory' ? (
                        <Crown className="w-5 h-5 drop-shadow-xs" />
                      ) : item.category === 'top' ? (
                        <Shirt className="w-5 h-5 drop-shadow-xs" />
                      ) : (
                        <Footprints className="w-5 h-5 drop-shadow-xs" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-800">{item.name}</h4>
                        {item.requiredScore > 0 && (
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-200/80 px-1.5 py-0.2 rounded">
                            {item.requiredScore}점
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Button: Equip / Unequip */}
                  <div>
                    {isEquipped ? (
                      <button
                        onClick={() => handleUnequip(item.category)}
                        className="inline-flex items-center gap-1 text-xs font-black text-amber-900 bg-amber-200/90 hover:bg-amber-300/90 px-3 py-1.5 rounded-xl border border-amber-400 shadow-2xs transition active:scale-95 cursor-pointer"
                        title="클릭 시 착용을 해제합니다"
                      >
                        <Check className="w-3.5 h-3.5 text-amber-700" />
                        <span>착용 중 (해제)</span>
                      </button>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => handleEquip(item.category, item.id)}
                        className="text-xs font-black text-white bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600 px-3.5 py-1.5 rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                      >
                        착용하기
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-200/70 px-2.5 py-1 rounded-xl">
                        <Lock className="w-3 h-3" />
                        <span>{item.requiredScore}점</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Close Button */}
          <div className="pt-3 border-t border-amber-200/80 mt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-white font-black text-sm rounded-2xl shadow-md hover:brightness-105 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>꾸미기 완료</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
