"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const currentLang = pathname.startsWith("/en") ? "en" : "mn";
  const languages = [
    { code: "en", label: "English" },
    { code: "mn", label: "Монгол хэл" },
  ];

  const switchLanguage = (langCode: string) => {
    const newPathname = pathname.replace(/^\/(en|mn)/, `/${langCode}`);
    router.push(newPathname);
    setIsOpen(false);
  };

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
        {currentLang === "en" ? "English" : "Монгол хэл"}
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
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLanguage(lang.code)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  textAlign: "left",
                  border: "none",
                  background: currentLang === lang.code ? "#f3f4f6" : "white",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  color: "#1f2937",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    currentLang === lang.code ? "#f3f4f6" : "white")
                }
              >
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
