import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { site } from "@/lib/content";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Voigue | Careers and Life at Voigue",
    template: "%s | Voigue"
  },
  description: site.description
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>
        <MotionProvider>
          <Navbar />
          <main className="overflow-x-clip">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
