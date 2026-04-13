import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPortal.css';

const AdminSettings = () => {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState({
    email: 'admin@gymstat.edu',
    notifications: true
  });
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = () => {
    const newPassword = prompt("Enter new password:");
    if (newPassword && newPassword.length >= 8) {
      alert("Password changed successfully!");
    } else if (newPassword) {
      alert("Password must be at least 8 characters");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      navigate("/admin-login");
    }
  };

  return (
    <div className="admin-page-content">
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "28px", marginBottom: "20px", color: "#333" }}>Settings</h1>

        {/* Account Section */}
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "15px", color: "#7b1e1e", borderBottom: "2px solid #ffdc00", paddingBottom: "8px" }}>
            Account
          </h2>
          
          {/* Change Password - Updated style */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #eee" }}>
            <div>
              <p style={{ fontWeight: "600", marginBottom: "4px" }}>🔐 Change Password</p>
              <p style={{ fontSize: "12px", color: "#888" }}>Update your account password</p>
            </div>
            <button 
              onClick={handleChangePassword}
              style={{ background: "#7b1e1e", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer" }}
            >
              Update
            </button>
          </div>

          {/* Email Address */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #eee" }}>
            <div>
              <p style={{ fontWeight: "600", marginBottom: "4px" }}>📧 Email Address</p>
              <p style={{ fontSize: "12px", color: "#888" }}>admin@gymstat.edu</p>
            </div>
            <button 
              style={{ background: "#7b1e1e", color: "white", border: "none", padding: "6px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" }}
              onClick={() => alert("Contact IT Support to change email")}
            >
              Change
            </button>
          </div>

          {/* Notifications */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0" }}>
            <div>
              <p style={{ fontWeight: "600", marginBottom: "4px" }}>🔔 Notifications</p>
              <p style={{ fontSize: "12px", color: "#888" }}>Receive system updates</p>
            </div>
            <button
              onClick={() => setAdminInfo({...adminInfo, notifications: !adminInfo.notifications})}
              style={{
                background: adminInfo.notifications ? "#7b1e1e" : "#ccc",
                color: "white",
                border: "none",
                padding: "6px 20px",
                borderRadius: "20px",
                cursor: "pointer",
                minWidth: "60px"
              }}
            >
              {adminInfo.notifications ? "ON" : "OFF"}
            </button>
          </div>
        </div>

        {/* System Info Section */}
        <div style={{ background: "white", borderRadius: "12px", padding: "20px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: "18px", marginBottom: "15px", color: "#7b1e1e", borderBottom: "2px solid #ffdc00", paddingBottom: "8px" }}>
            System Info
          </h2>
          
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #eee" }}>
            <span style={{ color: "#666" }}>Version</span>
            <strong>v1.0</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0" }}>
            <span style={{ color: "#666" }}>Support</span>
            <strong>support@gymstat.edu</strong>
          </div>
        </div>


      </div>
    </div>
  );
};

export default AdminSettings;