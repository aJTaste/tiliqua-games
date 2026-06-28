// app/html-preview/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Preview",
};

export default function HtmlPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
