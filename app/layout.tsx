import type { Metadata } from "next";
import { Cormorant_Garamond, Be_Vietnam_Pro, Playfair_Display, Orbitron } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
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
        className={`${cormorant.variable} ${beVietnam.variable} ${playfair.variable} ${orbitron.variable} font-be-vietnam min-h-screen flex flex-col antialiased`}
      >
        <div className="noise-overlay" />
        <div className="scan-line" />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
