import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import 'antd/dist/reset.css';
import "../styles/globals.css";
import NavBar from "./components/NavBar";
import AuthProvider from "./components/AuthProvider";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NavBar />

          {children}

          <footer className="site-footer">
            <div className="footer-inner">© {new Date().getFullYear()} nomadrise.mn — All rights reserved.</div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
