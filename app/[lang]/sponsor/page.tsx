import { Suspense } from "react";
import { getDictionary } from "@/i18n/dictionaries";
import { Locale } from "@/i18n/config";
import SponsorForm from "./SponsorForm";
import { SponsorSkeleton } from "@/app/components/Skeleton";

type SponsorPageProps = {
  params: Promise<{
    lang: Locale;
  }>;
};

async function SponsorContent({ params }: SponsorPageProps) {
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  return <SponsorForm dictionary={dictionary} />;
}

export default function SponsorPage({ params }: SponsorPageProps) {
  return (
    <Suspense fallback={<SponsorSkeleton />}>
      <SponsorContent params={params} />
    </Suspense>
  );
}
