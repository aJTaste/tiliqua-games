"use client";

import { useState, useCallback, useEffect } from "react";
import { GameState } from "@/lib/types";
import { generateRandomColor, evaluateAnswer } from "@/lib/gameLogic";
import ColorDisplay from "@/components/ColorDisplay";
import HexInput from "@/components/HexInput";
import ScoreBoard from "@/components/ScoreBoard";

const MAX_ROUNDS = 5;
const PLACEHOLDER_COLOR = { hex: "#F8F9FA", r: 248, g: 249, b: 250 };

function createInitialState(): GameState {
  return {
    phase: "playing",
    currentColor: generateRandomColor(),
    userInput: "",
    score: 0,
    round: 1,
    maxRounds: MAX_ROUNDS,
    lastResult: null,
  };
}

export default function HomePage() {
  const [state, setState] = useState<GameState>({
    phase: "playing",
    currentColor: PLACEHOLDER_COLOR,
    userInput: "",
    score: 0,
    round: 1,
    maxRounds: MAX_ROUNDS,
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
      setState((prev: GameState) => ({
        ...prev,
        phase: result.correct ? "correct" : "wrong",
        userInput: input,
        score: prev.score + result.points,
        lastResult: result,
      }));
    },
    [state.currentColor]
  );

  const handleNext = useCallback(() => {
    setState((prev: GameState) => {
      const nextRound = prev.round + 1;
      if (nextRound > MAX_ROUNDS) {
        return { ...prev, phase: "gameover" };
      }
      return {
        ...prev,
        phase: "playing",
        currentColor: generateRandomColor(),
        userInput: "",
        round: nextRound,
        lastResult: null,
      };
    });
  }, []);

  const handleRestart = useCallback(() => {
    setState(createInitialState());
  }, []);

  const revealed =
    state.phase === "correct" ||
    state.phase === "wrong" ||
    state.phase === "gameover";

  if (!mounted) return null;

  return (
    <main
      className="flex flex-col items-center px-6 py-4"
      style={{ height: "100dvh", backgroundColor: "#F8F9FA" }}
    >
      {/* ヘッダー */}
      <header className="flex-shrink-0 flex flex-col items-center gap-1">
        <p className="text-[8px] tracking-[0.5em] text-[#aaa] uppercase">
          16進数カラーコード
        </p>
        <h1 className="text-sm tracking-[0.25em] text-[#1a1a1a] font-light">
          IroGuesser
        </h1>
        <div className="w-8 h-px bg-[#ccc]" />
      </header>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full max-w-xs">
        <ColorDisplay color={state.currentColor} revealed={revealed} />

        {state.phase === "playing" && (
          <HexInput onSubmit={handleAnswer} disabled={false} />
        )}

        <ScoreBoard
          score={state.score}
          round={state.round}
          maxRounds={MAX_ROUNDS}
          lastResult={state.lastResult}
          phase={state.phase}
          onNext={handleNext}
          onRestart={handleRestart}
        />
      </div>

      {/* フッター */}
      <footer className="flex-shrink-0">
        <p className="text-[8px] tracking-[0.3em] text-[#ccc] uppercase text-center">
          Created by あじとかげ
        </p>
      </footer>
    </main>
  );
}