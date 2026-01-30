"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import PolicyModal from "@/app/components/PolicyModal";
import { LoginSkeleton } from "@/app/components/Skeleton";
import { tokenStorage } from "@/lib/api/base";

export default function RegisterPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const [lang, setLang] = useState<Locale>("mn");
  const [dictionary, setDictionary] = useState<any>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
      setError("Үйлчилгээний нөхцөл болон нууцлалын бодлогийг зөвшөөрөх ёстой");
      return;
    }

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Бүх талбарыг нөхөх ёстой");
      return;
    }

    if (password !== confirmPassword) {
      setError("Нууц үгүүд хүрэлцэхгүй байна");
      return;
    }

    if (password.length < 8) {
      setError("Нууц үг дор хаяж 8 тэмдэгт байх ёстой");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Call registration API endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Бүртгүүлэлт амжилтгүй болсон");
      }

      const data = await response.json();

      // Store tokens if registration returns them
      if (data.access && data.refresh) {
        tokenStorage.setTokens(data.access, data.refresh);
      }

      setSuccess("Бүртгүүлэлт амжилттай! Та сүүлийн хэмжээнд нэвтэрч байна...");
      setTimeout(() => {
        router.push(`/${lang}/dashboard`);
      }, 1500);
    } catch (err: any) {
      setIsSubmitting(false);
      const errorMessage = err.message || "Бүртгүүлэлт амжилтгүй болсон";
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
        .register-form {
          animation: slideIn 0.6s ease-out;
        }
      `,
        }}
      ></style>

      <div
        className="register-form"
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
            {dictionary.register?.title || "Бүртгүүлэх"}
          </h1>
          <p style={{ color: "#6b7280", fontSize: "16px" }}>
            {dictionary.register?.subtitle || "Шинэ эрхтэй үүсгэх"}
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

        {/* Success Message */}
        {success && (
          <div
            style={{
              background: "#dcfce7",
              border: "1px solid #86efac",
              color: "#166534",
              padding: "12px",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {success}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          {/* First Name Input */}
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
              Өвөг
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Өвөг"
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

          {/* Last Name Input */}
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
              Нэр
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Нэр"
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

          {/* Confirm Password Input */}
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
              Нууц үг баталгаажуулах
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
                  үйлчилгээний нөхцөл
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
                  нууцлалын бодлого
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
            {isSubmitting ? "Бүртгүүлж байна..." : "Бүртгүүлэх"}
          </button>

          {/* Login Link */}
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "8px" }}>
              Аль хэдийн эрхтэй юу?
            </p>
            <Link
              href={`/${lang}/login`}
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
              Нэвтрэх
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
