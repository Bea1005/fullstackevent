import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPortal.css";

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAthletes: 0,
    totalCoaches: 0,
    totalUsers: 0,
    pendingRequirements: 0,
    borrowedItems: 0,
    totalEquipments: 0,
    itemsOut: 0
  });
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [user, setUser] = useState({ name: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser({ name: userData.fullname || "Admin" });
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API}/admin/dashboard`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || {
          totalAthletes: data.totalAthletes || 0,
          totalCoaches: data.totalCoaches || 0,
          totalUsers: data.totalUsers || 0,
          pendingRequirements: data.pendingRequirements || 0,
          borrowedItems: data.borrowedItems || 0,
          totalEquipments: data.totalEquipments || 0,
          itemsOut: data.itemsOut || 0
        });
        setActivities(data.activities || []);
        setUpcomingSchedules(data.upcomingSchedules || []);
      } else {
        // Fallback demo data if API fails
        setStats({
          totalAthletes: 128,
          totalCoaches: 12,
          totalUsers: 140,
          pendingRequirements: 8,
          borrowedItems: 24,
          totalEquipments: 156,
          itemsOut: 32
        });
        setActivities([
          { id: 1, action: "New athlete registered: Juan Dela Cruz", time: "2 hours ago" },
          { id: 2, action: "Equipment borrowed: 5 Basketballs", time: "Yesterday" },
          { id: 3, action: "Schedule updated: Basketball Practice", time: "Yesterday" },
          { id: 4, action: "Requirement submitted: Medical Certificate", time: "2 days ago" }
        ]);
        setUpcomingSchedules([
          { id: 1, title: "Basketball Practice", date: "2026-03-28", time: "08:00 AM" },
          { id: 2, title: "Swimming Tryouts", date: "2026-03-29", time: "10:00 AM" },
          { id: 3, title: "Coaches Meeting", date: "2026-03-30", time: "02:00 PM" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Keep demo data on error
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "TOTAL ATHLETES", count: stats.totalAthletes, color: "#800000", icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ), path: "/admin/student-athletes" },
    { title: "TOTAL COACHES", count: stats.totalCoaches, color: "#ffd700", icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ), path: "/admin/coaches" },
    { title: "TOTAL USERS", count: stats.totalUsers, color: "#38b2ac", icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ), path: "/admin/student-athletes" },
    { title: "PENDING REQS", count: stats.pendingRequirements, color: "#ff4d4d", icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ), path: "/admin/requirements" },
    { title: "BORROWED ITEMS", count: stats.borrowedItems, color: "#ff9800", icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12H4" />
        <path d="M12 4v16" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ), path: "/admin/borrowing" },
    { title: "TOTAL EQUIPMENTS", count: stats.totalEquipments, color: "#4caf50", icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ), path: "/admin/equipments" },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-welcome">Welcome Back, {user.name}!</p>
        <p className="dashboard-subtitle">Monitoring the excellence of MarSU Athletes.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat) => (
          <div 
            key={stat.title} 
            className="stat-card" 
            style={{ borderLeft: `5px solid ${stat.color}` }}
            onClick={() => navigate(stat.path)}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.count}</h3>
              <p>{stat.title}</p>
            </div>~ 
            
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="dashboard-card">
          <h3>Latest Activities</h3>
          <div className="activity-list">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <span className="activity-dot"></span>
                  <span className="activity-text">{activity.action}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
              ))
            ) : (
              <p className="no-data">No recent activities</p>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Upcoming Schedules</h3>
          {upcomingSchedules.length > 0 ? (
            <div className="schedule-list">
              {upcomingSchedules.map((schedule) => (
                <div key={schedule.id} className="schedule-item">
                  <div className="schedule-info">
                    <span className="schedule-title">{schedule.title}</span>
                    <span className="schedule-date">{schedule.date}</span>
                  </div>
                  <span className="schedule-time">{schedule.time}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No upcoming schedules</p>
          )}
          <button className="view-all-btn" onClick={() => navigate("/admin/schedules")}>
            View All Schedules
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;