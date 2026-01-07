'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';

export default function TermsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const [lang, setLang] = useState<Locale>('mn');

  useEffect(() => {
    params.then((p) => {
      setLang(p.lang);
    });
  }, [params]);

  const isEnglish = lang === 'en';

  return (
    <div className="terms-page-container">
      <article className="terms-page-content">
        {isEnglish ? (
          <>
            {/* TERMS OF SERVICE - ENGLISH */}
            <h1>Terms of Service</h1>

            <p>
              These Terms govern your use of our website, mobile application, and related services.
            </p>

            <h2>Use of Service</h2>
            <p>
              You agree to use the Service only for lawful purposes.
            </p>

            <h2>Account Responsibility</h2>
            <p>
              You are responsible for maintaining the security of your account.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              The Service is provided "as is" without warranties of any kind.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All content on the Service is protected by intellectual property laws.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms are governed by the laws of Mongolia.
            </p>
          </>
        ) : (
          <>
            {/* TERMS OF SERVICE - MONGOLIAN */}
            <h1>Үйлчилгээ ашиглах нөхцөл</h1>

            <p>
              Энэхүү нөхцөл нь манай Үйлчилгээг ашиглахтай холбоотой хэрэглэгчийн эрх, үүрэг,
              болон хариуцлагыг тодорхойлно.
            </p>

            <h2>Үйлчилгээ ашиглах</h2>
            <p>
              Хэрэглэгч Үйлчилгээг зөвхөн хууль ёсны зорилгоор ашиглана.
            </p>

            <h2>Бүртгэл</h2>
            <p>
              Хэрэглэгч өөрийн бүртгэлийн аюулгүй байдлыг хариуцна.
            </p>

            <h2>Хариуцлага</h2>
            <p>
              Үйлчилгээ нь "байгаа чигээрээ" олгогдож байгаа бөгөөд тасалдал, алдаанд бид хариуцлага
              хүлээхгүй.
            </p>

            <h2>Оюуны өмч</h2>
            <p>
              Үйлчилгээ дээрх бүх контент нь зохиогчийн эрхээр хамгаалагдсан.
            </p>

            <h2>Хууль, маргаан</h2>
            <p>
              Эдгээр нөхцөл нь Монгол Улсын хууль тогтоомжид захирагдана.
            </p>
          </>
        )}
      </article>

      <style jsx>{`
        .terms-page-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
          min-height: 100vh;
        }

        .terms-page-content {
          color: #374151;
          line-height: 1.8;
        }

        .terms-page-content h1 {
          font-size: 2rem;
          margin: 0 0 8px 0;
          color: #1f2937;
          font-weight: 700;
        }

        .last-updated {
          font-size: 0.9rem;
          color: #6b7280;
          margin-bottom: 24px;
          font-style: italic;
        }

        .terms-page-content h2 {
          font-size: 1.2rem;
          margin: 28px 0 12px 0;
          color: #1f2937;
          font-weight: 600;
        }

        .terms-page-content p {
          margin: 0 0 16px 0;
          font-size: 1rem;
        }

        .terms-page-content ul {
          margin: 12px 0 16px 0;
          padding-left: 24px;
        }

        .terms-page-content li {
          margin-bottom: 8px;
          font-size: 1rem;
        }

        .terms-page-content strong {
          color: #667eea;
          font-weight: 600;
        }

        @media (prefers-color-scheme: dark) {
          .terms-page-content {
            color: #d1d5db;
          }

          .terms-page-content h1,
          .terms-page-content h2 {
            color: #f3f4f6;
          }

          .last-updated {
            color: #9ca3af;
          }
        }

        @media (max-width: 640px) {
          .terms-page-container {
            padding: 20px 16px;
          }

          .terms-page-content h1 {
            font-size: 1.6rem;
          }

          .terms-page-content h2 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
