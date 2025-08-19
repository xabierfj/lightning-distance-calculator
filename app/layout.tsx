import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], weight: ['400', '500', '700', '900'] });

export const metadata: Metadata = {
  title: "Lightning Distance Calculator",
  description: "An application to estimate the distance of a lightning strike by measuring the time between the flash and the sound of thunder. Start the timer when you see lightning and stop it when you hear thunder to get an approximate distance in miles and kilometers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900`}>{children}</body>
    </html>
  );
}
