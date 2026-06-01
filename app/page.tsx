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
      className="min-h-screen flex flex-col items-center justify-start pt-16 pb-20 px-6 gap-12"
      style={{ backgroundColor: "#F8F9FA" }}
    >
      {/* ヘッダー */}
      <header className="flex flex-col items-center gap-2">
        <p className="text-[9px] tracking-[0.5em] text-[#aaa] uppercase">
          Colour Identification Test
        </p>
        <h1 className="text-base tracking-[0.25em] text-[#1a1a1a] font-light">
          色番号判定
        </h1>
        <div className="w-8 h-px bg-[#ccc] mt-1" />
      </header>

      {/* 色表示 */}
      <ColorDisplay color={state.currentColor} revealed={revealed} />

      {/* 入力フォーム */}
      {state.phase === "playing" && (
        <HexInput onSubmit={handleAnswer} disabled={false} />
      )}

      {/* スコア・結果 */}
      <ScoreBoard
        score={state.score}
        round={state.round}
        maxRounds={MAX_ROUNDS}
        lastResult={state.lastResult}
        phase={state.phase}
        onNext={handleNext}
        onRestart={handleRestart}
      />

      {/* フッター */}
      <footer className="mt-auto pt-8">
        <p className="text-[9px] tracking-[0.3em] text-[#ccc] uppercase text-center">
          Created by あじとかげ |{" "}
        </p>
      </footer>
    </main>
  );
}