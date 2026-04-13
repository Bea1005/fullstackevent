import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentPortal.css";
import Sidebar from "./StudentSidebar";

const STUDENT_NAV = [
  { key: "home", label: "Home", icon: "🏠" },
  { key: "requirements", label: "Requirements", icon: "📝" },
  { key: "announcements", label: "Announcements", icon: "📢" },
  { key: "profile", label: "Profile", icon: "👤" },
  { key: "settings", label: "Settings", icon: "⚙️" },
];

const UPDATES = [
  { id: 1, title: "Team 1 Basketball Team Training", date: "January 23, 2026", time: "8AM–10AM", type: "training" },
  { id: 2, title: "Intramural Requirements 2026", date: "January 14, 2026", time: "All Day", type: "requirement" },
];

export default function StudentHomePage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("home");
  const [user, setUser] = useState({ name: "", email: "" });

  // 1. Authentication & Data Fetching Logic
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || role !== "student") {
      alert("Unauthorized access. Please login.");
      navigate("/login");
      return;
    }
    
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser({
        name: userData.fullname || userData.name || "Bea Dolor Soleta",
        email: userData.email || "student@marsu.edu"
      });
    } else {
      setUser({ name: "Bea Dolor Soleta", email: "student@marsu.edu" });
    }
  }, [navigate]);

  // 2. Button Handlers
  const handleNav = (key) => {
    setActive(key);
    navigate(`/student/${key}`);
  };

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to log out?")) {
      localStorage.clear(); // Clears token, role, and user
      navigate("/login");
    }
  };

  const handleNotifications = () => {
    alert("No new notifications at the moment.");
  };

  const handleUpdateClick = (update) => {
    console.log("Viewing update:", update.title);
    if(update.type === "requirement") {
      navigate("/student/requirements");
    } else {
      navigate("/student/announcements");
    }
  };

  return (
    <div className="portal-root">
      <Sidebar
        portalLabel="Student Athlete Portal"
        navItems={STUDENT_NAV}
        activeItem={active}
        onNav={handleNav}
        onLogout={handleLogout}
        email={user.email}
      />

      <div className="portal-main">
        {/* Top Header */}
        <div className="portal-topbar">
          <div className="topbar-right">
            <button 
              className="topbar-icon-btn sh-topbar-bell" 
              onClick={handleNotifications}
              title="Notifications"
            >
              <span className="icon-yellow">🔔</span>
            </button>
            <button 
              className="topbar-icon-btn sh-topbar-user" 
              onClick={() => handleNav("profile")}
              title="Profile"
            >
              <span className="icon-maroon">👤</span>
            </button>
          </div>
        </div>

        <div className="portal-content sh-content">
          {/* Welcome Banner */}
          <div className="sh-welcome-card">
            <div className="sh-welcome-content">
              <p className="sh-welcome-sub">WELCOME BACK, ATHLETE!</p>
              <h1 className="sh-welcome-name" style={{ color: 'white' }}>{user.name}</h1>
            </div>
            
            {/* ✅ Person icon moved to the right side */}
            <div className="sh-person-container" style={{ position: 'absolute', right: '60px', top: '50%', transform: 'translateY(-50%)' }}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="sh-decor-circle"></div>
          </div>

          {/* Quick Action */}
          <p className="sh-section-label">Quick Action</p>
          <div className="sh-quick-card">
            <p className="sh-quick-title">Sport Requirements</p>
            <p className="sh-quick-desc">Women Basketball Intramural Requirements 2026</p>
            <button className="sh-upload-btn" onClick={() => handleNav("requirements")}>
              <span>Upload Requirements</span>
              <span className="upload-icon">⤒</span>
            </button>
          </div>

          {/* Updates Header */}
          <div className="sh-updates-header">
            <p className="sh-section-label">Latest Update</p>
            <button className="sh-viewall-btn" onClick={() => handleNav("announcements")}>
              View all
            </button>
          </div>

          {/* Updates List */}
          <div className="sh-updates-list">
            {UPDATES.map((u) => (
              <div 
                className="sh-update-card" 
                key={u.id} 
                onClick={() => handleUpdateClick(u)}
                style={{ cursor: 'pointer' }}
              >
                <p className="sh-update-title">{u.title}</p>
                <p className="sh-update-meta">{u.date}</p>
                <p className="sh-update-meta">{u.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}