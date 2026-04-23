import { useNavigate } from "react-router-dom";
import "./WhyChooseUs.css";

const showcase = [
  { title: "Vibe Coding", video: "/videos/video4.mp4" },
  { title: "Website Development", video: "/videos/video5.mp4" },
  { title: "Video Editing", video: "/videos/video6.mp4" },
];

export default function WhyChooseUs() {
  const navigate = useNavigate();

  return (
    <div className="why-wrapper">
      <section className="why-card">
        <div className="why-text">
          <p className="eyebrow">Why creators stay</p>
          <h2 className="brand">AI-SaaS Marketplace</h2>
          <h1>
            High-quality AI tools with a more
            <span> trustworthy buying experience.</span>
          </h1>
          <p>
            Explore verified AI products, buy once with a smooth checkout flow, and return whenever
            you need the tool again. Sellers get clearer revenue tracking, buyers get less friction.
          </p>
          <button className="try-btn" onClick={() => navigate("/tools")}>
            Explore Tools
          </button>
        </div>

        <div className="why-video-wrapper">
          <div className="phone-frame">
            <video src="/videos/video2.mp4" autoPlay loop muted playsInline className="why-video" />
          </div>
        </div>
      </section>

      <section className="why-card second-card">
        <div className="why-video-wrapper">
          <div className="phone-frame wide-frame">
            <video src="/videos/video3.mp4" autoPlay loop muted playsInline className="why-video" />
          </div>
        </div>

        <div className="why-text">
          <p className="eyebrow">Built for momentum</p>
          <h2 className="brand">AI-SaaS Marketplace</h2>
          <h1>
            Discover the <span>power of AI</span> without the clutter.
          </h1>
          <p>
            Use the marketplace to browse, compare, and launch AI tools for design, writing,
            automation, and creative work from one clean interface.
          </p>
          <button className="try-btn" onClick={() => navigate("/submit-tool")}>
            Submit a Tool
          </button>
        </div>
      </section>

      <section className="ai-tools-showcase">
        {showcase.map((item) => (
          <article key={item.title} className="tool-showcase-card">
            <p className="tool-showcase-label">Featured workflow</p>
            <h3>{item.title}</h3>
            <div className="tool-preview">
              <video src={item.video} autoPlay loop muted playsInline />
            </div>
          </article>
        ))}
      </section>

      <section className="cta-section">
        <div className="cta-inner">
          <div className="cta-text">
            <h2>
              Marketplace polish that feels <span>worth paying for</span>
            </h2>
            <p>Browse better listings, publish faster, and give buyers a checkout flow they can trust.</p>
          </div>
          <div className="cta-actions">
            <button className="cta-ghost" onClick={() => navigate("/tools")}>
              Browse tools
            </button>
            <button className="cta-primary" onClick={() => navigate("/register")}>
              Join now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
