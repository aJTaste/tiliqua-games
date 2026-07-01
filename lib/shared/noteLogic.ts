// lib/hz-henkan/noteLogic.ts
import { NoteName, NoteInfo, KeyData } from "@/lib/shared/types";

export const NOTE_NAMES: NoteName[] = [
  "ド",
  "ド#",
  "レ",
  "レ#",
  "ミ",
  "ファ",
  "ファ#",
  "ソ",
  "ソ#",
  "ラ",
  "ラ#",
  "シ",
];

export const MIN_OCTAVE = 0;
export const MAX_OCTAVE = 8; // 表示可能な範囲：C0〜B8
export const VISIBLE_OCTAVES = 3; // 同時に表示するオクターブ数
export const WHITE_KEYS_PER_OCTAVE = 7;
export const TOTAL_OCTAVES = MAX_OCTAVE - MIN_OCTAVE + 1;
export const VISIBLE_WHITE_KEYS = VISIBLE_OCTAVES * WHITE_KEYS_PER_OCTAVE; // 21
export const TOTAL_WHITE_KEYS = TOTAL_OCTAVES * WHITE_KEYS_PER_OCTAVE;

/** MIDIノート番号 → 周波数（A4=69=440Hz基準） */
export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/** 音名＋オクターブ → MIDIノート番号 */
export function noteToMidi(name: NoteName, octave: number): number {
  return NOTE_NAMES.indexOf(name) + (octave + 1) * 12;
}

/** MIDIノート番号 → 音名・オクターブ・周波数 */
export function getNoteInfo(midi: number): NoteInfo {
  const name = NOTE_NAMES[((midi % 12) + 12) % 12];
  const octave = Math.floor(midi / 12) - 1;
  return { midi, name, octave, freq: midiToFreq(midi) };
}

/** C0〜B8 の全鍵盤データを生成する */
export function generateKeys(): KeyData[] {
  const keys: KeyData[] = [];
  let whiteIndex = -1;
  for (let octave = MIN_OCTAVE; octave <= MAX_OCTAVE; octave++) {
    for (const name of NOTE_NAMES) {
      const isBlack = name.includes("#");
      if (!isBlack) whiteIndex++;
      keys.push({
        midi: noteToMidi(name, octave),
        name,
        octave,
        isBlack,
        whiteIndex,
      });
    }
  }
  return keys;
}
