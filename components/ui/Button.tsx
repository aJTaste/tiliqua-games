// components/ui/Button.tsx
"use client";

import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean; // true のとき塗りつぶしスタイル（トグルボタン用）
}

export default function Button({
  active = false,
  className = "",
  children,
  ...rest
}: Props) {
  const base =
    "border border-[#1a1a1a] uppercase transition-all duration-200 active:scale-95 disabled:opacity-20 disabled:cursor-not-allowed";

  // active が true のとき：塗りつぶし（ホバー効果なし）
  // active が false のとき：透明背景 → ホバーで反転
  const color = active
    ? "bg-[#1a1a1a] text-[#F8F9FA]"
    : "text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#F8F9FA]";

  return (
    <button {...rest} className={`${base} ${color} ${className}`}>
      {children}
    </button>
  );
}
