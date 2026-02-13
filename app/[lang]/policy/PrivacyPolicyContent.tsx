'use client';

import type { Locale } from '@/i18n/config';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';

interface PrivacyPolicyContentProps {
  lang: Locale;
}

export default function PrivacyPolicyContent({ lang }: PrivacyPolicyContentProps) {
  const isEnglish = lang === 'en';

  return (
    <div className="policy-page-wrapper">
      <div className="policy-header">
        <button className="language-switcher-inline">
          <LanguageSwitcher currentLang={lang} />
        </button>
      </div>

      <article className="policy-page-content">
        {isEnglish ? (
          <>
            {/* ENGLISH PRIVACY POLICY */}
            <h1>Privacy Policy</h1>
            <p className="last-updated">Last updated: February 2026</p>

            <h2>1. Introduction</h2>
            <p>
              NomadRise ("we", "us", "our", or "Company") operates the nomadrise.mn website and mobile application 
              (collectively, the "Service"). This page informs you of our policies regarding the collection, use, and 
              disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
            <p>
              Your privacy is important to us. We are committed to being transparent about what data we collect, how we use it, 
              and your rights regarding your personal information.
            </p>

            <h2>2. Information Collection and Use</h2>

            <h3>2.1 Information You Provide</h3>
            <p>When you register or use NomadRise, we collect:</p>
            <ul>
              <li><strong>Authentication Data:</strong> Full name, email address, and profile information via OAuth providers (Google, Apple, Facebook)</li>
              <li><strong>Account Information:</strong> Preferences, language settings, and account security details</li>
              <li><strong>Communication Data:</strong> Messages, inquiries, and support requests you send to us</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you access our Service, we automatically collect:</p>
            <ul>
              <li><strong>Device Information:</strong> Device type, operating system, browser type, and unique device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on pages, clicks, and navigation patterns</li>
              <li><strong>Location Data:</strong> IP address and approximate geographic location (country/region level)</li>
              <li><strong>Cookies and Similar Technologies:</strong> Session cookies for authentication and functional cookies for preference storage</li>
            </ul>

            <h3>2.3 Third-Party Authentication</h3>
            <p>
              We use OAuth 2.0 providers (Google OAuth, Apple ID, Facebook Login) for authentication. When you choose to log in via 
              these providers, we receive your name and email address. Each provider's privacy policy governs their collection and use 
              of your data. We do not receive or store your passwords.
            </p>

            <h2>3. Use of Data</h2>
            <p>NomadRise uses the collected data for various purposes:</p>
            <ul>
              <li><strong>User Authentication:</strong> To verify your identity and maintain your account</li>
              <li><strong>Service Delivery:</strong> To provide, maintain, and improve our services</li>
              <li><strong>Communication:</strong> To send you service updates, security alerts, and support messages</li>
              <li><strong>Analytics:</strong> To understand how users interact with our platform and improve user experience</li>
              <li><strong>Security:</strong> To detect, prevent, and address technical and security issues</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
              <li><strong>Marketing (with consent):</strong> To send you promotional content only with your permission</li>
            </ul>

            <h2>4. Third-Party Services</h2>
            <p>We use the following third-party services that may collect your information:</p>

            <h3>4.1 Google Services</h3>
            <ul>
              <li><strong>Google OAuth:</strong> For user authentication</li>
              <li><strong>Google Analytics:</strong> To track website usage and user behavior</li>
              <li><strong>Google Cloud Platform:</strong> To host our backend services and databases</li>
            </ul>
            <p>
              Google's collection and use of data is governed by 
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"> Google's Privacy Policy</a>.
            </p>

            <h3>4.2 Authentication Providers</h3>
            <ul>
              <li><strong>Apple ID:</strong> <a href="https://www.apple.com/privacy/" target="_blank" rel="noopener noreferrer">Apple Privacy Policy</a></li>
              <li><strong>Facebook Login:</strong> <a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer">Meta Privacy Policy</a></li>
            </ul>

            <h2>5. Data Retention</h2>
            <p>
              We retain your personal data for as long as necessary to provide our services and fulfill the purposes outlined in this 
              Privacy Policy. You can delete your account and associated data at any time through your account settings. After deletion, 
              we will retain only anonymized usage data for analytics purposes.
            </p>

            <h2>6. User Rights and Data Deletion</h2>
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and personal data</li>
              <li><strong>Portability:</strong> Request your data in a portable format</li>
              <li><strong>Withdraw Consent:</strong> Revoke permissions you've previously granted</li>
            </ul>

            <h3>How to Delete Your Account and Data</h3>
            <ol>
              <li>Log in to your NomadRise account</li>
              <li>Go to Account Settings</li>
              <li>Select "Delete Account"</li>
              <li>Confirm your request (this action is permanent)</li>
              <li>Your account and associated personal data will be deleted within 30 days</li>
            </ol>

            <p>
              To exercise any of these rights or if you have questions about your data, contact us at{' '}
              <strong>nomadriseworld@gmail.com</strong>
            </p>

            <h2>7. Security</h2>
            <p>
              We implement industry-standard security measures to protect your personal data, including:
            </p>
            <ul>
              <li>HTTPS encryption for all data in transit</li>
              <li>Secure database encryption at rest</li>
              <li>Regular security audits and penetration testing</li>
              <li>Restricted access to personal data on a need-to-know basis</li>
              <li>Two-factor authentication options for account security</li>
            </ul>
            <p>
              However, no method of transmission over the internet or method of electronic storage is 100% secure. 
              While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee 
              its absolute security.
            </p>

            <h2>8. International Data Transfers</h2>
            <p>
              Your information may be transferred to, stored in, and processed in countries other than your country of residence. 
              These countries may have data protection laws that differ from your home country. By using NomadRise, you consent to 
              the transfer of your information to countries outside your country of residence, which may have different data protection rules.
            </p>

            <h2>9. Children's Privacy</h2>
            <p>
              Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable 
              information from children under 18. If you are a parent or guardian and are aware that your child has provided us with 
              Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification 
              of parental consent, we take steps to remove such data and terminate the child's account.
            </p>

            <h2>10. GDPR and Data Protection Laws</h2>
            <p>
              If you are in the European Union, United Kingdom, or other jurisdiction with similar laws, you have additional rights 
              under GDPR and equivalent regulations. These include:
            </p>
            <ul>
              <li>The right to be informed about data collection</li>
              <li>The right to access and rectify your data</li>
              <li>The right to erasure ("right to be forgotten")</li>
              <li>The right to restrict processing</li>
              <li>The right to data portability</li>
              <li>The right to object to processing</li>
              <li>Rights related to automated decision making and profiling</li>
            </ul>

            <h2>11. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy 
              on this page and updating the "Last updated" date at the top of this document. You are advised to review this Privacy 
              Policy periodically for any changes.
            </p>

            <h2>12. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <ul>
              <li><strong>Email:</strong> <a href="mailto:nomadriseworld@gmail.com">nomadriseworld@gmail.com</a></li>
              <li><strong>Support Email:</strong> <a href="mailto:nomadriseworld@gmail.com">nomadriseworld@gmail.com</a></li>
              <li><strong>Website:</strong> https://nomadrise.mn</li>
              <li><strong>Address:</strong> Ulaanbaatar, Mongolia</li>
            </ul>

            <p className="final-note">
              Your trust is important to us. We are committed to transparent and responsible data practices.
            </p>
          </>
        ) : (
          <>
            {/* MONGOLIAN PRIVACY POLICY */}
            <h1>Нууцлалын бодлого</h1>
            <p className="last-updated">Сүүлийн шинэчлэл: 2026 оны 2 сар</p>

            <h2>1. Оршил</h2>
            <p>
              NomadRise ("бид", "манай", "компани") нь nomadrise.mn вебсайт болон мобайл программ (цаашид "Үйлчилгээ") ажиллуулдаг. 
              Энэ хуудас нь та манай Үйлчилгээг ашиглаж байхдаа хувийн мэдээллийг цуглуулах, ашиглах, задруулах 
              болон та энэ мэдээллийн талаар ямар сонголттой байгаа талаарх манайн бодлогын талаар танаар мэдээлэх болно.
            </p>
            <p>
              Таны нууцлал бидний хувьд маш чухал ач холбогдолтой. Бид ямар өгөгдөл цуглуулж байгаа, үүнийг 
              хэрхэн ашиглаж байгаа, таны хувийн мэдээллийн талаар ямар эрхтэй байгаа талаараа ил тод байхыг зөвлөдөг.
            </p>

            <h2>2. Мэдээлэл цуглуулах, ашиглах</h2>

            <h3>2.1 Та өгсөн мэдээлэл</h3>
            <p>NomadRise-д бүртгүүлэх эсвэл ашиглаж байхад бид дараахь мэдээллийг цуглуулдаг:</p>
            <ul>
              <li><strong>Баталгаажуулалтын мэдээлэл:</strong> Бүрэн нэр, И-мэйл хаяг, OAuth үйлчилгээ (Google, Apple, Facebook) -ээр дамжуулан профайл мэдээлэл</li>
              <li><strong>Бүртгэлийн мэдээлэл:</strong> Сонголт, хэл установка, бүртгэлийн аюулгүй байдлын деталь</li>
              <li><strong>Харилцаа холбоо мэдээлэл:</strong> Та бидэнд илгээсэн мессеж, асуулт, дэмжлэгийн хүсэлт</li>
            </ul>

            <h3>2.2 Автоматаар цуглуулагдсан мэдээлэл</h3>
            <p>Та манай Үйлчилгээ нь ашиглаж байхад бид автоматаар цуглуулдаг:</p>
            <ul>
              <li><strong>Төхөөрөмжийн мэдээлэл:</strong> Төхөөрөмжийн төрөл, үйлдлийн систем, браузерийн төрөл, өвөрмөц төхөөрөмжийн танигч</li>
              <li><strong>Ашиглалтын мэдээлэл:</strong> Үзүүлсэн хуудас, хуудсан дээр зарцуулсан цаг, дарлага, навигацийн хэв маяг</li>
              <li><strong>Байршلын мэдээлэл:</strong> IP хаяг, ойролцоо газарзүйн байршил (улс/бүс нутаг түвшин)</li>
              <li><strong>Cookie болон ижил төрлийн технологи:</strong> Баталгаажуулалтын сеанс cookie ба сонголт хадгалах функцийн cookie</li>
            </ul>

            <h3>2.3 Гуравдагч талын баталгаажуулалт</h3>
            <p>
              Бид баталгаажуулалтын хувьд OAuth 2.0 үйлчилгээ (Google OAuth, Apple ID, Facebook Login) ашиглаж байна. 
              Та эдгээр үйлчилгээ дамжуулан нэвтэрч сонгосон тохиолдолд та манай нэр, И-мэйл хаяг дүүргэнэ. 
              Бүрт үйлчилгээний нууцлалын бодлого нь тэдгээрийн мэдээлэл цуглуулах болон атираж байгаа ашиглалтыг хорих хэрэгтэй. 
              Бид таны нууц үгийг хүлээж авч эсвэл хадгалж байдаггүй.
            </p>

            <h2>3. Өгөгдөл ашиглах</h2>
            <p>NomadRise нь цуглуулсан өгөгдлийг янз бүрийн зорилгоор ашигладаг:</p>
            <ul>
              <li><strong>Хэрэглэгчийн баталгаажуулалт:</strong> Таны личность баталгаажуулах болон бүртгэлийг хэвээр байлгах</li>
              <li><strong>Үйлчилгээ хүргүүлэх:</strong> Манай үйлчилгээг хүргүүлэх, хэвээр байлгах, сайжруулах</li>
              <li><strong>Харилцаа холбоо:</strong> Үйлчилгээний төлөвлөлт, аюулгүй байдлын анхааруулга, дэмжлэгийн мессеж явуулах</li>
              <li><strong>Анализ:</strong> Хэрэглэгчид манай платформтай кхэрхэн ажиллаж байгаа талаар ойлгох, ашиглалтын туршлагыг сайжруулах</li>
              <li><strong>Аюулгүй байдал:</strong> Техникийн болон аюулгүй байдлын асуудлыг илрүүлэх, урьдчилан сэргийлэх, шийдвэрлэх</li>
              <li><strong>Хууль тогтоомжийн дагуу:</strong> Хэвлүүлэх хуулиуд, дүрмүүд, хууль эрх зүйн үйл ажиллагаанд нийцэх</li>
              <li><strong>Маркетинг (зөвшөөрлүүтэй):</strong> Зөвхөн таны зөвшөөрлөөр сурталчилгааны агуулга явуулах</li>
            </ul>

            <h2>4. Гуравдагч талын үйлчилгээ</h2>
            <p>Бид дараахь гуравдагч талын үйлчилгээ ашигладаг бөгөөд эдгээр нь таны мэдээллийг цуглуулах боломжтой:</p>

            <h3>4.1 Google үйлчилгээ</h3>
            <ul>
              <li><strong>Google OAuth:</strong> Хэрэглэгчийн баталгаажуулалтын хувьд</li>
              <li><strong>Google Analytics:</strong> Вебсайтын ашиглалту болон ашигладаг үйлдэл хэмжих</li>
              <li><strong>Google Cloud Platform:</strong> Манай backendиж үйлчилгээ болон мэдээллийн сан байршуулахаар</li>
            </ul>
            <p>
              Google-ын мэдээлэл цуглуулах болон ашигла байгаа ашиглалт нь 
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer"> Google-ын нууцлалын бодлого</a>-ор явагдаж байна.
            </p>

            <h3>4.2 Баталгаажуулалтын үйлчилгээ өгүүлэгч</h3>
            <ul>
              <li><strong>Apple ID:</strong> <a href="https://www.apple.com/privacy/" target="_blank" rel="noopener noreferrer">Apple нууцлалын бодлого</a></li>
              <li><strong>Facebook нэвтрэлт:</strong> <a href="https://www.facebook.com/privacy/explanation" target="_blank" rel="noopener noreferrer">Meta нууцлалын бодлого</a></li>
            </ul>

            <h2>5. Мэдээлэл хадгалах хугацаа</h2>
            <p>
              Бид таны хувийн мэдээллийг манай үйлчилгээ хүргүүлэх болон энэ нууцлалын бодлогод тайлбарласан зорилгыг биелүүлэхэд 
              хэрэгтэй хэмжээний хугацаа хадгалдаг. Та ямар ч үед таны бүртгэл болон холбоотой хувийн мэдээллийг устгаж болно. 
              Устгасны дараа зөвхөн шинжилгээ хийх зорилгоор анонимаас хэлбэр ашиглалтын өгөгдөл хадгалдаг.
            </p>

            <h2>6. Ашигладаг эрх болон өгөгдөл устгах</h2>
            <p>Та дараахь эрхтэй байна:</p>
            <ul>
              <li><strong>Хүсэлт:</strong> Бид танайд байгаа хувийн өгөгдлийн үнэлгээг хүсэх</li>
              <li><strong>Сүүлчүүлэх:</strong> Буруу өгөгдөл шинэчлэх эсвэл засах</li>
              <li><strong>Устгаах:</strong> Таны бүртгэл болон хувийн мэдээллийг устгахыг хүсэх</li>
              <li><strong>Портативаас:</strong> Таны өгөгдөл портатив хэлбэрээр хүсэх</li>
              <li><strong>Зөвшөөрлийг цуцлаа:</strong> Та өмнө зөврүүлсэн зөвшөөрлийг буцаатгах</li>
            </ul>

            <h3>Таны бүртгэл болон өгөгдлийг хэрхэн устгах вэ</h3>
            <ol>
              <li>NomadRise-ийн бүртгэлдээ нэвтэрнэ үү</li>
              <li>Бүртгэлийн тохиргоонд ираалцана</li>
              <li>"Бүртгэл устгах" сонголтыг сонгона</li>
              <li>Та хүсэлтийг батлах (энэ үйлдэл буцаатгах боломжгүй)</li>
              <li>Таны бүртгэл болон холбоотой хувийн мэдээлэл 30 хоног дотор устгагдана</li>
            </ol>

            <p>
              Эдгээр эрхүүдийг хэвлэх эсвэл таны өгөгдлийн талаар асуулт байвал{' '}
              <strong>nomadriseworld@gmail.com</strong> руу холбоо барина уу.
            </p>

            <h2>7. Аюулгүй байдал</h2>
            <p>
              Бид таны хувийн мэдээллийг хамгаалахын хөд аж үйлдвэрийн стандарт аюулгүй байдлын арга хэмжээ авдаг:
            </p>
            <ul>
              <li>Бүх өгөгдлийн цахилгаан шифрлэлт хувиргалт</li>
              <li>Мэдээллийн сангийн аюулгүй байдлын шифрлэлт</li>
              <li>Ирмэгт аюулгүй байдлын шалгалт, нэвтрэлтийн сорилт</li>
              <li>Хүүргэн мэдээллийн нэвтрэлт хязгаарлах</li>
              <li>Бүртгэлийн хоёр үе баталгаажуулалтын сонголт</li>
            </ul>
            <p>
              Гэсэн хэдий ч интернэт дамжилтын аль нь ч болон электрон хадгалалтын аль ч аргуул 100% аюулгүй байхгүй. 
              Үл тийм байдал бид та хүнээ хвийн мэдээлэл хамгаалахын хөд ашигладаг аргууд худ харанаат байлаа, 
              үл тийм байдалыг үхсүүлэнэ гэж баталж чадахгүй.
            </p>

            <h2>8. Олон улсын өгөгдөл дамжилт</h2>
            <p>
              Таны мэдээлэл та амьдарч байгаа улсаас өзгөөр улсад дамжуулж болно, хадгалж болно, задарч боломжтой. 
              Эдгээр улсуудад хувийн мэдээлэл хамгаалах хулиараа эс мэдээгүй байж болно. 
              NomadRise ашиглаж байснаар та та та хүнээ мэдээлэл та олсон хүүхлүүнээс ялгаатай өгөгдөл 
              хамгаалалтын дүрмүүдэй байгаа улсад дамжуулахыг зөвшөөрснө.
            </p>

            <h2>9. Хүүхдийн нууцлал</h2>
            <p>
              Манай Үйлчилгээ нь 18 насны доош ямар ч хүнийг хаяглан байдаггүй юм ("Хүүхдүүд"). 
              Бид 18 насны доохи хүүхдүүдээс анзаараагүй бан эмэл мэдээллийг цуглуулдаггүй. 
              Та эцэг эхэ эсвэл хүүхлийн цэцийтэн стөлөл байвал болон та эр хүүхэл айлийн Байла арвайн байлчайг цуглуулч байсан гэдгийг мэдэж байвал бид холбоо барина. 
              Булан хүүхдүүдээс хувл эмэл мэдээллийг цуглуулласан гэдгийг мэдэж байвал та ийм мэдээллийг арилгах, 
              хүүхил давгтялыг хаалтаас гаргах алхамыг авварт.
            </p>

            <h2>10. GDPR болон мэдээлэл хамгаалалтын хууль</h2>
            <p>
              Та Европын Холбоо, Нэгдсэн Вант Улс, эсвэл ижил төрлийн хуультай өзгөө үүсгэл байгаа бүс нутагт байвал 
              та GDPR болон өөрийнхэлтэн хуульд нэмэлт эрхтэй болно. Эдгээрт:
            </p>
            <ul>
              <li>Мэдээлэл цуглуулалтын талаар мэдээлүүлэх эрх</li>
              <li>Таны өгөгдөл нүүлгэн авах болон залруулах эрх</li>
              <li>Арсал эрх ("сайтээс устгагдах эрх")</li>
              <li>Боловсруулалт сулруулах эрх</li>
              <li>Мэдээлэл портативаас эрх</li>
              <li>Боловсруулалтанд эсэргүүцэх эрх</li>
              <li>Автомат шийдвэр гаргалт, профайлын эрхүүд</li>
            </ul>

            <h2>11. Энэ нууцлалын бодлогод эргүүлэлтүүд</h2>
            <p>
              Бид хааль нэгэн үеэр манай нууцлалын бодлогийг шинэчлэх боломжтой. Бид энэ хуудсан дээр шинэ нууцлалын бодлоге байрлуулах, 
              энэ баримтын дээд хэсэгт "Сүүлийн шинэчлэлийн огноо" -ийн огноо шинэчлэх замаар та танаар мэдээлэх болно. 
              Та энэ нууцлалын бодлогийг хугацаа хугацаагаар шалгахыг зөвлөж байна.
            </p>

            <h2>12. Бидэнтэй холбоо барих</h2>
            <p>Хэрэв та энэ нууцлалын бодлогын талаар асуулт байвал бидэнтэй холбоо барина уу:</p>
            <ul>
              <li><strong>И-мэйл:</strong> <a href="mailto:nomadriseworld@gmail.com">nomadriseworld@gmail.com</a></li>
              <li><strong>Дэмжлэгийн И-мэйл:</strong> <a href="mailto:nomadriseworld@gmail.com">nomadriseworld@gmail.com</a></li>
              <li><strong>Вебсайт:</strong> https://nomadrise.mn</li>
              <li><strong>Хаяг:</strong> Улаанбаатар, Монгол Улс</li>
            </ul>

            <p className="final-note">
              Та эндэр төлөөлөл бидний хувьд чухал ач холбогдолтой. Бид и ил тод болон хариуцлагатай мэдээлэл ашиглалтыг хангахыг үл тийм байдал.
            </p>
          </>
        )}
      </article>

      <style jsx>{`
        .policy-page-wrapper {
          position: relative;
        }

        .policy-header {
          display: flex;
          justify-content: flex-end;
          padding: 20px 40px;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        .language-switcher-inline {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .policy-page-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
          min-height: 100vh;
        }

        .policy-page-content {
          color: #374151;
          line-height: 1.8;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px 20px;
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
          font-size: 1.3rem;
          margin: 32px 0 16px 0;
          color: #1f2937;
          font-weight: 600;
          border-bottom: 2px solid #667eea;
          padding-bottom: 8px;
        }

        .policy-page-content h3 {
          font-size: 1.1rem;
          margin: 20px 0 12px 0;
          color: #374151;
          font-weight: 600;
        }

        .policy-page-content p {
          margin: 0 0 16px 0;
          font-size: 1rem;
        }

        .policy-page-content ul,
        .policy-page-content ol {
          margin: 12px 0 16px 0;
          padding-left: 24px;
        }

        .policy-page-content li {
          margin-bottom: 12px;
          font-size: 1rem;
          line-height: 1.6;
        }

        .policy-page-content strong {
          color: #667eea;
          font-weight: 600;
        }

        .policy-page-content a {
          color: #667eea;
          text-decoration: underline;
          transition: color 0.3s ease;
        }

        .policy-page-content a:hover {
          color: #764ba2;
        }

        .final-note {
          background-color: #f0f4ff;
          padding: 16px;
          border-left: 4px solid #667eea;
          border-radius: 4px;
          margin-top: 32px;
          font-style: italic;
        }

        @media (prefers-color-scheme: dark) {
          .policy-page-content {
            color: #d1d5db;
          }

          .policy-page-content h1,
          .policy-page-content h2,
          .policy-page-content h3 {
            color: #f3f4f6;
          }

          .last-updated {
            color: #9ca3af;
          }

          .final-note {
            background-color: #1e293b;
            border-left-color: #667eea;
          }

          .policy-header {
            background-color: #111827;
            border-bottom-color: #374151;
          }
        }

        @media (max-width: 640px) {
          .policy-header {
            padding: 16px 20px;
          }

          .policy-page-content {
            padding: 20px 16px;
          }

          .policy-page-content h1 {
            font-size: 1.6rem;
          }

          .policy-page-content h2 {
            font-size: 1.15rem;
          }

          .policy-page-content h3 {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
