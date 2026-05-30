import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Color Hex Quiz",
  description: "表示された色のHEXコードを当てるゲーム",
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