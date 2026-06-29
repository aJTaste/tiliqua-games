// app/iro-guesser/page.tsx
"use client";

import { useState, useCallback, useEffect } from "react";
import { GameState } from "@/lib/iro-guesser/types";
import {
  generateRandomColor,
  evaluateAnswer,
} from "@/lib/iro-guesser/gameLogic";
import ColorDisplay from "@/components/iro-guesser/ColorDisplay";
import HexInput from "@/components/iro-guesser/HexInput";
import ResultPanel from "@/components/iro-guesser/ResultPanel";
import CategoryTitle from "@/components/ui/CategoryTitle";
import PageFooter from "@/components/ui/PageFooter";

const PLACEHOLDER_COLOR = { hex: "#F8F9FA", r: 248, g: 249, b: 250 };

function createInitialState(): GameState {
  return {
    phase: "playing",
    currentColor: generateRandomColor(),
    streak: 0,
    lastResult: null,
  };
}

export default function HomePage() {
  const [state, setState] = useState<GameState>({
    phase: "playing",
    currentColor: PLACEHOLDER_COLOR,
    streak: 0,
    lastResult: null,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setState(createInitialState());
    setMounted(true);
  }, []);

  const handleAnswer = useCallback(
    (input: string) => {
      const result = evaluateAnswer(input, state.currentColor);
      if (!result) return;
      setState((prev) => ({
        ...prev,
        phase: "answered",
        lastResult: result,
        streak: result.deltaE <= 12 ? prev.streak + 1 : 0,
      }));
    },
    [state.currentColor],
  );

  const handleNext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      phase: "playing",
      currentColor: generateRandomColor(),
      lastResult: null,
    }));
  }, []);

  if (!mounted) return null;

  const revealed = state.phase === "answered";

  return (
    // style={{ height }} → h-[100dvh] に統一
    <main className="flex flex-col items-center bg-[#F8F9FA] h-[100dvh]">
      <header className="flex-shrink-0 w-full max-w-xs flex justify-between items-end px-1 pt-4 pb-3">
        <CategoryTitle category="Games" title="IroGuesser" />
        {state.streak >= 2 && (
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[7px] tracking-[0.2em] text-[#bbb] uppercase">
              Streak
            </span>
            {/* style={{ color }} → text-[#22c55e] に統一 */}
            <span className="font-mono-game text-sm leading-none text-[#22c55e]">
              {state.streak}
            </span>
          </div>
        )}
      </header>

      <div className="w-full max-w-xs border-t border-[#e8e8e8]" />

      <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full max-w-xs px-5 overflow-y-auto py-3">
        <ColorDisplay
          color={state.currentColor}
          revealed={revealed}
          compact={revealed}
        />
        {state.phase === "playing" && (
          <HexInput onSubmit={handleAnswer} disabled={false} />
        )}
        {state.phase === "answered" && state.lastResult && (
          <ResultPanel result={state.lastResult} onNext={handleNext} />
        )}
      </div>

      <PageFooter />
    </main>
  );
}
