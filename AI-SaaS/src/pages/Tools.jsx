import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ToolCard from "../components/ToolCard.jsx";

export default function Tools() {
  const [tools, setTools] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [inputTerm, setInputTerm] = useState(searchParams.get("search") || "");
  const currentSearch = searchParams.get("search") || "";

  useEffect(() => {
    fetchTools(currentSearch);
    setInputTerm(currentSearch);
  }, [currentSearch]);

  const fetchTools = async (query) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/tools?search=${encodeURIComponent(query || "")}`
      );
      setTools(res.data || []);
    } catch (error) {
      console.error("Error fetching tools:", error);
      setTools([]);
    }
  };

  const handleSearchClick = (event) => {
    event.preventDefault();
    if (inputTerm.trim()) {
      setSearchParams({ search: inputTerm.trim() });
      return;
    }

    setSearchParams({});
  };

  const handleToolClick = (tool) => {
    if (Number(tool.price) > 0) {
      navigate(`/tools/${tool._id}`);
      return;
    }

    if (tool.url && (tool.url.startsWith("http://") || tool.url.startsWith("https://"))) {
      window.open(tool.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (tool.url) {
      const fixedURL = tool.url.startsWith("/") ? tool.url : `/${tool.url}`;
      navigate(fixedURL);
      return;
    }

    navigate(`/tools/${tool._id}`);
  };

  return (
    <div className="tools" style={{ padding: "32px 24px 72px" }}>
      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          borderRadius: "34px",
          border: "1px solid rgba(149,176,214,0.16)",
          background:
            "linear-gradient(180deg, rgba(13,27,47,0.88) 0%, rgba(8,18,32,0.96) 100%)",
          padding: "34px",
          boxShadow: "0 30px 80px rgba(2, 6, 23, 0.28)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "end", flexWrap: "wrap", marginBottom: "24px" }}>
          <div>
            <p style={{ color: "#8fa5c2", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "12px", marginBottom: "10px" }}>
              Browse marketplace
            </p>
            <h2 style={{ marginBottom: "10px" }}>Explore AI Tools</h2>
            <p style={{ color: "#9fb2ce", maxWidth: "640px", lineHeight: 1.7 }}>
              Search polished AI products, compare pricing, and move from discovery to purchase without the interface getting in your way.
            </p>
          </div>
          <div
            style={{
              padding: "14px 18px",
              borderRadius: "20px",
              border: "1px solid rgba(149,176,214,0.14)",
              background: "rgba(7,17,31,0.48)",
              color: "#d8e3f2",
              minWidth: "200px",
            }}
          >
            <p style={{ color: "#8fa5c2", fontSize: "13px", marginBottom: "4px" }}>Results</p>
            <p style={{ fontSize: "1.3rem", fontWeight: 700 }}>{tools.length}</p>
          </div>
        </div>

        <form
          onSubmit={handleSearchClick}
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "28px",
          }}
        >
          <input
            type="text"
            placeholder="Search tools, creators, or categories"
            value={inputTerm}
            onChange={(event) => setInputTerm(event.target.value)}
            className="form-input"
            style={{ flex: 1, minWidth: "240px" }}
          />
          <button type="submit" className="buy-btn" style={{ padding: "14px 20px" }}>
            Search
          </button>
        </form>

        <div className="tool-list">
          {tools.length > 0 ? (
            tools.map((tool) => (
              <div key={tool._id} onClick={() => handleToolClick(tool)} style={{ cursor: "pointer" }}>
                <ToolCard tool={tool} />
              </div>
            ))
          ) : (
            <div
              style={{
                gridColumn: "1/-1",
                padding: "40px",
                borderRadius: "26px",
                border: "1px solid rgba(149,176,214,0.14)",
                background: "rgba(7,17,31,0.55)",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#8fa5c2", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: "12px" }}>
                No match yet
              </p>
              <h3 style={{ color: "#f8fbff", fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.5rem", marginBottom: "10px" }}>
                No tools found
              </h3>
              <p style={{ color: "#9fb2ce" }}>Try a broader search term or clear the filter to browse everything.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
