import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { getStoredToken } from "../utils/auth.js";

const emptyPayoutDetails = {
  upiId: "",
  accountName: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
};

export default function Dashboard() {
  const [tools, setTools] = useState([]);
  const [overview, setOverview] = useState(null);
  const [payoutDetails, setPayoutDetails] = useState(emptyPayoutDetails);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingPayout, setSavingPayout] = useState(false);
  const [requestingPayout, setRequestingPayout] = useState(false);
  const [feedback, setFeedback] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const token = getStoredToken();

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      if (!token) {
        setError("Please log in to see your submitted tools.");
        setLoading(false);
        return;
      }

      const [toolsRes, overviewRes] = await Promise.all([
        axios.get(`${API_BASE}/tools/my`, authHeaders),
        axios.get(`${API_BASE}/payments/creator/overview`, authHeaders),
      ]);

      setTools(toolsRes.data || []);
      setOverview(overviewRes.data || null);
      setPayoutDetails(overviewRes.data?.payoutDetails || emptyPayoutDetails);
    } catch (fetchError) {
      console.error("Error fetching dashboard data:", fetchError);
      setError("Could not load your creator dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handlePayoutChange = (event) => {
    setPayoutDetails((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSavePayout = async (event) => {
    event.preventDefault();
    setSavingPayout(true);
    setFeedback("");

    try {
      const res = await axios.put(`${API_BASE}/payments/creator/payout-details`, payoutDetails, authHeaders);
      setPayoutDetails(res.data.payoutDetails || emptyPayoutDetails);
      setFeedback("Payout details updated.");
    } catch (saveError) {
      setFeedback(saveError.response?.data?.error || "Could not save payout details.");
    } finally {
      setSavingPayout(false);
    }
  };

  const handleRequestPayout = async () => {
    setRequestingPayout(true);
    setFeedback("");

    try {
      const res = await axios.post(`${API_BASE}/payments/creator/request-payout`, {}, authHeaders);
      setFeedback(res.data.message || "Payout request submitted.");
      await fetchDashboardData();
    } catch (requestError) {
      setFeedback(requestError.response?.data?.error || "Could not request payout.");
    } finally {
      setRequestingPayout(false);
    }
  };

  const summary = overview?.summary || {
    totalSales: 0,
    grossRevenue: 0,
    platformFees: 0,
    netEarnings: 0,
    availableBalance: 0,
    pendingBalance: 0,
    paidOut: 0,
  };

  const cards = [
    ["Total Sales", summary.totalSales, "#7c9cff"],
    ["Gross Revenue", `Rs. ${summary.grossRevenue.toFixed(2)}`, "#5eead4"],
    ["Platform Fee", `Rs. ${summary.platformFees.toFixed(2)}`, "#f4a261"],
    ["Net Earnings", `Rs. ${summary.netEarnings.toFixed(2)}`, "#34d399"],
    ["Available", `Rs. ${summary.availableBalance.toFixed(2)}`, "#a78bfa"],
    ["Paid Out", `Rs. ${summary.paidOut.toFixed(2)}`, "#fb7185"],
  ];

  const feedbackPositive =
    feedback.toLowerCase().includes("updated") || feedback.toLowerCase().includes("submitted");

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
          <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "end", flexWrap: "wrap", marginBottom: "26px" }}>
            <div>
              <p style={{ color: "#8fa5c2", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "12px", marginBottom: "10px" }}>
                Creator workspace
              </p>
              <h2 style={{ marginBottom: "10px" }}>Creator Dashboard</h2>
              <p style={{ color: "#9fb2ce", maxWidth: "680px", lineHeight: 1.7 }}>
                Track tool performance, keep payout details current, and request creator payouts from one cleaner control center.
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                to="/dashboard/purchases"
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
                  fontSize: "14px",
                }}
              >
                View Purchases
              </Link>
              <button
                onClick={fetchDashboardData}
                style={{
                  padding: "12px 16px",
                  borderRadius: "999px",
                  border: "1px solid rgba(149,176,214,0.16)",
                  background: "rgba(7,17,31,0.44)",
                  color: "#eff6ff",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Refresh
              </button>
            </div>
          </div>

          {feedback ? (
            <div
              style={{
                marginBottom: "20px",
                padding: "14px 16px",
                borderRadius: "16px",
                border: `1px solid ${feedbackPositive ? "rgba(52,211,153,0.22)" : "rgba(244,162,97,0.22)"}`,
                background: feedbackPositive ? "rgba(52,211,153,0.12)" : "rgba(244,162,97,0.12)",
                color: feedbackPositive ? "#bbf7d0" : "#ffd7b0",
              }}
            >
              {feedback}
            </div>
          ) : null}

          {loading ? (
            <p style={{ color: "#9ca3af" }}>Loading your creator dashboard...</p>
          ) : error ? (
            <p style={{ color: "#fda4af" }}>{error}</p>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "14px",
                  marginBottom: "24px",
                }}
              >
                {cards.map(([label, value, accent]) => (
                  <div
                    key={label}
                    style={{
                      borderRadius: "22px",
                      padding: "18px",
                      background: "rgba(7,17,31,0.44)",
                      border: "1px solid rgba(149,176,214,0.14)",
                      boxShadow: "0 16px 36px rgba(2, 6, 23, 0.18)",
                    }}
                  >
                    <p style={{ color: "#8fa5c2", fontSize: "13px", marginBottom: "6px" }}>{label}</p>
                    <p style={{ color: "#f8fbff", fontSize: "1.2rem", fontWeight: 700 }}>{value}</p>
                    <div style={{ width: "42px", height: "4px", borderRadius: "999px", background: accent, marginTop: "14px" }} />
                  </div>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1.25fr 0.75fr", gap: "20px", marginBottom: "24px" }}>
                <section
                  style={{
                    borderRadius: "26px",
                    padding: "24px",
                    background: "rgba(7,17,31,0.44)",
                    border: "1px solid rgba(149,176,214,0.14)",
                  }}
                >
                  <h3 style={{ color: "#f8fbff", marginBottom: "14px", fontSize: "1.1rem" }}>Top Earning Tools</h3>
                  {overview?.toolBreakdown?.length ? (
                    <div style={{ display: "grid", gap: "12px" }}>
                      {overview.toolBreakdown.slice(0, 5).map((item) => (
                        <div
                          key={item.toolId}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "12px",
                            padding: "14px",
                            borderRadius: "18px",
                            background: "rgba(18,36,61,0.58)",
                            border: "1px solid rgba(149,176,214,0.08)",
                          }}
                        >
                          <div>
                            <p style={{ color: "#f8fbff", fontWeight: 700 }}>{item.toolName}</p>
                            <p style={{ color: "#8fa5c2", fontSize: "13px" }}>{item.salesCount} sales</p>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ color: "#bbf7d0", fontWeight: 700 }}>Rs. {item.netEarnings.toFixed(2)}</p>
                            <p style={{ color: "#8fa5c2", fontSize: "13px" }}>Gross Rs. {item.grossRevenue.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#94a3b8" }}>No sales yet for your tools.</p>
                  )}
                </section>

                <section
                  style={{
                    borderRadius: "26px",
                    padding: "24px",
                    background:
                      "linear-gradient(180deg, rgba(124,156,255,0.12) 0%, rgba(7,17,31,0.62) 100%)",
                    border: "1px solid rgba(124,156,255,0.18)",
                  }}
                >
                  <h3 style={{ color: "#f8fbff", marginBottom: "14px", fontSize: "1.1rem" }}>Payout Balance</h3>
                  <p style={{ color: "#8fa5c2", marginBottom: "8px" }}>Available for payout</p>
                  <p style={{ color: "#f8fbff", fontSize: "2rem", fontWeight: 700, marginBottom: "10px" }}>
                    Rs. {summary.availableBalance.toFixed(2)}
                  </p>
                  <p style={{ color: "#d8e3f2", marginBottom: "18px", fontSize: "14px" }}>
                    Pending review: Rs. {summary.pendingBalance.toFixed(2)}
                  </p>
                  <button
                    onClick={handleRequestPayout}
                    disabled={requestingPayout || summary.availableBalance <= 0}
                    className="buy-btn"
                    style={{
                      width: "100%",
                      opacity: requestingPayout || summary.availableBalance <= 0 ? 0.65 : 1,
                      cursor: requestingPayout || summary.availableBalance <= 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    {requestingPayout ? "Submitting..." : "Request Payout"}
                  </button>
                </section>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                <section
                  style={{
                    borderRadius: "26px",
                    padding: "24px",
                    background: "rgba(7,17,31,0.44)",
                    border: "1px solid rgba(149,176,214,0.14)",
                  }}
                >
                  <h3 style={{ color: "#f8fbff", marginBottom: "14px", fontSize: "1.1rem" }}>Payout Details</h3>
                  <form onSubmit={handleSavePayout} style={{ display: "grid", gap: "12px" }}>
                    <input className="form-input" name="upiId" placeholder="UPI ID" value={payoutDetails.upiId || ""} onChange={handlePayoutChange} />
                    <input className="form-input" name="accountName" placeholder="Account holder name" value={payoutDetails.accountName || ""} onChange={handlePayoutChange} />
                    <input className="form-input" name="bankName" placeholder="Bank name" value={payoutDetails.bankName || ""} onChange={handlePayoutChange} />
                    <input className="form-input" name="accountNumber" placeholder="Account number" value={payoutDetails.accountNumber || ""} onChange={handlePayoutChange} />
                    <input className="form-input" name="ifscCode" placeholder="IFSC code" value={payoutDetails.ifscCode || ""} onChange={handlePayoutChange} />
                    <button
                      type="submit"
                      disabled={savingPayout}
                      className="buy-btn"
                      style={{ opacity: savingPayout ? 0.7 : 1, cursor: savingPayout ? "not-allowed" : "pointer" }}
                    >
                      {savingPayout ? "Saving..." : "Save Payout Details"}
                    </button>
                  </form>
                </section>

                <section
                  style={{
                    borderRadius: "26px",
                    padding: "24px",
                    background: "rgba(7,17,31,0.44)",
                    border: "1px solid rgba(149,176,214,0.14)",
                  }}
                >
                  <h3 style={{ color: "#f8fbff", marginBottom: "14px", fontSize: "1.1rem" }}>Recent Payout Requests</h3>
                  {overview?.payoutRequests?.length ? (
                    <div style={{ display: "grid", gap: "10px" }}>
                      {overview.payoutRequests.slice(0, 5).map((request) => (
                        <div key={request._id} style={{ padding: "14px", borderRadius: "18px", background: "rgba(18,36,61,0.58)" }}>
                          <p style={{ color: "#f8fbff", fontWeight: 700 }}>Rs. {request.amount.toFixed(2)}</p>
                          <p style={{ color: "#8fa5c2", fontSize: "13px" }}>
                            {request.status} on {new Date(request.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: "#94a3b8" }}>No payout requests yet.</p>
                  )}
                </section>
              </div>

              <section
                style={{
                  borderRadius: "26px",
                  padding: "24px",
                  background: "rgba(7,17,31,0.44)",
                  border: "1px solid rgba(149,176,214,0.14)",
                }}
              >
                <h3 style={{ color: "#f8fbff", marginBottom: "14px", fontSize: "1.1rem" }}>Submitted Tools</h3>
                {tools.length === 0 ? (
                  <p style={{ color: "#9ca3af" }}>You have not submitted any tools yet.</p>
                ) : (
                  <div style={{ display: "grid", gap: "14px" }}>
                    {tools.map((tool) => (
                      <div
                        key={tool._id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "minmax(0, 3fr) minmax(0, 1.2fr)",
                          gap: "12px",
                          padding: "16px",
                          borderRadius: "20px",
                          background: "rgba(18,36,61,0.58)",
                          border: "1px solid rgba(149,176,214,0.08)",
                        }}
                      >
                        <div>
                          <h4 style={{ color: "#f8fbff", marginBottom: "4px", fontSize: "16px", fontWeight: 700 }}>{tool.name}</h4>
                          <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.7 }}>{tool.description}</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={{ color: "#dbe7ff", fontWeight: 700 }}>
                            {tool.price === 0 || tool.price == null ? "Free" : `Rs. ${tool.price}`}
                          </p>
                          <p style={{ color: tool.approved ? "#86efac" : "#fde68a", fontSize: "13px", marginTop: "6px" }}>
                            {tool.approved ? "Approved" : "Pending Review"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
