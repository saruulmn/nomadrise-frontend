"use client";

import React, { useEffect, useMemo, useState } from "react";
import { contentApi, ContentItem } from "@/lib/api";
import { Locale } from "@/i18n/config";

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
  lang?: Locale;
};

const ABOUT_KEYS = {
  title: "about.title",
  vision: "about.vision",
  challenge: "about.challenge",
  solution: "about.solution",
  cta: "about.cta",
} as const;

function getBlockText(block: ContentItem | undefined, fallback: string, lang: Locale) {
  if (!block) return fallback;
  return (lang === "mn" ? block.body_mn || block.body_en : block.body_en || block.body_mn) || fallback;
}

function getBlockTitle(block: ContentItem | undefined, fallback: string, lang: Locale) {
  return lang === "mn" ? block?.title || fallback : fallback;
}

export default function Content({ dictionary, lang = "mn" }: ContentProps) {
  const [blocks, setBlocks] = useState<ContentItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    contentApi
      .getAll()
      .then((data) => {
        if (isMounted) setBlocks(data);
      })
      .catch((err) => {
        console.error("Error fetching about content blocks:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const blockByKey = useMemo(() => {
    return blocks.reduce<Record<string, ContentItem>>((acc, block) => {
      acc[block.key] = block;
      return acc;
    }, {});
  }, [blocks]);

  const title = blockByKey[ABOUT_KEYS.title];
  const vision = blockByKey[ABOUT_KEYS.vision];
  const challenge = blockByKey[ABOUT_KEYS.challenge];
  const solution = blockByKey[ABOUT_KEYS.solution];
  const cta = blockByKey[ABOUT_KEYS.cta];

  return (
    <section className="team-wrap">
      <div className="team-header">
        <h2 className="team-title">{getBlockText(title, dictionary.about.title, lang)}</h2>
      </div>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
            {getBlockTitle(vision, dictionary.about.vision.title, lang)}
          </h3>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.75", color: "#4b5563" }}>
            {getBlockText(vision, dictionary.about.vision.text, lang)}
          </p>
        </div>

        <div style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
            {getBlockTitle(challenge, dictionary.about.challenge.title, lang)}
          </h3>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.75", color: "#4b5563" }}>
            {getBlockText(challenge, dictionary.about.challenge.text, lang)}
          </p>
        </div>

        <div style={{ marginBottom: "3rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "#1f2937" }}>
            {getBlockTitle(solution, dictionary.about.solution.title, lang)}
          </h3>
          <p style={{ fontSize: "0.9rem", lineHeight: "1.75", color: "#4b5563" }}>
            {getBlockText(solution, dictionary.about.solution.text, lang)}
          </p>
        </div>

        <div style={{ textAlign: "center", padding: "2rem", background: "#f9fafb", borderRadius: "0.5rem", marginTop: "3rem" }}>
          <p style={{ fontSize: "1rem", fontWeight: "500", color: "#1f2937" }}>
            {getBlockText(cta, dictionary.about.cta, lang)}
          </p>
        </div>
      </div>
    </section>
  );
}
