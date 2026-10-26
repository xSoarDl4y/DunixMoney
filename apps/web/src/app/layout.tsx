import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "MONEYFLOW — Quản lý tài chính",
  description: "Quản lý thu chi cá nhân trên một giao diện rõ ràng.",
  manifest: "/manifest.json"
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}
