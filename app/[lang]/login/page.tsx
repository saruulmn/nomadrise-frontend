"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import PolicyModal from "@/app/components/PolicyModal";
import { LoginSkeleton } from "@/app/components/Skeleton";
import { signIn } from "next-auth/react";

export default function LoginPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = use(params);
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
    getDictionary(lang).then((dict) => {
      setDictionary(dict);
      setIsLoading(false);
    });
  }, [lang]);

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
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (response?.error) {
         setIsSubmitting(false);
         setError("Invalid email or password");
         return;
      }
      
      router.push(`/${lang}/profile`);
    } catch (err: any) {
      setIsSubmitting(false);
      setError("An unexpected error occurred");
    }
  };

  if (isLoading || !dictionary) {
    return <LoginSkeleton />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Hero background image with blur */}
      <div className="absolute inset-0 bg-[url('/images/slider/1.jpg')] bg-cover bg-center blur-sm scale-110 z-0" />

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-form {
          animation: slideIn 0.6s ease-out;
        }
      `}} />

      <div className="login-form bg-white p-12 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-[440px] relative z-20">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mx-auto mb-6 flex justify-center">
            <img
              src="/logo.png"
              alt="NomadRise Logo"
              width={64}
              height={64}
              className="rounded-2xl object-contain shadow-[0_8px_16px_rgba(102,126,234,0.3)]"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-transparent mb-2">
            {dictionary.login?.title || "Nomadrise-д нэвтрэх"}
          </h1>
          <p className="text-gray-500 text-base">
            {dictionary.login?.subtitle || "Нэвтрэх мэйл хаяг болон нууц үгээ оруулна уу"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Мэйл хаяг
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-3 border-2 border-gray-200 rounded-xl text-base font-inherit box-border transition-colors duration-300 focus:border-[#667eea] focus:outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Нууц үг
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-3 border-2 border-gray-200 rounded-xl text-base font-inherit box-border transition-colors duration-300 focus:border-[#667eea] focus:outline-none"
            />
          </div>

          {/* Terms Checkbox */}
          <div className={`mb-5 p-4 bg-gray-50 rounded-xl border-2 transition-all duration-300 ${agreeTerms ? 'border-[#667eea]' : 'border-gray-200'}`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-5 h-5 mt-0.5 cursor-pointer accent-[#667eea]"
              />
              <span className="text-sm text-gray-700 leading-relaxed font-medium">
                Би{" "}
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(true)}
                  className="bg-transparent border-none text-[#667eea] cursor-pointer underline p-0 font-inherit hover:text-[#764ba2]"
                >
                  {dictionary.login?.termsLink || "үйлчилгээний нөхцөл"}
                </button>
                {" "}болон{" "}
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(true)}
                  className="bg-transparent border-none text-[#667eea] cursor-pointer underline p-0 font-inherit hover:text-[#764ba2]"
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
            className={`w-full h-14 text-white border-none rounded-xl text-base font-bold transition-all duration-300 ${!agreeTerms ? 'bg-gray-300 cursor-not-allowed opacity-60' : 'bg-gradient-to-br from-[#667eea] to-[#764ba2] cursor-pointer hover:-translate-y-0.5 shadow-[0_8px_16px_rgba(102,126,234,0.3)] hover:shadow-[0_12px_24px_rgba(102,126,234,0.4)]'} ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-4 text-gray-400 text-sm font-medium">эсвэл</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: `/${lang}/profile` })}
            className="w-full h-[52px] bg-white text-gray-700 border-2 border-gray-200 rounded-xl text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-3 transition-all duration-300 mb-3 hover:border-[#667eea] hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)]"
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
            onClick={() => signIn("facebook", { callbackUrl: `/${lang}/profile` })}
            className="w-full h-[52px] bg-[#1877F2] text-white border-none rounded-xl text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-3 transition-all duration-300 hover:bg-[#166fe5] hover:shadow-[0_4px_12px_rgba(24,119,242,0.4)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook-ээр нэвтрэх
          </button>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <Link
              href={`/${lang}/register`}
              className="text-[#667eea] no-underline font-semibold text-sm transition-colors duration-300 cursor-pointer hover:text-[#764ba2]"
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

