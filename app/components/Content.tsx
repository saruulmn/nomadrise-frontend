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
  content: "about.content",
} as const;

function getBlockText(block: ContentItem | undefined, fallback: string, lang: Locale) {
  if (!block) return fallback;
  return (lang === "mn" ? block.body_mn || block.body_en : block.body_en || block.body_mn) || fallback;
}

function getBlockTitle(block: ContentItem | undefined, fallback: string, lang: Locale) {
  return lang === "mn" ? block?.title || fallback : fallback;
}

function getFallbackBody(dictionary: ContentProps["dictionary"]) {
  return [
    `<h3>${dictionary.about.vision.title}</h3>`,
    `<p>${dictionary.about.vision.text}</p>`,
    `<h3>${dictionary.about.challenge.title}</h3>`,
    `<p>${dictionary.about.challenge.text}</p>`,
    `<h3>${dictionary.about.solution.title}</h3>`,
    `<p>${dictionary.about.solution.text}</p>`,
    `<p><strong>${dictionary.about.cta}</strong></p>`,
  ].join("");
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

  const content = blockByKey[ABOUT_KEYS.content];
  const contentBody = getBlockText(content, getFallbackBody(dictionary), lang);

  return (
    <section className="team-wrap">
      <div className="team-header">
        <h2 className="team-title">{getBlockTitle(content, dictionary.about.title, lang)}</h2>
      </div>

      <div
        className="about-rich-content"
        dangerouslySetInnerHTML={{ __html: contentBody }}
      />
    </section>
  );
}
