import type { Metadata } from "next";
import "../globals.css";
import "./admin.css";

export const metadata: Metadata = {
  title: "Zaruret Admin",
  description: "Zaruret Records content management",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
