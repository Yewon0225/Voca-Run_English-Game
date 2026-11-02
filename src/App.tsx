import React, { useState, useEffect } from 'react';
import { StartScreen } from './components/StartScreen';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { ReviewModal } from './components/ReviewModal';
import { WardrobeModal } from './components/WardrobeModal';
import { CHAPTERS, getRandomCurriculumQuestions } from './data/vocabularyData';
import { Chapter, GameScreenMode, Question, UserAnswer, CharacterCostume, CostumeItem } from './types';
import {
  loadTotalScore,
  saveTotalScore,
  loadSavedCostume,
  saveCostume,
  getNewlyUnlockedItems
} from './data/costumeData';

export default function App() {
  const [mode, setMode] = useState<GameScreenMode>('START');
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentAnswers, setCurrentAnswers] = useState<UserAnswer[]>([]);
  const [sessionScore, setSessionScore] = useState<number>(0);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [showWardrobeModal, setShowWardrobeModal] = useState<boolean>(false);

  // Cumulative Score state (persists across sessions)
  const [totalScore, setTotalScore] = useState<number>(() => loadTotalScore());

  // Character costume state (persists across sessions)
  const [costume, setCostume] = useState<CharacterCostume>(() => loadSavedCostume());

  // Track newly unlocked items after each game session
  const [newlyUnlockedItems, setNewlyUnlockedItems] = useState<CostumeItem[]>([]);

  // Persistent wrong answers in localStorage
  const [storedWrongAnswers, setStoredWrongAnswers] = useState<UserAnswer[]>(() => {
    try {
      const saved = localStorage.getItem('vocarun_saved_wrongs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cumulative play count state (persists across sessions)
  const [playCount, setPlayCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('vocarun_play_count') || '0', 10);
    } catch {
      return 0;
    }
  });

  // Category of current game session
  const [currentCategory, setCurrentCategory] = useState<string>('동아 중1 • 3과 Part 1 (Lesson 3 Core)');

  useEffect(() => {
    try {
      localStorage.setItem('vocarun_saved_wrongs', JSON.stringify(storedWrongAnswers));
    } catch {
      // ignore
    }
  }, [storedWrongAnswers]);

  // Start a new game session with 15 questions
  const handleStartGame = (chapter: Chapter | null) => {
    let questionsToPlay: Question[] = [];
    if (chapter) {
      questionsToPlay = [...chapter.questions].sort(() => 0.5 - Math.random());
      setCurrentCategory(`${chapter.badge} (${chapter.subtitle})`);
    } else {
      questionsToPlay = getRandomCurriculumQuestions(15);
      setCurrentCategory('동아 중1 통합 (전체 랜덤 15제)');
    }

    // Shuffle options order inside each question so answers aren't always in identical lanes
    const randomizedQuestions = questionsToPlay.map(q => ({
      ...q,
      options: [...q.options].sort(() => 0.5 - Math.random())
    }));

    setCurrentQuestions(randomizedQuestions);
    setCurrentAnswers([]);
    setSessionScore(0);
    setNewlyUnlockedItems([]);
    setMode('PLAYING');
  };

  // Game finished (15 questions answered) -> Accumulate score!
  const handleFinishGame = (answers: UserAnswer[], score: number) => {
    // Deduplicate answers by questionId to guarantee unique entries
    const deduplicatedAnswersMap = new Map<number, UserAnswer>();
    answers.forEach(a => deduplicatedAnswersMap.set(a.questionId, a));
    const cleanAnswers = Array.from(deduplicatedAnswersMap.values());

    setCurrentAnswers(cleanAnswers);
    setSessionScore(score);

    // Cumulative score update & check newly unlocked items
    const oldTotal = totalScore;
    const newTotal = oldTotal + score;
    setTotalScore(newTotal);
    saveTotalScore(newTotal);

    // Increment play_count on game completion
    const nextPlayCount = playCount + 1;
    setPlayCount(nextPlayCount);
    try {
      localStorage.setItem('vocarun_play_count', String(nextPlayCount));
    } catch {
      // ignore
    }

    const unlocked = getNewlyUnlockedItems(oldTotal, newTotal);
    setNewlyUnlockedItems(unlocked);

    // Collect wrong answers to persistent storage
    const newWrongs = cleanAnswers.filter(a => !a.isCorrect);
    if (newWrongs.length > 0) {
      setStoredWrongAnswers(prev => {
        const map = new Map<number, UserAnswer>();
        prev.forEach(item => map.set(item.questionId, item));
        newWrongs.forEach(item => map.set(item.questionId, item));
        return Array.from(map.values());
      });
    }

    setMode('RESULT');
  };

  // Replay the current 15 questions
  const handleRetryAll = () => {
    const reshuffled = currentQuestions.map(q => ({
      ...q,
      options: [...q.options].sort(() => 0.5 - Math.random())
    }));
    setCurrentQuestions(reshuffled);
    setCurrentAnswers([]);
    setSessionScore(0);
    setNewlyUnlockedItems([]);
    setMode('PLAYING');
  };

  // Retry only wrong questions
  const handleRetryWrongOnly = (wrongs: UserAnswer[]) => {
    const seen = new Set<number>();
    const uniqueQuestions: Question[] = [];
    wrongs.forEach(w => {
      if (!seen.has(w.question.id)) {
        seen.add(w.question.id);
        uniqueQuestions.push(w.question);
      }
    });

    const wrongQuestions = uniqueQuestions.map(q => ({
      ...q,
      options: [...q.options].sort(() => 0.5 - Math.random())
    }));
    setCurrentCategory(prev => (prev.includes('오답 복습') ? prev : `${prev} (오답 복습)`));
    setCurrentQuestions(wrongQuestions);
    setCurrentAnswers([]);
    setSessionScore(0);
    setNewlyUnlockedItems([]);
    setMode('PLAYING');
  };

  // Start review game from the Review Modal
  const handleStartReviewFromModal = (questions: Question[]) => {
    const seen = new Set<number>();
    const uniqueQuestions = questions.filter(q => {
      if (seen.has(q.id)) return false;
      seen.add(q.id);
      return true;
    });

    const shuffled = uniqueQuestions.map(q => ({
      ...q,
      options: [...q.options].sort(() => 0.5 - Math.random())
    }));
    setCurrentCategory('오답노트 복습런 (Review Run)');
    setShowReviewModal(false);
    setCurrentQuestions(shuffled);
    setCurrentAnswers([]);
    setSessionScore(0);
    setNewlyUnlockedItems([]);
    setMode('PLAYING');
  };

  const handleClearHistory = () => {
    setStoredWrongAnswers([]);
    try {
      localStorage.removeItem('vocarun_saved_wrongs');
    } catch {
      // ignore
    }
  };

  const handleCostumeChange = (newCostume: CharacterCostume) => {
    setCostume(newCostume);
    saveCostume(newCostume);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-amber-100/75 via-rose-100/65 to-pink-100/80 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 antialiased text-slate-800 selection:bg-pink-200 relative overflow-hidden">
      {/* Pastel soft ambient glow elements (Yellow & Pink) */}
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-amber-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed -bottom-24 -right-24 w-96 h-96 bg-pink-300/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-rose-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Background subtle grid pattern (like notebook graph paper from sketch, soft pastel tone) */}
      <div
        className="fixed inset-0 pointer-events-none opacity-35 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #f472b6 1px, transparent 1px),
            linear-gradient(to bottom, #fbbf24 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Main App Container */}
      <main className="w-full max-w-md h-[100dvh] sm:h-[720px] sm:max-h-[860px] bg-gradient-to-b from-amber-50/90 via-pink-50/80 to-rose-50/90 sm:rounded-3xl shadow-xl border-0 sm:border-4 sm:border-slate-800 flex flex-col relative overflow-hidden">
        {mode === 'START' && (
          <StartScreen
            onStartGame={handleStartGame}
            onOpenReview={() => setShowReviewModal(true)}
            onOpenWardrobe={() => setShowWardrobeModal(true)}
            wrongAnswerCount={storedWrongAnswers.length}
            totalScore={totalScore}
            costume={costume}
            playCount={playCount}
          />
        )}

        {mode === 'PLAYING' && (
          <GameScreen
            questions={currentQuestions}
            costume={costume}
            onFinishGame={handleFinishGame}
            onExitToStart={() => setMode('START')}
          />
        )}

        {mode === 'RESULT' && (
          <ResultScreen
            answers={currentAnswers}
            finalScore={sessionScore}
            totalScore={totalScore}
            newlyUnlockedItems={newlyUnlockedItems}
            totalQuestions={currentQuestions.length}
            category={currentCategory}
            playCount={playCount}
            onRetryAll={handleRetryAll}
            onRetryWrongOnly={handleRetryWrongOnly}
            onGoHome={() => setMode('START')}
            onOpenWardrobe={() => setShowWardrobeModal(true)}
          />
        )}

        {/* Dedicated Review Modal */}
        {showReviewModal && (
          <ReviewModal
            wrongAnswers={storedWrongAnswers}
            onClose={() => setShowReviewModal(false)}
            onStartReviewGame={handleStartReviewFromModal}
            onClearHistory={handleClearHistory}
          />
        )}

        {/* Character Wardrobe & Customize Modal */}
        <WardrobeModal
          isOpen={showWardrobeModal}
          onClose={() => setShowWardrobeModal(false)}
          totalScore={totalScore}
          currentCostume={costume}
          onUpdateCostume={handleCostumeChange}
        />
      </main>
    </div>
  );
}
