"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import PolicyModal from "@/app/components/PolicyModal";
import { LoginSkeleton } from "@/app/components/Skeleton";
import { signIn } from "next-auth/react";
import { useTheme } from "@/app/components/ThemeProvider";

export default function LoginPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = use(params);
  const [dictionary, setDictionary] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [shakeTerms, setShakeTerms] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const router = useRouter();

  // Safely grab theme context (SSR safe)
  let themeContext: any = null;
  try {
    themeContext = useTheme();
  } catch (e) {
    // SSR Safe Fallback
  }

  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (themeContext) {
      setCurrentTheme(themeContext.theme);
    }
  }, [themeContext?.theme]);

  useEffect(() => {
    getDictionary(lang).then((dict) => {
      setDictionary(dict);
      setIsLoading(false);
    });
  }, [lang]);

  const triggerValidationAlert = () => {
    const errorMsg = lang === "mn"
      ? "Үйлчилгээний нөхцөл болон нууцлалын бодлогийг зөвшөөрөх ёстой"
      : "You must agree to the Terms of Service and Privacy Policy";
    setError(errorMsg);
    setShakeTerms(true);
    setTimeout(() => {
      setShakeTerms(false);
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      triggerValidationAlert();
      return;
    }

    if (!email || !password) {
      setError(lang === "mn" ? "Имэйл болон нууц үг шаардлагатай" : "Email and password are required");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (response?.error) {
         setIsSubmitting(false);
         setError(lang === "mn" ? "Имэйл эсвэл нууц үг буруу байна" : "Invalid email or password");
         return;
      }
      
      router.push(`/${lang}/profile`);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(lang === "mn" ? "Гэнэтийн алдаа гарлаа" : "An unexpected error occurred");
    }
  };

  const handleSocialSignIn = async (provider: "google" | "facebook") => {
    if (!agreeTerms) {
      triggerValidationAlert();
      return;
    }
    await signIn(provider, { callbackUrl: `/${lang}/profile` });
  };

  if (isLoading || !dictionary) {
    return <LoginSkeleton />;
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${currentTheme === "dark" ? "bg-[#0a0c10]" : "bg-[#f8fafc]"}`}>
      {/* Hero background image with blur */}
      <div className="absolute inset-0 bg-[url('/images/slider/1.jpg')] bg-cover bg-center blur-sm scale-105 z-0 transition-all duration-1000" />

      {/* Spatial Lighting Gradient Overlay */}
      <div className={`absolute inset-0 z-10 transition-opacity duration-500 ${currentTheme === "dark" ? "bg-gradient-to-b from-black/40 via-black/50 to-[#0a0c10]/95" : "bg-gradient-to-b from-white/20 via-white/40 to-[#f8fafc]/95"}`} />

      {/* Floating Theme Selector Dropdown Widget */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition-all duration-300 shadow-sm cursor-pointer ${
              currentTheme === "dark"
                ? "bg-white/[0.06] border-white/10 text-white hover:bg-white/[0.1] shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                : "bg-white/90 border-black/[0.08] text-gray-800 hover:bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
            }`}
          >
            {currentTheme === "light" ? (
              <>
                <svg className="w-4 h-4 text-amber-500 animate-spin-slow" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.46 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
                </svg>
                <span>{lang === "mn" ? "Гэгээлэг" : "Light"}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                <span>{lang === "mn" ? "Харанхуй" : "Dark"}</span>
              </>
            )}
            <svg className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${isThemeDropdownOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isThemeDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsThemeDropdownOpen(false)} />
              <div className={`absolute right-0 mt-2 w-36 rounded-2xl p-1.5 backdrop-blur-xl border shadow-2xl z-50 animate-[slideIn_0.2s_ease-out] ${
                currentTheme === "dark"
                  ? "bg-[#161a22]/95 border-white/10 text-white shadow-black/80"
                  : "bg-white/95 border-black/[0.08] text-gray-900 shadow-gray-200"
              }`}>
                <button
                  type="button"
                  onClick={() => {
                    if (themeContext && themeContext.theme !== "light") {
                      themeContext.toggleTheme();
                    }
                    setIsThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    currentTheme === "light"
                      ? "bg-gray-100 text-[#667eea]"
                      : "hover:bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.46 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
                  </svg>
                  <span>{lang === "mn" ? "Гэгээлэг" : "Light"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (themeContext && themeContext.theme !== "dark") {
                      themeContext.toggleTheme();
                    }
                    setIsThemeDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    currentTheme === "dark"
                      ? "bg-white/10 text-[#98a9fa]"
                      : "hover:bg-gray-50 text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <svg className="w-4 h-4 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  <span>{lang === "mn" ? "Харанхуй" : "Dark"}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dynamic colorful blur blobs (Visible and accented in dark, soft pastel in light) */}
      <div className={`absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-40 z-10 animate-pulse pointer-events-none transition-all duration-500 ${currentTheme === "dark" ? "bg-purple-600/20" : "bg-purple-400/5"}`} />
      <div className={`absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full blur-3xl opacity-35 z-10 animate-pulse pointer-events-none transition-all duration-500 ${currentTheme === "dark" ? "bg-purple-600/20" : "bg-[#3b82f6]/5"}`} style={{ animationDelay: "2s" }} />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .login-card {
          animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
          border-color: rgba(239, 68, 68, 0.5) !important;
          background-color: rgba(239, 68, 68, 0.05) !important;
        }
      `}} />

      <div className={`login-card backdrop-blur-xl p-8 md:p-10 rounded-3xl w-full max-w-[430px] relative z-20 flex flex-col gap-6 transition-all duration-500 ${currentTheme === "dark" ? "bg-white/[0.06] border border-white/[0.08] shadow-[0_24px_80px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] text-white" : "bg-white/85 border border-black/[0.06] shadow-[0_24px_80px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.8)] text-gray-900"}`}>
        {/* Header */}
        <div className="text-center mb-1">
          <div className="mx-auto mb-4 flex justify-center relative group">
            <div className={`absolute -inset-1.5 rounded-2xl blur-md opacity-60 group-hover:opacity-100 transition duration-300 ${currentTheme === "dark" ? "bg-gradient-to-br from-[#667eea] to-[#764ba2]" : "bg-[#667eea]/40"}`} />
            <img
              src="/logo.png"
              alt="NomadRise Logo"
              width={60}
              height={60}
              className={`relative rounded-2xl object-contain p-1 shadow-lg border transition-all duration-500 ${currentTheme === "dark" ? "bg-slate-955 border-white/5" : "bg-white border-black/5"}`}
            />
          </div>
          <h1 className={`text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r bg-clip-text text-transparent mb-1 transition-all duration-500 ${currentTheme === "dark" ? "from-white via-white to-gray-400" : "from-gray-900 via-gray-800 to-gray-600"}`}>
            {dictionary.login?.title || "Nomadrise-д нэвтрэх"}
          </h1>
          <p className={`text-xs md:text-sm font-medium transition-colors duration-500 ${currentTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            {dictionary.login?.subtitle || "Нэвтрэх мэйл хаяг болон нууц үгээ оруулна уу"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`px-4 py-3 rounded-xl text-xs md:text-sm flex items-center gap-2.5 transition-all duration-500 ${currentTheme === "dark" ? "bg-red-500/10 border border-red-500/20 text-red-200" : "bg-red-50 border border-red-200 text-red-800"}`}>
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-500 ${currentTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Мэйл хаяг
            </label>
            <div className="relative group">
              <span className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300 ${currentTheme === "dark" ? "text-gray-500 group-focus-within:text-[#667eea]" : "text-gray-400 group-focus-within:text-[#667eea]"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-medium outline-none transition-all duration-300 ${
                  currentTheme === "dark"
                    ? "bg-black/20 focus:bg-black/35 border-white/10 hover:border-white/20 focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 text-white placeholder:text-gray-500"
                    : "bg-gray-50 focus:bg-white border-black/10 hover:border-black/15 focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 text-gray-900 placeholder:text-gray-400"
                }`}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1.5">
            <label className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-500 ${currentTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              Нууц үг
            </label>
            <div className="relative group">
              <span className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300 ${currentTheme === "dark" ? "text-gray-500 group-focus-within:text-[#667eea]" : "text-gray-400 group-focus-within:text-[#667eea]"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-11 pr-4 py-3 border rounded-xl text-sm font-medium outline-none transition-all duration-300 ${
                  currentTheme === "dark"
                    ? "bg-black/20 focus:bg-black/35 border-white/10 hover:border-white/20 focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 text-white placeholder:text-gray-500"
                    : "bg-gray-50 focus:bg-white border-black/10 hover:border-black/15 focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10 text-gray-900 placeholder:text-gray-400"
                }`}
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className={`p-3.5 border rounded-xl transition-all duration-300 flex items-start gap-3 cursor-pointer ${
            shakeTerms ? "animate-shake" : ""
          } ${
            agreeTerms
              ? currentTheme === "dark"
                ? "border-[#667eea]/40 bg-[#667eea]/5"
                : "border-[#667eea]/30 bg-[#667eea]/5"
              : currentTheme === "dark"
                ? "bg-white/[0.02] border-white/5 hover:border-white/15"
                : "bg-black/[0.01] border-black/5 hover:border-black/10"
          }`}>
            <label className="flex items-start gap-3 cursor-pointer w-full">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 cursor-pointer accent-[#667eea] rounded border-white/10"
              />
              <span className={`text-xs leading-relaxed font-medium transition-colors duration-500 ${currentTheme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                Би{" "}
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(true)}
                  className={`bg-transparent border-none cursor-pointer underline p-0 font-semibold transition-colors ${currentTheme === "dark" ? "text-[#98a9fa] hover:text-[#b4c1ff]" : "text-[#4f46e5] hover:text-[#3730a3]"}`}
                >
                  {dictionary.login?.termsLink || "үйлчилгээний нөхцөл"}
                </button>
                {" "}болон{" "}
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(true)}
                  className={`bg-transparent border-none cursor-pointer underline p-0 font-semibold transition-colors ${currentTheme === "dark" ? "text-[#98a9fa] hover:text-[#b4c1ff]" : "text-[#4f46e5] hover:text-[#3730a3]"}`}
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
            className={`w-full h-13 text-white border-none rounded-xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2 ${
              !agreeTerms
                ? currentTheme === "dark"
                  ? "bg-white/[0.04] text-gray-500 border border-white/5 cursor-not-allowed opacity-40 shadow-none"
                  : "bg-black/[0.04] text-gray-400 border border-black/5 cursor-not-allowed opacity-40 shadow-none"
                : "bg-gradient-to-r from-[#667eea] to-[#764ba2] cursor-pointer hover:shadow-[0_8px_24px_rgba(102,126,234,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
            } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Нэвтэрч байна...</span>
              </>
            ) : (
              "Нэвтрэх"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center my-1">
            <div className={`flex-1 h-px transition-colors duration-500 ${currentTheme === "dark" ? "bg-white/10" : "bg-black/10"}`} />
            <span className={`px-4 text-[10px] font-bold uppercase tracking-widest transition-colors duration-500 ${currentTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>эсвэл</span>
            <div className={`flex-1 h-px transition-colors duration-500 ${currentTheme === "dark" ? "bg-white/10" : "bg-black/10"}`} />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            disabled={!agreeTerms}
            className={`w-full h-12 text-sm font-semibold flex items-center justify-center gap-3 transition-all duration-300 rounded-xl ${
              !agreeTerms
                ? currentTheme === "dark"
                  ? "bg-white/[0.01] text-gray-600 border border-white/5 cursor-not-allowed opacity-30 shadow-none"
                  : "bg-black/[0.01] text-gray-300 border border-black/5 cursor-not-allowed opacity-30 shadow-none"
                : currentTheme === "dark"
                  ? "bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 cursor-pointer hover:shadow-[0_4px_20px_rgba(255,255,255,0.05)] active:scale-[0.99]"
                  : "bg-white hover:bg-gray-50/80 text-gray-700 border border-black/10 cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)] active:scale-[0.99]"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className={`flex-shrink-0 ${!agreeTerms ? "grayscale opacity-30" : ""}`}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 0 12c0 1.94.46 3.77 1.28 5.4l3.56-2.77.01-.54z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span>{dictionary.login?.continueGoogle || "Google-ээр нэвтрэх"}</span>
          </button>

          {/* Facebook Sign In */}
          <button
            type="button"
            onClick={() => handleSocialSignIn("facebook")}
            disabled={!agreeTerms}
            className={`w-full h-12 text-sm font-semibold flex items-center justify-center gap-3 transition-all duration-300 rounded-xl ${
              !agreeTerms
                ? currentTheme === "dark"
                  ? "bg-white/[0.01] text-gray-600 border border-white/5 cursor-not-allowed opacity-30 shadow-none"
                  : "bg-black/[0.01] text-gray-300 border border-black/5 cursor-not-allowed opacity-30 shadow-none"
                : currentTheme === "dark"
                  ? "bg-[#1877F2]/90 hover:bg-[#1877F2] text-white border-none cursor-pointer hover:shadow-[0_8px_20px_rgba(24,119,242,0.25)] active:scale-[0.99]"
                  : "bg-[#1877F2] hover:bg-[#166fe5] text-white border-none cursor-pointer hover:shadow-[0_8px_20px_rgba(24,119,242,0.2)] active:scale-[0.99]"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" className={`flex-shrink-0 ${!agreeTerms ? "opacity-20" : ""}`}>
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>{dictionary.login?.continueFacebook || "Facebook-ээр нэвтрэх"}</span>
          </button>

          {/* Register Link */}
          <div className="text-center mt-3 flex justify-center items-center gap-2">
            <span className={`text-xs font-medium transition-colors duration-500 ${currentTheme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              {dictionary.login?.noAccount || "Эрх байхгүй юу?"}
            </span>
            <Link
              href={`/${lang}/register`}
              className={`underline font-bold text-xs tracking-wider transition-colors ${currentTheme === "dark" ? "text-[#98a9fa]" : "text-[#4f46e5]"}`}
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


