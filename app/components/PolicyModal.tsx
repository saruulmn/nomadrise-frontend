'use client';

import React, { useState } from 'react';
import '../styles/policy-modal.css';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove?: () => void;
  showApproveButton?: boolean;
  lang?: 'en' | 'mn';
}

export default function PolicyModal({
  isOpen,
  onClose,
  onApprove,
  showApproveButton = true,
  lang = 'mn',
}: PolicyModalProps) {
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const isAtBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight < 10;
    setIsScrolledToBottom(isAtBottom);
  };

  const isEnglish = lang === 'en';

  if (!isOpen) return null;

  return (
    <div className="policy-modal-overlay">
      <div className="policy-modal">
        <div className="policy-modal-header">
          <h2>
            {isEnglish
              ? 'Terms of Service & Privacy Policy'
              : 'Үйлчилгээний нөхцөл & Нууцлалын бодлого'}
          </h2>
          <button
            className="policy-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="policy-modal-content" onScroll={handleScroll}>
          {isEnglish ? (
            <>
              <p>
                By using this website or application, you agree to these Terms of Service and Privacy Policy.
              </p>

              <h3>Use of Service</h3>
              <p>
                This service provides digital content and online functionality for lawful and personal use only.
              </p>

              <h3>Personal Data We Collect</h3>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Profile picture (if provided)</li>
                <li>Login metadata such as IP address, device, and cookies</li>
              </ul>

              <h3>Social Login (Google, Facebook, Apple)</h3>
              <p>
                Users may sign in using Google, Facebook, or Apple accounts.
                We may receive basic profile information such as name, email address,
                profile image, and a unique user ID.
              </p>
              <p>
                We do not collect or store passwords from social login providers.
                Social login data is used only for authentication and account management.
              </p>

              <h3>Data Protection</h3>
              <p>
                Personal data is securely stored and processed in accordance with applicable data protection laws.
              </p>

              <h3>Data Deletion</h3>
              <p>
                Users may request deletion of their account and personal data by contacting:
                <strong> nomadriseworld@gmail.com</strong>
              </p>

              <h3>Cookies</h3>
              <p>
                Cookies are used to maintain user sessions and improve user experience.
              </p>

              <h3>Third-Party Services</h3>
              <p>
                This service integrates third-party authentication providers.
                We are not responsible for their privacy practices.
              </p>

              <h3>Contact</h3>
              <p>
                Email: nomadriseworld@gmail.com
                <br />
                Location: Ulaanbaatar, Mongolia
              </p>
            </>
          ) : (
            <>
              <p>
                Та энэхүү веб сайт эсвэл аппликейшнийг ашигласнаар дараах нөхцөл,
                нууцлалын бодлогыг хүлээн зөвшөөрсөнд тооцогдоно.
              </p>

              <h3>Үйлчилгээний хэрэглээ</h3>
              <p>
                Үйлчилгээ нь хууль ёсны болон хувийн зорилгоор ашиглагдана.
              </p>

              <h3>Цуглуулах хувийн мэдээлэл</h3>
              <ul>
                <li>Нэр</li>
                <li>И-мэйл хаяг</li>
                <li>Профайл зураг (хэрэв олгогдсон бол)</li>
                <li>Нэвтрэлтийн мэдээлэл (IP хаяг, төхөөрөмж, cookie)</li>
              </ul>

              <h3>Нийгмийн сүлжээгээр нэвтрэх (Google, Facebook, Apple)</h3>
              <p>
                Хэрэглэгч Google, Facebook, Apple зэрэг нийгмийн сүлжээгээр дамжуулан нэвтрэх боломжтой.
                Энэ үед нэр, и-мэйл хаяг, профайл зураг, хэрэглэгчийг ялгах уник ID мэдээлэл ирж болно.
              </p>
              <p>
                Бид нийгмийн сүлжээний нууц үгийг хадгалахгүй.
                Авсан мэдээллийг зөвхөн нэвтрэлт, бүртгэлийн зорилгоор ашиглана.
              </p>

              <h3>Мэдээллийн хамгаалалт</h3>
              <p>
                Хувийн мэдээллийг холбогдох хууль тогтоомжийн дагуу аюулгүй хадгалж, боловсруулна.
              </p>

              <h3>Мэдээлэл устгах</h3>
              <p>
                Хэрэглэгч өөрийн бүртгэл болон хувийн мэдээллийг устгуулах хүсэлтийг
                дараах и-мэйл хаягаар илгээж болно:
                <strong> nomadriseworld@gmail.com</strong>
              </p>

              <h3>Cookie</h3>
              <p>
                Cookie нь нэвтрэлт хадгалах болон хэрэглэгчийн туршлагыг сайжруулахад ашиглагдана.
              </p>

              <h3>Гуравдагч тал</h3>
              <p>
                Үйлчилгээ нь гуравдагч талын нэвтрэлтийн систем ашиглаж болох бөгөөд
                тэдгээрийн нууцлалын бодлогод бид хариуцлага хүлээхгүй.
              </p>

              <h3>Холбоо барих</h3>
              <p>
                И-мэйл: nomadriseworld@gmail.com
                <br />
                Байршил: Улаанбаатар хот, Монгол Улс
              </p>
            </>
          )}
        </div>

        <div className="policy-modal-footer">
          <button className="policy-modal-btn-secondary" onClick={onClose}>
            {isEnglish ? 'Decline' : 'Татгалзах'}
          </button>
          {showApproveButton && (
            <button
              className="policy-modal-btn-primary"
              onClick={onApprove || onClose}
              disabled={!isScrolledToBottom}
              title={
                !isScrolledToBottom
                  ? isEnglish
                    ? 'Please scroll to bottom to approve'
                    : 'Зөвшөөрөхийн тулд доошоо орилцоорой'
                  : ''
              }
            >
              {isEnglish ? 'I Agree & Approve' : 'Зөвшөөрч Батлах'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
