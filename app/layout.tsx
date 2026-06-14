import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ExitIntentModal from "@/components/ExitIntentModal";

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
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiasedScroll`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {/* Navigation header */}
        <Header />
        
        {/* Main Content Pages */}
        <main className="flex-1 w-full">{children}</main>
        
        {/* Footer */}
        <Footer />
        
        {/* Exit Intent conversion popup */}
        <ExitIntentModal />
      </body>
    </html>
  );
}
