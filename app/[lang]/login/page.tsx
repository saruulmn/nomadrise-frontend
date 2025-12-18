"use client";

import { signIn } from "next-auth/react";
import { GoogleOutlined, FacebookOutlined, AppleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

export default function LoginPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const [lang, setLang] = useState<Locale>("mn");
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    params.then((p) => {
      setLang(p.lang);
      getDictionary(p.lang).then(setDictionary);
    });
  }, [params]);

  if (!dictionary) return null;

  const handleGoogleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  const handleFacebookSignIn = async () => {
    await signIn("facebook", { callbackUrl: "/dashboard" });
  };

  const handleAppleSignIn = async () => {
    await signIn("apple", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ 
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Hero background image with blur */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/images/slider/1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(8px)',
        transform: 'scale(1.1)',
        zIndex: 0
      }} />
      
      {/* Dark overlay for better readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.3)',
        zIndex: 1
      }} />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(30px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .social-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .social-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .social-btn:hover::before {
          width: 300px;
          height: 300px;
        }
        .social-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }
      `}}></style>

      <div style={{
        background: 'white',
        padding: '48px',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 2,
        animation: 'slideIn 0.6s ease-out'
      }}>
        <div className="text-center mb-10">
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
          }}>
            <span style={{ fontSize: '32px' }}>🚀</span>
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>{dictionary.login.title}</h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>{dictionary.login.subtitle}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <button
            onClick={handleGoogleSignIn}
            className="social-btn"
            style={{
              width: '100%',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '14px',
              background: '#eee',
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <GoogleOutlined style={{ fontSize: '20px', color: '#374151' }} />
            <span>Continue with Google</span>
          </button>

          <button
            onClick={handleFacebookSignIn}
            className="social-btn"
            style={{
              width: '100%',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '14px',
              background: '#eee',
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <FacebookOutlined style={{ fontSize: '20px', color: '#374151' }} />
            <span>Continue with Facebook</span>
          </button>

          <button
            onClick={handleAppleSignIn}
            className="social-btn"
            style={{
              width: '100%',
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              border: '2px solid #e5e7eb',
              borderRadius: '14px',
              background: '#eee',
              fontSize: '16px',
              fontWeight: '600',
              color: '#374151',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <AppleOutlined style={{ fontSize: '20px', color: '#374151' }} />
            <span>Continue with Apple</span>
          </button>
        </div>
        <div style={{
          marginTop: '32px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#9ca3af',
          lineHeight: '1.6'
        }}>
          <p>
            {dictionary.login.termsText}{" "}
            <a href="/terms" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
              {dictionary.login.termsLink}
            </a>{" "}
            {dictionary.login.and}{" "}
            <a href="/privacy" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
              {dictionary.login.privacyLink}
            </a>
            {dictionary.login.agreeText}
          </p>
        </div>
      </div>
          </div>
          </div>
  );
}
