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
            <p className="last-updated">Last updated: January 7, 2026</p>

            <p>
              By accessing or using NomadRise ("Service"), you agree to be bound
              by these Terms of Service ("Terms"). If you disagree with any part
              of these Terms, you may not access the Service.
            </p>

            <h2>1. Service Description</h2>
            <p>
              NomadRise provides information, digital content, scholarship
              listings, and educational resources through our website and mobile
              application.
            </p>

            <h2>2. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate information when creating an account</li>
              <li>Maintain the security of your login credentials</li>
              <li>Use the Service only for lawful purposes</li>
              <li>Not engage in fraudulent, abusive, or harmful activities</li>
              <li>Not violate the rights of others</li>
            </ul>

            <h2>3. Account Termination</h2>
            <p>
              We may suspend or terminate your account if you violate these
              Terms. You may delete your account at any time through the in-app
              Data Deletion feature.
            </p>

            <h2>4. Intellectual Property</h2>
            <p>
              All content, logos, designs, and software on the Service are owned
              by NomadRise or our licensors and protected by intellectual
              property laws. Unauthorized use, copying, or distribution is
              prohibited.
            </p>

            <h2>5. Service Availability</h2>
            <p>
              The Service is provided "as is" without warranty. We do not
              guarantee uninterrupted or error-free operation. We may modify,
              suspend, or discontinue the Service at any time without notice.
            </p>

            <h2>6. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, NomadRise shall not be
              liable for any indirect, incidental, special, or consequential
              damages arising from your use of the Service.
            </p>

            <h2>7. Governing Law</h2>
            <p>
              These Terms are governed by the laws of Mongolia. Any disputes
              shall be resolved by the competent courts of Mongolia.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to update these Terms at any time. Continued
              use of the Service after changes constitutes acceptance of the new
              Terms.
            </p>

            <h2>9. Contact</h2>
            <p>
              Email: <strong>nomadriseworld@gmail.com</strong>
              <br />
              Location: Ulaanbaatar, Mongolia
            </p>
          </>
        ) : (
          <>
            {/* TERMS OF SERVICE - MONGOLIAN */}
            <h1>Үйлчилгээний Нөхцөл</h1>
            <p className="last-updated">Сүүлд шинэчлэгдсэн: 2026 оны 1-р сарын 7</p>

            <p>
              NomadRise ("Үйлчилгээ")-г ашигласнаар та энэхүү Үйлчилгээний
              Нөхцөл ("Нөхцөл")-ийг хүлээн зөвшөөрч байна. Хэрэв та энэ Нөхцөлтэй
              санал нийлэхгүй бол Үйлчилгээг ашиглах эрхгүй.
            </p>

            <h2>1. Үйлчилгээний Тодорхойлолт</h2>
            <p>
              NomadRise нь мэдээлэл, дижитал контент, тэтгэлгийн жагсаалт,
              боловсролын материалыг веб сайт болон мобайл аппликейшнээр
              дамжуулан хүргэдэг.
            </p>

            <h2>2. Хэрэглэгчийн Үүрэг</h2>
            <p>Та дараахийг зөвшөөрч байна:</p>
            <ul>
              <li>Бүртгэл үүсгэхдээ үнэн зөв мэдээлэл өгөх</li>
              <li>Нэвтрэх мэдээллийнхээ аюулгүй байдлыг хадгалах</li>
              <li>Үйлчилгээг зөвхөн хууль ёсны зорилгоор ашиглах</li>
              <li>Залилан, доромжлол, хортой үйлдэл хийхгүй байх</li>
              <li>Бусдын эрхийг зөрчихгүй байх</li>
            </ul>

            <h2>3. Бүртгэл Цуцлах</h2>
            <p>
              Та энэ Нөхцөлийг зөрчвөл бид таны бүртгэлийг түдгэлзүүлэх эсвэл
              цуцлах эрхтэй. Та хүссэн үедээ апп дотор Мэдээлэл Устгах
              боломжоор бүртгэлээ устгаж болно.
            </p>

            <h2>4. Оюуны Өмч</h2>
            <p>
              Үйлчилгээ дээрх бүх контент, лого, дизайн, програм хангамж нь
              NomadRise эсвэл манай лицензийн эзэмшигчдийн өмч бөгөөд оюуны
              өмчийн хуулиар хамгаалагдсан. Зөвшөөрөлгүй ашиглах, хуулбарлах,
              түгээхийг хориглоно.
            </p>

            <h2>5. Үйлчилгээний Хүртээмж</h2>
            <p>
              Үйлчилгээг "байгаа чигээрээ" баталгаагүй хангана. Бид тасралтгүй,
              алдаагүй ажиллагааг баталгаажуулахгүй. Бид хүссэн үедээ Үйлчилгээг
              өөрчлөх, түдгэлзүүлэх, зогсоох эрхтэй.
            </p>

            <h2>6. Хариуцлагын Хязгаарлалт</h2>
            <p>
              Хуулиар зөвшөөрөгдсөн хэмжээнд NomadRise таны Үйлчилгээ ашигласнаас
              үүдэлтэй аливаа шууд бус, санамсаргүй, онцгой, эсвэл үр дагавар
              бүхий хохиролд хариуцлага хүлээхгүй.
            </p>

            <h2>7. Хэрэглэх Хууль</h2>
            <p>
              Энэхүү Нөхцөлийг Монгол Улсын хуулиар зохицуулна. Аливаа маргааныг
              Монгол Улсын шүүхээр шийдвэрлэнэ.
            </p>

            <h2>8. Нөхцөлийн Өөрчлөлт</h2>
            <p>
              Бид энэ Нөхцөлийг хүссэн үедээ шинэчлэх эрхтэй. Өөрчлөлтийн дараа
              Үйлчилгээг үргэлжлүүлэн ашиглах нь шинэ Нөхцөлийг хүлээн зөвшөөрсөн
              гэж тооцогдоно.
            </p>

            <h2>9. Холбоо Барих</h2>
            <p>
              Имэйл: <strong>nomadriseworld@gmail.com</strong>
              <br />
              Байршил: Улаанбаатар хот, Монгол Улс
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
