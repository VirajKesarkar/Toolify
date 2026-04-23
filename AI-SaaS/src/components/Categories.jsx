const categories = [
  { name: "Image Generation", accent: "#7c9cff", count: "120+", description: "Prompt-to-visual tools with polished outputs." },
  { name: "Video Editing", accent: "#5eead4", count: "85+", description: "Fast AI editors, enhancers, and summarizers." },
  { name: "Resume Tools", accent: "#f4a261", count: "45+", description: "Sharper portfolios, resumes, and job-ready assets." },
  { name: "Productivity", accent: "#fb7185", count: "200+", description: "Automations and copilots for daily work." },
  { name: "Writing", accent: "#a78bfa", count: "95+", description: "Copy, research, and editing workflows." },
  { name: "Analytics", accent: "#34d399", count: "60+", description: "Insight engines for data-heavy teams." },
];

export default function Categories() {
  return (
    <section style={{ padding: "32px 24px 72px" }}>
      <div style={{ maxWidth: "1220px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "18px", alignItems: "end", flexWrap: "wrap", marginBottom: "28px" }}>
          <div>
            <p style={{ color: "#8fa5c2", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "12px", marginBottom: "10px" }}>
              Discover by intent
            </p>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.05,
                color: "#f8fbff",
                marginBottom: "10px",
              }}
            >
              Browse elegant tool collections.
            </h2>
            <p style={{ maxWidth: "620px", color: "#9fb2ce", lineHeight: 1.7 }}>
              Explore categories designed around the jobs people actually want to complete, not just generic AI labels.
            </p>
          </div>
          <div
            style={{
              padding: "14px 18px",
              borderRadius: "20px",
              border: "1px solid rgba(149,176,214,0.16)",
              background: "rgba(13,27,47,0.62)",
              color: "#d8e3f2",
              minWidth: "220px",
            }}
          >
            <p style={{ fontSize: "13px", color: "#8fa5c2", marginBottom: "4px" }}>Marketplace depth</p>
            <p style={{ fontSize: "1.3rem", fontWeight: 700 }}>600+ active listings</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "18px" }}>
          {categories.map((category) => (
            <article
              key={category.name}
              style={{
                borderRadius: "26px",
                padding: "24px",
                background: "linear-gradient(180deg, rgba(18,36,61,0.86) 0%, rgba(9,18,30,0.96) 100%)",
                border: "1px solid rgba(149,176,214,0.14)",
                boxShadow: "0 20px 46px rgba(2, 6, 23, 0.24)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-40px",
                  right: "-20px",
                  width: "120px",
                  height: "120px",
                  borderRadius: "999px",
                  background: `radial-gradient(circle, ${category.accent}44, transparent 68%)`,
                }}
              />
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "18px",
                  background: `linear-gradient(135deg, ${category.accent}30, rgba(255,255,255,0.04))`,
                  border: `1px solid ${category.accent}40`,
                  marginBottom: "18px",
                }}
              />
              <p style={{ color: category.accent, fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
                {category.count} tools
              </p>
              <h3 style={{ color: "#f8fbff", fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.15rem", marginBottom: "10px" }}>
                {category.name}
              </h3>
              <p style={{ color: "#9fb2ce", fontSize: "14px", lineHeight: 1.7 }}>{category.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
