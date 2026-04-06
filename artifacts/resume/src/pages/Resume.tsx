import { useState, useEffect } from "react";

const PT_TO_PX = 96 / 72;

interface ResumeRole {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

interface Spacing {
  sectionGap: number;
  roleGap: number;
  bulletGap: number;
  lineHeight: number;
  bodyFontSize: number;
  headlineFontSize: number;
}

interface ResumeData {
  name: string;
  headline: string;
  contact: {
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    website: string;
  };
  summary: string;
  roles: ResumeRole[];
  skills: { category: string; items: string }[];
  education: {
    degree: string;
    school: string;
    location: string;
    dates: string;
  }[];
  spacing: Spacing;
}

function SectionHeader({
  title,
  lineHeightPx,
}: {
  title: string;
  lineHeightPx: number;
}) {
  return (
    <h2
      style={{
        fontSize: "10pt",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        margin: 0,
        padding: 0,
        paddingBottom: "3px",
        marginBottom: `${lineHeightPx}px`,
        borderBottom: "1px solid #1a1a2e",
        color: "#1a1a2e",
      }}
    >
      {title}
    </h2>
  );
}

export default function ResumePage() {
  const [data, setData] = useState<ResumeData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const base = import.meta.env.BASE_URL;
    fetch(`${base}resume-data.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-red-600 text-sm">
        Failed to load resume: {error}
      </div>
    );
  if (!data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-500 text-sm">
        Loading...
      </div>
    );

  const sp = data.spacing;
  const sectionGapPx = sp.sectionGap * PT_TO_PX;
  const roleGapPx = sp.roleGap * PT_TO_PX;
  const bulletGapPx = sp.bulletGap * PT_TO_PX;
  const lineHeightPx = sp.lineHeight * PT_TO_PX;
  const bodyFontPx = sp.bodyFontSize * PT_TO_PX;
  const headlineFontPx = sp.headlineFontSize * PT_TO_PX;

  const contactParts = [
    data.contact.location,
    data.contact.email,
    data.contact.linkedin,
    data.contact.website,
  ].filter(Boolean);

  const base = import.meta.env.BASE_URL;

  return (
    <div
      style={{
        background: "#e8e8e8",
        minHeight: "100vh",
        padding: "32px 16px 48px",
      }}
    >
      {/* Download bar */}
      <div
        style={{
          width: "816px",
          margin: "0 auto 16px",
          display: "flex",
          justifyContent: "flex-end",
          gap: "10px",
        }}
      >
        <a
          href={`${base}fernando-rodriguez-resume.pdf`}
          download
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 16px",
            background: "#1a1a2e",
            color: "#fff",
            borderRadius: "5px",
            fontSize: "12.5px",
            fontFamily: "'Calibri', 'Arial', sans-serif",
            textDecoration: "none",
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          Download PDF
        </a>
        <a
          href={`${base}fernando-rodriguez-resume.docx`}
          download
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 16px",
            background: "#fff",
            color: "#1a1a2e",
            border: "1.5px solid #1a1a2e",
            borderRadius: "5px",
            fontSize: "12.5px",
            fontFamily: "'Calibri', 'Arial', sans-serif",
            textDecoration: "none",
            fontWeight: 600,
            letterSpacing: "0.01em",
          }}
        >
          Download DOCX
        </a>
      </div>

      {/* Resume paper */}
      <div
        style={{
          width: "816px",
          minHeight: "1056px",
          margin: "0 auto",
          background: "#fff",
          padding: "48px",
          fontFamily: "'Calibri', 'Arial', sans-serif",
          fontSize: `${bodyFontPx}px`,
          lineHeight: `${lineHeightPx}px`,
          color: "#1a1a2e",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: `${lineHeightPx}px` }}>
          <div
            style={{
              fontSize: "20pt",
              fontWeight: 700,
              marginBottom: "8px",
              letterSpacing: "-0.01em",
            }}
          >
            {data.name}
          </div>
          <div
            style={{
              fontSize: `${headlineFontPx}px`,
              lineHeight: `${lineHeightPx}px`,
              marginBottom: "6px",
              color: "#333",
            }}
          >
            {data.headline}
          </div>
          <div
            style={{
              fontSize: "9pt",
              color: "#555",
              borderBottom: "1.5px solid #1a1a2e",
              paddingBottom: `${lineHeightPx + 2}px`,
            }}
          >
            {contactParts.join("   |   ")}
          </div>
        </div>

        {/* Summary */}
        <div
          style={{
            fontSize: `${bodyFontPx}px`,
            lineHeight: `${lineHeightPx}px`,
            marginBottom: `${sectionGapPx}px`,
            color: "#222",
          }}
        >
          {data.summary}
        </div>

        {/* Experience */}
        <div style={{ marginBottom: `${sectionGapPx}px` }}>
          <SectionHeader title="Experience" lineHeightPx={lineHeightPx} />
          {data.roles.map((role, i) => (
            <div
              key={i}
              style={{ marginBottom: `${roleGapPx}px` }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  fontWeight: 700,
                  fontSize: `${bodyFontPx}px`,
                  lineHeight: `${lineHeightPx * 0.9}px`,
                  marginBottom: "2px",
                }}
              >
                <span>{role.title}</span>
                <span style={{ flexShrink: 0, marginLeft: "8px" }}>
                  {role.startDate} – {role.endDate}
                </span>
              </div>
              <div
                style={{
                  fontStyle: "italic",
                  fontSize: `${bodyFontPx - 0.5}px`,
                  lineHeight: `${lineHeightPx}px`,
                  color: "#444",
                  marginBottom: "4px",
                }}
              >
                {role.company} · {role.location}
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                {role.bullets.map((bullet, j) => (
                  <li
                    key={j}
                    style={{
                      fontSize: `${bodyFontPx}px`,
                      lineHeight: `${lineHeightPx}px`,
                      marginBottom: `${bulletGapPx}px`,
                      paddingLeft: "10px",
                      position: "relative",
                      color: "#222",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                      }}
                    >
                      •
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div style={{ marginBottom: `${sectionGapPx}px` }}>
          <SectionHeader title="Skills" lineHeightPx={lineHeightPx} />
          {data.skills.map((skill, i) => (
            <div
              key={i}
              style={{
                fontSize: `${bodyFontPx}px`,
                lineHeight: `${lineHeightPx}px`,
                marginBottom: `${bulletGapPx}px`,
              }}
            >
              <strong>{skill.category}: </strong>
              {skill.items}
            </div>
          ))}
        </div>

        {/* Education */}
        <div>
          <SectionHeader title="Education" lineHeightPx={lineHeightPx} />
          {data.education.map((edu, i) => (
            <div key={i}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  fontWeight: 700,
                  fontSize: `${bodyFontPx}px`,
                  lineHeight: `${lineHeightPx * 0.9}px`,
                  marginBottom: "2px",
                }}
              >
                <span>{edu.degree}</span>
                <span style={{ flexShrink: 0, marginLeft: "8px" }}>
                  {edu.dates}
                </span>
              </div>
              <div
                style={{
                  fontStyle: "italic",
                  fontSize: `${bodyFontPx - 0.5}px`,
                  lineHeight: `${lineHeightPx}px`,
                  color: "#444",
                }}
              >
                {edu.school} · {edu.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
