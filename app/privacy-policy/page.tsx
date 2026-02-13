import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Privacy Policy | NomadRise',
  description: 'Privacy Policy for NomadRise - Learn how we collect and protect your data',
  robots: 'follow, index',
};

export default function PrivacyPolicyRedirect() {
  redirect('/en/policy');
}
