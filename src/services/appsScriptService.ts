import { UserAnswer, SentenceTapData, AppsScriptPayload } from '../types';

/**
 * Get Google Apps Script Web App URL from environment variable (.env.local)
 * Default fallback matches the user's provided deployment URL.
 */
export function getAppsScriptUrl(): string {
  const envUrl =
    (typeof import.meta !== 'undefined' && import.meta.env ? (import.meta.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL as string) : '') ||
    (typeof process !== 'undefined' && process.env ? (process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL as string) : '');

  let url = (envUrl && envUrl.trim().length > 0)
    ? envUrl.trim()
    : 'https://script.google.com/macros/s/AKfycbwe3vcNJlqyeayYvPbmIUGFetf4-U8TkaP1gE9ehVSULh1U5QNBGW52LKjHevSMUrXOfg/exec';

  // Guard against accidental test URL (/dev) which forces developer login and fails for external students on Vercel
  if (url.endsWith('/dev')) {
    url = url.slice(0, -4) + '/exec';
  }

  return url;
}

export interface TapAnalytics {
  sentences: SentenceTapData[];
  totalTaps: number;
  averageTaps: number;
  sentenceTapsSummary: string;
}

/**
 * Calculate per-sentence tap count and average across all sentences in the session
 */
export function calculateTapAnalytics(answers: UserAnswer[]): TapAnalytics {
  const sentences: SentenceTapData[] = answers.map((ans, idx) => {
    const tapCount = Math.max(1, ans.tapCount || 1);
    return {
      questionNumber: idx + 1,
      questionId: ans.questionId,
      sentence: ans.question.sentence,
      koreanSentence: ans.question.koreanSentence,
      correctWord: ans.question.correctWord,
      selectedWord: ans.selectedWord,
      isCorrect: ans.isCorrect,
      tapCount
    };
  });

  const totalTaps = sentences.reduce((sum, s) => sum + s.tapCount, 0);
  const averageTaps = sentences.length > 0
    ? Number((totalTaps / sentences.length).toFixed(1))
    : 0;

  const sentenceTapsSummary = sentences
    .map(s => `${s.questionNumber}번(${s.correctWord}): ${s.tapCount}회`)
    .join(' | ');

  return {
    sentences,
    totalTaps,
    averageTaps,
    sentenceTapsSummary
  };
}

export interface SendScriptResult {
  success: boolean;
  timestamp: string;
  totalTaps: number;
  averageTaps: number;
  url: string;
  message?: string;
}

/**
 * Send sentence-by-sentence tap frequency and averages to Google Apps Script Web App
 */
export async function sendTapDataToGoogleAppsScript(params: {
  answers: UserAnswer[];
  playCount: number;
  category: string;
  correctCount: number;
  wrongCount: number;
  customScriptUrl?: string;
}): Promise<SendScriptResult> {
  const targetUrl = params.customScriptUrl?.trim() || getAppsScriptUrl();

  if (!targetUrl) {
    throw new Error('Google Apps Script 웹 앱 URL이 설정되지 않았습니다.');
  }

  // Format local date-time: YYYY-MM-DD HH:mm:ss
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const analytics = calculateTapAnalytics(params.answers);

  const payload: AppsScriptPayload = {
    timestamp,
    playCount: params.playCount,
    play_count: params.playCount,
    category: params.category,
    totalQuestions: params.answers.length,
    total_questions: params.answers.length,
    correctCount: params.correctCount,
    correct_count: params.correctCount,
    wrongCount: params.wrongCount,
    wrong_count: params.wrongCount,
    totalTaps: analytics.totalTaps,
    total_taps: analytics.totalTaps,
    averageTaps: analytics.averageTaps,
    average_taps: analytics.averageTaps,
    sentenceTaps: analytics.sentences.map(s => s.tapCount),
    sentence_taps: analytics.sentenceTapsSummary,
    sentences: analytics.sentences,
    sentence_details: analytics.sentences,
    rows: analytics.sentences.map(s => ({
      timestamp,
      play_count: params.playCount,
      category: params.category,
      question_number: s.questionNumber,
      sentence: s.sentence,
      correct_word: s.correctWord,
      selected_word: s.selectedWord,
      is_correct: s.isCorrect ? 'O' : 'X',
      tap_count: s.tapCount,
      average_taps: analytics.averageTaps
    }))
  };

  /**
   * Google Apps Script Web Apps:
   * To prevent CORS preflight block from browsers, we send as text/plain with mode: 'no-cors'
   * The Apps Script `doPost(e)` receives the payload in `e.postData.contents`.
   */
  try {
    await fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    try {
      localStorage.setItem('vocarun_last_script_sync_time', timestamp);
      localStorage.setItem('vocarun_last_average_taps', String(analytics.averageTaps));
    } catch {
      // ignore local storage restrictions
    }

    return {
      success: true,
      timestamp,
      totalTaps: analytics.totalTaps,
      averageTaps: analytics.averageTaps,
      url: targetUrl,
      message: '각 문장별 탭 빈도와 평균이 구글 시트에 성공적으로 전송되었습니다.'
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : '알 수 없는 전송 오류가 발생했습니다.';
    throw new Error(`구글 시트 웹 앱 전송 실패: ${errorMsg}`);
  }
}
