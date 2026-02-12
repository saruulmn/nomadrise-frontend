import { Metadata } from "next";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles = {
    en: "Sign In - NomadRise | Learn Beyond Borders",
    mn: "Нэвтрэх - NomadRise | Learn Beyond Borders",
  };

  const descriptions = {
    en: "An open community for people who value learning and personal growth without borders, and who strive to make a real contribution to society.",
    mn: "Хил хязгаараар хязгаарлагдахгүй суралцах, хөгжих, нийгэмд бодит хувь нэмэр оруулахыг эрхэмлэдэг хүмүүст зориулсан нээлттэй community юм.",
  };

  return {
    title: titles[lang],
    description: descriptions[lang],
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      url: `https://nomadrise.mn/${lang}/login`,
      type: "website",
      siteName: "NomadRise",
    },
    twitter: {
      card: "summary",
      title: titles[lang],
      description: descriptions[lang],
    },
  };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
