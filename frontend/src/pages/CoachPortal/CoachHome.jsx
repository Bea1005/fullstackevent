import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CoachPortal.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const CoachHome = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [coach, setCoach] = useState({ fullname: '' });
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== 'coach') {
      navigate('/login');
      return;
    }

    fetchCoachData();
    fetchUpdates();
  }, [navigate]);

  const fetchCoachData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/coach/profile`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCoach({ fullname: data.fullname });
      } else {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setCoach({ fullname: userData.fullname });
        }
      }
    } catch (error) {
      console.error("Error fetching coach data:", error);
      setCoach({ fullname: "Coach" });
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdates = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API}/coach/updates`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setUpdates(data);
      } else {
        setUpdates([
          { id: 1, title: 'Team 1 Basketball Team Training', date: 'January 23, 2026', time: '8AM - 10AM' },
          { id: 2, title: 'Intramural Requirements 2026', date: 'January 14, 2026', time: 'All Day' },
        ]);
      }
    } catch (error) {
      console.error("Error fetching updates:", error);
    }
  };

  if (loading) {
    return (
      <div className="coach-main-content">
        <div className="loading-container">Loading...</div>
      </div>
    );
  }

  return (
    <div className="coach-main-content">
      {/* HEADER SECTION */}
      <div className="coach-top-bar">
        <div className="notification-icons">
          <button className="icon-btn" title="Notifications">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button 
            className="icon-btn" 
            title="Profile"
            onClick={() => navigate('/coach/profile')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </div>
      </div>

      {/* WELCOME BANNER */}
      <div className="welcome-banner-card">
        <div className="banner-text">
          <h3>WELCOME BACK, COACH!</h3>
          <h1>{coach.fullname || 'Coach'}</h1>
        </div>
        <div className="banner-circle-decoration"></div>
      </div>

      {/* LATEST UPDATES SECTION */}
      <div className="updates-section">
        <div className="section-header">
          <h3>Latest Update</h3>
          <button className="view-all-btn" onClick={() => navigate('/coach/announcements')}>View all</button>
        </div>

        <div className="updates-container">
          {updates.length === 0 ? (
            <div className="no-updates">No updates available</div>
          ) : (
            updates.map((update) => (
              <div key={update.id} className="update-card-gold">
                <div className="update-content">
                  <p className="update-title">{update.title}</p>
                  <p className="update-subtext">{update.date}</p>
                  <p className="update-subtext">{update.time}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachHome;