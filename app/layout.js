import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { EdgeStoreProvider } from "@/components/edgestore";
import { Toaster } from 'react-hot-toast'
import NEXT_AUTH_PROVIDER from "@/components/NextAuthProvider";


const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Web Project - by Ch Arham",
  description: "Created by Ch Arham",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        

          <EdgeStoreProvider>
            <NEXT_AUTH_PROVIDER>
            <LayoutWrapper>
              
              {children}
              <Toaster position="top-center" reverseOrder={false} />
            </LayoutWrapper>
            </NEXT_AUTH_PROVIDER>
          </EdgeStoreProvider>
       

      </body>
    </html>
  );
}
