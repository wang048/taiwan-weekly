import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | 台灣週報趨勢",
    default: "台灣週報趨勢",
  },
  description:
    "每週精選台灣各平台熱門趨勢，涵蓋 PTT、Google 趨勢、新聞媒體等多元來源。",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://taiwan-weekly.pages.dev"
  ),
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "台灣週報趨勢",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
