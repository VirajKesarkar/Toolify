import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getStoredToken } from "../utils/auth.js";

export default function MyPurchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = getStoredToken();
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPurchases = async () => {
      if (!token) {
        setError("Please log in to view your purchases.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE}/payments/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPurchases(res.data || []);
      } catch (fetchError) {
        console.error("Error loading purchases:", fetchError);
        setError("Could not load purchases.");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, [API_BASE, token]);

  return (
    <div style={{ padding: "32px 24px 72px" }}>
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          borderRadius: "34px",
          padding: "34px",
          background:
            "linear-gradient(180deg, rgba(13,27,47,0.88) 0%, rgba(8,18,32,0.96) 100%)",
          border: "1px solid rgba(149,176,214,0.16)",
          boxShadow: "0 30px 80px rgba(2, 6, 23, 0.28)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "18px", alignItems: "end", flexWrap: "wrap", marginBottom: "26px" }}>
          <div>
            <p style={{ color: "#8fa5c2", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "12px", marginBottom: "10px" }}>
              Purchased access
            </p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#f8fbff", marginBottom: "10px" }}>
              My Purchases
            </h2>
            <p style={{ color: "#9fb2ce", maxWidth: "620px", lineHeight: 1.7 }}>
              Reopen tools you bought once and keep using them whenever you need.
            </p>
          </div>
          <div
            style={{
              minWidth: "180px",
              padding: "14px 18px",
              borderRadius: "20px",
              border: "1px solid rgba(149,176,214,0.14)",
              background: "rgba(7,17,31,0.46)",
              color: "#d8e3f2",
            }}
          >
            <p style={{ color: "#8fa5c2", fontSize: "13px", marginBottom: "4px" }}>Unlocked tools</p>
            <p style={{ fontSize: "1.3rem", fontWeight: 700 }}>{purchases.length}</p>
          </div>
        </div>

        {loading ? <p style={{ color: "#cbd5e1" }}>Loading purchases...</p> : null}
        {!loading && error ? <p style={{ color: "#fca5a5" }}>{error}</p> : null}
        {!loading && !error && purchases.length === 0 ? (
          <div
            style={{
              borderRadius: "26px",
              border: "1px solid rgba(149,176,214,0.14)",
              background: "rgba(7,17,31,0.46)",
              padding: "32px",
              color: "#9fb2ce",
            }}
          >
            You have not purchased any tools yet.
          </div>
        ) : null}

        {!loading && !error && purchases.length > 0 ? (
          <div style={{ display: "grid", gap: "14px" }}>
            {purchases.map((purchase) => {
              const tool = purchase.tool;
              const isExternal = tool?.url?.startsWith("http://") || tool?.url?.startsWith("https://");

              return (
                <article
                  key={purchase._id}
                  style={{
                    border: "1px solid rgba(149,176,214,0.14)",
                    borderRadius: "24px",
                    padding: "22px",
                    background: "rgba(7,17,31,0.44)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "18px", flexWrap: "wrap" }}>
                    <div style={{ maxWidth: "720px" }}>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "8px", color: "#f8fbff" }}>
                        {tool?.name || "Tool unavailable"}
                      </h3>
                      <p style={{ color: "#9fb2ce", marginBottom: "10px", lineHeight: 1.7 }}>
                        {tool?.description || "This tool is no longer available."}
                      </p>
                      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                        <span
                          style={{
                            padding: "8px 12px",
                            borderRadius: "999px",
                            background: "rgba(52,211,153,0.12)",
                            color: "#bbf7d0",
                            border: "1px solid rgba(52,211,153,0.2)",
                            fontSize: "13px",
                            fontWeight: 700,
                          }}
                        >
                          Purchased on {new Date(purchase.createdAt).toLocaleDateString()}
                        </span>
                        {tool?.category ? (
                          <span
                            style={{
                              padding: "8px 12px",
                              borderRadius: "999px",
                              background: "rgba(124,156,255,0.12)",
                              color: "#dbe7ff",
                              border: "1px solid rgba(124,156,255,0.18)",
                              fontSize: "13px",
                              fontWeight: 700,
                            }}
                          >
                            {tool.category}
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div style={{ minWidth: "180px", textAlign: "right" }}>
                      <p style={{ color: "#bbf7d0", fontWeight: 700, marginBottom: "12px", fontSize: "1.1rem" }}>
                        Rs. {purchase.price}
                      </p>
                      {tool?.url ? (
                        <button
                          onClick={() => {
                            if (isExternal) {
                              window.open(tool.url, "_blank", "noopener,noreferrer");
                              return;
                            }

                            navigate(tool.url.startsWith("/") ? tool.url : `/${tool.url}`);
                          }}
                          className="buy-btn"
                          style={{ padding: "12px 18px" }}
                        >
                          Open Tool
                        </button>
                      ) : null}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
