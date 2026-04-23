import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { getStoredToken, getStoredUser } from "../utils/auth.js";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = getStoredToken();
  const API_BASE = import.meta.env.VITE_API_URL;

  const fetchEarningsData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/admin/earnings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (error) {
      console.error("Error loading admin earnings:", error);
      setMessage("Could not load admin earnings dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const parsedUser = getStoredUser();
    if (!parsedUser) {
      navigate("/login");
      return;
    }
    if (parsedUser.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    setUser(parsedUser);
    fetchEarningsData();
  }, []);

  const updatePayout = async (id, action) => {
    try {
      await axios.patch(
        `${API_BASE}/admin/payouts/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`Payout ${action}d successfully.`);
      await fetchEarningsData();
    } catch (error) {
      setMessage(error.response?.data?.error || `Could not ${action} payout.`);
    }
  };

  if (!user || loading) {
    return <p style={{ padding: "40px", color: "#d8e3f2" }}>Loading...</p>;
  }

  const summary = data?.summary || { totalSales: 0, grossRevenue: 0, platformRevenue: 0, creatorRevenue: 0 };
  const cards = [
    ["Total Sales", summary.totalSales, "#7c9cff"],
    ["Gross Revenue", `Rs. ${summary.grossRevenue.toFixed(2)}`, "#5eead4"],
    ["Platform Revenue", `Rs. ${summary.platformRevenue.toFixed(2)}`, "#f4a261"],
    ["Creator Revenue", `Rs. ${summary.creatorRevenue.toFixed(2)}`, "#34d399"],
  ];

  return (
    <div style={{ padding: "32px 24px 72px" }}>
      <div style={{ maxWidth: "1220px", margin: "0 auto" }}>
        <div
          style={{
            borderRadius: "34px",
            padding: "34px",
            background:
              "linear-gradient(180deg, rgba(13,27,47,0.88) 0%, rgba(8,18,32,0.96) 100%)",
            border: "1px solid rgba(149,176,214,0.16)",
            boxShadow: "0 30px 80px rgba(2, 6, 23, 0.28)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "end", flexWrap: "wrap", marginBottom: "24px" }}>
            <div>
              <p style={{ color: "#8fa5c2", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "12px", marginBottom: "10px" }}>
                Admin control room
              </p>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#f8fbff", marginBottom: "10px" }}>
                Revenue Dashboard
              </h2>
              <p style={{ color: "#9fb2ce", lineHeight: 1.7, maxWidth: "700px" }}>
                Signed in as {user.email}. Review marketplace revenue, recent sales, and creator payout requests from one premium admin view.
              </p>
            </div>

            <Link
              to="/admin/tools"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(124,156,255,0.18)",
                background: "rgba(124,156,255,0.12)",
                color: "#dbe7ff",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Manage Tools
            </Link>
          </div>

          {message ? (
            <div
              style={{
                marginBottom: "20px",
                padding: "14px 16px",
                borderRadius: "16px",
                border: "1px solid rgba(244,162,97,0.22)",
                background: "rgba(244,162,97,0.12)",
                color: "#ffd7b0",
              }}
            >
              {message}
            </div>
          ) : null}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "24px" }}>
            {cards.map(([label, value, accent]) => (
              <div
                key={label}
                style={{
                  borderRadius: "22px",
                  padding: "18px",
                  background: "rgba(7,17,31,0.44)",
                  border: "1px solid rgba(149,176,214,0.14)",
                }}
              >
                <p style={{ color: "#8fa5c2", fontSize: "13px", marginBottom: "6px" }}>{label}</p>
                <p style={{ color: "#f8fbff", fontSize: "1.2rem", fontWeight: 700 }}>{value}</p>
                <div style={{ width: "42px", height: "4px", borderRadius: "999px", background: accent, marginTop: "14px" }} />
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "20px" }}>
            <section
              style={{
                borderRadius: "26px",
                padding: "24px",
                background: "rgba(7,17,31,0.44)",
                border: "1px solid rgba(149,176,214,0.14)",
              }}
            >
              <h3 style={{ marginBottom: "14px", color: "#f8fbff" }}>Recent Sales</h3>
              {data?.purchases?.length ? (
                <div style={{ display: "grid", gap: "10px" }}>
                  {data.purchases.map((purchase) => (
                    <div key={purchase._id} style={{ background: "rgba(18,36,61,0.58)", borderRadius: "18px", padding: "16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                        <div>
                          <p style={{ fontWeight: 700, color: "#f8fbff" }}>{purchase.tool?.name || "Tool sale"}</p>
                          <p style={{ color: "#8fa5c2", fontSize: "13px" }}>
                            Creator: {purchase.creator?.email || "Unknown"}
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ color: "#bbf7d0", fontWeight: 700 }}>Rs. {purchase.price.toFixed(2)}</p>
                          <p style={{ color: "#8fa5c2", fontSize: "13px" }}>
                            Fee Rs. {(purchase.platformFeeAmount || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#94a3b8" }}>No sales recorded yet.</p>
              )}
            </section>

            <section
              style={{
                borderRadius: "26px",
                padding: "24px",
                background: "rgba(7,17,31,0.44)",
                border: "1px solid rgba(149,176,214,0.14)",
              }}
            >
              <h3 style={{ marginBottom: "14px", color: "#f8fbff" }}>Payout Requests</h3>
              {data?.payoutRequests?.length ? (
                <div style={{ display: "grid", gap: "12px" }}>
                  {data.payoutRequests.map((request) => (
                    <div key={request._id} style={{ background: "rgba(18,36,61,0.58)", borderRadius: "18px", padding: "16px" }}>
                      <p style={{ fontWeight: 700, color: "#f8fbff" }}>{request.creator?.email || "Creator"}</p>
                      <p style={{ color: "#d8e3f2", margin: "4px 0" }}>Rs. {request.amount.toFixed(2)}</p>
                      <p style={{ color: "#8fa5c2", fontSize: "13px", marginBottom: "10px" }}>
                        {request.status} • {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                      {request.status === "pending" || request.status === "approved" ? (
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {request.status === "pending" ? (
                            <button
                              onClick={() => updatePayout(request._id, "approve")}
                              style={{
                                padding: "9px 12px",
                                borderRadius: "12px",
                                border: "none",
                                background: "#2563eb",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: 700,
                              }}
                            >
                              Approve
                            </button>
                          ) : null}
                          <button
                            onClick={() => updatePayout(request._id, "pay")}
                            style={{
                              padding: "9px 12px",
                              borderRadius: "12px",
                              border: "none",
                              background: "#059669",
                              color: "white",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            Mark Paid
                          </button>
                          <button
                            onClick={() => updatePayout(request._id, "reject")}
                            style={{
                              padding: "9px 12px",
                              borderRadius: "12px",
                              border: "none",
                              background: "#dc2626",
                              color: "white",
                              cursor: "pointer",
                              fontWeight: 700,
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: "#94a3b8" }}>No payout requests yet.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
