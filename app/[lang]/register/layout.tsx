import { Metadata } from "next";
import type { Locale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;

  const titles = {
    en: "Sign Up - NomadRise | Create Your Account",
    mn: "Бүртгүүлэх - NomadRise | Эрхтэй эхлүүлэх",
  };

  const descriptions = {
    en: "Create a NomadRise account to start exploring global scholarship opportunities. Free registration to access thousands of scholarships.",
    mn: "NomadRise дээр эрхтэй бүртгүүлээд дэлхийн стипендийн боломжуудыг олоорой.",
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
      url: `https://nomadrise.mn/${lang}/register`,
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

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
