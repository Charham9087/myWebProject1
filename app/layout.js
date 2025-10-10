import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/LayoutWrapper";
import { EdgeStoreProvider } from "@/components/edgestore";
import { Toaster } from "react-hot-toast";
import NEXT_AUTH_PROVIDER from "@/components/NextAuthProvider";
import Script from "next/script";
import FloatingWhatsApp from "@/components/floatingWhatsapp/page";

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
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* ✅ Stronger SEO Title with Generic Keywords */}
        <title>Watches in Pakistan | Ghari Point - Buy Luxury, Smart & Stainless Steel Watches</title>

        {/* ✅ Updated Description (Includes "Watch", "Ghari", "Watches") */}
        <meta
          name="description"
          content="Searching for Watch or Ghari in Pakistan? Ghari Point offers premium luxury, smart, and stainless-steel watches for men & women. Cash on Delivery & 3-Day Replacement."
        />

        {/* ✅ Expanded Keywords for Broad Search Ranking */}
        <meta
          name="keywords"
          content="watch, ghari, watches pakistan, buy watch online, men watches, women watches, smart watches, luxury watches, stainless steel watch, ghari online, pakistan watches store"
        />

        <meta name="robots" content="index, follow" />
        <meta name="author" content="Ghari Point" />
        <link rel="canonical" href="https://www.gharipoint.com" />

        {/* ✅ Open Graph for Sharing */}
        <meta property="og:title" content="Watches in Pakistan | Ghari Point" />
        <meta
          property="og:description"
          content="Buy Watch / Ghari Online in Pakistan. Luxury & Smart Watches with Cash on Delivery & Fast Shipping."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.gharipoint.com" />
        <meta property="og:site_name" content="Ghari Point" />
        <meta property="og:image" content="https://www.gharipoint.com/assets/gharipoint-banner.jpg" />

        {/* ✅ Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        {/* ✅ Updated Structured Data with New Links */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Organization",
              "name": "Ghari Point",
              "url": "https://www.gharipoint.com",
              "logo": "https://www.gharipoint.com/assets/logo.png",
              "sameAs": [
                "https://www.instagram.com/ghari.point?igsh=OGszYjRydDdscjY4",
                "https://www.facebook.com/share/1KNuxxpcsp/",
                "https://www.tiktok.com/@gharipoint?_t=ZS-90RKG0uSbJw&_r=1"
              ],
              "description": "Ghari Point is Pakistan's trusted store for Watch / Ghari — luxury, smart & stainless-steel watches with Cash on Delivery.",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+92-300-0000000",
                "contactType": "Customer Service",
                "areaServed": "PK",
                "availableLanguage": ["English", "Urdu"]
              }
            }),
          }}
        />
      </head>


      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <EdgeStoreProvider>
          <NEXT_AUTH_PROVIDER>
            <LayoutWrapper>
              {children}
              <FloatingWhatsApp />
              <Toaster position="top-center" reverseOrder={false} />
            </LayoutWrapper>
          </NEXT_AUTH_PROVIDER>
        </EdgeStoreProvider>

        {/* ✅ Facebook Meta Pixel Code */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !(function(f,b,e,v,n,t,s){
              if(f.fbq)return;
              n=f.fbq=function(){
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
              };
              if(!f._fbq)f._fbq=n;
              n.push=n;
              n.loaded=!0;
              n.version='2.0';
              n.queue=[];
              t=b.createElement(e);
              t.async=!0;
              t.src=v;
              s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s);
            })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
            
            fbq('init', '1109494101397042');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* ✅ NoScript fallback (for users without JS) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1109494101397042&ev=PageView&noscript=1"
            alt="facebook pixel"
          />
        </noscript>
      </body>
    </html>
  );
}
