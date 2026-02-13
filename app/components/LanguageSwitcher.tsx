"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/i18n/config";

interface LanguageSwitcherProps {
  currentLang?: Locale;
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Determine current language - use prop if provided, otherwise detect from pathname
  const detectedLang = pathname.startsWith("/en") ? "en" : "mn";
  const lang = (currentLang || detectedLang) as Locale;
  
  const languages = [
    { code: "en", label: "English" },
    { code: "mn", label: "Монгол хэл" },
  ];

  // For policy page, use Link for navigation
  if (currentLang) {
    const otherLang = currentLang === "en" ? "mn" : "en";
    const otherLangLabel = otherLang === "en" ? "English" : "Монгол хэл";

    return (
      <Link href={`/${otherLang}/policy`} style={{ display: "inline-block" }}>
        <button
          style={{
            background: "none",
            border: "2px solid #667eea",
            color: "#667eea",
            cursor: "pointer",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#667eea";
            e.currentTarget.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#667eea";
          }}
        >
          {otherLangLabel}
        </button>
      </Link>
    );
  }

  // Default navbar behavior

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: "0.5rem 1rem",
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRadius: "0.375rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          fontSize: "0.875rem",
          color: "white",
        }}
      >
        {lang === "en" ? "English" : "Монгол хэл"}
        <span style={{ fontSize: "0.75rem" }}>▼</span>
      </button>

      {isOpen && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999,
            }}
            onClick={() => setIsOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "0.5rem",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "0.375rem",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              minWidth: "150px",
              zIndex: 1000,
            }}
          >
            {languages.map((langOption) => (
              <button
                key={langOption.code}
                onClick={() => {
                  // Check if pathname already has a locale
                  if (pathname.startsWith("/en") || pathname.startsWith("/mn")) {
                    const newPathname = pathname.replace(/^\/(en|mn)/, `/${langOption.code}`);
                    router.push(newPathname);
                  } else {
                    // If no locale in pathname, add it
                    router.push(`/${langOption.code}${pathname}`);
                  }
                  setIsOpen(false);
                }}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  border: "none",
                  background: lang === langOption.code ? "#f3f4f6" : "white",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  color: "#1f2937",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    lang === langOption.code ? "#f3f4f6" : "white")
                }
              >
                {langOption.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
