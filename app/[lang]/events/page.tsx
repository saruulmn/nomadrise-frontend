"use client";

import React, { useEffect, useState } from "react";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import { EventsSkeleton } from "@/app/components/Skeleton";

type EventsPageProps = {
  params: Promise<{ lang: string }>;
};

export default function EventsPage({ params }: EventsPageProps) {
  const [lang, setLang] = useState("en");
  const [dict, setDict] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.resolve(params).then(async (resolved) => {
      setLang(resolved.lang);
      try {
        const d = await getDictionary(resolved.lang as Locale);
        setDict(d);
      } catch (e) {
        // ignore
      }
      setIsLoading(false);
    });
  }, [params]);

  if (isLoading) {
    return <EventsSkeleton />;
  }

  return (
    <div style={{ minHeight: "100vh", padding: "4rem 2rem", background: "#f9fafb" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2.25rem", fontWeight: 700 }}>
            {dict?.events?.title || (lang === "mn" ? "Арга хэмжээ" : "Events")}
          </h1>
        </div>

        <div style={{ background: "white", padding: "2rem", borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <p style={{ color: "#6b7280" }}>
            {dict?.events?.empty || (lang === "mn" ? "Одоогоор бүртгэлтэй арга хэмжээ байхгүй байна." : "No events available at the moment.")}
          </p>
        </div>
      </div>
    </div>
  );
}
