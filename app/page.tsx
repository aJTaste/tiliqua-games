// app/page.tsx
import Link from "next/link";
import PageFooter from "@/components/ui/PageFooter";

const games = [
  { label: "IroGuesser", href: "/iro-guesser", available: true },
  { label: "Pi to Polygon", href: "#", available: false },
  { label: "OtoGuesser", href: "#", available: false },
  { label: "R U File?", href: "#", available: false },
];

const tools = [
  { label: "HTML Preview", href: "/html-preview", available: true },
  { label: "Hz変換", href: "#", available: false },
  { label: "リポジトリツリーハウス", href: "#", available: false },
  { label: "運ゲー", href: "#", available: false },
  { label: "文章生成疑似AI", href: "#", available: false },
  { label: "タイピングピアノ", href: "#", available: false },
];

export default function Page() {
  return (
    <main className="flex flex-col items-center min-h-dvh bg-[#F8F9FA]">
      <header className="w-full max-w-xs flex flex-col px-5 pt-8 pb-5">
        <p className="text-[7px] tracking-[0.5em] text-[#bbb] uppercase">
          by あじとかげ
        </p>
        <h1 className="text-sm tracking-[0.3em] text-[#1a1a1a] font-light mt-1">
          Tiliqua Games
        </h1>
      </header>

      <div className="w-full max-w-xs border-t border-[#e8e8e8]" />

      <div className="flex-1 w-full max-w-xs px-5 py-8 flex flex-col gap-8">
        <section className="flex flex-col gap-3">
          <p className="text-[7px] tracking-[0.5em] text-[#bbb] uppercase">
            Games
          </p>
          <div className="flex flex-col">
            {games.map((item) =>
              item.available ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between py-3 border-b border-[#e8e8e8] text-xs tracking-[0.15em] font-light text-[#1a1a1a] hover:pl-2 transition-all duration-200 group"
                >
                  <span>{item.label}</span>
                  <span className="text-[#ccc] group-hover:text-[#1a1a1a] transition-colors duration-200">
                    →
                  </span>
                </Link>
              ) : (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3 border-b border-[#e8e8e8]"
                >
                  <span className="text-xs tracking-[0.15em] font-light text-[#ccc]">
                    {item.label}
                  </span>
                  <span className="text-[7px] tracking-[0.25em] text-[#ddd] uppercase">
                    soon
                  </span>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <p className="text-[7px] tracking-[0.5em] text-[#bbb] uppercase">
            Tools
          </p>
          <div className="flex flex-col">
            {tools.map((item) =>
              item.available ? (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between py-3 border-b border-[#e8e8e8] text-xs tracking-[0.15em] font-light text-[#1a1a1a] hover:pl-2 transition-all duration-200 group"
                >
                  <span>{item.label}</span>
                  <span className="text-[#ccc] group-hover:text-[#1a1a1a] transition-colors duration-200">
                    →
                  </span>
                </Link>
              ) : (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3 border-b border-[#e8e8e8]"
                >
                  <span className="text-xs tracking-[0.15em] font-light text-[#ccc]">
                    {item.label}
                  </span>
                  <span className="text-[7px] tracking-[0.25em] text-[#ddd] uppercase">
                    soon
                  </span>
                </div>
              ),
            )}
          </div>
        </section>
      </div>

      {/* PageFooter に統一（py-3 → py-2 も含めて揃える） */}
      <PageFooter />
    </main>
  );
}
