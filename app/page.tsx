"use client";

import { AnswerResult } from "@/lib/types";
import { getRank } from "@/lib/gameLogic";

interface Props {
  score: number;
  round: number;
  maxRounds: number;
  lastResult: AnswerResult | null;
  phase: string;
  onNext: () => void;
  onRestart: () => void;
}

export default function ScoreBoard({
  score,
  round,
  maxRounds,
  lastResult,
  phase,
  onNext,
  onRestart,
}: Props) {
  const rank = lastResult ? getRank(lastResult.diff) : null;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xs">

      {/* ラウンド・スコア */}
      <div className="w-full flex justify-between items-end border-b border-[#e0e0e0] pb-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] tracking-[0.3em] text-[#aaa] uppercase">Round</span>
          <span className="font-mono-game text-base font-light text-[#1a1a1a]">
            {String(round).padStart(2, "0")} / {String(maxRounds).padStart(2, "0")}
          </span>
        </div>
        <div className="flex flex-col gap-0.5 items-end">
          <span className="text-[9px] tracking-[0.3em] text-[#aaa] uppercase">Score</span>
          <span className="font-mono-game text-base font-light text-[#1a1a1a]">
            {score.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 進捗ドット */}
      <div className="flex gap-2">
        {Array.from({ length: maxRounds }).map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i < round - 1
              ? "bg-[#1a1a1a]"
              : i === round - 1
                ? phase === "playing" ? "bg-[#aaa]" : "bg-[#1a1a1a]"
                : "bg-[#ddd]"
              }`}
          />
        ))}
      </div>

      {/* 判定結果 */}
      {lastResult && phase !== "playing" && phase !== "gameover" && (
        <div className="w-full flex flex-col gap-5">
          {/* ランク */}
          <div className="text-center">
            <span className="text-[9px] tracking-[0.3em] text-[#aaa] uppercase block mb-1">Result</span>
            <span className="text-sm tracking-[0.15em]" style={{ color: rank?.color }}>
              {rank?.label}
            </span>
          </div>

          {/* 色比較 */}
          <div className="flex items-stretch gap-4 justify-center">
            {/* あなたの色 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 border border-black/8"
                style={{ backgroundColor: lastResult.userHex }}
              />
              <span className="text-[9px] tracking-[0.2em] text-[#aaa] uppercase">あなた</span>
              <span className="font-mono-game text-[10px] text-[#666]">{lastResult.userHex}</span>
            </div>

            {/* 区切り線 */}
            <div className="flex items-center">
              <div className="h-full w-px bg-[#e0e0e0]" />
            </div>

            {/* 正解の色 */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 border border-black/8"
                style={{ backgroundColor: lastResult.actualHex }}
              />
              <span className="text-[9px] tracking-[0.2em] text-[#aaa] uppercase">正解</span>
              <span className="font-mono-game text-[10px] text-[#666]">{lastResult.actualHex}</span>
            </div>
          </div>

          {/* 数値詳細 */}
          <div className="w-full border-t border-[#e0e0e0] pt-4 flex flex-col gap-2">
            <div className="flex justify-between text-[10px]">
              <span className="tracking-[0.2em] text-[#aaa] uppercase">誤差</span>
              <span className="font-mono-game text-[#555]">{lastResult.diff}%</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="tracking-[0.2em] text-[#aaa] uppercase">獲得点</span>
              <span className="font-mono-game text-[#555]">+{lastResult.points.toLocaleString()} pt</span>
            </div>
          </div>

          {/* 次へ */}
          <button
            onClick={onNext}
            className="
              w-full py-3 border border-[#1a1a1a] text-[#1a1a1a]
              text-[10px] tracking-[0.3em] uppercase
              hover:bg-[#1a1a1a] hover:text-[#F8F9FA]
              active:scale-95 transition-all duration-200 mt-1
            "
          >
            次の色へ
          </button>
        </div>
      )}

      {/* ゲーム終了 */}
      {phase === "gameover" && (
        <div className="w-full flex flex-col items-center gap-6 pt-2">
          <div className="w-full border-t border-b border-[#e0e0e0] py-6 flex flex-col items-center gap-2">
            <span className="text-[9px] tracking-[0.3em] text-[#aaa] uppercase">Final Score</span>
            <span className="font-mono-game text-3xl font-light text-[#1a1a1a]">
              {score.toLocaleString()}
            </span>
            <span className="text-[10px] tracking-[0.15em] text-[#aaa]">points</span>
          </div>
          <button
            onClick={onRestart}
            className="
              w-full py-3 border border-[#1a1a1a] text-[#1a1a1a]
              text-[10px] tracking-[0.3em] uppercase
              hover:bg-[#1a1a1a] hover:text-[#F8F9FA]
              active:scale-95 transition-all duration-200
            "
          >
            もう一度挑戦する
          </button>
        </div>
      )}
    </div>
  );
}