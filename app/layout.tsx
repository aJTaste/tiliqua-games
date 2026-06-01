import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "色Guessr",
  description: "表示された色のカラーコードを推測しましょう。",
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