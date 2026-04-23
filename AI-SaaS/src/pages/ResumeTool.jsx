import { useState } from "react";
import axios from "axios";

export default function ResumeTool() {
  const [form, setForm] = useState({ name: "", email: "", summary: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/resume/generate`,
        form,
        { responseType: "blob" } // 👈 important for file download
      );

      // Trigger file download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error generating resume:", err);
    }
  };

  return (
    <div className="resume-tool">
      <h2>AI Resume Builder</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <textarea
          name="summary"
          placeholder="Summary"
          value={form.summary}
          onChange={handleChange}
        />
        <button type="submit">Generate Resume</button>
      </form>
    </div>
  );
}
