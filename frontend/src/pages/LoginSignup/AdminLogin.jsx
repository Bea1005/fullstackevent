import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/api";
import "./LoginPage.css";
import gymBackground from "../../assets/gym-background.jpg";
import emailIcon from "../../assets/email.png";
import passwordIcon from "../../assets/password.png";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);

      if (data.success && data.user.role === "admin") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert(`Welcome back, ${data.user.fullname}!`);
        navigate("/admin/dashboard");
      } else if (data.success && data.user.role !== "admin") {
        alert("Access denied. This portal is for administrators only.");
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      alert("Cannot connect to server. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      {/* LEFT SIDE */}
      <div
        className="login-left"
        style={{ backgroundImage: `url(${gymBackground})` }}
      >
        <div className="login-left-overlay"></div>
        <div className="login-left-content">
          <div className="login-university-badge">
            <span>MARINDUQUE STATE UNIVERSITY</span>
          </div>
          <h1 className="login-system-name" style={{ color: "white" }}>GYMSTAT</h1>
          <p className="login-system-sub">
            Gymnasium and Student Athlete Record Management System
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-right-inner">
          <h2 className="login-title">Admin Portal</h2>
          <p className="login-description" style={{ textAlign: "center", marginBottom: "20px", color: "#666" }}>
            Enter your administrator credentials to access the dashboard.
          </p>

          <form onSubmit={handleAdminLogin} className="login-form">
            <div className="login-field">
              <label>Email</label>
              <div className="login-input-wrapper">
                <img src={emailIcon} alt="email icon" className="login-icon" />
                <input
                  type="email"
                  className="login-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@marsu.edu"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label>Password</label>
              <div className="login-input-wrapper">
                <img
                  src={passwordIcon}
                  alt="password icon"
                  className="login-icon"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#666"
                  }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
              style={{
                background: "#7b1e1e",
                marginTop: "20px",
                padding: "14px"
              }}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>

            <p className="login-switch-text" style={{ marginTop: "20px" }}>
              <button
                type="button"
                className="login-link-btn"
                onClick={() => navigate("/roles")}
              >
                ← Back to Role Selection
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}