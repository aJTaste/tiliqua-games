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
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            {/* スコアとラウンド */}
            <div className="flex justify-between w-full text-sm text-gray-400">
                <span>ラウンド {round} / {maxRounds}</span>
                <span className="font-bold text-white">{score.toLocaleString()} pt</span>
            </div>

            {/* プログレスバー */}
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${(round / maxRounds) * 100}%` }}
                />
            </div>

            {/* 直前の結果 */}
            {lastResult && phase !== "playing" && (
                <div className="w-full bg-gray-800 rounded-2xl p-4 flex flex-col gap-3">
                    <div className="text-center text-xl font-bold" style={{ color: rank?.color }}>
                        {rank?.label}
                    </div>

                    {/* 色の比較 */}
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className="w-12 h-12 rounded-lg border-2 border-gray-600"
                                style={{ backgroundColor: lastResult.userHex }}
                            />
                            <span className="text-xs text-gray-400 font-mono">あなた</span>
                            <span className="text-xs font-mono text-white">{lastResult.userHex}</span>
                        </div>
                        <div className="text-gray-500">vs</div>
                        <div className="flex flex-col items-center gap-1">
                            <div
                                className="w-12 h-12 rounded-lg border-2 border-yellow-500"
                                style={{ backgroundColor: lastResult.actualHex }}
                            />
                            <span className="text-xs text-gray-400 font-mono">正解</span>
                            <span className="text-xs font-mono text-white">{lastResult.actualHex}</span>
                        </div>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">誤差</span>
                        <span className="font-mono text-white">{lastResult.diff}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-400">獲得ポイント</span>
                        <span className="font-bold text-yellow-400">+{lastResult.points.toLocaleString()} pt</span>
                    </div>
                </div>
            )}

            {/* ゲームオーバー画面 */}
            {phase === "gameover" && (
                <div className="w-full text-center bg-gray-800 rounded-2xl p-6 flex flex-col gap-4">
                    <p className="text-2xl font-bold text-white">ゲーム終了！</p>
                    <p className="text-4xl font-bold text-yellow-400">{score.toLocaleString()} pt</p>
                    <button
                        onClick={onRestart}
                        className="mt-2 px-8 py-3 rounded-xl text-white font-bold text-lg
              bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all"
                    >
                        もう一度
                    </button>
                </div>
            )}

            {/* 次へボタン */}
            {(phase === "correct" || phase === "wrong") && (
                <button
                    onClick={onNext}
                    className="w-full px-8 py-3 rounded-xl text-white font-bold text-lg
            bg-gray-700 hover:bg-gray-600 active:scale-95 transition-all"
                >
                    次に進む →
                </button>
            )}
        </div>
    );
}