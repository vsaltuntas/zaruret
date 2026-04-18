import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { JsonLd, organizationSchema } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zaruret.com"),
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
    <html lang="tr" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <JsonLd data={organizationSchema()} />
      </head>
      <body className="grain">{children}</body>
    </html>
  );
}
