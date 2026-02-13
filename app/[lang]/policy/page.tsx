import type { Locale } from '@/i18n/config';
import type { Metadata } from 'next';
import PrivacyPolicyContent from './PrivacyPolicyContent';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const isEnglish = lang === 'en';

  return {
    title: isEnglish ? 'Privacy Policy | NomadRise' : 'Нууцлалын бодлого | NomadRise',
    description: isEnglish
      ? 'Privacy Policy for NomadRise - Learn how we collect and protect your personal data'
      : 'NomadRise-ийн нууцлалын бодлого - Бид хэрхэн таны хувийн мэдээллийг цуглуулж, хамгаалж байгаа талаар үзнэ үү',
    robots: 'follow, index',
    alternates: {
      canonical: `https://nomadrise.mn/${lang}/policy`,
      languages: {
        en: 'https://nomadrise.mn/en/policy',
        mn: 'https://nomadrise.mn/mn/policy',
      },
    },
    openGraph: {
      title: isEnglish ? 'Privacy Policy | NomadRise' : 'Нууцлалын бодлого | NomadRise',
      description: isEnglish
        ? 'Privacy Policy for NomadRise'
        : 'NomadRise-ийн нууцлалын бодлого',
      url: `https://nomadrise.mn/${lang}/policy`,
      type: 'website',
      siteName: 'NomadRise',
      locale: lang === 'mn' ? 'mn_MN' : 'en_US',
    },
  };
}

export default async function PolicyPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;

  return <PrivacyPolicyContent lang={lang} />;
}
