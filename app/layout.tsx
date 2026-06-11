import type { Metadata } from "next";
import { Inter, Montserrat, Nunito } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

// Inter - font chính cho body text, hỗ trợ tiếng Việt xuất sắc
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Montserrat - font cho tiêu đề, hiện đại và dễ đọc tiếng Việt
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Nunito - font phụ cho các element đặc biệt, rounded và thân thiện
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SimDepGiaRe - Kho Sim Số Đẹp Giá Rẻ",
  description: "Mua bán sim số đẹp giá rẻ, sim tứ quý, ngũ quý, lộc phát, phong thủy. Sim Viettel, VinaPhone, MobiFone chính chủ.",
  keywords: "sim số đẹp, sim giá rẻ, sim tứ quý, sim ngũ quý, sim lộc phát, sim phong thủy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body
        className={`${inter.variable} ${montserrat.variable} ${nunito.variable} font-inter min-h-screen flex flex-col antialiased`}
      >
        <div className="noise-overlay" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
