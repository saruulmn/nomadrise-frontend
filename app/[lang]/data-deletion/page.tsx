'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';

type Params = {
  params: Promise<{ lang: Locale }>;
};

export default function DataDeletionPage({ params }: Params) {
  const [lang, setLang] = useState<Locale>('mn');

  useEffect(() => {
    params.then((p) => {
      setLang(p.lang);
    });
  }, [params]);

  const isEnglish = lang === 'en';

  return (
    <main className="data-deletion-container">
      {isEnglish ? (
        <section className="data-deletion-section">
          <h1>Data Deletion Instructions</h1>
          <p>
            Users who signed in using social login (Google, Facebook, or Apple)
            may request deletion of their account and personal data.
          </p>
          <p>
            Please email <strong>info@website.mn</strong> with the following
            information:
          </p>
          <ul>
            <li>Your full name</li>
            <li>The email address associated with your account</li>
            <li>Request for account and data deletion</li>
          </ul>
          <p className="notice">
            Data deletion requests are processed within 30 days. Once deleted,
            your account and all associated data cannot be recovered.
          </p>
        </section>
      ) : (
        <section className="data-deletion-section">
          <h1>Мэдээлэл Устгах Заавар</h1>
          <p>
            Нийгмийн сүлжээгээр (Google, Facebook, Apple) нэвтрэл ашиглан
            бүртгүүлсэн хэрэглэгч өөрийн бүртгэл болон хувийн мэдээллийг
            устгуулах хүсэлт гаргах боломжтой.
          </p>
          <p>
            Дараах мэдээллийг агуулсан и-мэйлийг
            <strong> info@website.mn </strong>
            хаяг руу илгээнэ үү:
          </p>
          <ul>
            <li>Овог, нэр</li>
            <li>Таны бүртгэлтэй холбогдсон и-мэйл хаяг</li>
            <li>Бүртгэл болон мэдээлэл устгуулах хүсэлт</li>
          </ul>
          <p className="notice">
            Хүсэлтийг 30 хоногийн дотор боловсруулна. Устгаж салгасан бүртгэл
            болон түүнтэй холбогдсон бүх мэдээллийг сэргээх боломжгүй.
          </p>
        </section>
      )}

      <style jsx>{`
        .data-deletion-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          min-height: 100vh;
        }

        .data-deletion-section {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .data-deletion-section h1 {
          font-size: 2rem;
          color: #1f2937;
          margin: 0 0 24px 0;
          font-weight: 700;
        }

        .data-deletion-section p {
          font-size: 1rem;
          color: #374151;
          line-height: 1.8;
          margin: 0 0 16px 0;
        }

        .data-deletion-section ul {
          list-style: none;
          padding: 0;
          margin: 16px 0;
        }

        .data-deletion-section li {
          font-size: 1rem;
          color: #374151;
          line-height: 1.8;
          padding: 12px 0 12px 28px;
          position: relative;
        }

        .data-deletion-section li:before {
          content: '•';
          position: absolute;
          left: 0;
          color: #667eea;
          font-weight: bold;
          font-size: 1.2rem;
        }

        .data-deletion-section strong {
          color: #667eea;
          font-weight: 600;
        }

        .notice {
          background: #f0f4ff;
          border-left: 4px solid #667eea;
          padding: 16px;
          border-radius: 6px;
          margin: 24px 0 0 0 !important;
          color: #374151;
        }

        @media (prefers-color-scheme: dark) {
          .data-deletion-section {
            background: #1f2937;
            color: #d1d5db;
          }

          .data-deletion-section h1 {
            color: #f3f4f6;
          }

          .data-deletion-section p,
          .data-deletion-section li {
            color: #d1d5db;
          }

          .notice {
            background: rgba(102, 126, 234, 0.1);
            color: #d1d5db;
          }
        }

        @media (max-width: 640px) {
          .data-deletion-container {
            padding: 20px 16px;
          }

          .data-deletion-section {
            padding: 24px;
          }

          .data-deletion-section h1 {
            font-size: 1.5rem;
          }

          .data-deletion-section p,
          .data-deletion-section li {
            font-size: 0.95rem;
          }
        }
      `}</style>
    </main>
  );
}
