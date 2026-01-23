"use client";

import { signIn } from "next-auth/react";
import { GoogleOutlined, FacebookOutlined, AppleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import PolicyModal from "@/app/components/PolicyModal";
import { LoginSkeleton } from "@/app/components/Skeleton";

export default function LoginPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const [lang, setLang] = useState<Locale>("mn");
  const [dictionary, setDictionary] = useState<any>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      setLang(p.lang);
      getDictionary(p.lang).then((dict) => {
        setDictionary(dict);
        setIsLoading(false);
      });
    });
  }, [params]);

  if (isLoading || !dictionary) {
    return <LoginSkeleton />;
  }

  const handleGoogleSignIn = async () => {
    if (agreeTerms) {
      await signIn("google", { callbackUrl: "/dashboard" });
    }
  };

  const handleFacebookSignIn = async () => {
    if (agreeTerms) {
      await signIn("facebook", { callbackUrl: "/dashboard" });
    }
  };

  const handleAppleSignIn = async () => {
    if (agreeTerms) {
      await signIn("apple", { callbackUrl: "/dashboard" });
    }
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
          <button
            onClick={handleGoogleSignIn}
            disabled={!agreeTerms}
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
              background: agreeTerms ? '#eee' : '#f3f4f6',
              fontSize: '16px',
              fontWeight: '600',
              color: agreeTerms ? '#374151' : '#d1d5db',
              cursor: agreeTerms ? 'pointer' : 'not-allowed',
              position: 'relative',
              opacity: agreeTerms ? 1 : 0.6
            }}
          >
            <GoogleOutlined style={{ fontSize: '20px', color: agreeTerms ? '#374151' : '#d1d5db' }} />
            <span>{dictionary.login.continueGoogle || 'Continue with Google'}</span>
          </button>

          <button
            onClick={handleFacebookSignIn}
            disabled={!agreeTerms}
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
              background: agreeTerms ? '#eee' : '#f3f4f6',
              fontSize: '16px',
              fontWeight: '600',
              color: agreeTerms ? '#374151' : '#d1d5db',
              cursor: agreeTerms ? 'pointer' : 'not-allowed',
              position: 'relative',
              opacity: agreeTerms ? 1 : 0.6
            }}
          >
            <FacebookOutlined style={{ fontSize: '20px', color: agreeTerms ? '#374151' : '#d1d5db' }} />
            <span>{dictionary.login.continueFacebook || 'Continue with Facebook'}</span>
          </button>

          <button
            onClick={handleAppleSignIn}
            disabled={!agreeTerms}
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
              background: agreeTerms ? '#eee' : '#f3f4f6',
              fontSize: '16px',
              fontWeight: '600',
              color: agreeTerms ? '#374151' : '#d1d5db',
              cursor: agreeTerms ? 'pointer' : 'not-allowed',
              position: 'relative',
              opacity: agreeTerms ? 1 : 0.6
            }}
          >
            <AppleOutlined style={{ fontSize: '20px', color: agreeTerms ? '#374151' : '#d1d5db' }} />
            <span>{dictionary.login.continueApple || 'Continue with Apple'}</span>
          </button>
        </div>

        {/* Terms Checkbox */}
        <div style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: agreeTerms ? '2px solid #667eea' : '2px solid #e5e7eb',
          transition: 'all 0.3s ease'
        }}>
          <label style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              style={{
                width: '20px',
                height: '20px',
                marginTop: '2px',
                cursor: 'pointer',
                accentColor: '#667eea'
              }}
            />
            <span style={{ 
              fontSize: '14px',
              color: '#374151',
              lineHeight: '1.5',
              fontWeight: '500'
            }}>
              <button
                type="button"
                onClick={() => setShowPolicyModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: '0',
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#764ba2'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#667eea'}
              >
                Үйлчилгээний нөхцлийг зөвшөөрч байна
              </button>
            </span>
          </label>
        </div>
      </div>

      {/* Policy Modal */}
      <PolicyModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        onApprove={() => {
          setAgreeTerms(true);
          setShowPolicyModal(false);
        }}
        showApproveButton={true}
        lang={lang as 'en' | 'mn'}
      />
    </div>
  );
}
