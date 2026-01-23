'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { PolicySkeleton } from '@/app/components/Skeleton';

export default function PolicyPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const [lang, setLang] = useState<Locale | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      setLang(p.lang);
      setIsLoading(false);
    });
  }, [params]);

  if (isLoading || !lang) {
    return <PolicySkeleton />;
  }

  const isEnglish = lang === 'en';

  return (
    <div className="policy-page-container">
      <article className="policy-page-content">
        {isEnglish ? (
          <>
            {/* PRIVACY POLICY - ENGLISH */}
            <h1>Privacy Policy</h1>

            <p>
              This Privacy Policy explains how we collect, use, and protect personal information
              when you use our website, mobile application, and related services ("Service").
            </p>

            <h2>Information We Collect</h2>
            <ul>
              <li>Name and email address (via Google / Facebook / Apple login)</li>
              <li>IP address and device information</li>
              <li>Cookies and usage data</li>
            </ul>

            <h2>How We Use Information</h2>
            <ul>
              <li>To authenticate users</li>
              <li>To improve our services</li>
              <li>To ensure security</li>
            </ul>

            <h2>Third-Party Services</h2>
            <p>
              We may use third-party authentication services such as Google, Meta (Facebook), and Apple.
            </p>

            <h2>Data Deletion</h2>
            <p>
              Users can request deletion of their account and personal data after logging in.
              Deleted data cannot be restored.
            </p>

            <h2>Contact</h2>
            <p>Email: <strong>nomadriseworld@gmail.com</strong></p>
          </>
        ) : (
          <>
            {/* PRIVACY POLICY - MONGOLIAN */}
            <h1>Нууцлалын бодлого</h1>

            <p>
              Манай веб сайт, мобайл апп болон түүнтэй холбоотой үйлчилгээ (цаашид "Үйлчилгээ") нь
              хэрэглэгчийн хувийн мэдээллийг Монгол Улсын холбогдох хууль тогтоомж болон
              олон улсын стандартын дагуу цуглуулж, ашиглаж, хамгаална.
            </p>

            <h2>Цуглуулах мэдээлэл</h2>
            <ul>
              <li>Нэр, и-мэйл хаяг (Google / Facebook / Apple нэвтрэлт)</li>
              <li>IP хаяг, төхөөрөмжийн мэдээлэл</li>
              <li>Cookie болон ашиглалтын мэдээлэл</li>
            </ul>

            <h2>Мэдээлэл ашиглах зорилго</h2>
            <ul>
              <li>Хэрэглэгчийг баталгаажуулах</li>
              <li>Үйлчилгээг сайжруулах</li>
              <li>Аюулгүй байдлыг хангах</li>
            </ul>

            <h2>Гуравдагч тал</h2>
            <p>
              Бид Google, Meta (Facebook), Apple зэрэг гуравдагч талын нэвтрэлтийн үйлчилгээг ашиглаж болно.
            </p>

            <h2>Мэдээлэл устгах</h2>
            <p>
              Хэрэглэгч бүртгэлдээ нэвтэрсний дараа өөрийн бүртгэл болон хувийн мэдээллийг устгах
              хүсэлт гаргах боломжтой. Устгасан мэдээллийг сэргээх боломжгүй.
            </p>

            <h2>Холбоо барих</h2>
            <p>И-мэйл: <strong>nomadriseworld@gmail.com</strong></p>
          </>
        )}
      </article>

      <style jsx>{`
        .policy-page-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
          min-height: 100vh;
        }

        .policy-page-content {
          color: #374151;
          line-height: 1.8;
        }

        .policy-page-content h1 {
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

        .policy-page-content h2 {
          font-size: 1.2rem;
          margin: 28px 0 12px 0;
          color: #1f2937;
          font-weight: 600;
        }

        .policy-page-content p {
          margin: 0 0 16px 0;
          font-size: 1rem;
        }

        .policy-page-content ul {
          margin: 12px 0 16px 0;
          padding-left: 24px;
        }

        .policy-page-content li {
          margin-bottom: 8px;
          font-size: 1rem;
        }

        .policy-page-content strong {
          color: #667eea;
          font-weight: 600;
        }

        @media (prefers-color-scheme: dark) {
          .policy-page-content {
            color: #d1d5db;
          }

          .policy-page-content h1,
          .policy-page-content h2 {
            color: #f3f4f6;
          }

          .last-updated {
            color: #9ca3af;
          }
        }

        @media (max-width: 640px) {
          .policy-page-container {
            padding: 20px 16px;
          }

          .policy-page-content h1 {
            font-size: 1.6rem;
          }

          .policy-page-content h2 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
