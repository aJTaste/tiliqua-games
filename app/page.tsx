// app/page.tsx
import Link from "next/link";
import PageFooter from "@/components/ui/PageFooter";

const games = [
  { label: "IroGuesser", href: "/iro-guesser", available: true }, //ランダムに表示される色の16進数からコードを推測するゲーム。
  { label: "Pi to Polygon", href: "#", available: false }, //正しく入力された桁数の円周率に相当する正何角形を描画するゲーム。
  { label: "OtoGuesser", href: "#", available: false }, //ランダムに流れる音の音程または周波数を推測するゲーム。
  { label: "R U File?", href: "#", available: false }, //ctfのようなゲーム。
];

const tools = [
  { label: "HTML Preview", href: "/html-preview", available: true }, //HTMLコードを入力するとそのままプレビューできるツール。
  { label: "Hz変換", href: "#", available: false }, //ピアノの音を選択してその音の周波数を表示するツール。
  { label: "リポジトリツリーハウス", href: "#", available: false }, // リポジトリのurlを入力（またはユーザー名とリポジトリ名）することで瞬時にテキスト形式のツリーを出力するツール。
  { label: "運ゲー", href: "#", available: false }, //あらゆる種類を設けた運ゲーツール。
  { label: "文章生成疑似AI", href: "#", available: false }, //理論で長文を張り付けると、次に来る単語などの確率から勝手に適当な文章を生成する疑似aiツール。
  { label: "タイピングピアノ", href: "#", available: false }, //キーボードでピアノの演奏ができる多機能ピアノツール。
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
