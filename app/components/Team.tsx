"use client";

import React, { useState } from "react";
import { Modal } from "antd";

type Member = {
  name: string;
  position: string;
  location: string;
  photo?: string;
  bio?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
};

const members: Member[] = [
  { 
    name: "Д. Янжиндулам", 
    position: "Chief Executive Officer",
    location: "Eindhoven, Netherlands", 
    photo: "/images/members/1.png",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium.",
  },
  { 
    name: "Даваа", 
    position: "Chief Operating Officer",
    location: "Eindhoven, Netherlands", 
    photo: "/images/members/2.png",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra. Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum, elit eget tincidunt condimentum.",
  },
  { 
    name: "Эрдэнэбилэг", 
    position: "Board Member",
    location: "Helsinki, Finland", 
    photo: "/images/members/3.png",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis lorem ut libero malesuada feugiat. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Donec sollicitudin molestie malesuada. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui. Pellentesque in ipsum id orci porta dapibus. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.",
  },
  { 
    name: "Ананд", 
    position: "Chief Technology Officer",
    location: "Eindhoven, Netherlands", 
    photo: "/images/members/4.png",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin eget tortor risus. Curabitur aliquet quam id dui posuere blandit. Quisque velit nisi, pretium ut lacinia in, elementum id enim. Vivamus suscipit tortor eget felis porttitor volutpat. Nulla porttitor accumsan tincidunt. Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Cras ultricies ligula sed magna dictum porta. Sed porttitor lectus nibh. Donec rutrum congue leo eget malesuada. Vestibulum ante ipsum primis in faucibus orci luctus.",
  },
  { 
    name: "Саруул", 
    position: "Chief Marketing Officer",
    location: "Ulaanbaatar, Mongolia", 
    photo: "/images/members/5.png",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. Donec rutrum congue leo eget malesuada. Nulla quis lorem ut libero malesuada feugiat. Vivamus suscipit tortor eget felis porttitor volutpat. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Curabitur aliquet quam id dui posuere blandit. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.",
  },
];

type TeamProps = {
  dictionary: {
    team: {
      title: string;
      subtitle: string;
    };
  };
};

export default function Team({ dictionary }: TeamProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          {members.map((member) => (
            <article 
              className="team-card" 
              key={member.name}
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
          ))}
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
              <div style={{ marginBottom: "1.5rem" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem", color: "var(--foreground)" }}>
                  About
                </h4>
                <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: "1.6" }}>
                  {selectedMember.bio}
                </p>
              </div>
            )}

            <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
              {selectedMember.email && (
                <div style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center" }}>
                  <span style={{ fontWeight: "600", color: "var(--foreground)", marginRight: "0.5rem", minWidth: "70px" }}>
                    Email:
                  </span>
                  <span style={{ color: "var(--muted)" }}>{selectedMember.email}</span>
                </div>
              )}
              {selectedMember.phone && (
                <div style={{ marginBottom: "0.75rem", display: "flex", alignItems: "center" }}>
                  <span style={{ fontWeight: "600", color: "var(--foreground)", marginRight: "0.5rem", minWidth: "70px" }}>
                    Phone:
                  </span>
                  <span style={{ color: "var(--muted)" }}>{selectedMember.phone}</span>
                </div>
              )}
              {selectedMember.linkedin && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontWeight: "600", color: "var(--foreground)", marginRight: "0.5rem", minWidth: "70px" }}>
                    LinkedIn:
                  </span>
                  <a 
                    href={selectedMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--primary)", textDecoration: "none" }}
                  >
                    View Profile
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
