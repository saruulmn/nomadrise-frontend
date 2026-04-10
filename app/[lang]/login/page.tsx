"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import PolicyModal from "@/app/components/PolicyModal";
import { LoginSkeleton } from "@/app/components/Skeleton";
import { loginWithEmail } from "@/lib/api/login";
import { tokenStorage } from "@/lib/api/base";
import { signIn } from "next-auth/react";

export default function LoginPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const [lang, setLang] = useState<Locale>("mn");
  const [dictionary, setDictionary] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    params.then((p) => {
      setLang(p.lang);
      getDictionary(p.lang).then((dict) => {
        setDictionary(dict);
        setIsLoading(false);
      });
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      setError("Please agree to the terms and conditions");
      return;
    }

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await loginWithEmail({ email, password });
      
      // Store tokens
      tokenStorage.setTokens(response.access, response.refresh);
      
      // Redirect to dashboard
      router.push(`/${lang}/dashboard`);
    } catch (err: any) {
      setIsSubmitting(false);
      const errorMessage = err.data?.error || err.message || "Login failed";
      setError(errorMessage);
    }
  };

  if (isLoading || !dictionary) {
    return <LoginSkeleton />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Hero background image with blur */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url(/images/slider/1.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
          transform: "scale(1.1)",
          zIndex: 0,
        }}
      />

      {/* Dark overlay for better readability */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.3)",
          zIndex: 1,
        }}
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-form {
          animation: slideIn 0.6s ease-out;
        }
      `,
        }}
      ></style>

      <div
        className="login-form"
        style={{
          background: "white",
          padding: "48px",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          width: "100%",
          maxWidth: "440px",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <div
            style={{
              margin: "0 auto 24px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img
              src="/logo.png"
              alt="NomadRise Logo"
              width={64}
              height={64}
              style={{
                borderRadius: "16px",
                objectFit: "contain",
                boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
              }}
            />
          </div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px",
            }}
          >
            {dictionary.login?.title || "Nomadrise-д нэвтрэх"}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            {dictionary.login?.subtitle || "Нэвтрэх мэйл хаяг болон нууц үгээ оруулна уу"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#991b1b",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Мэйл хаяг
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "2px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "16px",
                fontFamily: "inherit",
                boxSizing: "border-box",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px",
              }}
            >
              Нууц үг
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "2px solid #e5e7eb",
                borderRadius: "10px",
                fontSize: "16px",
                fontFamily: "inherit",
                boxSizing: "border-box",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#667eea")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
            />
          </div>

          {/* Terms Checkbox */}
          <div
            style={{
              marginBottom: "20px",
              padding: "16px",
              backgroundColor: "#f9fafb",
              borderRadius: "12px",
              border: agreeTerms ? "2px solid #667eea" : "2px solid #e5e7eb",
              transition: "all 0.3s ease",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  marginTop: "2px",
                  cursor: "pointer",
                  accentColor: "#667eea",
                }}
              />
              <span
                style={{
                  fontSize: "14px",
                  color: "#374151",
                  lineHeight: "1.5",
                  fontWeight: "500",
                }}
              >
                Би{" "}
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#667eea",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: "0",
                    fontSize: "inherit",
                    fontWeight: "inherit",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#764ba2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#667eea")
                  }
                >
                  {dictionary.login?.termsLink || "үйлчилгээний нөхцөл"}
                </button>
                {" "}болон{" "}
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(true)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#667eea",
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: "0",
                    fontSize: "inherit",
                    fontWeight: "inherit",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#764ba2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "#667eea")
                  }
                >
                  {dictionary.login?.privacyLink || "нууцлалын бодлого"}
                </button>
                {" "}гийг зөвшөөрч байна
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !agreeTerms}
            style={{
              width: "100%",
              height: "56px",
              background: !agreeTerms
                ? "#d1d5db"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: !agreeTerms || isSubmitting ? "not-allowed" : "pointer",
              opacity: !agreeTerms || isSubmitting ? 0.6 : 1,
              transition: "all 0.3s ease",
              boxShadow:
                !agreeTerms || isSubmitting
                  ? "none"
                  : "0 8px 16px rgba(102, 126, 234, 0.3)",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting && agreeTerms) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(102, 126, 234, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting && agreeTerms) {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 8px 16px rgba(102, 126, 234, 0.3)";
              }
            }}
          >
            {isSubmitting ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", margin: "24px 0" }}>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
            <span style={{ padding: "0 16px", color: "#9ca3af", fontSize: "14px", fontWeight: "500" }}>эсвэл</span>
            <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: `/${lang}/dashboard` })}
            style={{
              width: "100%",
              height: "52px",
              background: "#ffffff",
              color: "#374151",
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              transition: "all 0.3s ease",
              marginBottom: "12px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#667eea";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.56-2.77.01-.54z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google-ээр нэвтрэх
          </button>

          {/* Facebook Sign In */}
          <button
            type="button"
            onClick={() => signIn("facebook", { callbackUrl: `/${lang}/dashboard` })}
            style={{
              width: "100%",
              height: "52px",
              background: "#1877F2",
              color: "#ffffff",
              border: "none",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#166fe5";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(24,119,242,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#1877F2";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook-ээр нэвтрэх
          </button>

          {/* Register Link */}
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <Link
              href={`/${lang}/register`}
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
                transition: "color 0.3s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#764ba2")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#667eea")}
            >
              {dictionary.login?.register || "Бүртгүүлэх"}
            </Link>
          </div>
        </form>
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
        lang={lang as "en" | "mn"}
      />
    </div>
  );
}
