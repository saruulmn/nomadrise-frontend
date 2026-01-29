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
  title: "NomadRise",
  description: "Connecting future professionals",
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
