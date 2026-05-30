"use client";

import { Color } from "@/lib/types";

interface Props {
    color: Color;
    revealed: boolean; // 正解後はHEXを表示
}

export default function ColorDisplay({ color, revealed }: Props) {
    return (
        <div className="flex flex-col items-center gap-4">
            <div
                className="w-64 h-64 rounded-2xl shadow-2xl transition-all duration-500"
                style={{ backgroundColor: color.hex }}
                aria-label={revealed ? `Color: ${color.hex}` : "Guess this color"}
            />
            {revealed ? (
                <p className="text-2xl font-mono font-bold tracking-widest text-white drop-shadow">
                    {color.hex}
                </p>
            ) : (
                <p className="text-gray-400 text-sm">この色は何番？</p>
            )}
        </div>
    );
}