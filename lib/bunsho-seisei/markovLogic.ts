// lib/bunsho-seisei/markovLogic.ts
import {
  ChainOrder,
  MarkovTable,
  OrderedTables,
  QuestionReply,
} from "@/lib/bunsho-seisei/types";

const SENTENCE_ENDERS = ["。", "！", "？"];
const COPY_LIMIT = 20;

/** 指定した次数1つ分の連鎖表を構築する（内部ヘルパー） */
function buildSingleOrderTable(
  chars: string[],
  order: number,
): Record<string, string[]> {
  const table: Record<string, string[]> = {};
  for (let i = 0; i <= chars.length - order - 1; i++) {
    const key = chars.slice(i, i + order).join("");
    const next = chars[i + order];
    if (!table[key]) table[key] = [];
    table[key].push(next);
  }
  return table;
}

/** 元テキストから、指定した次数を頂点にバックオフ用の連鎖表一式を構築する */
export function buildMarkovTable(text: string, order: ChainOrder): MarkovTable {
  const chars = Array.from(text);
  const tables: OrderedTables = {};

  for (let n = order; n >= 1; n--) {
    tables[n] = buildSingleOrderTable(chars, n);
  }

  const startKeys: string[] = [];
  for (let i = 0; i <= chars.length - order; i++) {
    const isTextStart = i === 0;
    const isAfterSentenceEnd = i > 0 && SENTENCE_ENDERS.includes(chars[i - 1]);
    if (isTextStart || isAfterSentenceEnd) {
      startKeys.push(chars.slice(i, i + order).join(""));
    }
  }

  if (startKeys.length === 0) {
    startKeys.push(...Object.keys(tables[order]));
  }

  return { order, tables, startKeys };
}

/** バックオフ方式：指定キーに対する次の文字候補を探す */
function findCandidates(tables: OrderedTables, key: string): string[] | null {
  for (let n = key.length; n >= 1; n--) {
    const shortKey = key.slice(-n);
    const candidates = tables[n]?.[shortKey];
    if (candidates && candidates.length > 0) return candidates;
  }
  return null;
}

/** 連鎖表をランダムに巡回して文章を生成する共通ロジック（開始点は呼び出し元が決める） */
function runChain(
  markov: MarkovTable,
  startKey: string,
  length: number,
): string {
  const { tables, order, startKeys } = markov;
  const pickStart = () =>
    startKeys[Math.floor(Math.random() * startKeys.length)];

  let current = startKey;
  let result = current;
  let copyStreak = 0;

  for (let i = 0; i < length - current.length; i++) {
    const candidates = findCandidates(tables, current);

    if (!candidates) {
      current = pickStart();
      result += current;
      copyStreak = 0;
      continue;
    }

    copyStreak = candidates.length === 1 ? copyStreak + 1 : 0;

    if (copyStreak >= COPY_LIMIT) {
      current = pickStart();
      result += current;
      copyStreak = 0;
      continue;
    }

    const next = candidates[Math.floor(Math.random() * candidates.length)];
    result += next;
    current = (current + next).slice(-order);

    if (SENTENCE_ENDERS.includes(next) && result.length >= length * 0.6) {
      break;
    }
  }

  return result;
}

/** 構築済みの連鎖表から完全ランダムな文章を生成する（従来通り） */
export function generateText(markov: MarkovTable, length: number): string {
  if (markov.startKeys.length === 0) return "";
  const start =
    markov.startKeys[Math.floor(Math.random() * markov.startKeys.length)];
  return runChain(markov, start, length);
}

/** 質問文の中に、元テキストにも登場する文字列がないか探す（見つかった手がかりを返す） */
function findRelevantStart(
  markov: MarkovTable,
  question: string,
): string | null {
  const qChars = Array.from(question);

  // 長い一致ほど「話が噛み合っている」ように見えるので、長い文字列から順に探す
  for (let len = markov.order; len >= 1; len--) {
    const table = markov.tables[len];
    if (!table) continue;
    for (let i = 0; i <= qChars.length - len; i++) {
      const key = qChars.slice(i, i + len).join("");
      if (table[key] && table[key].length > 0) return key;
    }
  }
  return null;
}

/** 質問文に対して「それっぽい」返答を生成する（ELIZA方式） */
export function generateReply(
  markov: MarkovTable,
  question: string,
  length: number,
): QuestionReply {
  if (markov.startKeys.length === 0) return { matched: null, body: "" };

  const found = findRelevantStart(markov, question);
  const start =
    found ??
    markov.startKeys[Math.floor(Math.random() * markov.startKeys.length)];
  const body = runChain(markov, start, length);

  return { matched: found, body };
}

/** 入力テキストが指定した連鎖長に対して十分な長さかを判定する */
export function isTextLongEnough(text: string, order: ChainOrder): boolean {
  return Array.from(text).length > order + 1;
}
