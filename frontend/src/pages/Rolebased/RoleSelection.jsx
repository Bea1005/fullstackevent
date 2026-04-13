import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelection.css";
import gymBackground from "../../assets/gym-background.jpg";

const roles = [
  { key: "student", label: "Student Portal" },
  { key: "coach",   label: "Coach Portal"   },
  { key: "admin",   label: "Admin Portal"   },
  { key: "screener", label: "Screener Portal" }, // ✅ ADDED NEW ROLE
];

export default function RoleSelection({ onSelect }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const handleRoleSelect = (roleKey) => {
    if (roleKey === "admin") {
      navigate("/admin-login");
    } else if (roleKey === "screener") {
      navigate("/screener-login");
    } else {
      navigate("/register", { state: { selectedRole: roleKey } });
    }
    if (onSelect) onSelect(roleKey);
  };

  return (
    <div className="role-root">
      {/* Left panel - gym photo side */}
      <div className="role-left">
        <img 
          src={gymBackground} 
          alt="Gymnasium Background" 
          className="role-left-image"
        />
        <div className="role-left-overlay" />
        <div className="role-left-content">
          <div className="role-university-badge">
            <span>MARINDUQUE STATE UNIVERSITY</span>
          </div>
          <h1 className="role-system-name">GYMSTAT</h1>
          <p className="role-system-sub">Gymnasium and Student Athlete Record Management System</p>
        </div>
      </div>

      {/* Right panel - portal selection */}
      <div className="role-right">
        <div className="role-right-inner">
          <h2 className="role-welcome-title">Welcome</h2>
          <p className="role-welcome-sub">Select your portal to continue</p>

          <div className="role-cards">
            {roles.map((role, i) => (
              <button
                key={role.key}
                className={`role-card${hovered === role.key ? " role-card-hovered" : ""}`}
                style={{ animationDelay: `${i * 0.12}s` }}
                onMouseEnter={() => setHovered(role.key)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleRoleSelect(role.key)}
              >
                <span className="role-card-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                <span className="role-card-label">{role.label}</span>
                <span className="role-card-arrow">›</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}