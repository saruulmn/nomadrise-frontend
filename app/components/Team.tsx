"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { Locale } from "@/i18n/config";

type MentorProfile = {
  user_id: number;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  country: string | null;
  city: string | null;
  highest_education: string | null;
  current_status: string | null;
  preferred_language: string | null;
  bio_en: string | null;
  bio_mn: string | null;
};

type Member = {
  name: string;
  position: string;
  location: string;
  photo?: string;
  bio?: string;
};

type TeamProps = {
  dictionary: {
    team: {
      title: string;
      subtitle: string;
    };
  };
  lang?: Locale;
};
const [error, setError] = useState<string | null>(null);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function mapProfileToMember(profile: MentorProfile, lang: Locale): Member {
  const location = [profile.city, profile.country].filter(Boolean).join(", ");
  const bio = lang === "mn" ? (profile.bio_mn || profile.bio_en) : (profile.bio_en || profile.bio_mn);
  return {
    name: `${profile.first_name} ${profile.last_name}`.trim() || profile.username,
    position: profile.current_status || "",
    location: location || "",
    photo: profile.avatar_url || undefined,
    bio: bio || undefined,
  };
}

export default function Team({ dictionary, lang = "mn" }: TeamProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (loading) return <p>Ачааллаж байна...</p>;
  if (error) return <p>{error}</p>;

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch(`${API_BASE_URL}/mentors/profiles/`);
        if (!res.ok) throw new Error("Failed to fetch mentors");
        const json = await res.json();
        if (!Array.isArray(json)) throw new Error("Буруу формат");
        const data = json as MentorProfile[];
        setMembers(data.map((p) => mapProfileToMember(p, lang)));
      } catch (err) {
    console.error("Error fetching team members:", err);
    setError("Мэдээлэл ачааллахад алдаа гарлаа")  // ерөнхий текст
    } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, [lang]);

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  };

  return (
    <>
      <section id="team" className="team-wrap">
        <div className="team-header">
          <h2 className="team-title">{dictionary.team.title}</h2>
          <p className="team-sub">{dictionary.team.subtitle}</p>
        </div>

        <div className="team-grid">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <article className="team-card" key={i}>
                <div className="team-photo-wrapper">
                  <div className="team-photo-placeholder" style={{ background: "#e0e0e0" }} />
                </div>
                <div className="team-meta">
                  <div className="team-name" style={{ background: "#e0e0e0", height: "1rem", width: "60%", borderRadius: 4 }} />
                  <div className="team-position" style={{ background: "#e0e0e0", height: "0.8rem", width: "40%", borderRadius: 4, marginTop: 6 }} />
                </div>
              </article>
            ))
          ) : members.length === 0 ? (
            <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--muted)" }}>
              No team members found.
            </p>
          ) : (
            members.map((member, idx) => (
            <article 
              className="team-card" 
              key={idx}
              onClick={() => handleMemberClick(member)}
              style={{ cursor: "pointer" }}
            >
              <div className="team-photo-wrapper">
                {member.photo ? (
                  <img className="team-photo" src={member.photo} alt={member.name} />
                ) : (
                  <div className="team-photo-placeholder">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="team-meta">
                <div className="team-name">{member.name}</div>
                <div className="team-position">{member.position}</div>
              </div>
            </article>
          ))
          )}
        </div>
      </section>

      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        centered
        styles={{
          content: {
            background: 'var(--card-bg)',
            color: 'var(--foreground)'
          }
        }}
      >
        {selectedMember && (
          <div style={{ padding: "1rem 0" }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
              {selectedMember.photo ? (
                <img 
                  src={selectedMember.photo} 
                  alt={selectedMember.name}
                  style={{ 
                    width: "110px", 
                    height: "110px", 
                    borderRadius: "50%", 
                    objectFit: "cover",
                    marginRight: "1.5rem"
                  }}
                />
              ) : (
                <div style={{
                  width: "110px",
                  height: "110px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "2.75rem",
                  color: "white",
                  fontWeight: "bold",
                  marginRight: "1.5rem"
                }}>
                  {selectedMember.name.charAt(0)}
                </div>
              )}
              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.25rem", color: "var(--foreground)" }}>
                  {selectedMember.name}
                </h3>
                <p style={{ fontSize: "1rem", color: "var(--muted)", marginBottom: "0.25rem" }}>
                  {selectedMember.position}
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
                  {selectedMember.location}
                </p>
              </div>
            </div>

            {selectedMember.bio && (
              <div>
                <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--foreground)" }}>
                  About
                </h4>
                <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: "1.6" }}>
                  {selectedMember.bio}
                </p>
              </div>
            )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
