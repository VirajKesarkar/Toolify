import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faChartLine, faMagnifyingGlass, faStar, faWallet } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const stats = [
  { icon: faStar, value: "500+", label: "Curated tools" },
  { icon: faChartLine, value: "10k+", label: "Creators exploring" },
  { icon: faWallet, value: "Fast payouts", label: "For sellers" },
];

const featuredTags = ["Image generation", "Resume builder", "Automation", "Productivity"];

export default function HeroSection({ onSearch }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) {
      return;
    }

    onSearch(query.trim());
  };

  return (
    <section
      style={{
        position: "relative",
        padding: "72px 24px 48px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 18% 22%, rgba(124,156,255,0.18), transparent 22%), radial-gradient(circle at 82% 18%, rgba(94,234,212,0.12), transparent 18%), radial-gradient(circle at 50% 80%, rgba(244,162,97,0.12), transparent 24%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
          gap: "28px",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            borderRadius: "34px",
            padding: "40px",
            border: "1px solid rgba(149,176,214,0.18)",
            background:
              "linear-gradient(180deg, rgba(13,27,47,0.9) 0%, rgba(8,18,32,0.96) 100%)",
            boxShadow: "0 30px 80px rgba(2, 6, 23, 0.34)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-120px",
              right: "-80px",
              width: "280px",
              height: "280px",
              borderRadius: "999px",
              background: "radial-gradient(circle, rgba(124,156,255,0.22), transparent 62%)",
            }}
          />

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(124,156,255,0.28)",
              background: "rgba(124,156,255,0.08)",
              color: "#dbe7ff",
              fontSize: "13px",
              fontWeight: 600,
              marginBottom: "22px",
            }}
          >
            <FontAwesomeIcon icon={faStar} />
            Marketplace for elegant AI workflows
          </div>

          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4.8rem)",
              lineHeight: 1,
              letterSpacing: "-0.05em",
              color: "#f8fbff",
              maxWidth: "760px",
              marginBottom: "18px",
            }}
          >
            Find AI tools that feel
            <span
              style={{
                display: "block",
                background: "linear-gradient(135deg, #f8fbff 0%, #7c9cff 52%, #5eead4 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              premium to use.
            </span>
          </h1>

          <p
            style={{
              maxWidth: "680px",
              color: "#a9bdd8",
              fontSize: "17px",
              lineHeight: 1.75,
              marginBottom: "28px",
            }}
          >
            Discover polished AI products, launch your own tools, and turn one-time purchases into
            a beautiful marketplace experience for both buyers and creators.
          </p>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px",
              borderRadius: "26px",
              background: "rgba(6,13,24,0.62)",
              border: "1px solid rgba(149,176,214,0.16)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
              marginBottom: "18px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flex: 1,
                minWidth: "220px",
                padding: "0 12px",
              }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: "#7c9cff" }} />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for tools, creators, or categories"
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  color: "#f7fafc",
                  outline: "none",
                  fontSize: "15px",
                  padding: "12px 0",
                }}
              />
            </div>
            <button type="submit" className="buy-btn" style={{ padding: "14px 20px" }}>
              Search Marketplace
            </button>
          </form>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "30px",
            }}
          >
            {featuredTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setQuery(tag);
                  onSearch(tag);
                }}
                style={{
                  border: "1px solid rgba(149,176,214,0.16)",
                  background: "rgba(15,29,49,0.78)",
                  color: "#d8e3f2",
                  borderRadius: "999px",
                  padding: "9px 14px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="buy-btn"
              onClick={() => navigate("/tools")}
              style={{ padding: "15px 22px" }}
            >
              Explore Tools
            </button>
            <button
              type="button"
              onClick={() => navigate("/submit-tool")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "15px 22px",
                borderRadius: "999px",
                border: "1px solid rgba(149,176,214,0.18)",
                background: "rgba(15,23,42,0.55)",
                color: "#eff6ff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Sell your tool
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          <div
            style={{
              borderRadius: "30px",
              padding: "28px",
              border: "1px solid rgba(149,176,214,0.16)",
              background:
                "linear-gradient(180deg, rgba(18,36,61,0.88) 0%, rgba(9,18,30,0.96) 100%)",
              boxShadow: "0 22px 56px rgba(2, 6, 23, 0.28)",
            }}
          >
            <p style={{ color: "#8fa5c2", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: "12px" }}>
              Marketplace pulse
            </p>
            <div style={{ display: "grid", gap: "14px" }}>
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "16px 18px",
                    borderRadius: "20px",
                    background: "rgba(7,17,31,0.62)",
                    border: "1px solid rgba(149,176,214,0.12)",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "16px",
                      display: "grid",
                      placeItems: "center",
                      background: "linear-gradient(135deg, rgba(124,156,255,0.22), rgba(94,234,212,0.18))",
                      color: "#dbe7ff",
                    }}
                  >
                    <FontAwesomeIcon icon={stat.icon} />
                  </div>
                  <div>
                    <p style={{ color: "#f8fbff", fontSize: "20px", fontWeight: 700 }}>{stat.value}</p>
                    <p style={{ color: "#8fa5c2", fontSize: "13px" }}>{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              borderRadius: "30px",
              padding: "28px",
              background:
                "linear-gradient(135deg, rgba(244,162,97,0.16), rgba(124,156,255,0.12) 42%, rgba(15,23,42,0.94) 100%)",
              border: "1px solid rgba(244,162,97,0.18)",
              boxShadow: "0 24px 60px rgba(2, 6, 23, 0.28)",
            }}
          >
            <p style={{ color: "#ffd7b0", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.18em", marginBottom: "14px" }}>
              Creator economy
            </p>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                color: "#fffaf5",
                fontSize: "1.8rem",
                lineHeight: 1.1,
                marginBottom: "10px",
              }}
            >
              Beautiful listings, fast checkout, clear creator payouts.
            </h3>
            <p style={{ color: "#e7d7cb", lineHeight: 1.7, marginBottom: "18px" }}>
              Keep the buy-once flow simple for customers while giving creators a dashboard that
              actually feels worth opening.
            </p>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              style={{
                border: "none",
                borderRadius: "999px",
                padding: "13px 18px",
                background: "rgba(255,255,255,0.08)",
                color: "#fffaf5",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Open Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
