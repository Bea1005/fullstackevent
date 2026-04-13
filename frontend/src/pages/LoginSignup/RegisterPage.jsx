import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { register as registerUser } from "../../services/api";
import "./RegisterPage.css";

import gymBackground from "../../assets/gym-background.jpg";

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get selected role from navigation state (from role selection page)
  const selectedRole = location.state?.selectedRole || "student";

  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    role: selectedRole,
    // ✅ ADDED: Student-only fields (default empty)
    department: "",
    sport: "",
    studentId: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // Password validation function
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&* etc.)";
    }
    return null;
  };

  const handlePasswordChange = (e) => {
    setForm((prev) => ({ ...prev, password: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!form.fullname || !form.username || !form.email || !form.password) {
      alert("Please fill in all fields");
      return;
    }

    const passwordValidationError = validatePassword(form.password);
    if (passwordValidationError) {
      alert(passwordValidationError);
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser(form);

      if (data.success) {
        alert(`Registration successful as ${form.role}!`);
        navigate("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Register error:", err);
      const message = err.message || "Cannot connect to server. Please check if backend is running.";
      alert(message.includes('Failed to fetch') ? "Cannot connect to server. Please check if backend is running." : message);
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
          <h2 className="login-title">Sign Up as {form.role === "student" ? "Student" : "Coach"}</h2>

          <form onSubmit={handleRegister} className="login-form">
            <div className="login-field">
              <label>Full Name</label>
              <input
                type="text"
                className="login-input"
                value={form.fullname}
                onChange={set("fullname")}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="login-field">
              <label>Username</label>
              <input
                type="text"
                className="login-input"
                value={form.username}
                onChange={set("username")}
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="login-field">
              <label>Email</label>
              <input
                type="email"
                className="login-input"
                value={form.email}
                onChange={set("email")}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="login-field">
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  value={form.password}
                  onChange={handlePasswordChange}
                  placeholder="Create a password "
                  style={{ paddingRight: "40px" }}
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

            {/* ✅ STUDENT-ONLY FIELDS - Lalabas lang kapag student ang role */}
            {form.role === "student" && (
              <>
                <div className="login-field">
                  <label>Department</label>
                  <select
                    className="login-input"
                    value={form.department}
                    onChange={set("department")}
                  >
                    <option value="">Select Department</option>
                    <option value="CICS">CICS - College of Information and Computing Sciences</option>
                    <option value="Education">College of Education</option>
                    <option value="Engineering">College of Engineering</option>
                    <option value="Business">College of Business</option>
                    <option value="Arts">College of Arts and Sciences</option>
                  </select>
                </div>

                <div className="login-field">
                  <label>Sport</label>
                  <select
                    className="login-input"
                    value={form.sport}
                    onChange={set("sport")}
                  >
                    <option value="">Select Sport</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Volleyball">Volleyball</option>
                    <option value="Soccer">Soccer</option>
                    <option value="Swimming">Swimming</option>
                    <option value="Track and Field">Track and Field</option>
                    <option value="Softball">Softball</option>
                    <option value="Tennis">Tennis</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Chess">Chess</option>
                    <option value="Table Tennis">Table Tennis</option>
                  </select>
                </div>

                <div className="login-field">
                  <label>Student ID</label>
                  <input
                    type="text"
                    className="login-input"
                    value={form.studentId}
                    onChange={set("studentId")}
                    placeholder="e.g., 23B1509"
                  />
                </div>
              </>
            )}

            {/* Role is hidden because it's pre-selected from role selection */}
            <input type="hidden" name="role" value={form.role} />

            <button type="submit" className="login-submit-btn" disabled={loading}>
              {loading ? "Registering..." : "Sign Up"}
            </button>

            <p className="login-switch-text">
              Already have an account?{" "}
              <button
                type="button"
                className="login-link-btn"
                onClick={() => navigate("/login")}
              >
                Log in
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}