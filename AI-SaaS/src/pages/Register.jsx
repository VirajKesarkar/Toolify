import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { setAuthSession } from "../utils/auth.js";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMsg("");

    try {
      const registerRes = await axios.post(`${import.meta.env.VITE_API_URL}/users/register`, {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      const loginRes = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
        email: email.trim().toLowerCase(),
        password,
      });

      setAuthSession({
        token: loginRes.data.token,
        user: loginRes.data.user,
      });

      setMsg(registerRes.data.msg || "Account created successfully.");
      setName("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (error) {
      setMsg(error.response?.data?.msg || "Could not create your account.");
    } finally {
      setSubmitting(false);
    }
  };

  const isSuccess = msg.toLowerCase().includes("success");

  return (
    <div style={{ padding: "56px 24px 72px" }}>
      <div className="register">
        <div
          style={{
            display: "inline-flex",
            padding: "9px 14px",
            borderRadius: "999px",
            background: "rgba(94,234,212,0.1)",
            border: "1px solid rgba(94,234,212,0.16)",
            color: "#ccfbf1",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          Join the marketplace
        </div>
        <h2>Create your account</h2>
        <p style={{ color: "#9fb2ce", marginBottom: "30px", fontSize: "15px", lineHeight: 1.7 }}>
          Start buying tools, publishing your own listings, and tracking payouts from a cleaner creator experience.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="form-input"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="form-input"
          />
          <input
            type="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            className="form-input"
          />
          <button type="submit" disabled={submitting}>
            {submitting ? "Creating account..." : "Create Account"}
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
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#dbe7ff", fontWeight: 700, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
