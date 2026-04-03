import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";
import Hero from "@/app/components/Hero";
import Team from "@/app/components/Team";
import PopularCategories from "@/app/components/PopularCategories";
import Content from "@/app/components/Content";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <main>
      {/* Hidden link for Google OAuth verification */}
      <Link 
        href="/en/policy" 
        style={{ 
          position: 'absolute', 
          left: '-10000px', 
          top: 'auto', 
          width: '1px', 
          height: '1px', 
          overflow: 'hidden' 
        }}
        aria-label="Privacy Policy"
      >
        Privacy Policy
      </Link>
      
      <Hero />
      <Content dictionary={dictionary} />
      <Team dictionary={dictionary} lang={lang} />
      <PopularCategories dictionary={dictionary} />
    </main>
  );
}
