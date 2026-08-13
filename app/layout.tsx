import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
const previewImage = siteUrl ? `${siteUrl}/muscle-anatomy-front.webp` : "/muscle-anatomy-front.webp";

export const metadata: Metadata = {
  title: "Muscle Index — интерактивная карта мышц",
  description:
    "Нажимайте на мышцы человека, изучайте их функции и находите упражнения в прокручиваемом анатомическом каталоге.",
  openGraph: {
    title: "Muscle Index — карта мышц человека",
    description: "35 мышц с функциями, техникой и упражнениями.",
    images: [
      {
        url: previewImage,
        width: 1672,
        height: 941,
        alt: "Интерактивная карта мышц человека",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muscle Index — карта мышц человека",
    description: "35 мышц с функциями, техникой и упражнениями.",
    images: [previewImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
