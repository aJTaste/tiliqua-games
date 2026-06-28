// app/layout.tsx
import type { Metadata } from "next";
import { Noto_Sans_JP, DM_Mono } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

const dmMono = DM_Mono({
  weight: ["300", "400"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  title: "Tiliqua Games",
  description: "TiliquaのGames",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${dmMono.variable}`}>
      <body style={{ fontFamily: "var(--font-noto-sans-jp), sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
