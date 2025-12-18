"use client";

import React, { useEffect, useState } from "react";
import { scholarshipApi } from "@/lib/api";
import Link from "next/link";

type Scholarship = {
  url: string;
  org: string;
  org_name: string;
  title: string;
  description: string;
  study_level: string;
  field_of_study: string;
  coverage: string;
  amount: string;
  currency: string;
  application_open_at: string;
  application_close_at: string;
  application_url: string;
  is_active: boolean;
};

type ScholarshipsPageProps = {
  params: Promise<{ lang: string }>;
};

export default function ScholarshipsPage({ params }: ScholarshipsPageProps) {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const response = await scholarshipApi.getAll();
        // Handle paginated response with results array
        const data = response.data || response;
        const scholarshipsData = data.results || data;
        setScholarships(Array.isArray(scholarshipsData) ? scholarshipsData : []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching scholarships:", err);
        setError("Failed to load scholarships");
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);

  useEffect(() => {
    Promise.resolve(params).then((resolvedParams) => {
      setLang(resolvedParams.lang);
    });
  }, [params]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCoverageLabel = (coverage: string) => {
    const labels: { [key: string]: string } = {
      full: "Full Coverage",
      partial: "Partial Coverage",
      tuition_only: "Tuition Only",
    };
    return labels[coverage] || coverage;
  };

  const getStudyLevelLabel = (level: string) => {
    const labels: { [key: string]: string } = {
      undergraduate: "Undergraduate",
      postgraduate: "Master's/Postgraduate",
      doctorate: "Doctorate/PhD",
      other: "Other",
    };
    return labels[level] || level;
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "2rem", color: "#1f2937" }}>
            Scholarships
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#6b7280" }}>Loading scholarships...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "2rem", color: "#1f2937" }}>
            Scholarships
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#ef4444" }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "4rem 2rem", background: "#f9fafb" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "1rem", color: "#1f2937" }}>
            {lang === "mn" ? "Боломжтой Тэтгэлгүүд" : "Available Scholarships"}
          </h1>
          <p style={{ fontSize: "1.125rem", color: "#6b7280", maxWidth: "700px", margin: "0 auto" }}>
            {lang === "mn" 
              ? "Боловсролын зорилгодоо хүрэхэд туслах тэтгэлгийн боломжуудтай танилцаарай" 
              : "Discover scholarship opportunities for your educational journey"}
          </p>
        </div>

        {scholarships.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: "1rem" }}>
            <p style={{ fontSize: "1.125rem", color: "#6b7280" }}>
              {lang === "mn" ? "Одоогоор тэтгэлэг байхгүй байна." : "No scholarships available at the moment."}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}>
            {scholarships.map((scholarship, index) => (
              <div
                key={index}
                style={{
                  background: "white",
                  borderRadius: "1rem",
                  padding: "2rem",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                  transition: "all 0.3s ease",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.15)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: "#1f2937", marginBottom: "0.5rem" }}>
                    {scholarship.title}
                  </h2>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.75rem" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.75rem",
                        background: "#dbeafe",
                        color: "#1e40af",
                        borderRadius: "9999px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                      }}
                    >
                      {getStudyLevelLabel(scholarship.study_level)}
                    </span>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.75rem",
                        background: "#dcfce7",
                        color: "#166534",
                        borderRadius: "9999px",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                      }}
                    >
                      {getCoverageLabel(scholarship.coverage)}
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: "1.5rem", flex: "1" }}>
                  <p
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      color: "#4b5563",
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {scholarship.description.split('\n')[0]}
                  </p>
                </div>

                <div style={{ marginBottom: "1.5rem" }}>
                  <div style={{ marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: "500" }}>Amount: </span>
                    <span style={{ fontSize: "1.25rem", fontWeight: "700", color: "#667eea" }}>
                      {scholarship.amount ? `${scholarship.currency} ${Number(scholarship.amount).toLocaleString()}` : "Contact for details"}
                    </span>
                  </div>
                  {scholarship.field_of_study && (
                    <div style={{ marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Field: </span>
                      <span style={{ fontSize: "0.875rem", color: "#374151", fontWeight: "500" }}>
                        {scholarship.field_of_study}
                      </span>
                    </div>
                  )}
                  <div style={{ marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Deadline: </span>
                    <span style={{ fontSize: "0.875rem", color: "#dc2626", fontWeight: "600" }}>
                      {formatDate(scholarship.application_close_at)}
                    </span>
                  </div>
                </div>

                <Link 
                  href={`/${lang}/scholarships/${scholarship.url.split('/').filter(Boolean).pop()}`}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: "0.75rem",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    textAlign: "center",
                    borderRadius: "0.5rem",
                    fontWeight: "600",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(102, 126, 234, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {lang === "mn" ? "Дэлгэрэнгүй үзэх" : "View Details"}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
