import React from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import './StudentPortal.css';

const StudentLayout = () => {
  return (
    <div className="portal-container">
      <StudentSidebar />
      <main className="main-content">
        <div className="top-header">
            <span className="icon-circle">🔔</span>
            <span className="icon-circle">👤</span>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;