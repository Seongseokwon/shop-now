import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://shop-now-ebon.vercel.app";

export const metadata: Metadata = {
  title: "Shop Now — AI 쇼핑 도우미",
  description:
    "상품 추천, 살까말까 결정, 가성비 레이더. AI가 당신의 쇼핑 고민을 해결해드립니다.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Shop Now — AI 쇼핑 도우미",
    description:
      "선물 추천 · 살까말까 결정 · 가성비 레이더. 쇼핑 고민, AI에게 맡기세요.",
    url: BASE_URL,
    siteName: "쇼핑GPT",
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Shop Now — AI 쇼핑 도우미",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shop Now — AI 쇼핑 도우미",
    description:
      "선물 추천 · 살까말까 결정 · 가성비 레이더. 쇼핑 고민, AI에게 맡기세요.",
    images: [`${BASE_URL}/opengraph-image`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={geist.className}>
      <body className="bg-white text-[#1A1A1A] min-h-screen">
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js"
          strategy="lazyOnload"
        />
        <Navbar />
        <main className="max-w-[480px] mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
