import { Link } from "react-router-dom";
import { FaFileAlt, FaVideo } from "react-icons/fa";
import { MdImage } from "react-icons/md";

const tools = [
  {
    id: 1,
    title: "AI Resume Generator",
    description: "Create polished resumes in minutes with a cleaner document workflow and PDF output.",
    icon: <FaFileAlt size={28} color="#7c9cff" />,
    link: "/resume",
    accent: "#7c9cff",
  },
  {
    id: 2,
    title: "AI Image Creator",
    description: "Turn prompts into striking visual concepts with a premium creation flow.",
    icon: <MdImage size={30} color="#f4a261" />,
    link: "/tools/image-generator",
    accent: "#f4a261",
  },
  {
    id: 3,
    title: "AI Video Summarizer",
    description: "Cut long-form content into the moments and insights that actually matter.",
    icon: <FaVideo size={28} color="#5eead4" />,
    link: "/tools/video-summarizer",
    accent: "#5eead4",
  },
];

export default function FeaturedTools() {
  return (
    <section style={{ padding: "0 24px 32px" }}>
      <div style={{ maxWidth: "1220px", margin: "0 auto" }}>
        <div style={{ marginBottom: "26px" }}>
          <p style={{ color: "#8fa5c2", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "12px", marginBottom: "10px" }}>
            Featured experiences
          </p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#f8fbff", marginBottom: "10px" }}>
            Built-in tools worth opening right away.
          </h2>
          <p style={{ color: "#9fb2ce", maxWidth: "620px", lineHeight: 1.7 }}>
            A few standout experiences live directly inside the app so the marketplace feels useful from the first visit.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
          {tools.map((tool) => (
            <article
              key={tool.id}
              style={{
                borderRadius: "28px",
                padding: "26px",
                background: "linear-gradient(180deg, rgba(18,36,61,0.88) 0%, rgba(9,18,30,0.96) 100%)",
                border: "1px solid rgba(149,176,214,0.14)",
                boxShadow: "0 20px 46px rgba(2, 6, 23, 0.24)",
              }}
            >
              <div
                style={{
                  width: "58px",
                  height: "58px",
                  borderRadius: "18px",
                  display: "grid",
                  placeItems: "center",
                  background: `linear-gradient(135deg, ${tool.accent}22, rgba(255,255,255,0.03))`,
                  border: `1px solid ${tool.accent}30`,
                  marginBottom: "18px",
                }}
              >
                {tool.icon}
              </div>
              <h3 style={{ color: "#f8fbff", fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", marginBottom: "10px" }}>
                {tool.title}
              </h3>
              <p style={{ color: "#9fb2ce", lineHeight: 1.7, fontSize: "14px", marginBottom: "18px" }}>{tool.description}</p>
              <Link
                to={tool.link}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#eff6ff",
                  textDecoration: "none",
                  fontWeight: 700,
                }}
              >
                Try it now
                <span style={{ color: tool.accent }}>→</span>
              </Link>
            </article>
          ))}
        </div>

        <div style={{ marginTop: "22px" }}>
          <Link
            to="/tools"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              borderRadius: "999px",
              padding: "14px 18px",
              textDecoration: "none",
              color: "#04111f",
              fontWeight: 700,
              background: "linear-gradient(135deg, #7c9cff 0%, #5eead4 100%)",
              boxShadow: "0 18px 36px rgba(124,156,255,0.18)",
            }}
          >
            View all tools
          </Link>
        </div>
      </div>
    </section>
  );
}
