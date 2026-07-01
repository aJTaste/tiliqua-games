// lib/oto-guesser/gameLogic.ts
import { AnswerResult, RankInfo } from "@/lib/oto-guesser/types";
import { noteToMidi } from "@/lib/shared/noteLogic";

// 出題範囲はOtoGuesser専用（鍵盤の表示範囲=C0〜B8とは別）
const TARGET_MIN_OCTAVE = 2;
const TARGET_MAX_OCTAVE = 6;
const MIN_MIDI = noteToMidi("C", TARGET_MIN_OCTAVE); // 36
const MAX_MIDI = noteToMidi("C", TARGET_MAX_OCTAVE); // 84

/** C2〜C6の範囲でランダムなMIDIノート番号を返す */
export function generateRandomMidi(): number {
  return MIN_MIDI + Math.floor(Math.random() * (MAX_MIDI - MIN_MIDI + 1));
}

/** 半音差からランクを判定する */
export function getRank(semitoneDiff: number): RankInfo {
  if (semitoneDiff === 0)
    return { grade: "S", label: "完璧な音感です。", color: "#22c55e" };
  if (semitoneDiff % 12 === 0)
    return {
      grade: "S-",
      label: "音名は完璧、オクターブだけ違います。",
      color: "#4ade80",
    };
  if (semitoneDiff <= 1)
    return { grade: "A+", label: "非常に近い！", color: "#84cc16" };
  if (semitoneDiff <= 2)
    return { grade: "A", label: "良い精度です。", color: "#eab308" };
  if (semitoneDiff <= 4)
    return { grade: "B", label: "まずまずです。", color: "#f97316" };
  if (semitoneDiff <= 7)
    return { grade: "C", label: "少し離れています。", color: "#ef4444" };
  return { grade: "D", label: "かけ離れています。", color: "#dc2626" };
}

export function evaluateAnswer(
  guessMidi: number,
  targetMidi: number,
): AnswerResult {
  const semitoneDiff = Math.abs(targetMidi - guessMidi);
  const rank = getRank(semitoneDiff);
  return { targetMidi, guessMidi, semitoneDiff, rank };
}
