'use client';

import { useEffect, useState } from 'react';
import { getDictionary } from '@/i18n/dictionaries';
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
            <h1>Terms of Service & Privacy Policy</h1>

            <p>
              This document ("Terms") governs the rights, obligations, and
              responsibilities of users ("User") when using our website, mobile
              application, and all related services ("Service"), as well as how
              personal data is collected, used, and protected. By using the
              Service, the User is deemed to have read, understood, and agreed
              to these Terms.
            </p>

            <h2>1. General</h2>
            <p>
              The Service provides information, recommendations, digital
              content, and online features. We reserve the right to update or
              modify these Terms at any time. Updated versions take effect upon
              publication.
            </p>

            <h2>2. Age and Legal Capacity</h2>
            <p>
              Users must have legal capacity to enter into agreements under the
              laws of Mongolia. Users under the age of 16 may use the Service
              only with parental or legal guardian consent.
            </p>

            <h2>3. User Rights and Obligations</h2>
            <p>
              Users must use the Service lawfully, fairly, and for personal
              purposes only. Any unlawful, abusive, fraudulent, or
              rights-infringing activities are strictly prohibited. Users are
              responsible for maintaining the security of their account
              credentials.
            </p>

            <h2>4. Collection and Use of Personal Data</h2>
            <p>We may collect the following information:</p>
            <ul>
              <li>Registration information (name, email address, contact details)</li>
              <li>
                Usage data (login history, IP address, cookies, device
                information)
              </li>
              <li>Feedback, inquiries, and requests provided by the User</li>
            </ul>
            <p>
              Personal data is used to operate and improve the Service,
              communicate with users, and comply with legal obligations. All
              personal data is protected in accordance with the Law on Personal
              Data Protection of Mongolia and applicable regulations.
            </p>

            <h2>5. Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar technologies to enhance user experience
              and perform analytics. Users may disable or limit cookies through
              their browser settings.
            </p>

            <h2>6. Social Authentication (Social Login)</h2>
            <p>
              Users may sign in to the Service using third-party platforms such
              as Google, Facebook, or Apple.
            </p>
            <p>When using social login, we may receive the following information:</p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Profile picture (if permitted)</li>
              <li>A unique user identifier</li>
            </ul>
            <p>
              We do not receive or store social network passwords. Data obtained
              via social login is used solely for account creation,
              authentication, and operation of the Service. Users may revoke
              social login access at any time through the respective platform's
              settings.
            </p>

            <h2>7. Third-Party Services</h2>
            <p>
              The Service may contain links to third-party websites or services.
              We are not responsible for the privacy practices or content of
              such third parties. Users are subject to the terms and policies of
              those third parties.
            </p>

            <h2>8. Modification or Termination of Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue all or
              part of the Service at any time. We are not liable for any direct
              or indirect damages resulting from such changes.
            </p>

            <h2>9. Intellectual Property</h2>
            <p>
              All content, text, images, logos, designs, and software on the
              Service are protected by intellectual property laws and owned by
              us or rightful owners. Unauthorized use, reproduction, or
              distribution is prohibited.
            </p>

            <h2>10. Limitation of Liability</h2>
            <p>
              The Service is provided "as is" without warranties of any kind. We
              are not liable for damages arising from the use or inability to
              use the Service, except as required by law.
            </p>

            <h2>11. Governing Law and Dispute Resolution</h2>
            <p>
              These Terms are governed by the laws of Mongolia. Any disputes
              shall be resolved by the competent courts of Mongolia.
            </p>

            <h2>12. Contact Information</h2>
            <p>
              For questions regarding these Terms or personal data, please
              contact us:
            </p>
            <p>
              Email: <strong>nomadriseworld@gmail.com</strong>
              <br />
              Address: Ulaanbaatar, Mongolia
            </p>
          </>
        ) : (
          <>
            <h1>ҮЙЛЧИЛГЭЭ АШИГЛАХ НӨХЦӨЛ БА ХУВИЙН МЭДЭЭЛЭЛ ХАМГААЛАХ БОДЛОГО</h1>

            <p>
              Энэхүү баримт бичиг (цаашид "Нөхцөл") нь манай веб сайт, мобайл
              апп болон түүнтэй холбогдсон бүх үйлчилгээ (цаашид "Үйлчилгээ")-г
              ашиглахтай холбоотой хэрэглэгч (цаашид "Хэрэглэгч")-ийн эрх, үүрэг,
              хариуцлага болон хувийн мэдээлэл цуглуулах, ашиглах, хамгаалах
              журмыг тодорхойлно. Хэрэглэгч Үйлчилгээг ашигласнаар энэхүү
              Нөхцөлийг бүрэн уншиж танилцан, хүлээн зөвшөөрсөнд тооцогдоно.
            </p>

            <h2>1. Ерөнхий нөхцөл</h2>
            <p>
              Үйлчилгээ нь мэдээлэл, зөвлөмж, дижитал контент болон онлайн
              боломжуудыг хэрэглэгчдэд хүргэх зорилготой. Бид эдгээр Нөхцөлийг
              шаардлагатай тохиолдолд шинэчлэх, өөрчлөх эрхтэй бөгөөд
              шинэчилсэн хувилбар нийтлэгдсэн өдрөөс эхлэн хүчин төгөлдөр
              үйлчилнэ.
            </p>

            <h2>2. Нас болон эрх зүйн чадвар</h2>
            <p>
              Хэрэглэгч нь Монгол Улсын хууль тогтоомжийн дагуу гэрээ байгуулах
              эрх зүйн чадвартай байх ёстой. 16-аас доош насны хэрэглэгч
              Үйлчилгээг ашиглахдаа эцэг, эх эсвэл хууль ёсны асран
              хамгаалагчийн зөвшөөрөлтэй байна.
            </p>

            <h2>3. Хэрэглэгчийн эрх, үүрэг</h2>
            <p>
              Хэрэглэгч нь Үйлчилгээг зөвхөн хууль ёсны, шударга, хувийн
              зорилгоор ашиглана. Бусдын эрх, нэр төр, хууль ёсны ашиг
              сонирхлыг зөрчих, хууль бус, доромж, залилангийн шинжтэй үйлдэл
              хийхийг хатуу хориглоно. Хэрэглэгч өөрийн бүртгэлийн мэдээлэл,
              нууц үгийн аюулгүй байдлыг бүрэн хариуцна.
            </p>

            <h2>4. Хувийн мэдээлэл цуглуулах, ашиглах</h2>
            <p>Бид дараах төрлийн мэдээллийг цуглуулж болно:</p>
            <ul>
              <li>Бүртгэлийн мэдээлэл (нэр, и-мэйл хаяг, холбоо барих мэдээлэл)</li>
              <li>
                Үйлчилгээ ашиглалтын мэдээлэл (нэвтрэлтийн түүх, IP хаяг,
                cookie, төхөөрөмжийн мэдээлэл)
              </li>
              <li>Хэрэглэгчийн өгсөн санал, асуулга, хүсэлт</li>
            </ul>
            <p>
              Эдгээр мэдээллийг Үйлчилгээг сайжруулах, хэрэглэгчтэй харилцах,
              хууль ёсны үүргээ биелүүлэх зорилгоор ашиглана. Хувийн мэдээллийг
              Монгол Улсын Хувийн мэдээлэл хамгаалах тухай хууль болон
              холбогдох бусад хууль тогтоомжийн дагуу хамгаална.
            </p>

            <h2>5. Cookie болон ижил төрлийн технологи</h2>
            <p>
              Манай сайт, апп нь хэрэглэгчийн туршлагыг сайжруулах, статистик
              шинжилгээ хийх зорилгоор cookie болон ижил төстэй технологи
              ашиглаж болно. Хэрэглэгч өөрийн браузерын тохиргоогоор cookie-г
              хязгаарлах, идэвхгүй болгох боломжтой.
            </p>

            <h2>6. Нийгмийн сүлжээ ашиглан нэвтрэх (Social Authentication)</h2>
            <p>
              Хэрэглэгч Google, Facebook, Apple зэрэг гуравдагч талын нийгмийн
              сүлжээний бүртгэлээр дамжуулан Үйлчилгээнд нэвтрэх боломжтой.
            </p>
            <p>
              Энэ тохиолдолд бид тухайн нийгмийн сүлжээнээс дараах мэдээллийг
              авах боломжтой:
            </p>
            <ul>
              <li>Нэр</li>
              <li>И-мэйл хаяг</li>
              <li>Профайл зураг (хэрэв тухайн платформоос зөвшөөрөгдсөн бол)</li>
              <li>Тухайн хэрэглэгчийг ялгах уник таних ID</li>
            </ul>
            <p>
              Бид нийгмийн сүлжээний нууц үг, нэвтрэх мэдээллийг хадгалахгүй.
              Нийгмийн сүлжээгээр дамжуулан авсан мэдээллийг зөвхөн хэрэглэгчийн
              бүртгэл үүсгэх, баталгаажуулах болон Үйлчилгээг хэвийн ажиллуулах
              зорилгоор ашиглана. Хэрэглэгч нийгмийн сүлжээний холболтоо
              тухайн платформын тохиргооноос хүссэн үедээ цуцлах боломжтой.
            </p>

            <h2>7. Гуравдагч тал</h2>
            <p>
              Үйлчилгээ нь гуравдагч талын вэб сайт, сервис рүү холбоос агуулж
              болох бөгөөд бид эдгээр талуудын нууцлал, үйл ажиллагаанд
              хариуцлага хүлээхгүй. Хэрэглэгч гуравдагч талын үйлчилгээг
              ашиглахдаа тухайн талын нөхцөлийг дагаж мөрдөнө.
            </p>

            <h2>8. Үйлчилгээг өөрчлөх, зогсоох</h2>
            <p>
              Бид Үйлчилгээний зарим хэсгийг түр хугацаагаар эсвэл бүрмөсөн
              өөрчлөх, зогсоох эрхтэй. Ийм өөрчлөлтөөс үүдэн хэрэглэгчид учирч
              болзошгүй шууд болон шууд бус хохиролд бид хариуцлага хүлээхгүй.
            </p>

            <h2>9. Оюуны өмчийн эрх</h2>
            <p>
              Үйлчилгээ дээрх бүх контент, текст, зураг, лого, дизайн,
              програм хангамж нь манай болон хууль ёсны эрх эзэмшигчдийн оюуны
              өмч бөгөөд зохиогчийн эрхээр хамгаалагдана. Зөвшөөрөлгүйгээр
              хуулбарлах, түгээх, ашиглахыг хориглоно.
            </p>

            <h2>10. Хариуцлага хязгаарлах</h2>
            <p>
              Үйлчилгээ нь "байгаа чигээрээ" (as is) олгогдож байгаа бөгөөд
              алдаагүй, тасралтгүй байх баталгаа өгөхгүй. Үйлчилгээ ашигласнаас
              үүдэн гарсан аливаа хохирол, алдагдалд бид хуульд зааснаас бусад
              тохиолдолд хариуцлага хүлээхгүй.
            </p>

            <h2>11. Маргаан шийдвэрлэх</h2>
            <p>
              Энэхүү Нөхцөлтэй холбоотой маргааныг Монгол Улсын хууль
              тогтоомжийн дагуу, шаардлагатай тохиолдолд харьяалах шүүхээр
              шийдвэрлэнэ.
            </p>

            <h2>12. Холбоо барих</h2>
            <p>
              Эдгээр Нөхцөл болон хувийн мэдээлэлтэй холбоотой асуулт, хүсэлт
              байвал дараах хаягаар холбогдоно уу.
            </p>
            <p>
              Имэйл: <strong>nomadriseworld@gmail.com</strong>
              <br />
              Хаяг: Улаанбаатар хот, Монгол Улс
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
          font-size: 2.5rem;
          margin: 0 0 24px 0;
          color: #1f2937;
          font-weight: 700;
        }

        .policy-page-content h2 {
          font-size: 1.3rem;
          margin: 32px 0 16px 0;
          color: #1f2937;
          font-weight: 600;
        }

        .policy-page-content p {
          margin: 0 0 16px 0;
          font-size: 1rem;
        }

        .policy-page-content ul {
          margin: 16px 0;
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
        }

        @media (max-width: 640px) {
          .policy-page-container {
            padding: 20px 16px;
          }

          .policy-page-content h1 {
            font-size: 1.8rem;
          }

          .policy-page-content h2 {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
