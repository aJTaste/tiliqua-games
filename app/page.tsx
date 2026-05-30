"use client";

import { useState, useCallback } from "react";
import { GameState } from "@/lib/types";
import { generateRandomColor, evaluateAnswer } from "@/lib/gameLogic";
import ColorDisplay from "@/components/ColorDisplay";
import HexInput from "@/components/HexInput";
import ScoreBoard from "@/components/ScoreBoard";

const MAX_ROUNDS = 5;

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
  const [state, setState] = useState<GameState>(createInitialState);

  const handleAnswer = useCallback(
    (input: string) => {
      const result = evaluateAnswer(input, state.currentColor);
      setState((prev) => ({
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
    setState((prev) => {
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

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6 gap-8">
      <h1 className="text-3xl font-bold tracking-tight text-white">
        🎨 Color Hex Quiz
      </h1>

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
    </main>
  );
}