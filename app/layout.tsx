import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hex Color",
  description: "表示された色のHEXカラーコードを当てるゲーム。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}