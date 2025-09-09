import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flex Layout Panel - Paper Design Demo",
  description: "A sophisticated flex layout panel demonstration showcasing technical excellence and design sensibility",
  keywords: "flex, layout, design, ui, ux, paper, panel",
  authors: [{ name: "Design Engineer Candidate" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}