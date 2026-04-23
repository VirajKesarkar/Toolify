import { useState } from "react";
import axios from "axios";
import "./ResumeGenerator.css";

export default function ResumeGenerator() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    linkedin: "", github: "",
    skills: [], experience: [], education: [],
    template: "classic"
  });

  const [skillInput, setSkillInput] = useState("");
  const [expInput, setExpInput] = useState("");
  const [eduInput, setEduInput] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addItem = (key, value, setter) => {
    if (value.trim()) {
      setForm({ ...form, [key]: [...form[key], value] });
      setter("");
    }
  };

  const generateResume = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/resume/generate`,
        form,
        { responseType: "blob" }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${form.name || "resume"}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Error generating resume:", err);
    }
  };

  return (
    <div className="resume-container">
      <h1 className="resume-title">AI Resume Generator</h1>

      <div className="grid">
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange}/>
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange}/>
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}/>
        <input name="linkedin" placeholder="LinkedIn Profile" value={form.linkedin} onChange={handleChange}/>
        <input name="github" placeholder="GitHub Profile" value={form.github} onChange={handleChange}/>
      </div>

      {/* Template Selection */}
      <div className="section">
        <h2>Choose Template</h2>
        <select
          value={form.template}
          onChange={(e) => setForm({ ...form, template: e.target.value })}
          className="template-select"
        >
          <option value="classic">Classic ATS</option>
          <option value="creative">Creative Color</option>
          <option value="tech">Tech Minimal</option>
        </select>
      </div>

      {/* Skills */}
      <div className="section">
        <h2>Skills</h2>
        <div className="input-row">
          <input placeholder="Add Skill" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}/>
          <button onClick={() => addItem("skills", skillInput, setSkillInput)}>Add</button>
        </div>
        <ul>{form.skills.map((s, i) => <li key={i}>{s}</li>)}</ul>
      </div>

      {/* Experience */}
      <div className="section">
        <h2>Experience</h2>
        <div className="input-row">
          <input placeholder="Add Experience" value={expInput} onChange={(e) => setExpInput(e.target.value)}/>
          <button onClick={() => addItem("experience", expInput, setExpInput)}>Add</button>
        </div>
        <ul>{form.experience.map((exp, i) => <li key={i}>{exp}</li>)}</ul>
      </div>

      {/* Education */}
      <div className="section">
        <h2>Education</h2>
        <div className="input-row">
          <input placeholder="Add Education" value={eduInput} onChange={(e) => setEduInput(e.target.value)}/>
          <button onClick={() => addItem("education", eduInput, setEduInput)}>Add</button>
        </div>
        <ul>{form.education.map((edu, i) => <li key={i}>{edu}</li>)}</ul>
      </div>

      <button className="generate-btn" onClick={generateResume}>Generate Resume</button>
    </div>
  );
}
