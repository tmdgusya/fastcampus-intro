import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "ROACH SHOP",
  description: "ROACH SHOP — 감각적인 패션을 큐레이션하는 쇼핑몰. 상품 목록과 상세 조회.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-white text-neutral-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
