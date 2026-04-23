import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { loadRazorpayScript } from "../utils/loadRazorpay.js";
import { getStoredToken, getStoredUser } from "../utils/auth.js";

export default function ToolDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [purchased, setPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [message, setMessage] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL;
  const user = getStoredUser();
  const token = getStoredToken();

  useEffect(() => {
    fetchTool();
  }, [id]);

  useEffect(() => {
    if (!tool) {
      return;
    }

    if (!user || Number(tool.price) <= 0) {
      setCheckingPurchase(false);
      return;
    }

    checkPurchaseStatus();
  }, [tool, user]);

  const fetchTool = async () => {
    try {
      const res = await axios.get(`${API_BASE}/tools/${id}`);
      setTool(res.data);
    } catch (error) {
      console.error("Error fetching tool:", error);
      setTool(null);
      setCheckingPurchase(false);
    }
  };

  const checkPurchaseStatus = async () => {
    try {
      const res = await axios.get(`${API_BASE}/payments/status/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPurchased(Boolean(res.data?.purchased));
    } catch (error) {
      console.error("Error checking purchase status:", error);
    } finally {
      setCheckingPurchase(false);
    }
  };

  const openTool = () => {
    if (tool.url && (tool.url.startsWith("http://") || tool.url.startsWith("https://"))) {
      window.open(tool.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (tool.url) {
      navigate(tool.url.startsWith("/") ? tool.url : `/${tool.url}`);
      return;
    }

    navigate("/");
  };

  const handlePurchase = async () => {
    if (!user || !token) {
      navigate("/login");
      return;
    }

    setProcessingPayment(true);
    setMessage("");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setMessage("Could not load Razorpay Checkout.");
        return;
      }

      const orderRes = await axios.post(
        `${API_BASE}/payments/order`,
        { toolId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (orderRes.data?.alreadyPurchased) {
        setPurchased(true);
        setMessage("You already own this tool.");
        return;
      }

      const options = {
        key: orderRes.data.keyId,
        amount: orderRes.data.order.amount,
        currency: orderRes.data.order.currency,
        name: "AI-SaaS Marketplace",
        description: `Purchase ${tool.name}`,
        order_id: orderRes.data.order.id,
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#7c9cff",
        },
        handler: async (response) => {
          try {
            await axios.post(
              `${API_BASE}/payments/verify`,
              {
                toolId: id,
                ...response,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            setPurchased(true);
            setMessage("Payment successful. Your tool is now unlocked.");
          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            setMessage(verifyError.response?.data?.error || "Payment verification failed.");
          }
        },
        modal: {
          ondismiss: () => {
            setMessage("Checkout was closed before payment completed.");
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Payment initialization failed:", error);
      setMessage(error.response?.data?.error || "Could not start payment.");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (!tool) {
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Tool not found</h2>;
  }

  const isPaidTool = Number(tool.price) > 0;
  const canOpenTool = !isPaidTool || purchased;
  const successMessage = /(successful|unlocked|already own)/i.test(message);

  return (
    <div style={{ padding: "32px 24px 72px" }}>
      <div
        className="tool-details"
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.2fr) minmax(300px, 0.8fr)",
          gap: "20px",
          padding: "32px",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              padding: "9px 14px",
              borderRadius: "999px",
              border: "1px solid rgba(149,176,214,0.16)",
              background: "rgba(7,17,31,0.48)",
              color: "#d8e3f2",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              marginBottom: "18px",
            }}
          >
            Tool details
          </div>
          <h2 style={{ marginBottom: "14px" }}>{tool.name}</h2>
          <p style={{ color: "#9fb2ce", lineHeight: 1.8, fontSize: "15px", marginBottom: "22px" }}>
            {tool.description}
          </p>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
            {tool.category ? (
              <span
                style={{
                  padding: "9px 14px",
                  borderRadius: "999px",
                  background: "rgba(124,156,255,0.1)",
                  color: "#dbe7ff",
                  border: "1px solid rgba(124,156,255,0.18)",
                  fontWeight: 700,
                  fontSize: "13px",
                }}
              >
                {tool.category}
              </span>
            ) : null}

            <span
              style={{
                padding: "9px 14px",
                borderRadius: "999px",
                background: isPaidTool ? "rgba(244,162,97,0.12)" : "rgba(52,211,153,0.12)",
                color: isPaidTool ? "#ffd7b0" : "#bbf7d0",
                border: `1px solid ${isPaidTool ? "rgba(244,162,97,0.2)" : "rgba(52,211,153,0.2)"}`,
                fontWeight: 700,
                fontSize: "13px",
              }}
            >
              {isPaidTool ? `Rs. ${tool.price}` : "Free"}
            </span>

            {isPaidTool && purchased ? (
              <span
                style={{
                  padding: "9px 14px",
                  borderRadius: "999px",
                  background: "rgba(52,211,153,0.12)",
                  color: "#bbf7d0",
                  border: "1px solid rgba(52,211,153,0.2)",
                  fontWeight: 700,
                  fontSize: "13px",
                }}
              >
                Purchased
              </span>
            ) : null}
          </div>

          {message ? (
            <div
              style={{
                marginBottom: "18px",
                padding: "14px 16px",
                borderRadius: "16px",
                background: successMessage ? "rgba(52,211,153,0.12)" : "rgba(244,162,97,0.12)",
                border: `1px solid ${successMessage ? "rgba(52,211,153,0.22)" : "rgba(244,162,97,0.22)"}`,
                color: successMessage ? "#bbf7d0" : "#ffd7b0",
              }}
            >
              {message}
            </div>
          ) : null}

          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            <button
              onClick={canOpenTool ? openTool : handlePurchase}
              disabled={checkingPurchase || processingPayment}
              className="buy-btn"
              style={{
                opacity: checkingPurchase || processingPayment ? 0.7 : 1,
                cursor: checkingPurchase || processingPayment ? "not-allowed" : "pointer",
              }}
            >
              {checkingPurchase
                ? "Checking access..."
                : canOpenTool
                ? "Open Tool"
                : processingPayment
                ? "Starting Checkout..."
                : "Buy with Razorpay"}
            </button>

            {isPaidTool ? (
              <button
                onClick={() => navigate("/dashboard/purchases")}
                style={{
                  padding: "12px 20px",
                  borderRadius: "999px",
                  border: "1px solid rgba(149,176,214,0.16)",
                  background: "rgba(15,23,42,0.5)",
                  color: "#eff6ff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                View Purchases
              </button>
            ) : null}
          </div>
        </div>

        <aside
          style={{
            borderRadius: "28px",
            padding: "24px",
            border: "1px solid rgba(149,176,214,0.14)",
            background: "rgba(7,17,31,0.44)",
            alignSelf: "start",
          }}
        >
          <p style={{ color: "#8fa5c2", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "12px", marginBottom: "14px" }}>
            Access summary
          </p>
          <div style={{ display: "grid", gap: "14px" }}>
            <div>
              <p style={{ color: "#8fa5c2", fontSize: "13px", marginBottom: "4px" }}>Payment model</p>
              <p style={{ color: "#f8fbff", fontWeight: 700 }}>{isPaidTool ? "One-time purchase" : "Free access"}</p>
            </div>
            <div>
              <p style={{ color: "#8fa5c2", fontSize: "13px", marginBottom: "4px" }}>Status</p>
              <p style={{ color: canOpenTool ? "#bbf7d0" : "#ffd7b0", fontWeight: 700 }}>
                {canOpenTool ? "Ready to use" : "Purchase required"}
              </p>
            </div>
            <div>
              <p style={{ color: "#8fa5c2", fontSize: "13px", marginBottom: "4px" }}>Entry point</p>
              <p style={{ color: "#d8e3f2", lineHeight: 1.7 }}>
                {tool.url ? "Opens the linked tool experience immediately after access is confirmed." : "This listing opens from the marketplace detail page."}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
