import type { Metadata, Viewport } from "next";
import { Inter, Outfit, Lora } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://brandbtss.com"),
  title: {
    template: "%s | BrandBTSS",
    default: "BrandBTSS | Hand-Tested Reviews & Affiliated Shopping Deals",
  },
  description: "Explore unbiased product reviews, side-by-side comparisons, and verified buying guides on running shoes, watches, backpacks, fashion, and cosmetics.",
  keywords: ["affiliate guides", "running shoes under 5000", "best student watches", "seiko 5 automatic review", "Puma Velocity Nitro 3", "product comparison"],
  authors: [{ name: "BrandBTSS Editorial Team" }],
  creator: "BrandBTSS Group",
  publisher: "BrandBTSS",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BrandBTSS | Hand-Tested Reviews & Affiliated Shopping Deals",
    description: "Explore unbiased product reviews, side-by-side comparisons, and verified buying guides on running shoes, watches, backpacks, fashion, and cosmetics.",
    url: "https://brandbtss.com",
    siteName: "BrandBTSS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BrandBTSS | Hand-Tested Reviews & Affiliated Shopping Deals",
    description: "Independent hand-tested guides and deals.",
    creator: "@brandbtss",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5", // Indigo 600
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${outfit.variable} h-full antialiasedScroll`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');`,
            }}
          />
        )}
        
        {/* Navigation header */}
        <Header />
        
        {/* Main Content Pages */}
        <main className="flex-1 w-full">{children}</main>
        
        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
