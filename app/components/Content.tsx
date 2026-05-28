import React from "react";

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

        <div style={{ textAlign: "center", padding: "2rem", background: "#f9fafb", borderRadius: "0.5rem", marginTop: "3rem" }}>
          <p style={{ fontSize: "1rem", fontWeight: "500", color: "#1f2937" }}>
            {dictionary.about.cta}
          </p>
        </div>
      </div>
    </section>
  );
}
