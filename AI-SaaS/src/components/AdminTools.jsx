// src/pages/AdminTools.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminTools() {
  const [tools, setTools] = useState([]);

  // Fetch all tools for admin
  const fetchTools = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/tools");
      setTools(res.data);
    } catch (err) {
      console.error("Error fetching tools:", err);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  // Approve a tool
  const approveTool = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/tools/${id}/approve`);
      fetchTools(); // refresh list
    } catch (err) {
      console.error("Error approving tool:", err);
    }
  };

  // Delete a tool
  const deleteTool = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/tools/${id}`);
      fetchTools(); // refresh list
    } catch (err) {
      console.error("Error deleting tool:", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Tools Management</h1>

      <h2>Pending Tools</h2>
      {tools.filter((t) => !t.isApproved).length === 0 && <p>No pending tools</p>}
      <ul>
        {tools
          .filter((t) => !t.isApproved)
          .map((tool) => (
            <li key={tool._id} style={{ marginBottom: 12 }}>
              <strong>{tool.name}</strong> - {tool.description}
              <button
                onClick={() => approveTool(tool._id)}
                style={{ marginLeft: 10, background: "green", color: "white", border: "none", padding: "4px 8px", borderRadius: 4 }}
              >
                Approve
              </button>
              <button
                onClick={() => deleteTool(tool._id)}
                style={{ marginLeft: 10, background: "red", color: "white", border: "none", padding: "4px 8px", borderRadius: 4 }}
              >
                Delete
              </button>
            </li>
          ))}
      </ul>

      <h2>Approved Tools</h2>
      {tools.filter((t) => t.isApproved).length === 0 && <p>No approved tools</p>}
      <ul>
        {tools
          .filter((t) => t.isApproved)
          .map((tool) => (
            <li key={tool._id} style={{ marginBottom: 12 }}>
              <strong>{tool.name}</strong> - {tool.description}
              <button
                onClick={() => deleteTool(tool._id)}
                style={{ marginLeft: 10, background: "red", color: "white", border: "none", padding: "4px 8px", borderRadius: 4 }}
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
