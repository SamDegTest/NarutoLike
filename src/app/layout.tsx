import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NarutoLike",
  description: "A Naruto-themed roguelike game.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}