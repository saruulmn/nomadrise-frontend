"use client";

import React from "react";
import Link from "next/link";

type CategoryItem = {
  name: string;
  count: number;
};

const jobsByField: CategoryItem[] = [
  { name: "Artificial Intelligence", count: 210 },
  { name: "Programming Languages", count: 205 },
  { name: "Machine Learning", count: 197 },
  { name: "Electrical Engineering", count: 161 },
  { name: "Materials Engineering", count: 152 },
  { name: "Computational Sciences", count: 145 },
  { name: "Molecular Biology", count: 131 },
  { name: "Materials Chemistry", count: 128 },
  { name: "Cell Biology", count: 124 },
  { name: "Mechanical Engineering", count: 113 },
];

const jobsByType: CategoryItem[] = [
  { name: "PhD", count: 490 },
  { name: "Postdoc", count: 390 },
  { name: "Assistant / Associate Professor", count: 187 },
  { name: "Professor", count: 186 },
  { name: "Lecturer / Senior Lecturer", count: 143 },
  { name: "Researcher", count: 131 },
  { name: "Research assistant", count: 80 },
  { name: "Tenure Track", count: 79 },
  { name: "Other", count: 62 },
  { name: "Management / Leadership", count: 31 },
];

const jobsByCountry: CategoryItem[] = [
  { name: "Belgium", count: 213 },
  { name: "Sweden", count: 201 },
  { name: "Germany", count: 166 },
  { name: "Morocco", count: 154 },
  { name: "Switzerland", count: 122 },
  { name: "Austria", count: 99 },
  { name: "Luxembourg", count: 91 },
  { name: "The Netherlands", count: 88 },
  { name: "Finland", count: 78 },
  { name: "Norway", count: 49 },
];

const jobsBySchool: CategoryItem[] = [
  { name: "Mohammed VI Polytechnic University", count: 154 },
  { name: "KTH Royal Institute of Technology", count: 127 },
  { name: "University of Luxembourg", count: 88 },
  { name: "KU Leuven", count: 78 },
  { name: "IU International University of Applied Sciences", count: 69 },
  { name: "ETH Zürich", count: 68 },
  { name: "Ghent University", count: 43 },
  { name: "University of Cologne", count: 39 },
  { name: "University of Graz", count: 34 },
  { name: "Eindhoven University of Technology", count: 33 },
];

function CategoryColumn({ title, items }: { title: string; items: CategoryItem[] }) {
  return (
    <div style={{ flex: 1, minWidth: "250px" }}>
      <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1.5rem", color: "#1f2937" }}>
        {title}
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li key={item.name} style={{ marginBottom: "0.75rem" }}>
            <Link
              href="#"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "#374151",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ flex: 1 }}>{item.name}</span>
              <span style={{ color: "#9ca3af", fontSize: "0.875rem", marginLeft: "0.5rem" }}>
                {item.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type PopularCategoriesProps = {
  dictionary: {
    categories: {
      title: string;
      exploreMore: string;
      byField: string;
      byType?: string;
      byLevel?: string;
      byCountry: string;
      byEmployer?: string;
      bySchool?: string;
    };
  };
};

export default function PopularCategories({ dictionary }: PopularCategoriesProps) {
  return (
    <section className="team-wrap">
      <div className="team-header">
        <h2 className="team-title">{dictionary.categories.title}</h2>
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
            borderTop: "3px solid #22d3ee",
            paddingTop: "2rem",
          }}
        >
          <CategoryColumn title={dictionary.categories.byField} items={jobsByField} />
          <CategoryColumn title={dictionary.categories.byType || dictionary.categories.byLevel || ''} items={jobsByType} />
          <CategoryColumn title={dictionary.categories.byCountry} items={jobsByCountry} />
          <CategoryColumn title={dictionary.categories.byEmployer || dictionary.categories.bySchool || ''} items={jobsBySchool} />
        </div>

        <div style={{ textAlign: "center" }}>
          <Link
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem 3rem",
              background: "#eeeeee",
              color: "white",
              borderRadius: "9999px",
              textDecoration: "none",
              fontSize: "1.125rem",
              fontWeight: "500",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#06b6d4")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#22d3ee")}
          >
            {dictionary.categories.exploreMore}
            <span style={{ fontSize: "1.25rem" }}>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
