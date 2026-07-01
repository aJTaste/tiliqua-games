// app/oto-guesser/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OtoGuesser",
  description: "ランダムに流れる音の音程を推測しましょう",
};

export default function OtoGuesserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
