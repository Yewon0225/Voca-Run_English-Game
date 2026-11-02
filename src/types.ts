export interface WordOption {
  id: string;
  word: string;
  meaning: string;
}

export interface Question {
  id: number;
  sentence: string; // e.g., "I ate ______ with John."
  koreanSentence: string; // e.g., "나는 존과 함께 ______를 먹었다."
  correctWord: string; // e.g., "sandwich"
  correctMeaning: string; // e.g., "샌드위치"
  options: WordOption[]; // 3 options for the 3 lanes
  explanation: string; // Why this word fits
  targetWordDetail?: {
    partOfSpeech: string;
    level: string;
  };
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  questions: Question[];
}

export interface UserAnswer {
  questionId: number;
  question: Question;
  selectedWord: string;
  selectedOptionId: string;
  isCorrect: boolean;
  selectedLane: number; // 0, 1, 2
  correctLane: number;
  tapCount?: number; // 탭 빈도 (해당 문장을 풀면서 행한 레인 이동/선택 탭 횟수)
}

export interface SentenceTapData {
  questionNumber: number;
  questionId: number;
  sentence: string;
  koreanSentence: string;
  correctWord: string;
  selectedWord: string;
  isCorrect: boolean;
  tapCount: number;
}

export interface AppsScriptPayload {
  timestamp: string;
  playCount: number;
  play_count: number;
  category: string;
  totalQuestions: number;
  total_questions: number;
  correctCount: number;
  correct_count: number;
  wrongCount: number;
  wrong_count: number;
  totalTaps: number;
  total_taps: number;
  averageTaps: number;
  average_taps: number;
  sentenceTaps: number[];
  sentence_taps: string;
  sentences: SentenceTapData[];
  sentence_details: SentenceTapData[];
  rows: Array<{
    timestamp: string;
    play_count: number;
    category: string;
    question_number: number;
    sentence: string;
    correct_word: string;
    selected_word: string;
    is_correct: string;
    tap_count: number;
    average_taps: number;
  }>;
}


export type GameScreenMode = 'START' | 'PLAYING' | 'RESULT' | 'REVIEW';

export type ObstacleKind = 'rock' | 'fence' | 'animal';

export interface CostumeItem {
  id: string;
  name: string;
  category: 'accessory' | 'top' | 'bottom';
  requiredScore: number;
  description: string;
  previewColor: string;
}

export interface CharacterCostume {
  accessory: string; // 'default' | 'visor' | 'lightning' | 'crown' | 'glasses'
  top: string;       // 'default' | 'red' | 'mint' | 'gold' | 'neon'
  bottom: string;    // 'default' | 'white' | 'black'
}

