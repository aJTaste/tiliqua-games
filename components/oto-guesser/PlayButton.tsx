// components/oto-guesser/PlayButton.tsx
"use client";

import Button from "@/components/ui/Button";
import { playTone } from "@/lib/oto-guesser/audio";

interface Props {
  freq: number;
}

export default function PlayButton({ freq }: Props) {
  return (
    <Button
      onClick={() => playTone(freq)}
      className="w-40 py-2.5 text-xs tracking-[0.3em]"
    >
      ▶ 再生する
    </Button>
  );
}
