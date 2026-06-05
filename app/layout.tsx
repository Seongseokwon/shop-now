import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "쇼핑GPT — AI 쇼핑 도우미",
  description: "선물 추천, 살까말까 결정, 가성비 레이더. AI가 당신의 쇼핑 고민을 해결해드립니다.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
