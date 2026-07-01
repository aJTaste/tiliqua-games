// lib/oto-guesser/types.ts
export type GamePhase = "playing" | "answered";

export interface RankInfo {
  grade: string;
  label: string;
  color: string;
}

export interface AnswerResult {
  targetMidi: number;
  guessMidi: number;
  semitoneDiff: number; // |targetMidi - guessMidi|
  rank: RankInfo;
}

export interface GameState {
  phase: GamePhase;
  targetMidi: number;
  streak: number;
  lastResult: AnswerResult | null;
}
