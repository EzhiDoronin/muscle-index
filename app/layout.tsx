import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pixel Drop! — падающие блоки",
  description: "Неоновая аркада с падающими блоками в стиле 90-х.",
  openGraph: {
    title: "Pixel Drop!",
    description: "Двигай, крути и взрывай линии в неоновой аркаде.",
    images: ["https://pixel-pop-90s.sage-civet-0454.chatgpt.site/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel Drop!",
    description: "Двигай, крути и взрывай линии в неоновой аркаде.",
    images: ["https://pixel-pop-90s.sage-civet-0454.chatgpt.site/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
