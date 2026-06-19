// app/page.tsx
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <Link href="/iro-guesser">IroGuesser</Link>
      <Link href="/html-preview">HTML Preview</Link>
    </div>
  );
}
