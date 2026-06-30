// components/hz-henkan/FrequencyDisplay.tsx
import { NoteInfo } from "@/lib/hz-henkan/types";

interface Props {
  note: NoteInfo;
}

export default function FrequencyDisplay({ note }: Props) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[9px] tracking-[0.3em] text-[#bbb] uppercase">
        {note.name}
        {note.octave}
      </span>
      <span className="font-mono-game text-4xl font-light tracking-[0.05em] text-[#1a1a1a]">
        {note.freq.toFixed(2)} Hz
      </span>
    </div>
  );
}
