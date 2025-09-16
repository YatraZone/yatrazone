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
import Link from "next/link";


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
        <Script id="gtag-conversion" strategy="afterInteractive">
          {`
            gtag('event', 'ads_conversion_Contact_Us_1', {
              // <event_parameters>
            });
          `}
        </Script>

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
          <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-6">
            {/* Broken page icon */}
            <div className="mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 9h.01M15 9h.01M9 15h6m2-12H7a2 2 0 00-2 2v14l4-2 4 2 4-2 4 2V5a2 2 0 00-2-2z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-medium text-gray-800 mb-2">
              This site can’t be reached
            </h1>

            <p className="text-gray-600 mb-1">
              Check if there is a typo in <strong>yatrazone.com</strong>.
            </p>
            <p className="text-gray-600 mb-6">
              If spelling is correct, try running Windows Network Diagnostics.
            </p>

            <p className="text-gray-400 text-sm mb-8">DNS_PROBE_FINISHED_NXDOMAIN</p>
          </div>

        )}
      </body>
    </html>
  );
}
