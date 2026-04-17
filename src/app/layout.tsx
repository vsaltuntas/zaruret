import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zaruretrecords.com"),
  title: {
    default: "Zaruret Records",
    template: "%s — Zaruret Records",
  },
  description:
    "Bağımsız bir müzik evi. Label, stüdyo, yapımcılık ve etkinlik.",
  openGraph: {
    title: "Zaruret Records",
    description: "Bağımsız bir müzik evi. Label, stüdyo, yapımcılık ve etkinlik.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="grain">{children}</body>
    </html>
  );
}
