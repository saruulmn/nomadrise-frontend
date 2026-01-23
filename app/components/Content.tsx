"use client";

import React, { useEffect, useState } from "react";
import { contentApi, ContentItem } from "@/lib/api";

type ContentProps = {
  dictionary: {
    about: {
      title: string;
      vision: { title: string; text: string };
      challenge: { title: string; text: string };
      solution: { title: string; text: string };
      cta: string;
    };
  };
};

export default function Content({ dictionary }: ContentProps) {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        // contentApi.getAll() now returns data directly (no .data wrapper)
        const data = await contentApi.getAll();
        setContents(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching contents:", err);
        setError("Failed to load content");
        setLoading(false);
      }
    };

    fetchContents();
  }, []);

  if (loading) {
    return (
      <section className="team-wrap">
        <div className="team-header">
          <h2 className="team-title">{dictionary.about.title}</h2>
        </div>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="team-wrap">
        <div className="team-header">
          <h2 className="team-title">{dictionary.about.title}</h2>
        </div>
        <div style={{ textAlign: "center", padding: "2rem", color: "#ef4444" }}>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="team-wrap">
      <div className="team-header">
        <h2 className="team-title">{dictionary.about.title}</h2>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem" }}>
        {/* Static dictionary content */}
        <div style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
            {dictionary.about.vision.title}
          </h3>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.75", color: "#4b5563" }}>
            {dictionary.about.vision.text}
          </p>
        </div>

        <div style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
            {dictionary.about.challenge.title}
          </h3>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.75", color: "#4b5563" }}>
            {dictionary.about.challenge.text}
          </p>
        </div>

        <div style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
            {dictionary.about.solution.title}
          </h3>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.75", color: "#4b5563" }}>
            {dictionary.about.solution.text}
          </p>
        </div>

        {/* Dynamic content from API */}
        {contents.length > 0 && (
          <div style={{ marginTop: "3rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1f2937" }}>
              Latest Updates
            </h3>
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {contents.map((content, index) => (
                <div
                  key={index}
                  style={{
                    padding: "1.5rem",
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    transition: "box-shadow 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.75rem", color: "#1f2937" }}>
                    {content.title}
                  </h4>
                  <p style={{ fontSize: "0.8rem", lineHeight: "1.5", color: "#4b5563" }}>
                    {content.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", padding: "2rem", background: "#f9fafb", borderRadius: "0.5rem", marginTop: "3rem" }}>
          <p style={{ fontSize: "1rem", fontWeight: "500", color: "#1f2937" }}>
            {dictionary.about.cta}
          </p>
        </div>
      </div>
    </section>
  );
}