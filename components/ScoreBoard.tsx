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
    score = 0,
    round = 1,
    maxRounds = 5,
    lastResult,
    phase,
    onNext,
    onRestart,
}: Props) {
    const rank = lastResult ? getRank(lastResult.diff) : null;

    return (
        <div className="flex flex-col items-center gap-2 w-full max-w-xs">

            {/* ラウンド・スコア */}
            <div className="w-full flex justify-between items-end border-b border-[#e0e0e0] pb-2">
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
                <div className="w-full flex flex-col gap-2 pt-1">
                    {/* ランク */}
                    <p className="text-center text-xs tracking-[0.12em]" style={{ color: rank?.color }}>
                        {rank?.label}
                    </p>

                    {/* 色比較 */}
                    <div className="flex items-stretch gap-4 justify-center">
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className="w-10 h-10 border border-black/8"
                                style={{ backgroundColor: lastResult.userHex }}
                            />
                            <span className="text-[8px] tracking-[0.2em] text-[#aaa] uppercase">あなた</span>
                            <span className="font-mono-game text-[9px] text-[#666]">{lastResult.userHex}</span>
                        </div>
                        <div className="w-px bg-[#e0e0e0]" />
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className="w-10 h-10 border border-black/8"
                                style={{ backgroundColor: lastResult.actualHex }}
                            />
                            <span className="text-[8px] tracking-[0.2em] text-[#aaa] uppercase">正解</span>
                            <span className="font-mono-game text-[9px] text-[#666]">{lastResult.actualHex}</span>
                        </div>
                    </div>

                    {/* 数値詳細 */}
                    <div className="w-full border-t border-[#e0e0e0] pt-2 flex flex-col gap-1.5">
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
              w-full py-2.5 border border-[#1a1a1a] text-[#1a1a1a]
              text-[10px] tracking-[0.3em] uppercase
              hover:bg-[#1a1a1a] hover:text-[#F8F9FA]
              active:scale-95 transition-all duration-200
            "
                    >
                        次に進む
                    </button>
                </div>
            )}

            {/* ゲーム終了 */}
            {phase === "gameover" && (
                <div className="w-full flex flex-col items-center gap-3 pt-1">
                    <div className="w-full border-t border-b border-[#e0e0e0] py-4 flex flex-col items-center gap-1">
                        <span className="text-[8px] tracking-[0.3em] text-[#aaa] uppercase">Final Score</span>
                        <span className="font-mono-game text-3xl font-light text-[#1a1a1a]">
                            {score.toLocaleString()}
                        </span>
                        <span className="text-[9px] tracking-[0.15em] text-[#aaa]">points</span>
                    </div>
                    <button
                        onClick={onRestart}
                        className="
              w-full py-2.5 border border-[#1a1a1a] text-[#1a1a1a]
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