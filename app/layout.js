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

// ✅ All SEO now here (this fixes pixel & indexing)
export const metadata = {
  title: "Watches in Pakistan | Ghari Point - Buy Luxury, Smart & Stainless Steel Watches",
  description:
    "Searching for Watch or Ghari in Pakistan? Ghari Point offers premium luxury, smart, and stainless-steel watches for men & women. Cash on Delivery & 3-Day Replacement.",
  keywords:
    "watch, ghari, watches pakistan, buy watch online, men watches, women watches, smart watches, luxury watches, stainless steel watch, ghari online, pakistan watches store",
  robots: "index, follow",
  authors: [{ name: "Ghari Point" }],
  alternates: {
    canonical: "https://www.gharipoint.com",
  },
  openGraph: {
    title: "Watches in Pakistan | Ghari Point",
    description:
      "Buy Watch / Ghari Online in Pakistan. Luxury & Smart Watches with Cash on Delivery & Fast Shipping.",
    url: "https://www.gharipoint.com",
    siteName: "Ghari Point",
    images: [
      {
        url: "https://www.gharipoint.com/assets/gharipoint-banner.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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

        {/* ✅ Pixel Correct Placement */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1563681587937819');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* ✅ Required for JS Disabled */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1563681587937819&ev=PageView&noscript=1"
            alt="facebook-pixel"
          />
        </noscript>

        {/* ✅ Schema (keep!) */}
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
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+92-300-0000000",
                "contactType": "Customer Service",
                "areaServed": "PK",
                "availableLanguage": ["English", "Urdu"],
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
