  import { Geist, Geist_Mono } from "next/font/google";
  import "./globals.css";
  import LayoutWrapper from "@/components/LayoutWrapper";
  import { EdgeStoreProvider } from "@/components/edgestore";
  import { Toaster } from 'react-hot-toast'


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
            <LayoutWrapper>
              {children}
              <Toaster position="top-center" reverseOrder={false} />
            </LayoutWrapper>
          </EdgeStoreProvider>

        </body>
      </html>
    );
  }
