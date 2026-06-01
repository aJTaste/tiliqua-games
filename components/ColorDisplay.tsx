"use client";

import { Color } from "@/lib/types";

interface Props {
    color: Color;
    revealed: boolean;
}

export default function ColorDisplay({ color, revealed }: Props) {
    return (
        <div className="flex flex-col items-center gap-6">
            {/* 色見本 */}
            <div className="relative">
                <div
                    style={{ backgroundColor: color.hex }}
                    className="w-52 h-52"
                    aria-label={revealed ? `正解の色: ${color.hex}` : "この色のHEXコードは？"}
                />
                {/* 細い枠線 */}
                <div className="absolute inset-0 border border-black/8 pointer-events-none" />
            </div>

            {/* HEXコード表示 */}
            <div className="h-8 flex items-center justify-center">
                {revealed ? (
                    <span className="font-mono-game text-xl font-light tracking-[0.2em] text-[#1a1a1a]">
                        {color.hex.toUpperCase()}
                    </span>
                ) : (
                    <span className="text-xs tracking-[0.3em] text-[#999] uppercase">
                        カラーコードを入力しましょう
                    </span>
                )}
            </div>
        </div>
    );
}　