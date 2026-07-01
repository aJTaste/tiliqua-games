// app/bunsho-seisei/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文章生成疑似AI",
  description: "文章の文字の並びの確率から、それっぽい文章を自動生成するツール",
};

export default function BunshoSeiseiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
