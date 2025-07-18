import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/FrontendComponents/navbar/page";
import Header from "@/components/FrontendComponents/header/page";
import Footer from "@/components/FrontendComponents/footer/page";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Web Project -by Ch Arham",
  description: "Created by Ch Arham",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
