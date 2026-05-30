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

    // フェーズが変わって disabled が解除されたらフォーカス
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
        if (raw.length >= 3) {
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

    const borderColor =
        isValid === null
            ? "border-gray-600"
            : isValid
                ? "border-green-500"
                : "border-red-500";

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
                <span className="text-gray-400 font-mono text-xl">#</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={value.replace(/^#/, "")}
                    onChange={handleChange}
                    disabled={disabled}
                    placeholder="FF5733"
                    maxLength={6}
                    className={`
            w-40 text-center text-2xl font-mono tracking-widest uppercase
            bg-gray-800 text-white rounded-xl px-4 py-3
            border-2 ${borderColor}
            focus:outline-none focus:border-blue-400
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors duration-200
          `}
                    aria-label="16進数カラーコードを入力"
                />
            </div>
            <button
                type="submit"
                disabled={disabled || !isValid}
                className="
          px-8 py-3 rounded-xl text-white font-bold text-lg
          bg-blue-600 hover:bg-blue-500 active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-150
        "
            >
                答える
            </button>
            <p className="text-xs text-gray-500">例: FF5733 または #FF5733</p>
        </form>
    );
}