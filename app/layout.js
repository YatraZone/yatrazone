import "./globals.css";
import Script from "next/script";
import Header from "@/components/Header";
import SessionWrapper from "@/components/SessionWrapper";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { SearchProvider } from "@/context/SearchContext";
import OverlayButton from "@/components/OverlayButton";
import GoogleTranslate from "@/components/GoogleTranslate";


export const metadata = {
  metadataBase: new URL("https://yatrazone.com/"),
  title: {
    default: "YatraZone - Your Spiritual Travel Solution",
    template: "%s | YatraZone",
  },
  description:
    "Embark on a transformative voyage with YatraZone, offering enriching spiritual journeys across India. Experience seamless pilgrimage tours with expert guidance.",
  keywords:
    "yatrazone, yatra, zone, travel, website, yatra zone, travel website, tour website, tour, tour package, package, india, India",
  icons: { apple: "/apple-touch-icon.png" },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "YatraZone - Your Spiritual Travel Solution",
    description:
      "Embark on a transformative voyage with YatraZone, offering enriching spiritual journeys across India.",
    images: ["/logo.png"],
    url: "https://yatrazone.com/",
    site_name: "YatraZone",
  },
  twitter: {
    card: "summary_large_image",
    title: "YatraZone - Your Spiritual Travel Solution",
    description:
      "Embark on a transformative voyage with YatraZone, offering enriching spiritual journeys across India.",
    images: ["/logo.png"],
  },
  other: {
    "author": "YatraZone",
    "robots": "index, follow",
    "viewport": "width=device-width, initial-scale=1",
  },
};

export default function RootLayout({ children }) {
  const isPaid = process.env.NEXT_PUBLIC_IS_PAID === "true";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-16449940407"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-16449940407');
          `}
        </Script>
        <script>
          gtag('event', 'ads_conversion_Contact_Us_1', {
            // <event_parameters>
          });
        </script>

      </head>
      <body className={`font-gilda`}>
        {isPaid ? (
          <>
            <NextTopLoader color="#006eff" height={3} showSpinner={false} zIndex={1600} />
            <Toaster position="top-center" reverseOrder={false} toastOptions={{ duration: 3000, style: { fontFamily: "var(--font-GildaDisplay)" } }} />
            <SessionWrapper>
              <SearchProvider>
                <Header />
                <GoogleTranslate />
                <main>
                  <OverlayButton />
                  {children}
                </main>
                <Footer />
              </SearchProvider>
            </SessionWrapper>
          </>
        ) : (
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold text-black text-center">
              Payment Pending. Please Contact Admin.
            </h1>
          </div>
        )}
      </body>
    </html>
  );
}
