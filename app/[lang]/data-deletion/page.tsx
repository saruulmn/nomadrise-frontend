'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { Locale } from '@/i18n/config';
import { DataDeletionSkeleton } from '@/app/components/Skeleton';

type Params = {
  params: Promise<{ lang: Locale }>;
};

export default function DataDeletionPage({ params }: Params) {
  const { data: session, status } = useSession();
  const [lang, setLang] = useState<Locale | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      setLang(p.lang);
      setIsPageLoading(false);
    });
  }, [params]);

  const isEnglish = lang === 'en';
  const isLoading = status === 'loading';
  const isLoggedIn = status === 'authenticated' && session?.user;

  if (isPageLoading || !lang) {
    return <DataDeletionSkeleton />;
  }

  const handleDataDeletionRequest = async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    setError(null);

    try {
      // Use centralized authApi for account deletion
      const { deleteAccount } = await import('@/lib/api');
      await deleteAccount({
        email: session?.user?.email,
        provider: session?.user?.provider || 'unknown',
        provider_account_id: session?.user?.providerAccountId || session?.user?.id || '',
      });

      setSubmitted(true);
    } catch (err) {
      setError(
        isEnglish
          ? 'Failed to delete account. Please try again or email nomadriseworld@gmail.com'
          : 'Бүртгэл устгахад алдаа гарлаа. Дахин оролдоно уу эсвэл nomadriseworld@gmail.com руу и-мэйл илгээнэ үү'
      );
      console.error('Data deletion error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <main className="data-deletion-container">
        <section className="data-deletion-section">
          <p>{isEnglish ? 'Loading...' : 'Ачаалаж байна...'}</p>
        </section>
      </main>
    );
  }

  return (
    <main className="data-deletion-container">
      {!submitted ? (
        <section className="data-deletion-section">
          {isEnglish ? (
            <>
              <h1>Request Account & Data Deletion</h1>
              <p className="intro-text">
                In compliance with data protection regulations, NomadRise provides
                users with the right to request deletion of their account and
                associated personal data.
              </p>

              <div className="info-card">
                <h2>Who Can Request Deletion</h2>
                <p>
                  Users who signed in using Google, Facebook, or Apple accounts
                  can request complete deletion of their account and all
                  associated personal data.
                </p>
              </div>

              <div className="info-card">
                <h2>What Gets Deleted</h2>
                <ul>
                  <li>Your account profile and login credentials</li>
                  <li>Personal information (name, email, profile picture)</li>
                  <li>Application history and submissions</li>
                  <li>Saved preferences and settings</li>
                  <li>All associated user data</li>
                </ul>
              </div>

              <div className="info-card warning">
                <h2>⚠️ Important Notice</h2>
                <p>
                  <strong>This action is permanent.</strong> Once your account
                  and data are deleted, they cannot be recovered. This process
                  cannot be undone.
                </p>
                <p>
                  Data deletion requests are processed within{' '}
                  <strong>30 days</strong> from submission.
                </p>
              </div>

              {isLoggedIn ? (
                <div className="action-section">
                  {error && <div className="error-message">{error}</div>}
                  <button
                    onClick={handleDataDeletionRequest}
                    disabled={loading}
                    className="deletion-button"
                  >
                    {loading ? 'Submitting...' : 'Request Account Deletion'}
                  </button>
                  <p className="helper-text">
                    By clicking this button, you request permanent deletion of
                    your account and all associated data.
                  </p>
                </div>
              ) : (
                <div className="login-required">
                  <div className="info-box">
                    <h3>Sign In Required</h3>
                    <p>
                      You must be logged in to submit a data deletion request.
                    </p>
                    <p>
                      Please sign in with the same account (Google, Facebook, or
                      Apple) you used to create your account.
                    </p>
                  </div>
                </div>
              )}

              <div className="contact-section">
                <h2>Need Help?</h2>
                <p>
                  If you have questions about data deletion, please contact us
                  at <strong>nomadriseworld@gmail.com</strong>
                </p>
              </div>
            </>
          ) : (
            <>
              <h1>Бүртгэл ба Мэдээлэл Устгах Хүсэлт</h1>
              <p className="intro-text">
                Өгөгдлийн хамгаалалтын хуулийг сахиалтан, NomadRise нь
                хэрэглэгчдэд өөрсдийн бүртгэл болон холбогдох хувийн мэдээллийг
                устгуулах эрхийг олгодог.
              </p>

              <div className="info-card">
                <h2>Хэн Устгуулж Болох</h2>
                <p>
                  Google, Facebook, Apple-ээр нэвтэрсэн хэрэглэгчид өөрсдийн
                  бүртгэл болон түүнтэй холбогдох бүх хувийн мэдээллийг
                  бүрмөсөн устгуулах боломжтой.
                </p>
              </div>

              <div className="info-card">
                <h2>Юу Устгагдах Вэ</h2>
                <ul>
                  <li>Таны бүртгэл ба нэвтрэх мэдээлэл</li>
                  <li>Хувийн мэдээлэл (нэр, и-мэйл, профайл зураг)</li>
                  <li>Өргөдлийн түүх ба гаргасан хүсэлт</li>
                  <li>Хадгалсан сонголт ба тохиргоо</li>
                  <li>Холбогдох бүх хэрэглэгчийн мэдээлэл</li>
                </ul>
              </div>

              <div className="info-card warning">
                <h2>⚠️ Чухал Мэдэгдэл</h2>
                <p>
                  <strong>Энэ үйлдэл нь бүрмөсөн юм.</strong> Таны бүртгэл ба
                  мэдээлэл устгагдсаны дараа сэргээх боломжгүй. Энэ үйлдлийг
                  эргүүлж болохгүй.
                </p>
                <p>
                  Мэдээлэл устгах хүсэлтийг гаргасан өдрөөс{' '}
                  <strong>30 хоног</strong> дотор боловсруулна.
                </p>
              </div>

              {isLoggedIn ? (
                <div className="action-section">
                  {error && <div className="error-message">{error}</div>}
                  <button
                    onClick={handleDataDeletionRequest}
                    disabled={loading}
                    className="deletion-button"
                  >
                    {loading ? 'Илгээж байна...' : 'Бүртгэл Устгах Хүсэлт'}
                  </button>
                  <p className="helper-text">
                    Энэ товчлуурыг дарах замаар та өөрийн бүртгэл болон түүнтэй
                    холбогдох бүх мэдээллийг бүрмөсөн устгуулахыг хүсэж байна.
                  </p>
                </div>
              ) : (
                <div className="login-required">
                  <div className="info-box">
                    <h3>Нэвтрэх Шаардлагатай</h3>
                    <p>
                      Мэдээлэл устгах хүсэлт гаргахын тулд та нэвтрэх ёстой.
                    </p>
                    <p>
                      Та өөрийн бүртгэл үүсгэхэд ашигласан тэр же дансаар
                      (Google, Facebook, Apple) нэвтрэнэ үү.
                    </p>
                  </div>
                </div>
              )}

              <div className="contact-section">
                <h2>Тусламж Хэрэгтэй Юу?</h2>
                <p>
                  Мэдээлэл устгахтай холбоотой асуулт байвал дараах хаягаар
                  холбогдоно уу: <strong>nomadriseworld@gmail.com</strong>
                </p>
              </div>
            </>
          )}
        </section>
      ) : (
        <section className="data-deletion-section">
          <div className="success-message">
            <h2>✓ {isEnglish ? 'Request Submitted' : 'Хүсэлт Илгээгдлээ'}</h2>
            <p>
              {isEnglish
                ? 'Your data deletion request has been successfully submitted. Our team will process your request within 30 days.'
                : 'Таны мэдээлэл устгах хүсэлт амжилттай илгээгдлээ. Бидний баг таны хүсэлтийг 30 хоногийн дотор боловсруулах болно.'}
            </p>
            <p className="confirmation-email">
              {isEnglish
                ? 'You will receive a confirmation email at your registered email address.'
                : 'Та бүртгэлтэй холбогдсон и-мэйл хаягаа баталгаажуулах и-мэйл хүлээн авах болно.'}
            </p>
          </div>
        </section>
      )}

      <style jsx>{`
        .data-deletion-container {
          max-width: 900px;
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

        .intro-text {
          font-size: 1.1rem;
          color: #6b7280;
          line-height: 1.8;
          margin-bottom: 32px;
        }

        .info-card {
          background: #f9fafb;
          border-radius: 8px;
          padding: 24px;
          margin-bottom: 24px;
          border-left: 4px solid #667eea;
        }

        .info-card h2 {
          font-size: 1.3rem;
          color: #1f2937;
          margin: 0 0 12px 0;
          font-weight: 600;
        }

        .info-card p {
          color: #374151;
          line-height: 1.8;
          margin: 0 0 12px 0;
        }

        .info-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-card li {
          color: #374151;
          line-height: 1.8;
          padding: 8px 0 8px 24px;
          position: relative;
        }

        .info-card li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #667eea;
          font-weight: bold;
        }

        .info-card.warning {
          border-left-color: #ef4444;
          background: #fef2f2;
        }

        .info-card.warning h2 {
          color: #dc2626;
        }

        .info-card.warning p {
          color: #7f1d1d;
        }

        .action-section {
          margin: 32px 0;
          padding: 24px;
          background: #f0f4ff;
          border-radius: 8px;
          text-align: center;
        }

        .deletion-button {
          background: #dc2626;
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 16px;
        }

        .deletion-button:hover:not(:disabled) {
          background: #b91c1c;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
        }

        .deletion-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .helper-text {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0;
          line-height: 1.6;
        }

        .login-required {
          margin: 32px 0;
        }

        .info-box {
          background: #eff6ff;
          border: 2px solid #3b82f6;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
        }

        .info-box h3 {
          color: #1e40af;
          margin: 0 0 12px 0;
          font-size: 1.2rem;
        }

        .info-box p {
          color: #1e40af;
          margin: 12px 0;
          line-height: 1.8;
        }

        .contact-section {
          margin-top: 40px;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .contact-section h2 {
          color: #1f2937;
          margin: 0 0 12px 0;
        }

        .contact-section p {
          color: #374151;
        }

        .contact-section strong {
          color: #667eea;
        }

        .error-message {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 16px;
          font-size: 0.95rem;
        }

        .success-message {
          background: #f0fdf4;
          border-left: 4px solid #16a34a;
          padding: 32px;
          border-radius: 8px;
          text-align: center;
        }

        .success-message h2 {
          color: #16a34a;
          margin: 0 0 16px 0;
          font-size: 1.5rem;
        }

        .success-message p {
          color: #15803d;
          line-height: 1.8;
          margin: 12px 0;
        }

        .confirmation-email {
          font-size: 0.95rem;
          font-style: italic;
        }

        @media (prefers-color-scheme: dark) {
          .data-deletion-section {
            background: #1f2937;
            color: #d1d5db;
          }

          .data-deletion-section h1 {
            color: #f3f4f6;
          }

          .intro-text {
            color: #9ca3af;
          }

          .info-card {
            background: #111827;
            border-left-color: #667eea;
          }

          .info-card h2,
          .info-card p,
          .info-card li {
            color: #d1d5db;
          }

          .info-card.warning {
            background: rgba(220, 38, 38, 0.1);
          }

          .info-card.warning h2,
          .info-card.warning p {
            color: #fca5a5;
          }

          .action-section {
            background: rgba(102, 126, 234, 0.1);
          }

          .helper-text {
            color: #9ca3af;
          }

          .info-box {
            background: rgba(59, 130, 246, 0.1);
            border-color: #3b82f6;
          }

          .info-box h3,
          .info-box p {
            color: #93c5fd;
          }

          .contact-section {
            border-top-color: #374151;
          }

          .contact-section h2 {
            color: #f3f4f6;
          }

          .contact-section p {
            color: #d1d5db;
          }

          .success-message {
            background: rgba(22, 163, 74, 0.1);
            border-left-color: #16a34a;
          }

          .success-message h2 {
            color: #86efac;
          }

          .success-message p {
            color: #86efac;
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

          .info-card {
            padding: 16px;
          }

          .info-card h2 {
            font-size: 1.1rem;
          }

          .deletion-button {
            width: 100%;
            padding: 12px 16px;
          }
        }
      `}</style>
    </main>
  );
}

