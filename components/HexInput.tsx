"use client";

import { useState, useRef, useEffect } from "react";
import { normalizeHex } from "@/lib/gameLogic";

interface Props {
    onSubmit: (value: string) => void;
    disabled: boolean;
}

export default function HexInput({ onSubmit, disabled }: Props) {
    const [value, setValue] = useState("");
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!disabled) {
            setValue("");
            setIsValid(null);
            inputRef.current?.focus();
        }
    }, [disabled]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[^0-9A-Fa-f#]/g, "").slice(0, 7);
        setValue(raw);
        if (raw.replace(/^#/, "").length >= 3) {
            setIsValid(normalizeHex(raw) !== null);
        } else {
            setIsValid(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!disabled && normalizeHex(value)) {
            onSubmit(value);
        }
    };

    const underlineColor =
        isValid === null
            ? "border-[#ccc]"
            : isValid
                ? "border-[#1a1a1a]"
                : "border-[#c0392b]";

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-8">
            {/* 入力エリア */}
            <div className="flex flex-col items-center gap-1">
                <div className={`flex items-center border-b ${underlineColor} pb-2 transition-colors duration-200`}>
                    <span className="font-mono-game text-2xl font-light text-[#bbb] mr-1">#</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={value.replace(/^#/, "")}
                        onChange={handleChange}
                        disabled={disabled}
                        placeholder="FF5733"
                        maxLength={6}
                        className="
              w-36 text-center font-mono-game text-2xl font-light
              tracking-[0.25em] uppercase
              bg-transparent text-[#1a1a1a]
              focus:outline-none
              disabled:opacity-30 disabled:cursor-not-allowed
              placeholder:text-[#ccc]
            "
                        aria-label="HEXカラーコードを入力"
                    />
                </div>
                <span className="text-[10px] tracking-[0.2em] text-[#bbb] uppercase mt-1">
                    例）FF5733 または #1A2B3C
                </span>
            </div>

            {/* 送信ボタン */}
            <button
                type="submit"
                disabled={disabled || !isValid}
                className="
          w-40 py-3 border border-[#1a1a1a] text-[#1a1a1a]
          text-xs tracking-[0.3em] uppercase
          hover:bg-[#1a1a1a] hover:text-[#F8F9FA]
          active:scale-95
          disabled:opacity-20 disabled:cursor-not-allowed
          transition-all duration-200
        "
            >
                判定する
            </button>
        </form>
    );
}