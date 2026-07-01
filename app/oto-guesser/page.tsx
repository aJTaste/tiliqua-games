// app/oto-guesser/page.tsx
"use client";

import { playTone } from "@/lib/oto-guesser/audio";

import { useState, useCallback, useEffect } from "react";
import { GameState } from "@/lib/oto-guesser/types";
import {
  generateRandomMidi,
  evaluateAnswer,
} from "@/lib/oto-guesser/gameLogic";
import { getNoteInfo, noteToMidi } from "@/lib/shared/noteLogic";
import PianoKeyboard from "@/components/shared/PianoKeyboard";
import NoteSelector from "@/components/shared/NoteSelector";
import PlayButton from "@/components/oto-guesser/PlayButton";
import ResultPanel from "@/components/oto-guesser/ResultPanel";
import CategoryTitle from "@/components/ui/CategoryTitle";
import PageFooter from "@/components/ui/PageFooter";
import Button from "@/components/ui/Button";

type Mode = "keyboard" | "button";

function createInitialState(): GameState {
  return {
    phase: "playing",
    targetMidi: generateRandomMidi(),
    streak: 0,
    lastResult: null,
  };
}

export default function Page() {
  const [state, setState] = useState<GameState>({
    phase: "playing",
    targetMidi: noteToMidi("A", 4), // マウント前の仮の値（サーバー/クライアント不一致を防ぐ）
    streak: 0,
    lastResult: null,
  });
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("keyboard");
  const [selectedMidi, setSelectedMidi] = useState(() => noteToMidi("A", 4));

  useEffect(() => {
    setState(createInitialState());
    setMounted(true);
  }, []);

  const handleSubmit = useCallback(() => {
    const result = evaluateAnswer(selectedMidi, state.targetMidi);
    setState((prev) => ({
      ...prev,
      phase: "answered",
      lastResult: result,
      streak: result.semitoneDiff === 0 ? prev.streak + 1 : 0,
    }));
  }, [selectedMidi, state.targetMidi]);

  const handleNext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: "playing",
      targetMidi: generateRandomMidi(),
      lastResult: null,
    }));
  }, []);

  if (!mounted) return null;

  const targetFreq = getNoteInfo(state.targetMidi).freq;

  return (
    <main className="flex flex-col items-center bg-[#F8F9FA] h-[100dvh]">
      <header className="flex-shrink-0 w-full max-w-xs flex justify-between items-end px-1 pt-4 pb-3">
        <CategoryTitle category="Games" title="OtoGuesser" />
        {state.streak >= 2 && (
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[7px] tracking-[0.2em] text-[#bbb] uppercase">
              Streak
            </span>
            <span className="font-mono-game text-sm leading-none text-[#22c55e]">
              {state.streak}
            </span>
          </div>
        )}
      </header>

      <div className="w-full max-w-xs border-t border-[#e8e8e8]" />

      <div className="flex-1 flex flex-col items-center justify-center gap-5 w-full max-w-3xl px-5 overflow-y-auto py-4">
        {state.phase === "playing" ? (
          <>
            <PlayButton freq={targetFreq} />

            <div className="flex gap-2">
              <Button
                active={mode === "button"}
                onClick={() => setMode("button")}
                className="text-xs tracking-[0.2em] px-4 py-1.5"
              >
                ボタン
              </Button>
              <Button
                active={mode === "keyboard"}
                onClick={() => setMode("keyboard")}
                className="text-xs tracking-[0.2em] px-4 py-1.5"
              >
                鍵盤
              </Button>
            </div>

            <div className="w-full flex justify-center">
              {mode === "keyboard" ? (
                <PianoKeyboard
                  selectedMidi={selectedMidi}
                  onSelect={setSelectedMidi}
                />
              ) : (
                <NoteSelector
                  selectedMidi={selectedMidi}
                  onSelect={setSelectedMidi}
                />
              )}
            </div>
<Button
  onClick={() => playTone(getNoteInfo(noteToMidi("C", 4)).freq)}
  className="text-xs py-1.5"
>
  C4
</Button>

            <Button
              onClick={handleSubmit}
              className="w-40 py-2.5 text-xs tracking-[0.3em]"
            >
              回答する
            </Button>
          </>
        ) : (
          state.lastResult && (
            <ResultPanel result={state.lastResult} onNext={handleNext} />
          )
        )}
      </div>

      <PageFooter />
    </main>
  );
}
