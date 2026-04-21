import type { Metadata } from "next";
import { locales, Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;

  const metadata = {
    en: {
      title: "NomadRise - Learn beyond borders",
      description: "Connecting Talent to the World Stage.",
    },
    mn: {
      title: "NomadRise - Хил хязгааргүй суралцах ертөнц",
      description: "Авьяас Билгийг Дэлхийн Тавцанд Холбоно.",
    },
  };

  const pageMetadata = metadata[lang] || metadata.en;

  return {
    title: pageMetadata.title,
    description: pageMetadata.description,
    alternates: {
      languages: {
        en: "https://nomadrise.mn/en",
        mn: "https://nomadrise.mn/mn",
      },
    },
    openGraph: {
      title: pageMetadata.title,
      description: pageMetadata.description,
      url: `https://nomadrise.mn/${lang}`,
      type: "website",
      siteName: "NomadRise",
      locale: lang === "mn" ? "mn_MN" : "en_US",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang as Locale);

  return (
    <>
      <NavBar dictionary={dictionary} />
      {children}
      <Footer lang={lang as Locale} dictionary={dictionary} />
    </>
  );
}

