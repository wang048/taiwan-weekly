import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | 走吧 Zou Ba",
    default: "走吧 Zou Ba｜台灣第一個資料驅動週報",
  },
  description:
    "走吧 Zou Ba — 台灣第一個資料驅動的跨格式週報。每週精選 PTT、Google 趨勢、各大媒體熱門話題，直送您的信箱。",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://zoubo.vercel.app"
  ),
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "走吧 Zou Ba",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="h-full">
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
