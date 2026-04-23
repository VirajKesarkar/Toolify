export default function LogoutButton() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        padding: "10px 20px",
        borderRadius: "8px",
        background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
        color: "white",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
        marginTop: "20px"
      }}
    >
      Logout
    </button>
  );
}
