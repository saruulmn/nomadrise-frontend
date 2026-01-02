import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";
import SponsorForm from "./SponsorForm";

type SponsorPageProps = {
  params: Promise<{
    lang: Locale;
  }>;
};

export default async function SponsorPage({ params }: SponsorPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);

  return <SponsorForm dictionary={dictionary} />;
}
