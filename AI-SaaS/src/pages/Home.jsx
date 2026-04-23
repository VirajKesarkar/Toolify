import { useState } from "react";
import axios from "axios";
import HeroSection from "../components/HeroSection";
import FeaturedTools from "../components/FeaturedTools";
import Categories from "../components/Categories";
import HowItWorks from "../components/HowItWorks";
import CallToAction from "../components/CallToAction";

export default function Home() {
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/tools?search=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search error:", err);
    }
  };

  return (
    <div>
      <HeroSection onSearch={handleSearch} />

      {results.length > 0 && (
        <section style={{ padding: "60px 40px", maxWidth: "1400px", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "2.5rem",
              fontWeight: "700",
              marginBottom: "40px",
              background: "linear-gradient(135deg, #ffffff 0%, #7c9cff 58%, #5eead4 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Search Results
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 32,
            }}
          >
            {results.map((tool) => (
              <div
                key={tool._id}
                style={{
                  border: "1px solid rgba(149, 176, 214, 0.16)",
                  borderRadius: "24px",
                  padding: "28px",
                  background: "linear-gradient(180deg, rgba(16, 31, 50, 0.94) 0%, rgba(10, 22, 37, 0.98) 100%)",
                  boxShadow: "0 20px 50px rgba(3, 8, 20, 0.28)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 30px 80px rgba(3, 8, 20, 0.42)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 20px 50px rgba(3, 8, 20, 0.28)";
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "20px",
                    fontWeight: "600",
                    marginBottom: "12px",
                    color: "#f7fafc",
                  }}
                >
                  {tool.name}
                </h3>
                <p style={{ color: "#8fa5c2", fontSize: "14px", marginBottom: "12px", lineHeight: "1.6" }}>
                  {tool.description}
                </p>
                <p style={{ fontSize: "14px", marginBottom: "8px" }}>
                  <strong style={{ color: "#d8e3f2" }}>Category:</strong>{" "}
                  <span style={{ color: "#c8d8ff" }}>{tool.category || "General"}</span>
                </p>
                <p style={{ fontSize: "14px" }}>
                  <strong style={{ color: "#d8e3f2" }}>Price:</strong>{" "}
                  <span style={{ color: "#9cf0cb", fontWeight: "600" }}>Rs. {tool.price || "Free"}</span>
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <FeaturedTools />
      <Categories />
      <HowItWorks />
      <CallToAction />
    </div>
  );
}
