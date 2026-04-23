import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faCheckCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { getStoredToken, getStoredUser } from "../utils/auth.js";

export default function UserSubmitTool() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    apiUrl: "",
  });

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const user = getStoredUser();
  const token = getStoredToken();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      return alert("Login required before submitting a tool.");
    }

    try {
      const payload = {
        ...form,
        submittedBy: {
          name: user.name,
          email: user.email,
        },
      };

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/tools`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      setIsSuccess(true);

      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        apiUrl: "",
      });
    } catch (err) {
      setMessage(err.response?.data?.error || "Error submitting tool");
      setIsSuccess(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 200px)",
        padding: "80px 40px",
        background: "#0a0e27",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#1e293b",
          padding: "48px",
          borderRadius: "24px",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
          border: "1px solid #334155",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: "0 0 30px rgba(99, 102, 241, 0.5)",
            }}
          >
            <FontAwesomeIcon icon={faPaperPlane} style={{ fontSize: "36px", color: "white" }} />
          </div>

          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "2.5rem",
              fontWeight: "700",
              marginBottom: "12px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Submit Your AI Tool
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "16px", lineHeight: "1.6" }}>
            Share your tool with thousands of users and get discovered
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1", fontSize: "14px", fontWeight: "500" }}>
              Tool Name *
            </label>
            <input
              name="name"
              placeholder="e.g., AI Image Generator Pro"
              value={form.name}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1", fontSize: "14px", fontWeight: "500" }}>
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Describe what your tool does and its key features..."
              value={form.description}
              onChange={handleChange}
              required
              rows="4"
              style={{
                width: "100%",
                padding: "14px 18px",
                border: "2px solid #334155",
                borderRadius: "12px",
                fontSize: "15px",
                fontFamily: "'Inter', sans-serif",
                background: "#1a2332",
                color: "#f1f5f9",
              }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1", fontSize: "14px", fontWeight: "500" }}>
                Category
              </label>
              <input
                name="category"
                placeholder="e.g., Image Generation"
                value={form.category}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1", fontSize: "14px", fontWeight: "500" }}>
                Price (INR)
              </label>
              <input
                type="number"
                name="price"
                placeholder="0 for free"
                value={form.price}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", color: "#cbd5e1", fontSize: "14px", fontWeight: "500" }}>
              Website / API URL
            </label>
            <input
              name="apiUrl"
              placeholder="https://your-tool-website.com"
              value={form.apiUrl}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: "12px",
              padding: "16px",
              borderRadius: "50px",
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
            }}
          >
            Submit Tool for Review
          </button>
        </form>

        {message ? (
          <div
            style={{
              marginTop: "24px",
              padding: "16px 20px",
              borderRadius: "12px",
              background: isSuccess ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
              border: `1px solid ${isSuccess ? "#10b981" : "#ef4444"}`,
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <FontAwesomeIcon
              icon={isSuccess ? faCheckCircle : faExclamationCircle}
              style={{ fontSize: "20px", color: isSuccess ? "#10b981" : "#ef4444" }}
            />
            <p style={{ margin: 0, color: isSuccess ? "#10b981" : "#ef4444", fontSize: "15px", fontWeight: "500" }}>
              {message}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
