import "./globals.css";

import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";

const notoSansJP = Noto_Sans_JP({ weight: ["300", "400"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HTML Preview",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={notoSansJP.className}>{children}</div>;
}
