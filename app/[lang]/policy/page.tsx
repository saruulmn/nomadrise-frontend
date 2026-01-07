'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';

export default function PolicyPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const [lang, setLang] = useState<Locale>('mn');

  useEffect(() => {
    params.then((p) => {
      setLang(p.lang);
    });
  }, [params]);

  const isEnglish = lang === 'en';

  return (
    <div className="policy-page-container">
      <article className="policy-page-content">
        {isEnglish ? (
          <>
            {/* PRIVACY POLICY - ENGLISH */}
            <h1>Privacy Policy</h1>
            <p className="last-updated">Last updated: January 7, 2026</p>

            <p>
              This Privacy Policy describes how NomadRise ("we", "us", "our")
              collects, uses, and protects your personal information when you
              use our website and mobile application ("Service").
            </p>

            <h2>1. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul>
              <li><strong>Account Information:</strong> Name, email address, profile picture</li>
              <li><strong>Authentication Data:</strong> Unique user ID from social login providers (Google, Facebook, Apple)</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, operating system</li>
              <li><strong>Usage Data:</strong> Login history, pages visited, features used</li>
              <li><strong>Cookies:</strong> Session cookies, authentication tokens, analytics cookies</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul>
              <li>Create and manage your account</li>
              <li>Provide and improve our Service</li>
              <li>Authenticate your identity via social login</li>
              <li>Communicate with you about the Service</li>
              <li>Analyze usage patterns and improve user experience</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. Social Login (Google, Facebook, Apple)</h2>
            <p>
              You may sign in using Google, Facebook, or Apple. When you do, we
              receive your name, email address, profile picture, and a unique
              identifier from the provider. We do not receive or store your
              social network password.
            </p>

            <h2>4. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies for authentication,
              session management, and analytics. You can control cookies through
              your browser settings, but disabling them may affect Service
              functionality.
            </p>

            <h2>5. Third-Party Services</h2>
            <p>
              We use third-party services including Google, Meta (Facebook), and
              Apple for authentication. These providers have their own privacy
              policies. We are not responsible for their data practices.
            </p>

            <h2>6. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active
              or as needed to provide the Service. After account deletion, data
              is permanently removed within 30 days.
            </p>

            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and all associated data</li>
              <li>Withdraw consent at any time</li>
            </ul>

            <h2>8. Data Deletion</h2>
            <p>
              You can delete your account and all personal data directly within
              the app. While logged in, go to the <strong>Data Deletion</strong>{' '}
              page and click the "Request Account Deletion" button. No email
              required. Deletion is processed immediately or within 30 days
              maximum. This action is permanent and cannot be undone.
            </p>

            <h2>9. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal data against unauthorized access, alteration,
              or destruction.
            </p>

            <h2>10. Contact Us</h2>
            <p>
              For privacy-related questions, contact us at:{' '}
              <strong>nomadriseworld@gmail.com</strong>
            </p>
          </>
        ) : (
          <>
            {/* PRIVACY POLICY - MONGOLIAN */}
            <h1>Нууцлалын Бодлого</h1>
            <p className="last-updated">Сүүлд шинэчлэгдсэн: 2026 оны 1-р сарын 7</p>

            <p>
              Энэхүү Нууцлалын Бодлого нь NomadRise ("бид", "манай") таны хувийн
              мэдээллийг хэрхэн цуглуулж, ашиглаж, хамгаалж байгааг тодорхойлно.
            </p>

            <h2>1. Цуглуулах Мэдээлэл</h2>
            <p>Бид дараах төрлийн мэдээллийг цуглуулна:</p>
            <ul>
              <li><strong>Бүртгэлийн мэдээлэл:</strong> Нэр, и-мэйл хаяг, профайл зураг</li>
              <li><strong>Нэвтрэлтийн мэдээлэл:</strong> Нийгмийн сүлжээний (Google, Facebook, Apple) уник таних ID</li>
              <li><strong>Техникийн мэдээлэл:</strong> IP хаяг, браузер төрөл, төхөөрөмжийн мэдээлэл</li>
              <li><strong>Ашиглалтын мэдээлэл:</strong> Нэвтрэлтийн түүх, үзсэн хуудас, ашигласан боломжууд</li>
              <li><strong>Cookie:</strong> Сессийн cookie, нэвтрэлтийн token, аналитик cookie</li>
            </ul>

            <h2>2. Мэдээллийг Хэрхэн Ашиглах</h2>
            <p>Бид таны мэдээллийг дараах зорилгоор ашиглана:</p>
            <ul>
              <li>Бүртгэл үүсгэх, удирдах</li>
              <li>Үйлчилгээг хангах, сайжруулах</li>
              <li>Нийгмийн сүлжээгээр таныг таних</li>
              <li>Тантай холбогдох</li>
              <li>Ашиглалтын статистик шинжилгээ хийх</li>
              <li>Хуулийн үүргээ биелүүлэх</li>
            </ul>

            <h2>3. Нийгмийн Сүлжээгээр Нэвтрэх (Google, Facebook, Apple)</h2>
            <p>
              Та Google, Facebook, Apple-ээр нэвтрэх үед бид таны нэр, и-мэйл
              хаяг, профайл зураг, уник таних ID авна. Бид нийгмийн сүлжээний
              нууц үгийг хадгалдаггүй.
            </p>

            <h2>4. Cookie ба Хянах Технологи</h2>
            <p>
              Бид cookie болон ижил төстэй технологиудыг нэвтрэлт, сессийн
              удирдлага, аналитик зорилгоор ашиглана. Та браузерын тохиргоогоор
              cookie-г удирдах боломжтой.
            </p>

            <h2>5. Гуравдагч Талын Үйлчилгээ</h2>
            <p>
              Бид Google, Meta (Facebook), Apple-ийн нэвтрэлтийн үйлчилгээг
              ашигладаг. Эдгээр үйлчилгээ үзүүлэгчид өөрсдийн нууцлалын бодлоготой.
              Бид тэдний өгөгдлийн практикт хариуцлага хүлээхгүй.
            </p>

            <h2>6. Өгөгдөл Хадгалах Хугацаа</h2>
            <p>
              Таны бүртгэл идэвхтэй байх хугацаанд бид таны мэдээллийг хадгална.
              Бүртгэл устгасны дараа өгөгдлийг 30 хоногийн дотор бүрмөсөн устгана.
            </p>

            <h2>7. Таны Эрхүүд</h2>
            <p>Та дараах эрхтэй:</p>
            <ul>
              <li>Өөрийн мэдээлэлд хандах</li>
              <li>Буруу мэдээллийг засах</li>
              <li>Бүртгэл болон бүх мэдээллийг устгах</li>
              <li>Зөвшөөрлөө хүссэн үедээ цуцлах</li>
            </ul>

            <h2>8. Мэдээлэл Устгах</h2>
            <p>
              Та өөрийн бүртгэл болон бүх хувийн мэдээллийг апп дотроос шууд
              устгах боломжтой. Нэвтэрсэн үедээ <strong>Мэдээлэл Устгах</strong>{' '}
              хуудас руу орж "Бүртгэл Устгах Хүсэлт" товчийг дарна уу. И-мэйл
              шаардлагагүй. Устгалт шууд эсвэл хамгийн ихдээ 30 хоногийн дотор
              боловсруулагдана. Энэ үйлдэл бүрмөсөн бөгөөд буцаах боломжгүй.
            </p>

            <h2>9. Өгөгдлийн Аюулгүй Байдал</h2>
            <p>
              Бид таны хувийн мэдээллийг зөвшөөрөлгүй хандалт, өөрчлөлт, устгалтаас
              хамгаалах зохих техникийн болон зохион байгуулалтын арга хэмжээг
              хэрэгжүүлдэг.
            </p>

            <h2>10. Холбоо Барих</h2>
            <p>
              Нууцлалтай холбоотой асуултаа дараах хаягаар илгээнэ үү:{' '}
              <strong>nomadriseworld@gmail.com</strong>
            </p>
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
