import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function CallToAction() {
  const navigate = useNavigate();

  return (
    <section style={{ padding: "0 24px 72px" }}>
      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          borderRadius: "34px",
          padding: "36px",
          background:
            "linear-gradient(135deg, rgba(244,162,97,0.18) 0%, rgba(124,156,255,0.18) 36%, rgba(8,18,32,0.96) 100%)",
          border: "1px solid rgba(149,176,214,0.16)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "-60px",
            top: "-70px",
            width: "240px",
            height: "240px",
            borderRadius: "999px",
            background: "radial-gradient(circle, rgba(94,234,212,0.18), transparent 68%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", gap: "24px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ maxWidth: "640px" }}>
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "18px",
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.08)",
                color: "#fffaf5",
                marginBottom: "18px",
              }}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#fffaf5", marginBottom: "12px" }}>
              Have a tool worth selling?
            </h2>
            <p style={{ color: "#eadfd5", lineHeight: 1.75, fontSize: "16px" }}>
              Submit it to the marketplace, reach buyers faster, and manage revenue from a creator dashboard that finally feels polished.
            </p>
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => navigate("/submit-tool")}
              className="buy-btn"
              style={{ padding: "15px 22px" }}
            >
              Submit Your Tool
            </button>
            <button
              type="button"
              onClick={() => navigate("/tools")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "15px 22px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.18)",
                background: "rgba(255,255,255,0.05)",
                color: "#fffaf5",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Browse marketplace
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
