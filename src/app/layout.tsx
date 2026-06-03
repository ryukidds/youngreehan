import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "영리한 - 복잡한 티셔츠 제작 영리하게 원스톱으로",
  description: "복잡한 티셔츠 제작 영리하게 원스톱으로, 스마트한 단체복/굿즈 플랫폼",
  keywords: ["영리한", "단체티", "굿즈", "제작", "단체후드티", "데일리웨어"],
  openGraph: {
    title: "영리한 - 복잡한 티셔츠 제작 영리하게 원스톱으로",
    description: "복잡한 티셔츠 제작 영리하게 원스톱으로, 스마트한 단체복/굿즈 플랫폼",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: "'87mmDailyRegular', sans-serif" }}>
        <Header />
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
