// components/hz-henkan/NoteSelector.tsx
"use client";

import {
  NOTE_NAMES,
  MIN_OCTAVE,
  MAX_OCTAVE,
  noteToMidi,
  getNoteInfo,
} from "@/lib/hz-henkan/noteLogic";
import Button from "@/components/ui/Button";

interface Props {
  selectedMidi: number;
  onSelect: (midi: number) => void;
}

export default function NoteSelector({ selectedMidi, onSelect }: Props) {
  const current = getNoteInfo(selectedMidi);

  const changeOctave = (dir: 1 | -1) => {
    const next = current.octave + dir;
    if (next < MIN_OCTAVE || next > MAX_OCTAVE) return;
    onSelect(noteToMidi(current.name, next));
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-xs">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => changeOctave(-1)}
          disabled={current.octave <= MIN_OCTAVE}
          className="w-8 h-8 text-xs"
        >
          −
        </Button>
        <span className="font-mono-game text-sm tracking-widest text-[#1a1a1a] w-14 text-center">
          Oct {current.octave}
        </span>
        <Button
          onClick={() => changeOctave(1)}
          disabled={current.octave >= MAX_OCTAVE}
          className="w-8 h-8 text-xs"
        >
          ＋
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2 w-full">
        {NOTE_NAMES.map((name) => (
          <Button
            key={name}
            active={name === current.name}
            onClick={() => onSelect(noteToMidi(name, current.octave))}
            className="py-2 text-[10px] tracking-[0.15em]"
          >
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
}
