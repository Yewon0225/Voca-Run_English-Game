import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, UserAnswer, WordOption, ObstacleKind, CharacterCostume } from '../types';
import { RunningCharacter } from './RunningCharacter';
import { ObstacleView } from './ObstacleView';
import { soundManager, speakEnglish } from '../utils/audio';
import { Volume2, VolumeX, Volume1, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { DEFAULT_COSTUME } from '../data/costumeData';

interface GameScreenProps {
  questions: Question[];
  costume?: CharacterCostume;
  onFinishGame: (answers: UserAnswer[], finalScore: number) => void;
  onExitToStart: () => void;
}

interface ZoomedWordData {
  word: string;
  meaning: string;
  isCorrect: boolean;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  questions,
  costume = DEFAULT_COSTUME,
  onFinishGame,
  onExitToStart
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const answersRef = useRef<UserAnswer[]>([]);
  answersRef.current = answers;

  // Character lane: 0 (top), 1 (middle), 2 (bottom)
  const [characterLane, setCharacterLane] = useState<number>(1);
  const [characterState, setCharacterState] = useState<'running' | 'correct' | 'wrong'>('running');
  const [characterDashing, setCharacterDashing] = useState<boolean>(false);

  // Selection & Feedback state
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCurrentCorrect, setIsCurrentCorrect] = useState<boolean | null>(null);
  const [showScorePopup, setShowScorePopup] = useState<boolean>(false);

  // Center Zoomed Word Card
  const [zoomedWord, setZoomedWord] = useState<ZoomedWordData | null>(null);

  // Obstacle System (Every 3 questions)
  const isObstacleQuestion = (currentIndex + 1) % 3 === 0;
  const obstacleKinds: ObstacleKind[] = ['rock', 'fence', 'animal'];
  const currentObstacle: ObstacleKind = obstacleKinds[Math.floor(currentIndex / 3) % 3];
  const [timeLeft, setTimeLeft] = useState<number>(5.0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isQuestionResolvedRef = useRef<boolean>(false);

  // Exit Confirmation Modal state
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);

  // Refs to allow countdown timer to continue uninterrupted across lane changes
  const characterLaneRef = useRef<number>(characterLane);
  characterLaneRef.current = characterLane;

  // Sound & Hint
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.isMuted);

  const currentQuestion = questions[currentIndex];

  // Reset state on each new question
  useEffect(() => {
    if (!currentQuestion) return;

    isQuestionResolvedRef.current = false;
    setSelectedOptionId(null);
    setIsAnswerSubmitted(false);
    setIsCurrentCorrect(null);
    setCharacterState('running');
    setCharacterDashing(false);
    setZoomedWord(null);
    setTimeLeft(5.0);

    // Speak sentence prompt naturally
    const timer = setTimeout(() => {
      speakEnglish(currentQuestion.sentence);
    }, 200);

    return () => clearTimeout(timer);
  }, [currentIndex, currentQuestion]);

  // Unified answer submission handler (prevents duplicate submissions)
  const handleSelectOption = useCallback((option: WordOption | null, laneIndex: number, isTimeout = false) => {
    if (isQuestionResolvedRef.current || !currentQuestion) return;
    isQuestionResolvedRef.current = true;

    // Clear obstacle countdown timer if running
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsAnswerSubmitted(true);
    if (option) {
      setSelectedOptionId(option.id);
    }
    setCharacterLane(laneIndex);
    soundManager.playLaneSwitch();
    setCharacterDashing(true);

    const isCorrect = !isTimeout && option ? option.word.toLowerCase() === currentQuestion.correctWord.toLowerCase() : false;
    setIsCurrentCorrect(isCorrect);

    const correctLaneIndex = currentQuestion.options.findIndex(
      opt => opt.word.toLowerCase() === currentQuestion.correctWord.toLowerCase()
    );

    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion,
      selectedWord: isTimeout ? '(시간 초과)' : (option ? option.word : ''),
      selectedOptionId: option ? option.id : '',
      isCorrect,
      selectedLane: laneIndex,
      correctLane: correctLaneIndex >= 0 ? correctLaneIndex : 0
    };

    const nextAnswers = [...answersRef.current, newAnswer];
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);

    if (isCorrect && option) {
      soundManager.playCorrect();
      setCharacterState('correct');
      const nextScore = score + 10;
      setScore(nextScore);
      setShowScorePopup(true);
      setTimeout(() => setShowScorePopup(false), 800);

      // Show center zoomed card with English word + Korean meaning prominently!
      setTimeout(() => {
        setZoomedWord({
          word: option.word,
          meaning: currentQuestion.correctMeaning,
          isCorrect: true
        });

        // Speak the correct word completely without cutoff
        speakEnglish(currentQuestion.correctWord, () => {
          setTimeout(() => {
            setZoomedWord(null);
            if (currentIndex + 1 < questions.length) {
              setCurrentIndex(prev => prev + 1);
            } else {
              onFinishGame(nextAnswers, nextScore);
            }
          }, 600);
        });
      }, 300);
    } else {
      soundManager.playWrong();
      setCharacterState('wrong');

      setTimeout(() => {
        setZoomedWord({
          word: currentQuestion.correctWord,
          meaning: currentQuestion.correctMeaning,
          isCorrect: false
        });

        speakEnglish(currentQuestion.correctWord, () => {
          setTimeout(() => {
            setZoomedWord(null);
            if (currentIndex + 1 < questions.length) {
              setCurrentIndex(prev => prev + 1);
            } else {
              onFinishGame(nextAnswers, score);
            }
          }, 650);
        });
      }, 350);
    }
  }, [currentQuestion, currentIndex, questions.length, score, onFinishGame]);

  const handleSelectOptionRef = useRef(handleSelectOption);
  handleSelectOptionRef.current = handleSelectOption;

  // Handle 5-second countdown timer for Obstacle Questions safely (persists uninterrupted across lane switches)
  useEffect(() => {
    if (!isObstacleQuestion || isAnswerSubmitted || !currentQuestion) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    let remaining = 5.0;
    setTimeLeft(5.0);

    timerRef.current = setInterval(() => {
      remaining = Math.round((remaining - 0.1) * 10) / 10;
      if (remaining <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setTimeLeft(0);
        handleSelectOptionRef.current(null, characterLaneRef.current, true);
      } else {
        setTimeLeft(remaining);
      }
    }, 100);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentIndex, isObstacleQuestion, isAnswerSubmitted, currentQuestion]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswerSubmitted || !currentQuestion) return;

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCharacterLane(prev => Math.max(0, prev - 1));
        soundManager.playLaneSwitch();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setCharacterLane(prev => Math.min(2, prev + 1));
        soundManager.playLaneSwitch();
      } else if (e.key === '1') {
        if (currentQuestion.options[0]) handleSelectOption(currentQuestion.options[0], 0);
      } else if (e.key === '2') {
        if (currentQuestion.options[1]) handleSelectOption(currentQuestion.options[1], 1);
      } else if (e.key === '3') {
        if (currentQuestion.options[2]) handleSelectOption(currentQuestion.options[2], 2);
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (currentQuestion.options[characterLane]) {
          handleSelectOption(currentQuestion.options[characterLane], characterLane);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [characterLane, isAnswerSubmitted, currentQuestion, handleSelectOption]);

  const handleOpenExitConfirm = () => {
    soundManager.playClick();
    setShowExitConfirm(true);
  };

  const handleConfirmExit = () => {
    soundManager.playClick();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setShowExitConfirm(false);
    onExitToStart();
  };

  const handleCancelExit = () => {
    soundManager.playClick();
    setShowExitConfirm(false);
  };

  if (!currentQuestion) return null;

  const correctLaneIndex = currentQuestion.options.findIndex(
    opt => opt.word.toLowerCase() === currentQuestion.correctWord.toLowerCase()
  );

  return (
    <div className="w-full h-full flex flex-col justify-between items-center px-4 py-3 select-none relative overflow-hidden bg-gradient-to-b from-amber-50/70 via-pink-50/60 to-rose-50/70">
      {/* 1. Header (문제 번호, 오디오 제어, 점수) */}
      <div className="w-full flex items-center justify-between pb-2 border-b border-pink-200/70">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-slate-800 tracking-tight">
            {currentIndex + 1}/{questions.length}
          </span>
          <span className="text-xs font-bold text-slate-500">문제</span>
          {isObstacleQuestion && (
            <span className="text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full animate-pulse shadow-xs">
              ⚡ 장애물 돌파전!
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="btn-speak-sentence"
            onClick={() => speakEnglish(currentQuestion.sentence)}
            className="p-1.5 rounded-full text-pink-600 hover:bg-pink-100/80 transition-colors"
            title="문장 영어 발음 듣기"
          >
            <Volume1 className="w-5 h-5" />
          </button>
          <button
            id="btn-toggle-sound"
            onClick={() => {
              const muted = soundManager.toggleMute();
              setIsMuted(muted);
              if (!muted) soundManager.playClick();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title={isMuted ? '소리 켜기' : '소리 끄기'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-pink-500" />}
          </button>
        </div>

        <div className="relative flex items-center">
          <span className="text-lg font-black text-amber-900 bg-amber-100/95 px-3 py-1 rounded-xl border border-amber-300 shadow-xs">
            점수: {score}
          </span>
          <AnimatePresence>
            {showScorePopup && (
              <motion.div
                initial={{ opacity: 0, y: 0, scale: 0.7 }}
                animate={{ opacity: 1, y: -24, scale: 1.2 }}
                exit={{ opacity: 0 }}
                className="absolute -top-4 right-0 font-black text-emerald-600 text-sm bg-white px-2 py-0.5 rounded-full shadow border border-emerald-300 pointer-events-none"
              >
                +10점!
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* 2. Obstacle Alert & 5-second Timer Gauge (Every 3 questions) */}
      {isObstacleQuestion && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full my-1.5"
        >
          <div className="w-full bg-gradient-to-r from-red-500 via-amber-500 to-rose-500 text-white p-2 rounded-2xl shadow-md flex flex-col gap-1">
            <div className="flex items-center justify-between px-1 text-xs font-black">
              <div className="flex items-center gap-1.5">
                <span className="text-sm animate-bounce">🚨</span>
                <span>
                  {currentObstacle === 'rock' && '거대한 바위 출현! 5초 안에 정답 레인으로 점프!'}
                  {currentObstacle === 'fence' && '울타리 장애물 등장! 5초 안에 안전 레인으로 돌파!'}
                  {currentObstacle === 'animal' && '야생 동물 돌진! 5초 안에 피해서 골인!'}
                </span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs bg-black/30 px-2 py-0.5 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span className={timeLeft <= 2 ? 'text-rose-200 font-black animate-pulse' : 'text-amber-200'}>
                  {timeLeft.toFixed(1)}s
                </span>
              </div>
            </div>
            {/* 5s Gauge */}
            <div className="w-full h-2 bg-black/25 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full transition-all duration-100 ${
                  timeLeft <= 2 ? 'bg-rose-300' : 'bg-amber-300'
                }`}
                style={{ width: `${Math.max(0, (timeLeft / 5) * 100)}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. Question Box (상단 문장 & 빈칸 박스) */}
      <div className="w-full my-1">
        <div className="relative bg-white/95 border-2 border-slate-800 rounded-2xl px-4 pt-3.5 pb-2.5 shadow-sm">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-100 px-3 py-0.5 border-2 border-slate-800 rounded-md text-[11px] font-black text-slate-900 tracking-wider">
            문 제
          </div>

          <div className="text-center mt-0.5">
            <p className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
              {currentQuestion.sentence.split('______').map((part, i, arr) => (
                <React.Fragment key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span
                      className={`inline-flex items-center justify-center min-w-[85px] px-2 py-0.5 mx-1 border-b-2 font-black transition-all rounded-md ${
                        isAnswerSubmitted
                          ? isCurrentCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-700'
                            : 'bg-rose-100 border-rose-500 text-rose-700'
                          : 'bg-pink-100/70 border-pink-500 text-pink-900'
                      }`}
                    >
                      {isAnswerSubmitted
                        ? (selectedOptionId ? currentQuestion.options.find(o => o.id === selectedOptionId)?.word : currentQuestion.correctWord)
                        : '______'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {currentQuestion.koreanSentence}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Three Running Lanes with Word Cards & Obstacles */}
      <div className="w-full flex-1 flex flex-col justify-center my-1 relative">
        <div className="w-full h-[255px] relative flex flex-col justify-between py-1">
          {/* Subtle lane divider lines */}
          <div className="absolute top-[85px] left-0 right-0 h-0.5 border-b border-dashed border-pink-300/80 z-0" />
          <div className="absolute top-[170px] left-0 right-0 h-0.5 border-b border-dashed border-pink-300/80 z-0" />

          {currentQuestion.options.map((option, laneIdx) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.word.toLowerCase() === currentQuestion.correctWord.toLowerCase();
            const showAsCorrect = isAnswerSubmitted && isCorrectOption;
            const showAsWrong = isAnswerSubmitted && isSelected && !isCorrectOption;

            // In obstacle questions, show obstacle blocking the wrong lanes!
            const isObstacleLane = isObstacleQuestion && !isCorrectOption;

            return (
              <div key={`q-${currentQuestion.id}-lane-${laneIdx}-${option.id}`} className="relative w-full flex items-center z-10">
                {/* Lane Track Number & Indicator */}
                <div className="absolute left-18 text-xs font-black text-slate-400 pointer-events-none">
                  {laneIdx + 1}
                </div>

                {/* Obstacle on Track (if obstacle question and not correct lane) */}
                {isObstacleLane && (
                  <motion.div
                    className="absolute left-24 z-15 pointer-events-none"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                  >
                    <ObstacleView kind={currentObstacle} size={48} />
                  </motion.div>
                )}

                {/* Word Card: Korean meaning is strictly HIDDEN before selection! */}
                <motion.button
                  key={`btn-${currentQuestion.id}-${option.id}-${laneIdx}`}
                  whileHover={!isAnswerSubmitted ? { scale: 1.01 } : {}}
                  whileTap={!isAnswerSubmitted ? { scale: 0.98 } : {}}
                  initial={false}
                  animate={
                    showAsWrong
                      ? { x: [-6, 6, -6, 6, 0], backgroundColor: '#fee2e2' }
                      : showAsCorrect
                      ? { scale: [1, 1.04, 1], backgroundColor: '#dcfce7' }
                      : { x: 0, scale: 1, backgroundColor: '#ffffff' }
                  }
                  onClick={() => handleSelectOption(option, laneIdx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full h-[66px] rounded-2xl border-2 font-bold text-lg flex items-center justify-between px-5 pl-26 transition-all shadow-sm cursor-pointer ${
                    showAsCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-3 ring-emerald-300'
                      : showAsWrong
                      ? 'border-rose-500 bg-rose-50 text-rose-900'
                      : characterLane === laneIdx
                      ? 'border-pink-500 bg-white text-slate-900 shadow-md ring-2 ring-pink-200'
                      : 'border-slate-800 bg-white text-slate-800 hover:border-pink-500 hover:bg-pink-50/40'
                  }`}
                >
                  {/* English Word in Large Bold Display */}
                  <span className="text-xl sm:text-2xl font-black tracking-wide">
                    {option.word}
                  </span>

                  {/* Status Indicator / Arrow */}
                  <div className="flex items-center gap-1.5">
                    {showAsCorrect && (
                      <span className="text-xs font-black bg-emerald-200 text-emerald-800 px-2.5 py-1 rounded-xl">
                        정답!
                      </span>
                    )}
                    {showAsWrong && (
                      <span className="text-xs font-black bg-rose-200 text-rose-800 px-2.5 py-1 rounded-xl">
                        오답
                      </span>
                    )}
                    {!isAnswerSubmitted && (
                      <span className="text-xs font-bold text-slate-300">
                        {laneIdx + 1}번 레인
                      </span>
                    )}
                  </div>
                </motion.button>
              </div>
            );
          })}

          {/* Boy Runner Character with custom costume */}
          <motion.div
            className="absolute left-2 z-20 pointer-events-none"
            initial={false}
            animate={{
              top: characterLane === 0 ? 6 : characterLane === 1 ? 90 : 174,
              x: characterDashing ? 65 : 0
            }}
            transition={{
              type: 'spring',
              stiffness: 380,
              damping: 24
            }}
          >
            <RunningCharacter
              state={characterState}
              size={66}
              costume={costume}
            />
          </motion.div>
        </div>
      </div>

      {/* 5. Center Zoomed Word Card (정답 시 화면 중앙 크게 확대 + 영어/한국어 뜻 제공) */}
      <AnimatePresence>
        {zoomedWord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.65, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: 'spring', stiffness: 360, damping: 24 }}
              className={`w-full max-w-sm rounded-3xl border-4 p-6 shadow-2xl text-center relative flex flex-col items-center ${
                zoomedWord.isCorrect
                  ? 'bg-gradient-to-b from-amber-50 via-emerald-50 to-teal-50 border-emerald-400 ring-4 ring-emerald-200'
                  : 'bg-gradient-to-b from-amber-50 via-rose-50 to-pink-50 border-rose-400 ring-4 ring-rose-200'
              }`}
            >
              <div className="mb-2">
                {zoomedWord.isCorrect ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-black bg-emerald-500 text-white shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                    정답입니다! CORRECT!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-black bg-rose-500 text-white shadow-md">
                    <AlertCircle className="w-4 h-4" />
                    정답 단어 확인하기
                  </span>
                )}
              </div>

              {/* Large English Word */}
              <div className="flex items-center justify-center gap-2.5 my-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-wide drop-shadow-xs">
                  {zoomedWord.word}
                </h2>
                <button
                  onClick={() => speakEnglish(zoomedWord.word)}
                  className="p-2 rounded-full bg-white shadow hover:bg-amber-100 text-pink-600 transition active:scale-95 cursor-pointer"
                  title="발음 다시 듣기"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Large Korean Meaning in Highlight Box */}
              <div className="my-2.5 px-6 py-2 rounded-2xl bg-amber-100/95 border-2 border-amber-300 shadow-sm">
                <span className="text-2xl sm:text-3xl font-black text-amber-950">
                  {zoomedWord.meaning}
                </span>
              </div>

              {/* Sentence Context */}
              <div className="mt-3 p-3 bg-white/90 rounded-2xl border border-slate-200 text-left w-full shadow-xs">
                <p className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md inline-block mb-1">
                  문맥 속 단어 활용
                </p>
                <p className="text-sm font-black text-slate-800 leading-snug">
                  {currentQuestion.sentence.replace('______', zoomedWord.word)}
                </p>
                <p className="text-xs font-semibold text-slate-500 mt-1">
                  {currentQuestion.koreanSentence.replace('______', zoomedWord.meaning)}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>정확한 발음 학습 후 다음 문제로 자동 이동합니다</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Footer Navigation Strip */}
      <div className="w-full mt-1">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>👆 원하는 레인의 단어를 터치하면 캐릭터가 달려갑니다!</span>
          <button
            id="btn-exit-game"
            onClick={handleOpenExitConfirm}
            className="text-slate-500 hover:text-slate-800 underline text-xs font-semibold cursor-pointer py-1 px-2 rounded-lg hover:bg-white/60 transition"
          >
            게임 나가기
          </button>
        </div>
      </div>

      {/* Exit Game Confirmation Dialog (In-app modal to prevent iframe blocking) */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-white rounded-3xl border-2 border-slate-800 p-6 max-w-xs w-full shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-700 flex items-center justify-center mx-auto mb-3 text-2xl shadow-xs">
                🏃‍♂️
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1">게임을 중단할까요?</h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                지금 나가면 현재 게임이 중단되고 메인 시작 화면으로 돌아갑니다.
              </p>
              <div className="flex gap-2">
                <button
                  id="btn-cancel-exit"
                  onClick={handleCancelExit}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl transition cursor-pointer"
                >
                  계속하기
                </button>
                <button
                  id="btn-confirm-exit"
                  onClick={handleConfirmExit}
                  className="flex-1 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs rounded-xl transition shadow-xs active:scale-95 cursor-pointer"
                >
                  나가기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
