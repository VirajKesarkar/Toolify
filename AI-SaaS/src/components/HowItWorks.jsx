import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faCreditCard, faStore, faWandMagicSparkles } from "@fortawesome/free-solid-svg-icons";

const steps = [
  {
    label: "01",
    icon: faStore,
    title: "Browse tools",
    description: "Explore verified listings with pricing, descriptions, and creator context before you commit.",
  },
  {
    label: "02",
    icon: faCreditCard,
    title: "Pay once, unlock instantly",
    description: "Use a smooth Razorpay checkout flow and gain repeat access to the tool without friction.",
  },
  {
    label: "03",
    icon: faWandMagicSparkles,
    title: "Start creating",
    description: "Jump straight into the tool experience while sellers track revenue and payouts from the dashboard.",
  },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: "32px 24px 72px" }}>
      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          borderRadius: "34px",
          border: "1px solid rgba(149,176,214,0.14)",
          background:
            "linear-gradient(180deg, rgba(10,23,40,0.74) 0%, rgba(7,17,31,0.92) 100%)",
          padding: "34px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 15% 10%, rgba(124,156,255,0.12), transparent 24%), radial-gradient(circle at 80% 75%, rgba(94,234,212,0.1), transparent 18%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: "26px", display: "flex", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", alignItems: "end" }}>
            <div>
              <p style={{ color: "#8fa5c2", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "12px", marginBottom: "10px" }}>
                Workflow
              </p>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#f8fbff", marginBottom: "10px" }}>
                A smoother marketplace loop.
              </h2>
              <p style={{ color: "#9fb2ce", maxWidth: "620px", lineHeight: 1.7 }}>
                Everything from discovery to payment to creator earnings is designed to feel tighter and more trustworthy.
              </p>
            </div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                borderRadius: "999px",
                background: "rgba(124,156,255,0.12)",
                border: "1px solid rgba(124,156,255,0.2)",
                color: "#dbe7ff",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              <FontAwesomeIcon icon={faBolt} />
              Built for fast checkout and fast usage
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px" }}>
            {steps.map((step) => (
              <article
                key={step.label}
                style={{
                  padding: "24px",
                  borderRadius: "26px",
                  border: "1px solid rgba(149,176,214,0.14)",
                  background: "rgba(12,23,39,0.72)",
                  boxShadow: "0 18px 40px rgba(2, 6, 23, 0.22)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                  <div
                    style={{
                      width: "54px",
                      height: "54px",
                      borderRadius: "18px",
                      display: "grid",
                      placeItems: "center",
                      background: "linear-gradient(135deg, rgba(124,156,255,0.24), rgba(94,234,212,0.16))",
                      color: "#f8fbff",
                    }}
                  >
                    <FontAwesomeIcon icon={step.icon} />
                  </div>
                  <span style={{ color: "#7c9cff", fontWeight: 700, letterSpacing: "0.16em", fontSize: "13px" }}>
                    {step.label}
                  </span>
                </div>
                <h3 style={{ color: "#f8fbff", fontSize: "1.2rem", fontFamily: "'Space Grotesk', sans-serif", marginBottom: "10px" }}>
                  {step.title}
                </h3>
                <p style={{ color: "#9fb2ce", lineHeight: 1.7, fontSize: "14px" }}>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
