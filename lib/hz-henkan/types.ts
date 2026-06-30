// lib/hz-henkan/types.ts
export type NoteName =
  | "C"
  | "C#"
  | "D"
  | "D#"
  | "E"
  | "F"
  | "F#"
  | "G"
  | "G#"
  | "A"
  | "A#"
  | "B";

export interface NoteInfo {
  midi: number;
  name: NoteName;
  octave: number;
  freq: number;
}

export interface KeyData {
  midi: number;
  name: NoteName;
  octave: number;
  isBlack: boolean;
  whiteIndex: number; // 白鍵の通し番号（黒鍵は直前の白鍵の番号を流用）
}
