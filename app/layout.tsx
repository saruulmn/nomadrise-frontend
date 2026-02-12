import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'antd/dist/reset.css';
import "../styles/globals.css";
import NavBar from "./components/NavBar";
import AuthProvider from "./components/AuthProvider";
import { ThemeProvider } from "./components/ThemeProvider";
import { LoadingProvider } from "./components/LoadingProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nomadrise.mn"),
  title: {
    default: "NomadRise - Global Scholarship Platform",
    template: "%s | NomadRise"
  },
  description: "Discover and apply for scholarships worldwide. Connect with educational opportunities globally. NomadRise is your gateway to scholarships in 100+ countries.",
  keywords: [
    "scholarships",
    "education",
    "global opportunities",
    "nomad student",
    "international scholarships",
    "study abroad",
    "funding opportunities",
    "student grants",
  ],
  authors: [{ name: "NomadRise Team" }],
  creator: "NomadRise",
  publisher: "NomadRise",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "NomadRise",
  },
  formatDetection: {
    telephone: false,
    email: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["mn_MN"],
    url: "https://nomadrise.mn",
    siteName: "NomadRise",
    title: "NomadRise - Global Scholarship Platform",
    description: "Discover and apply for scholarships worldwide",
    images: [
      {
        url: "https://nomadrise.mn/og-image.png",
        width: 1200,
        height: 630,
        alt: "NomadRise - Global Scholarship Platform",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nomadrise",
    creator: "@nomadrise",
    title: "NomadRise - Global Scholarship Platform",
    description: "Discover and apply for scholarships worldwide",
    images: ["https://nomadrise.mn/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "Fjkfl7USzSLr_K9E3RYR5YnBhZgzvtJvIB51WRZTf60",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="google-site-verification" content="Fjkfl7USzSLr_K9E3RYR5YnBhZgzvtJvIB51WRZTf60" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthProvider>
            <LoadingProvider>
              {children}

              <footer className="site-footer">
                <div className="footer-inner">© {new Date().getFullYear()} <span style={{ color: '#c5c75c', fontWeight: 600 }}>nomadrise</span> — All rights reserved.</div>
              </footer>
            </LoadingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
