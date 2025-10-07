import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { EdgeStoreProvider } from "@/components/edgestore";
import { Toaster } from "react-hot-toast";
import NEXT_AUTH_PROVIDER from "@/components/NextAuthProvider";
import Script from "next/script";
import FloatingWhatsApp from "@/components/floatingWhatsapp/page"; // ✅ new client component

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Ghari Point - Flex Different. Wear Authentic.",
  description: "Created by Ch Arham",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta Pixel Code */}
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod ?
              n.callMethod.apply(n, arguments) : n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '842131638378353');
            fbq('track', 'PageView');
          `}
        </Script>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=842131638378353&ev=PageView&noscript=1"
          />
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <EdgeStoreProvider>
          <NEXT_AUTH_PROVIDER>
            <LayoutWrapper>
              {children}
              <FloatingWhatsApp /> {/* ✅ Only this runs on client */}
              <Toaster position="top-center" reverseOrder={false} />
            </LayoutWrapper>
          </NEXT_AUTH_PROVIDER>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
