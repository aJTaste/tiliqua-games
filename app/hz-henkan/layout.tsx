// app/hz-henkan/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hz変換",
  description: "音階とオクターブから周波数(Hz)を調べるツール",
};

export default function HzHenkanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
