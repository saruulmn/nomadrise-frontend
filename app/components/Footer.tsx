import Link from 'next/link';
import type { Locale } from '@/i18n/config';

interface FooterProps {
  lang: Locale;
  dictionary: any;
}

export default function Footer({ lang, dictionary }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-links">
          <Link href={`/${lang}/terms`}>{dictionary.footer.terms}</Link>
          <Link href={`/${lang}/policy`}>{dictionary.footer.policy}</Link>
          <a href="https://nomadrise.mn/en/policy" target="_blank" rel="noopener noreferrer" title="Privacy Policy">
            Privacy Policy
          </a>
          <a href="https://nomadrise.mn/mn/policy" target="_blank" rel="noopener noreferrer" title="Нууцлалын бодлого">
            Нууцлалын бодлого
          </a>
        </div>
        <div className="footer-copy">
          © {new Date().getFullYear()} NomadRise. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
