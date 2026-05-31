import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "色番号判定",
  description: "表示された色のHEXカラーコードを当てる、色彩識別トレーニング。",
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