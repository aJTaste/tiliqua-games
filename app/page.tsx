// app/page.tsx
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h2>Games</h2>
      <div>
        <Link href="/iro-guesser">IroGuesser</Link>
        <Link href="#">Pi to Polygon</Link>
        <Link href="#">OtoGuesser</Link>
        <Link href="#">R U File?</Link>
      </div>
      <h2>Tools</h2>
      <div>
        <Link href="/html-preview">HTML Preview</Link>
        <Link href="#">Hz変換</Link>
        <Link href="#">リポジトリツリーハウス</Link>
        <Link href="#">運ゲー</Link>
        <Link href="#">文章生成疑似AI</Link>
        <Link href="#">タイピングピアノ</Link>
      </div>
    </div>
  );
}

