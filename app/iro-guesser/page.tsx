"use client";

import { useState, useCallback, useEffect } from "react";
import { GameState } from "@/lib/iro-guesser/types";
import { generateRandomColor, evaluateAnswer } from "@/lib/iro-guesser/gameLogic";
import ColorDisplay from "@/components/iro-guesser/ColorDisplay";
import HexInput from "@/components/iro-guesser/HexInput";
import ResultPanel from "@/components/iro-guesser/ResultPanel";

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
        // A以上で連続正解カウント、それ以外はリセット
        streak: result.deltaE <= 12 ? prev.streak + 1 : 0,
      }));
    },
    [state.currentColor]
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
    <main
      className="flex flex-col items-center bg-[#F8F9FA]"
      style={{ height: "100dvh" }}
    >
      {/* ヘッダー */}
      <header className="flex-shrink-0 w-full max-w-xs flex justify-between items-end px-1 pt-4 pb-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-[7px] tracking-[0.5em] text-[#bbb] uppercase">
            Games
          </p>
          <h1 className="text-xs tracking-[0.25em] text-[#1a1a1a] font-light">
            IroGuesser
          </h1>
        </div>
        {state.streak >= 2 && (
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[7px] tracking-[0.2em] text-[#bbb] uppercase">Streak</span>
            <span className="font-mono-game text-sm leading-none" style={{ color: "#22c55e" }}>
              {state.streak}
            </span>
          </div>
        )}
      </header>
      <div className="w-full max-w-xs border-t border-[#e8e8e8]" />

      {/* メインコンテンツ */}
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

      {/* フッター */}
      <div className="w-full max-w-xs border-t border-[#e8e8e8]" />
      <footer className="flex-shrink-0 py-2">
        <p className="text-[7px] tracking-[0.3em] text-[#ccc] uppercase text-center">
          Created by あじとかげ
        </p>
      </footer>
    </main>
  );
}
