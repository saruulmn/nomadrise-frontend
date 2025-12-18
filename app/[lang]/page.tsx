import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";
import Hero from "@/app/components/Hero";
import Team from "@/app/components/Team";
import PopularCategories from "@/app/components/PopularCategories";
import Content from "@/app/components/Content";

export default async function Page({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return (
    <main>
      <Hero />
      <Content dictionary={dictionary} />
      <Team dictionary={dictionary} />
      <PopularCategories dictionary={dictionary} />
    </main>
  );
}
