import { useEffect, useState } from "react";
import axios from "axios";

export default function MyTools() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchMyTools = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/tools/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTools(res.data || []);
      } catch (error) {
        console.error("Error fetching my tools:", error);
        setTools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTools();
  }, [token]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return {
          bg: "rgba(16, 185, 129, 0.12)",
          color: "#86efac",
          label: "Approved",
        };
      case "rejected":
        return {
          bg: "rgba(239, 68, 68, 0.12)",
          color: "#fda4af",
          label: "Rejected",
        };
      default:
        return {
          bg: "rgba(234, 179, 8, 0.12)",
          color: "#fde68a",
          label: "Pending",
        };
    }
  };

  return (
    <div style={{ padding: "32px 24px 72px" }}>
      <div
        style={{
          maxWidth: "980px",
          margin: "0 auto",
          borderRadius: "34px",
          padding: "34px",
          background:
            "linear-gradient(180deg, rgba(13,27,47,0.88) 0%, rgba(8,18,32,0.96) 100%)",
          border: "1px solid rgba(149,176,214,0.16)",
          boxShadow: "0 30px 80px rgba(2, 6, 23, 0.28)",
        }}
      >
        <p style={{ color: "#8fa5c2", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "12px", marginBottom: "10px" }}>
          Creator submissions
        </p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2rem", marginBottom: "10px", color: "#f8fbff" }}>
          My Submitted Tools
        </h2>
        <p style={{ color: "#9ca3af", marginBottom: "24px", fontSize: "15px", lineHeight: 1.7 }}>
          Track approval status for every tool you&apos;ve published to the marketplace.
        </p>

        {!user ? <p style={{ color: "#fbbf24", marginTop: "12px" }}>Please login to view your submitted tools.</p> : null}

        {loading ? (
          <p style={{ color: "#9ca3af", marginTop: "20px" }}>Loading...</p>
        ) : tools.length === 0 ? (
          <div
            style={{
              marginTop: "24px",
              padding: "32px",
              borderRadius: "24px",
              background: "rgba(7,17,31,0.46)",
              border: "1px dashed rgba(149,176,214,0.22)",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#d8e3f2", fontSize: "15px" }}>You haven&apos;t submitted any tools yet.</p>
            <p style={{ color: "#7c9cff", marginTop: "6px", fontSize: "14px" }}>
              Open <b>Submit Tool</b> to share your AI product.
            </p>
          </div>
        ) : (
          <div style={{ marginTop: "20px", display: "grid", gap: "14px" }}>
            {tools.map((tool) => {
              const statusStyle = getStatusStyle(tool.status);

              return (
                <div
                  key={tool._id}
                  style={{
                    padding: "18px",
                    borderRadius: "22px",
                    background: "rgba(7,17,31,0.46)",
                    border: "1px solid rgba(149,176,214,0.14)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "17px", fontWeight: 700, color: "#e5e7eb", marginBottom: "6px" }}>
                      {tool.name}
                    </h3>
                    <p style={{ color: "#9ca3af", fontSize: "14px", maxWidth: "560px", lineHeight: 1.7 }}>
                      {tool.description}
                    </p>

                    {tool.url ? (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          marginTop: "8px",
                          fontSize: "13px",
                          color: "#93c5fd",
                          textDecoration: "none",
                        }}
                      >
                        Visit tool ↗
                      </a>
                    ) : null}

                    {tool.statusMessage ? (
                      <p
                        style={{
                          marginTop: "8px",
                          fontSize: "13px",
                          color:
                            tool.status === "rejected"
                              ? "#fda4af"
                              : tool.status === "approved"
                              ? "#bbf7d0"
                              : "#fde68a",
                        }}
                      >
                        {tool.statusMessage}
                      </p>
                    ) : null}
                  </div>

                  <div style={{ minWidth: "110px", textAlign: "right" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "7px 12px",
                        borderRadius: "999px",
                        fontSize: "13px",
                        fontWeight: 700,
                        background: statusStyle.bg,
                        color: statusStyle.color,
                      }}
                    >
                      {statusStyle.label}
                    </span>

                    {typeof tool.price === "number" ? (
                      <div style={{ marginTop: "8px", fontSize: "13px", color: "#9ca3af" }}>
                        {tool.price > 0 ? `Rs. ${tool.price}` : "Free"}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
