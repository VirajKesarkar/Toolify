import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { setAuthSession } from "../utils/auth.js";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMsg("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      const userData = res.data.user;
      const token = res.data.token;

      setAuthSession({ token, user: userData });
      setMsg("Login successful.");

      setTimeout(() => {
        navigate(userData.role === "admin" ? "/admin/dashboard" : "/dashboard");
      }, 700);
    } catch (error) {
      setMsg(error.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isSuccess = msg.toLowerCase().includes("successful");

  return (
    <div style={{ padding: "56px 24px 72px" }}>
      <div className="login-page">
        <div
          style={{
            display: "inline-flex",
            padding: "9px 14px",
            borderRadius: "999px",
            background: "rgba(124,156,255,0.1)",
            border: "1px solid rgba(124,156,255,0.18)",
            color: "#dbe7ff",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          Welcome back
        </div>
        <h2>Sign in to your workspace</h2>
        <p style={{ color: "#9fb2ce", marginBottom: "30px", fontSize: "15px", lineHeight: 1.7 }}>
          Access your dashboard, purchased tools, creator revenue, and checkout history from one elegant place.
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
            className="form-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="form-input"
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        {msg ? (
          <div
            style={{
              marginTop: "18px",
              borderRadius: "16px",
              padding: "14px 16px",
              border: `1px solid ${isSuccess ? "rgba(52,211,153,0.24)" : "rgba(251,113,133,0.24)"}`,
              background: isSuccess ? "rgba(52,211,153,0.12)" : "rgba(251,113,133,0.12)",
              color: isSuccess ? "#bbf7d0" : "#fecdd3",
              fontSize: "14px",
            }}
          >
            {msg}
          </div>
        ) : null}

        <p style={{ marginTop: "24px", color: "#9fb2ce", fontSize: "14px", textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link to="/register" style={{ color: "#dbe7ff", fontWeight: 700, textDecoration: "none" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
