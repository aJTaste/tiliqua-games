// app/hz-henkan/page.tsx
"use client";

import { useState } from "react";
import CategoryTitle from "@/components/ui/CategoryTitle";
import PageFooter from "@/components/ui/PageFooter";
import Button from "@/components/ui/Button";
import FrequencyDisplay from "@/components/hz-henkan/FrequencyDisplay";
import PianoKeyboard from "@/components/hz-henkan/PianoKeyboard";
import NoteSelector from "@/components/hz-henkan/NoteSelector";
import { getNoteInfo, noteToMidi } from "@/lib/hz-henkan/noteLogic";

type Mode = "keyboard" | "button";

export default function Page() {
  const [selectedMidi, setSelectedMidi] = useState(() => noteToMidi("A", 4)); // 初期値 A4 = 440Hz
  const [mode, setMode] = useState<Mode>("keyboard");

  const note = getNoteInfo(selectedMidi);

  return (
    <main className="flex flex-col items-center h-[100dvh] bg-[#F8F9FA]">
      <header className="flex-shrink-0 w-full max-w-xs flex justify-between items-end px-1 pt-4 pb-3">
        <CategoryTitle category="Tools" title="Hz変換" />
      </header>

      <div className="w-full max-w-xs border-t border-[#e8e8e8]" />

      {/* 鍵盤には幅が必要なので、このページだけ max-w-3xl まで広げている */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full max-w-3xl px-5 overflow-y-auto py-6">
        <FrequencyDisplay note={note} />

        <div className="flex gap-2">
          <Button
            active={mode === "button"}
            onClick={() => setMode("button")}
            className="text-xs tracking-[0.2em] px-4 py-1.5"
          >
            ボタン
          </Button>
          <Button
            active={mode === "keyboard"}
            onClick={() => setMode("keyboard")}
            className="text-xs tracking-[0.2em] px-4 py-1.5"
          >
            鍵盤
          </Button>
        </div>

        <div className="w-full flex justify-center">
          {mode === "keyboard" ? (
            <PianoKeyboard
              selectedMidi={selectedMidi}
              onSelect={setSelectedMidi}
            />
          ) : (
            <NoteSelector
              selectedMidi={selectedMidi}
              onSelect={setSelectedMidi}
            />
          )}
        </div>
      </div>

      <PageFooter />
    </main>
  );
}
