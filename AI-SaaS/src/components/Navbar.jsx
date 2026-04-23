import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { clearAuthSession, getStoredUser, isAdminUser } from "../utils/auth.js";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const syncUser = () => {
      setUser(getStoredUser());
    };

    syncUser();
    window.addEventListener("authChanged", syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("authChanged", syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <img src="/images/to.png" alt="AI-SaaS Logo" className="logo-img" />
          <span className="logo-text">AI-SaaS</span>
        </Link>
      </div>

      <ul>
        {!isAdminUser(user) && (
          <>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/tools">Tools</Link></li>
            <li><Link to="/why-choose-us">Why Choose Us</Link></li>
            {user ? <li><Link to="/submit-tool">Submit Tool</Link></li> : null}
          </>
        )}

        {user ? (
          <>
            <li>
              <Link to={isAdminUser(user) ? "/admin/dashboard" : "/dashboard"}>
                {user.name.split(" ")[0]}'s Dashboard
              </Link>
            </li>

            {!isAdminUser(user) ? (
              <li><Link to="/dashboard/purchases">Purchases</Link></li>
            ) : null}

            {isAdminUser(user) ? (
              <li><Link to="/admin/tools">Manage Tools</Link></li>
            ) : null}

            <li>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}
