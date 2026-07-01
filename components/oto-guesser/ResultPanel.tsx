// components/oto-guesser/ResultPanel.tsx
"use client";

import { AnswerResult } from "@/lib/oto-guesser/types";
import { getNoteInfo } from "@/lib/shared/noteLogic";
import Button from "@/components/ui/Button";
import PlayButton from "@/components/oto-guesser/PlayButton";

interface Props {
  result: AnswerResult;
  onNext: () => void;
}

export default function ResultPanel({ result, onNext }: Props) {
  const { rank, semitoneDiff, targetMidi, guessMidi } = result;
  const targetNote = getNoteInfo(targetMidi);
  const guessNote = getNoteInfo(guessMidi);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex items-center justify-center gap-5">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[7px] tracking-[0.2em] text-[#bbb] uppercase">
            あなた
          </span>
          <span className="font-mono-game text-lg font-light text-[#1a1a1a]">
            {guessNote.name}
            {guessNote.octave}
          </span>
          <span className="font-mono-game text-[8px] text-[#aaa]">
            {guessNote.freq.toFixed(1)} Hz
          </span>
        </div>

        <div className="flex flex-col items-center gap-0.5 px-2">
          <span
            className="font-mono-game text-2xl font-light leading-none"
            style={{ color: rank.color }}
          >
            {rank.grade}
          </span>
          <span className="text-[7px] tracking-widest text-[#bbb]">
            {semitoneDiff}半音差
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[7px] tracking-[0.2em] text-[#bbb] uppercase">
            正解
          </span>
          <span className="font-mono-game text-lg font-light text-[#1a1a1a]">
            {targetNote.name}
            {targetNote.octave}
          </span>
          <span className="font-mono-game text-[8px] text-[#aaa]">
            {targetNote.freq.toFixed(1)} Hz
          </span>
        </div>
      </div>

      <p
        className="text-center text-[9px] tracking-[0.12em]"
        style={{ color: rank.color }}
      >
        {rank.label}
      </p>

      <div className="w-full border-t border-[#ebebeb]" />

      <div className="flex justify-center">
        <PlayButton freq={targetNote.freq} />
      </div>

      <Button
        onClick={onNext}
        className="w-full py-2.5 text-[9px] tracking-[0.3em]"
      >
        次の音へ
      </Button>
    </div>
  );
}
