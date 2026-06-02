"use client";

import { Color } from "@/lib/types";

interface Props {
    color: Color;
    revealed: boolean;
    compact?: boolean;
}

export default function ColorDisplay({ color, revealed, compact = false }: Props) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative">
                <div
                    style={{ backgroundColor: color.hex }}
                    className={compact ? "w-24 h-24" : "w-36 h-36 sm:w-44 sm:h-44"}
                    aria-label={revealed ? `正解の色: ${color.hex}` : "この色のHEXコードは？"}
                />
                <div className="absolute inset-0 border border-black/8 pointer-events-none" />
            </div>
            <div className="h-5 flex items-center justify-center">
                {revealed ? (
                    <span className="font-mono-game text-base font-light tracking-[0.2em] text-[#1a1a1a]">
                        {color.hex.toUpperCase()}
                    </span>
                ) : (
                    <span className="text-[9px] tracking-[0.3em] text-[#bbb] uppercase">
                        カラーコードを入力
                    </span>
                )}
            </div>
        </div>
    );
}