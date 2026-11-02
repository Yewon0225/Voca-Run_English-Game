import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// In-memory token cache (DO NOT store in localStorage per security guidelines)
let inMemoryAccessToken: string | null = null;

export function getCachedAccessToken(): string | null {
  return inMemoryAccessToken;
}

export function setCachedAccessToken(token: string | null): void {
  inMemoryAccessToken = token;
}

export interface GameLogEntry {
  playCount: number;
  correctCount: number;
  wrongCount: number;
  category: string;
}

export interface SheetLogResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  updatedRange: string;
  rowValues: (string | number)[];
}

const SPREADSHEET_ID_KEY = 'vocarun_spreadsheet_id';

export function getSavedSpreadsheetId(): string | null {
  try {
    return localStorage.getItem(SPREADSHEET_ID_KEY);
  } catch {
    return null;
  }
}

export function saveSpreadsheetId(id: string): void {
  try {
    localStorage.setItem(SPREADSHEET_ID_KEY, id);
  } catch {
    // ignore
  }
}

export function clearSavedSpreadsheetId(): void {
  try {
    localStorage.removeItem(SPREADSHEET_ID_KEY);
  } catch {
    // ignore
  }
}

/**
 * Sign in with Google Sheets scope
 */
export async function signInWithGoogle(): Promise<{ user: User; accessToken: string }> {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/spreadsheets');
  provider.setCustomParameters({
    prompt: 'select_account'
  });

  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken;

  if (!token) {
    throw new Error('구글 인증 토큰(OAuth Access Token)을 가져오지 못했습니다.');
  }

  setCachedAccessToken(token);
  return { user: result.user, accessToken: token };
}

/**
 * Sign out and clear in-memory token
 */
export async function signOutGoogle(): Promise<void> {
  await signOut(auth);
  setCachedAccessToken(null);
}

/**
 * Create a new Google Spreadsheet with the exact schema headers:
 * timestamp,play_count,correct_count,wrong_count,category
 */
export async function createGameRecordsSpreadsheet(accessToken: string): Promise<{ id: string; url: string }> {
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: '보카런 (Voca Run) - 중1 영어 학습 기록장'
      },
      sheets: [
        {
          properties: {
            title: 'Sheet1',
            gridProperties: {
              frozenRowCount: 1
            }
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: [
                    { userEnteredValue: { stringValue: 'timestamp' } },
                    { userEnteredValue: { stringValue: 'play_count' } },
                    { userEnteredValue: { stringValue: 'correct_count' } },
                    { userEnteredValue: { stringValue: 'wrong_count' } },
                    { userEnteredValue: { stringValue: 'category' } }
                  ]
                }
              ]
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`스프레드시트 생성 실패 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId as string;
  saveSpreadsheetId(spreadsheetId);
  return {
    id: spreadsheetId,
    url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
  };
}

/**
 * Append game record to Google Sheets
 * Matches user's exact attachment schema:
 * timestamp,play_count,correct_count,wrong_count,category
 */
export async function appendGameRecordToSheet(
  accessToken: string,
  entry: GameLogEntry,
  targetSpreadsheetId?: string
): Promise<SheetLogResult> {
  let spreadsheetId = targetSpreadsheetId || getSavedSpreadsheetId();

  // If no spreadsheet ID exists yet, create a fresh one with headers
  if (!spreadsheetId) {
    const newSheet = await createGameRecordsSpreadsheet(accessToken);
    spreadsheetId = newSheet.id;
  }

  // Format local timestamp: YYYY-MM-DD HH:mm:ss
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const formattedTimestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const rowValues = [
    formattedTimestamp,
    entry.playCount,
    entry.correctCount,
    entry.wrongCount,
    entry.category
  ];

  // Try appending row to Sheet1
  const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:E:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
  
  let response = await fetch(appendUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range: 'Sheet1!A:E',
      majorDimension: 'ROWS',
      values: [rowValues]
    })
  });

  // If spreadsheet was not found (e.g. 404 deleted by user or invalid id), re-create and retry
  if (response.status === 404) {
    const newSheet = await createGameRecordsSpreadsheet(accessToken);
    spreadsheetId = newSheet.id;
    const retryUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:E:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;
    response = await fetch(retryUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range: 'Sheet1!A:E',
        majorDimension: 'ROWS',
        values: [rowValues]
      })
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`구글 시트 기록 저장 실패 (${response.status}): ${errorText}`);
  }

  const resultData = await response.json();

  return {
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    updatedRange: resultData.updates?.updatedRange || 'Sheet1!A:E',
    rowValues
  };
}
