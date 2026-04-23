import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return <p style={{ padding: "40px", color: "#d8e3f2" }}>Please log in to view your profile.</p>;
  }

  return (
    <div style={{ padding: "32px 24px 72px" }}>
      <div
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          borderRadius: "34px",
          padding: "34px",
          background:
            "linear-gradient(180deg, rgba(13,27,47,0.88) 0%, rgba(8,18,32,0.96) 100%)",
          border: "1px solid rgba(149,176,214,0.16)",
          boxShadow: "0 30px 80px rgba(2, 6, 23, 0.28)",
        }}
      >
        <p style={{ color: "#8fa5c2", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: "12px", marginBottom: "10px" }}>
          Account
        </p>
        <h2 style={{ fontFamily: "'Syne', sans-serif", color: "#f8fbff", fontSize: "2rem", marginBottom: "10px" }}>
          My Profile
        </h2>
        <p style={{ color: "#9fb2ce", marginBottom: "24px", lineHeight: 1.7 }}>
          Basic account information used across your marketplace activity.
        </p>

        <div style={{ display: "grid", gap: "14px" }}>
          {[
            ["Name", user.name],
            ["Email", user.email],
            ["Role", user.role],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                padding: "18px",
                borderRadius: "22px",
                background: "rgba(7,17,31,0.46)",
                border: "1px solid rgba(149,176,214,0.14)",
              }}
            >
              <p style={{ color: "#8fa5c2", fontSize: "13px", marginBottom: "6px" }}>{label}</p>
              <p style={{ color: "#f8fbff", fontWeight: 700 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
