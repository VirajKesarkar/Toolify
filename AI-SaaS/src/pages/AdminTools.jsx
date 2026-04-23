// src/pages/AdminTools.jsx
import { useEffect, useState } from "react";
import axios from "axios";

// 🌟 ADMIN TOOL MANAGEMENT PAGE
export default function AdminTools() {
  const [tools, setTools] = useState([]);

  // 📌 Fetch all tools (must send token)
  const fetchTools = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/tools`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTools(res.data);
    } catch (err) {
      console.error("Error fetching tools:", err);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  // ✔ Approve Tool
  const approveTool = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/tools/${id}/approve`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchTools();
    } catch (err) {
      console.error("Error approving tool:", err);
    }
  };

  // ❌ Reject/Delete Tool
  const deleteTool = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/admin/tools/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      fetchTools();
    } catch (err) {
      console.error("Error deleting tool:", err);
    }
  };

  return (
    <div
      style={{
        background: "#0a0e27",
        minHeight: "100vh",
        padding: "60px",
        color: "white",
      }}
    >
      <h1
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "2.5rem",
          fontWeight: "700",
          marginBottom: "20px",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Admin Tools Management
      </h1>

      {/* 🟨 Pending Tools Section */}
      <div
        style={{
          background: "#1e293b",
          padding: "30px",
          borderRadius: "18px",
          marginBottom: "40px",
          border: "1px solid #334155",
        }}
      >
        <h2 style={{ fontSize: "22px", marginBottom: "15px", color: "#ffd34d" }}>
          Pending Approval
        </h2>

        {tools.filter((t) => !t.approved).length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No pending tools</p>
        ) : (
          tools
            .filter((tool) => !tool.approved)
            .map((tool) => (
              <div
                key={tool._id}
                style={{
                  padding: "16px",
                  borderBottom: "1px solid #334155",
                  marginBottom: "10px",
                }}
              >
                <strong style={{ fontSize: "17px", color: "#fff" }}>
                  {tool.name}
                </strong>
                <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                  {tool.description}
                </p>

                {/* 🌐 URL */}
                {tool.url && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#60a5fa", fontSize: "14px" }}
                  >
                    {tool.url}
                  </a>
                )}

                {/* 👤 User Info */}
                {tool.submittedBy && (
                  <p style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "4px" }}>
                    Submitted by: <b>{tool.submittedBy.name}</b> ({tool.submittedBy.email})
                  </p>
                )}

                {/* Buttons */}
                <div style={{ marginTop: "10px" }}>
                  <button
                    onClick={() => approveTool(tool._id)}
                    style={{
                      padding: "6px 12px",
                      marginRight: "10px",
                      background: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => deleteTool(tool._id)}
                    style={{
                      padding: "6px 12px",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
        )}
      </div>

      {/* 🟩 Approved Section */}
      <div
        style={{
          background: "#1e293b",
          padding: "30px",
          borderRadius: "18px",
          border: "1px solid #334155",
        }}
      >
        <h2 style={{ fontSize: "22px", marginBottom: "15px", color: "#43e97b" }}>
          Approved Tools
        </h2>

        {tools.filter((t) => t.approved).length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No approved tools</p>
        ) : (
          tools
            .filter((tool) => tool.approved)
            .map((tool) => (
              <div
                key={tool._id}
                style={{
                  padding: "16px",
                  borderBottom: "1px solid #334155",
                  marginBottom: "10px",
                }}
              >
                <strong style={{ fontSize: "17px", color: "#fff" }}>
                  {tool.name}
                </strong>
                <p style={{ color: "#94a3b8", fontSize: "14px" }}>
                  {tool.description}
                </p>

                {tool.url && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#60a5fa", fontSize: "14px" }}
                  >
                    {tool.url}
                  </a>
                )}

                {tool.submittedBy && (
                  <p style={{ fontSize: "13px", color: "#cbd5e1", marginTop: "4px" }}>
                    Submitted by: <b>{tool.submittedBy.name}</b> ({tool.submittedBy.email})
                  </p>
                )}

                <button
                  onClick={() => deleteTool(tool._id)}
                  style={{
                    marginTop: "8px",
                    padding: "6px 12px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
