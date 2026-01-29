import type { Metadata } from "next";
import { locales, Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "NomadRise",
  description: "Connecting future professionals",
};

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
      <main className="site-content">{children}</main>
      <Footer lang={lang as Locale} dictionary={dictionary} />
    </>
  );
}

