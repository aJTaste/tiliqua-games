// app/iro-guesser/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IroGuesser",
  description: "表示された色のカラーコードを推測しましょう。",
};

export default function IroGuesserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
