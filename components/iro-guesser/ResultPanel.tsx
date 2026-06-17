"use client";

import { AnswerResult } from "@/lib/iro-guesser/types";

interface Props {
    result: AnswerResult;
    onNext: () => void;
}

function ChannelBar({
    label,
    actual,
    user,
    barColor,
}: {
    label: string;
    actual: number;
    user: number;
    barColor: string;
}) {
    const actualPct = (actual / 255) * 100;
    const userPct = (user / 255) * 100;
    const diff = user - actual;
    const absDiff = Math.abs(diff);
    const diffColor = absDiff <= 15 ? "#22c55e" : absDiff <= 40 ? "#f97316" : "#ef4444";
    const diffStr = diff > 0 ? `+${diff}` : diff === 0 ? "±0" : `${diff}`;

    return (
        <div className="flex items-center gap-2 w-full">
            <span className="font-mono-game text-[9px] text-[#aaa] w-3 shrink-0">{label}</span>
            <div className="flex-1 relative h-1.5 bg-[#e8e8e8]">
                {/* 正解バー */}
                <div
                    className="absolute left-0 top-0 h-full"
                    style={{ width: `${actualPct}%`, backgroundColor: barColor }}
                />
                {/* ユーザー位置マーカー（縦線） */}
                <div
                    className="absolute top-1/2 w-px h-3"
                    style={{
                        left: `clamp(0px, ${userPct}%, calc(100% - 1px))`,
                        transform: "translateY(-50%)",
                        backgroundColor: "#444",
                    }}
                />
            </div>
            <span className="font-mono-game text-[9px] text-[#666] w-6 text-right shrink-0">
                {actual}
            </span>
            <span
                className="font-mono-game text-[9px] w-8 text-right shrink-0"
                style={{ color: diffColor }}
            >
                {diffStr}
            </span>
        </div>
    );
}

export default function ResultPanel({ result, onNext }: Props) {
    const { rank, deltaE, actualColor, userColor, userHex, actualHex } = result;

    const channels = [
        { label: "R", actual: actualColor.r, user: userColor.r, barColor: "#d95555" },
        { label: "G", actual: actualColor.g, user: userColor.g, barColor: "#4caf7a" },
        { label: "B", actual: actualColor.b, user: userColor.b, barColor: "#4a8fd9" },
    ];

    const sorted = [...channels].sort((a, b) => b.actual - a.actual);
    const maxVal = sorted[0].actual;
    const minVal = sorted[2].actual;
    const chMap: Record<string, string> = { R: "赤", G: "緑", B: "青" };
    const rangeNote =
        maxVal - minVal < 20
            ? "ほぼ無彩色（グレー系）"
            : `${chMap[sorted[0].label]}最強 · ${chMap[sorted[2].label]}最弱`;

    return (
        <div className="w-full flex flex-col gap-3">

            {/* 色比較 + ランク */}
            <div className="flex items-center justify-center gap-5">
                <div className="flex flex-col items-center gap-1">
                    <div
                        className="w-10 h-10 border border-black/8"
                        style={{ backgroundColor: userHex }}
                    />
                    <span className="text-[7px] tracking-[0.2em] text-[#bbb] uppercase">あなた</span>
                    <span className="font-mono-game text-[8px] text-[#aaa]">{userHex}</span>
                </div>

                <div className="flex flex-col items-center gap-0.5 px-2">
                    <span
                        className="font-mono-game text-2xl font-light leading-none"
                        style={{ color: rank.color }}
                    >
                        {rank.grade}
                    </span>
                    <span className="text-[7px] tracking-widest text-[#bbb]">ΔE {deltaE}</span>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <div
                        className="w-10 h-10 border border-black/8"
                        style={{ backgroundColor: actualHex }}
                    />
                    <span className="text-[7px] tracking-[0.2em] text-[#bbb] uppercase">正解</span>
                    <span className="font-mono-game text-[8px] text-[#aaa]">{actualHex}</span>
                </div>
            </div>

            <p className="text-center text-[9px] tracking-[0.12em]" style={{ color: rank.color }}>
                {rank.label}
            </p>

            <div className="w-full border-t border-[#ebebeb]" />

            {/* 色成分バー */}
            <div className="flex flex-col gap-1.5 w-full">
                <div className="flex justify-between items-center">
                    <span className="text-[7px] tracking-[0.25em] text-[#bbb] uppercase">色成分</span>
                    <span className="text-[7px] text-[#c8c8c8]">{rangeNote}</span>
                </div>
                {channels.map((ch) => (
                    <ChannelBar key={ch.label} {...ch} />
                ))}
                <p className="text-right text-[6px] text-[#d4d4d4]">
                    バー = 正解 · 縦線 = あなた · 右端 = 差分
                </p>
            </div>

            <div className="w-full border-t border-[#ebebeb]" />

            <button
                onClick={onNext}
                className="
                    w-full py-2.5 border border-[#1a1a1a] text-[#1a1a1a]
                    text-[9px] tracking-[0.3em] uppercase
                    hover:bg-[#1a1a1a] hover:text-[#F8F9FA]
                    active:scale-95 transition-all duration-200
                "
            >
                次の色へ
            </button>
        </div>
    );
}