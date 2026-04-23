import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import { Toaster } from "react-hot-toast";

import Home from "./pages/Home.jsx";
import Tools from "./pages/Tools.jsx";
import ToolDetails from "./pages/ToolDetails.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ResumeGenerator from "./pages/ResumeGenerator.jsx";
import AdminTools from "./pages/AdminTools.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Profile from "./pages/Profile.jsx";
import WhyChooseUs from "./pages/WhyChooseUs.jsx";
import MyTools from "./pages/MyTools.jsx";
import MyPurchases from "./pages/MyPurchases.jsx";
import UserSubmitTool from "./components/UserSubmitTool.jsx";
import ImageGenerator from "./tools/ImageGenerator.jsx";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/:id" element={<ToolDetails />} />
        <Route path="/why-choose-us" element={<WhyChooseUs />} />
        <Route path="/tools/image-generator" element={<ImageGenerator />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/my-tools"
          element={
            <ProtectedRoute>
              <MyTools />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/purchases"
          element={
            <ProtectedRoute>
              <MyPurchases />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/subscription"
          element={
            <ProtectedRoute>
              <MyPurchases />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit-tool"
          element={
            <ProtectedRoute>
              <UserSubmitTool />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/tools"
          element={
            <AdminRoute>
              <AdminTools />
            </AdminRoute>
          }
        />

        <Route path="/resume" element={<ResumeGenerator />} />
      </Routes>

      <Toaster position="top-right" reverseOrder={false} />

      <footer
        style={{
          background:
            "radial-gradient(circle at top left, rgba(124, 156, 255, 0.12), transparent 28%), linear-gradient(180deg, rgba(9,20,36,0.98) 0%, rgba(7,17,31,1) 100%)",
          padding: "56px 40px 28px",
          borderTop: "1px solid rgba(149, 176, 214, 0.14)",
          marginTop: "96px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "260px",
            height: "260px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244, 162, 97, 0.16), transparent 68%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "40px",
            marginBottom: "32px",
            position: "relative",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "14px",
                background: "linear-gradient(135deg, #ffffff 0%, #7c9cff 55%, #5eead4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              AI-SaaS
            </h3>
            <p style={{ color: "#8fa5c2", fontSize: "14px", lineHeight: "1.7", maxWidth: "280px" }}>
              Discover, sell, and scale powerful AI tools in a marketplace designed for creators and modern teams.
            </p>
          </div>

          <div>
            <h4
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "16px",
                color: "#f7fafc",
              }}
            >
              Quick Links
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {["Home", "Tools", "Why Choose Us", "Submit Tool"].map((link) => (
                <li key={link} style={{ marginBottom: "8px" }}>
                  <a
                    href={`/${link.toLowerCase().replace(/\s+/g, "-")}`}
                    style={{
                      color: "#8fa5c2",
                      textDecoration: "none",
                      fontSize: "14px",
                      transition: "0.3s",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#f7fafc")}
                    onMouseLeave={(e) => (e.target.style.color = "#8fa5c2")}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "16px",
                color: "#f7fafc",
              }}
            >
              Support
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {["Help Center", "Contact Us", "Privacy Policy", "Terms of Service"].map((link) => (
                <li key={link} style={{ marginBottom: "8px" }}>
                  <a
                    href="#"
                    style={{
                      color: "#8fa5c2",
                      textDecoration: "none",
                      fontSize: "14px",
                      transition: "0.3s",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#f4a261")}
                    onMouseLeave={(e) => (e.target.style.color = "#8fa5c2")}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            paddingTop: "24px",
            borderTop: "1px solid rgba(149, 176, 214, 0.12)",
            color: "#61738f",
            fontSize: "14px",
            position: "relative",
          }}
        >
          © {new Date().getFullYear()} AI-SaaS Marketplace. All rights reserved.
        </div>
      </footer>
    </Router>
  );
}

export default App;
