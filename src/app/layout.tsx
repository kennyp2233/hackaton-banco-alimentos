// app/layout.tsx
import type { Metadata } from "next";
import { Cherry_Bomb_One, Inter } from "next/font/google";
import "./globals.css";

const cherryBombOne = Cherry_Bomb_One({
  variable: "--font-cherry-bomb-one",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"], // normal y bold
  display: "swap",
});


export const metadata: Metadata = {
  title: "Pepper Pizza",
  description: "Your Pizza Party Starts Here!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cherryBombOne.variable} ${inter.variable} antialiased bg-white text-black`}
      >
        {children}
      </body>
    </html>
  );
}
