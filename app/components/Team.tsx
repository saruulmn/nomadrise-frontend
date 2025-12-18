"use client";

import React from "react";

type Member = {
  name: string;
  location: string;
  photo?: string; // /images/team/*.jpg in public, optional
};

const members: Member[] = [
  { name: "Д. Янжиндулам", location: "Eindhoven, Netherlands", photo: "/images/members/1.png" },
  { name: "Даваа", location: "Eindhoven, Netherlands", photo: "/images/members/2.png" },
  { name: "Эрдэнэбилэг", location: "Helsinki, Finland", photo: "/images/members/3.png" },
  { name: "Ананд", location: "Eindhoven, Netherlands", photo: "/images/members/4.png" },
  { name: "Саруул", location: "Ulaanbaatar, Mongolia", photo: "/images/members/5.png" },
];

function InitialAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="avatar-initial">
      <span>{initials}</span>
    </div>
  );
}

type TeamProps = {
  dictionary: {
    team: {
      title: string;
      subtitle: string;
    };
  };
};

export default function Team({ dictionary }: TeamProps) {
  return (
    <section className="team-wrap">
      <div className="team-header">
        <h2 className="team-title">{dictionary.team.title}</h2>
        <p className="team-sub">{dictionary.team.subtitle}</p>
      </div>

      <div className="team-grid">
        {members.map((m) => (
          <article className="team-card" key={m.name}>
            {m.photo ? (
              <img className="team-photo" src={m.photo} alt={m.name} />
            ) : (
              <InitialAvatar name={m.name} />
            )}
            <div className="team-meta">
              <div className="team-name">{m.name}</div>
              <div className="team-location">{m.location}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
