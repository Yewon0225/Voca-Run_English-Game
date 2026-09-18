import { CostumeItem, CharacterCostume } from '../types';

export const DEFAULT_COSTUME: CharacterCostume = {
  accessory: 'default',
  top: 'default',
  bottom: 'default'
};

export const COSTUME_ITEMS: CostumeItem[] = [
  // --- Accessories (Headwear) ---
  {
    id: 'default',
    name: '기본 옐로우 밴드',
    category: 'accessory',
    requiredScore: 0,
    description: '활기찬 러너의 상징인 노란색 스포츠 헤어밴드',
    previewColor: '#f59e0b'
  },
  {
    id: 'visor',
    name: '스포티 썬바이저 캡',
    category: 'accessory',
    requiredScore: 150,
    description: '햇빛을 가려주는 시원한 핑크빛 스포츠 썬캡',
    previewColor: '#ec4899'
  },
  {
    id: 'lightning',
    name: '스피드 번개 밴드',
    category: 'accessory',
    requiredScore: 250,
    description: '짜릿한 번개 문양이 새겨진 에너제틱 헤어밴드',
    previewColor: '#8b5cf6'
  },
  {
    id: 'crown',
    name: '승리의 골드 월계관',
    category: 'accessory',
    requiredScore: 350,
    description: '중1 영단어를 마스터한 챔피언의 황금빛 월계관',
    previewColor: '#eab308'
  },
  {
    id: 'glasses',
    name: '스마트 영단어 안경',
    category: 'accessory',
    requiredScore: 450,
    description: '지적인 매력을 뽐내는 둥근 프레임의 스마트 안경',
    previewColor: '#0ea5e9'
  },

  // --- Tops (Shirts / Uniforms) ---
  {
    id: 'default',
    name: '스카이블루 스타 저지',
    category: 'top',
    requiredScore: 0,
    description: '가슴에 황금별이 빛나는 산뜻한 기본 블루 저지',
    previewColor: '#0284c7'
  },
  {
    id: 'red',
    name: '열정의 파이어 레드 저지',
    category: 'top',
    requiredScore: 200,
    description: '불꽃처럼 타오르는 학습 열정을 담은 레드 셔츠',
    previewColor: '#ef4444'
  },
  {
    id: 'mint',
    name: '상큼한 민트 에이스 후디',
    category: 'top',
    requiredScore: 300,
    description: '산뜻하고 청량한 느낌의 파스텔 민트 스포츠 웨어',
    previewColor: '#10b981'
  },
  {
    id: 'gold',
    name: '전설의 챔피언 골드 저지',
    category: 'top',
    requiredScore: 400,
    description: '누적 점수 400점 달성자에게 주어지는 영광의 황금 저지',
    previewColor: '#f59e0b'
  },
  {
    id: 'neon',
    name: '갤럭시 네온 퍼플 셔츠',
    category: 'top',
    requiredScore: 500,
    description: '우주처럼 신비로운 네온 바이올렛 컬러의 특수 유니폼',
    previewColor: '#a855f7'
  },

  // --- Bottoms (Shorts & Shoes) ---
  {
    id: 'default',
    name: '네이비 쇼츠 & 레드 슈즈',
    category: 'bottom',
    requiredScore: 0,
    description: '화이트 라인이 들어간 깔끔한 네이비 반바지와 러닝화',
    previewColor: '#1e293b'
  },
  {
    id: 'white',
    name: '프로 화이트 쇼츠 & 블루 슈즈',
    category: 'bottom',
    requiredScore: 150,
    description: '가볍고 쾌적한 화이트 쇼츠와 스카이블루 스니커즈',
    previewColor: '#38bdf8'
  },
  {
    id: 'black',
    name: '제트블랙 카고 쇼츠 & 골드 슈즈',
    category: 'bottom',
    requiredScore: 300,
    description: '시크한 블랙 쇼츠와 눈부신 골드 레이스 러닝화',
    previewColor: '#0f172a'
  }
];

// Helper: Check which items are newly unlocked given oldScore and newScore
export function getNewlyUnlockedItems(oldScore: number, newScore: number): CostumeItem[] {
  return COSTUME_ITEMS.filter(
    item => item.requiredScore > oldScore && item.requiredScore <= newScore
  );
}

// Storage helpers
const COSTUME_STORAGE_KEY = 'voca_run_character_costume';
const TOTAL_SCORE_STORAGE_KEY = 'voca_run_total_score';

export function loadSavedCostume(): CharacterCostume {
  try {
    const raw = localStorage.getItem(COSTUME_STORAGE_KEY);
    if (!raw) return DEFAULT_COSTUME;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_COSTUME, ...parsed };
  } catch {
    return DEFAULT_COSTUME;
  }
}

export function saveCostume(costume: CharacterCostume): void {
  try {
    localStorage.setItem(COSTUME_STORAGE_KEY, JSON.stringify(costume));
  } catch (e) {
    console.warn('Failed to save costume:', e);
  }
}

export function loadTotalScore(): number {
  try {
    const raw = localStorage.getItem(TOTAL_SCORE_STORAGE_KEY);
    if (!raw) return 0;
    const num = parseInt(raw, 10);
    return isNaN(num) ? 0 : num;
  } catch {
    return 0;
  }
}

export function saveTotalScore(score: number): void {
  try {
    localStorage.setItem(TOTAL_SCORE_STORAGE_KEY, score.toString());
  } catch (e) {
    console.warn('Failed to save total score:', e);
  }
}
