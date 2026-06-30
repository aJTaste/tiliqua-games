// components/hz-henkan/PianoKeyboard.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  generateKeys,
  VISIBLE_WHITE_KEYS,
  TOTAL_WHITE_KEYS,
  WHITE_KEYS_PER_OCTAVE,
} from "@/lib/hz-henkan/noteLogic";

interface Props {
  selectedMidi: number;
  onSelect: (midi: number) => void;
}

const ALL_KEYS = generateKeys();
const MAX_SCROLL_WHITE = TOTAL_WHITE_KEYS - VISIBLE_WHITE_KEYS;

function clampScroll(v: number) {
  return Math.min(Math.max(v, 0), MAX_SCROLL_WHITE);
}

export default function PianoKeyboard({ selectedMidi, onSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // scroll の単位は「白鍵1個分」。初期値は選択中の音が中央に来るように計算する
  const [scroll, setScroll] = useState(() => {
    const key = ALL_KEYS.find((k) => k.midi === selectedMidi);
    const center = key
      ? key.whiteIndex - Math.floor(VISIBLE_WHITE_KEYS / 2)
      : 0;
    return clampScroll(center);
  });
  const [animating, setAnimating] = useState(false);

  const isFirstRender = useRef(true);
  const dragState = useRef<{ startX: number; startScroll: number } | null>(
    null,
  );
  const wasDraggedRef = useRef(false);

  const whiteKeyWidth = containerWidth / VISIBLE_WHITE_KEYS;

  // コンテナの実幅を測定（リサイズにも追従）
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 外部（ボタンモードなど）で選択音が変わり、表示範囲外に出たら追従スクロール
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const key = ALL_KEYS.find((k) => k.midi === selectedMidi);
    if (!key) return;
    const inView =
      key.whiteIndex >= scroll && key.whiteIndex < scroll + VISIBLE_WHITE_KEYS;
    if (!inView) {
      setAnimating(true);
      setScroll(
        clampScroll(key.whiteIndex - Math.floor(VISIBLE_WHITE_KEYS / 2)),
      );
      setTimeout(() => setAnimating(false), 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMidi]);

  const shiftOctave = useCallback((dir: 1 | -1) => {
    setAnimating(true);
    setScroll((prev) => clampScroll(prev + dir * WHITE_KEYS_PER_OCTAVE));
    setTimeout(() => setAnimating(false), 300);
  }, []);

  // 矢印キーで1オクターブ移動
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") shiftOctave(1);
      if (e.key === "ArrowLeft") shiftOctave(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shiftOctave]);

  // ドラッグで自由にスクロール
  const handlePointerDown = (e: React.PointerEvent) => {
    dragState.current = { startX: e.clientX, startScroll: scroll };
    wasDraggedRef.current = false;
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragState.current || !whiteKeyWidth) return;
    const deltaPx = e.clientX - dragState.current.startX;
    if (Math.abs(deltaPx) > 3) wasDraggedRef.current = true;
    setScroll(
      clampScroll(dragState.current.startScroll - deltaPx / whiteKeyWidth),
    );
  };
  const handlePointerUp = () => {
    dragState.current = null;
  };

  // ホイールでもスクロール
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!whiteKeyWidth) return;
    const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
    setScroll((prev) => clampScroll(prev + delta / whiteKeyWidth));
  };

  const handleKeyClick = (midi: number) => {
    if (wasDraggedRef.current) return; // ドラッグの延長でクリック扱いされるのを防ぐ
    onSelect(midi);
  };

  const selectedKey = ALL_KEYS.find((k) => k.midi === selectedMidi);
  const translateX = -scroll * whiteKeyWidth;

  return (
    <div className="w-full flex items-center gap-2">
      <button
        onClick={() => shiftOctave(-1)}
        aria-label="1オクターブ下げる"
        className="shrink-0 text-[#bbb] hover:text-[#1a1a1a] transition-colors duration-200 px-1 text-lg"
      >
        ←
      </button>

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        className="relative flex-1 h-52 overflow-hidden touch-none cursor-grab active:cursor-grabbing select-none"
      >
        <div
          style={{
            width: `${TOTAL_WHITE_KEYS * whiteKeyWidth}px`,
            transform: `translateX(${translateX}px)`,
          }}
          className={`absolute top-0 left-0 h-full ${
            animating ? "transition-transform duration-300 ease-out" : ""
          }`}
        >
          {/* 白鍵 */}
          {ALL_KEYS.filter((k) => !k.isBlack).map((key) => {
            const isSelected = key.midi === selectedMidi;
            const bgClassName = isSelected
              ? "bg-[#22c55e]/70" // 選択中は緑色（image_0.pngのようなスタイル）
              : "bg-white hover:bg-[#f0f0f0]";
            return (
              <button
                key={key.midi}
                onClick={() => handleKeyClick(key.midi)}
                style={{
                  left: `${key.whiteIndex * whiteKeyWidth}px`,
                  width: `${whiteKeyWidth}px`,
                }}
                className={`absolute top-0 h-32 border border-[#e8e8e8] transition-colors duration-150 ${bgClassName}`}
              />
            );
          })}

          {/* 黒鍵（直前の白鍵との境界を中心に配置） */}
          {ALL_KEYS.filter((k) => k.isBlack).map((key) => {
            const isSelected = key.midi === selectedMidi;
            const blackWidth = whiteKeyWidth * 0.6;
            const boundaryX = (key.whiteIndex + 1) * whiteKeyWidth;
            const bgClassName = isSelected
              ? "bg-[#22c55e]/90" // 選択中は緑色（黒鍵は少し濃く見せる）
              : "bg-[#1a1a1a] hover:bg-[#333]";
            return (
              <button
                key={key.midi}
                onClick={() => handleKeyClick(key.midi)}
                style={{
                  left: `${boundaryX - blackWidth / 2}px`,
                  width: `${blackWidth}px`,
                }}
                className={`absolute top-0 h-20 transition-colors duration-150 z-10 ${bgClassName}`}
              />
            );
          })}

          {/* オクターブの境目ラベル */}
          {ALL_KEYS.filter((k) => k.name === "C").map((key) => (
            <span
              key={`label-${key.midi}`}
              style={{ left: `${key.whiteIndex * whiteKeyWidth + 4}px` }}
              className="absolute top-40 text-[8px] tracking-widest text-[#bbb] uppercase"
            >
              C{key.octave}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => shiftOctave(1)}
        aria-label="1オクターブ上げる"
        className="shrink-0 text-[#bbb] hover:text-[#1a1a1a] transition-colors duration-200 px-1 text-lg"
      >
        →
      </button>
    </div>
  );
}
