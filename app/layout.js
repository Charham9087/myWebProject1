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

        {/* <!-- ✅ Primary SEO --> */}
        <title>Buy Premium Watches Online in Pakistan | Ghari Point</title>
        <meta
          name="description"
          content="Shop luxury, smart, and stainless-steel watches for men and women at Ghari Point. Cash on Delivery, 3-Day Replacement, and Fast Nationwide Delivery across Pakistan."
        />
        <meta
          name="keywords"
          content="buy watches online Pakistan, Ghari Point, men watches, women watches, smart watches, luxury watches, stainless steel watches, cash on delivery watches, watches store Pakistan"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Ch Arham" />
        <link rel="canonical" href="https://www.gharipoint.com" />

        {/* <!-- ✅ Open Graph (Facebook, Instagram, WhatsApp Previews) --> */}
        <meta property="og:title" content="Buy Premium Watches Online in Pakistan | Ghari Point" />
        <meta
          property="og:description"
          content="Shop authentic wrist watches at Ghari Point. Discover luxury, smart, and stainless-steel timepieces. Cash on Delivery and 3-Day Replacement Available!"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.gharipoint.com" />
        <meta property="og:site_name" content="Ghari Point" />
        <meta property="og:image" content="https://www.gharipoint.com/assets/gharipoint-banner.jpg" />

        {/* <!-- ✅ Twitter Card --> */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Buy Premium Watches Online in Pakistan | Ghari Point" />
        <meta
          name="twitter:description"
          content="Discover authentic wrist watches at Ghari Point — where luxury meets affordability. Cash on Delivery & 3-Day Replacement across Pakistan."
        />
        <meta name="twitter:image" content="https://www.gharipoint.com/assets/gharipoint-banner.jpg" />

        {/* <!-- ✅ Favicon --> */}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />

        {/* <!-- ✅ Structured Data for Google Rich Results --> */}
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
                "https://www.facebook.com/gharipoint",
                "https://www.instagram.com/gharipoint",
                "https://www.tiktok.com/@gharipoint"
              ],
              "description": "Ghari Point is Pakistan's trusted online store for luxury, smart, and stainless-steel watches. Offering Cash on Delivery and 3-Day Replacement.",
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
