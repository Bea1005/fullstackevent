import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashScreen.css';
import gymBackground from "../../assets/gym-background.jpg";
import logoImage from "../../assets/logo.png"; // Import your logo image

const OnboardingScreen = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    // Go to Role Selection page
    navigate('/roles');
  };

  return (
    <div className="onboarding-container">
      {/* Background Image */}
      <div 
        className="onboarding-bg"
        style={{ backgroundImage: `url(${gymBackground})` }}
      />
      <div className="onboarding-overlay"></div>
      
      <div className="onboarding-content">
        {/* Logo Section */}
        <div className="logo-wrapper">
          <div className="logo-circle">
            <img 
              src={logoImage} 
              alt="GYMSTAT Logo" 
              className="onboarding-logo-img"
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="text-content">
         
          <p className="onboarding-subtitle">
            GYMSTAT: Gymnasium and Student Athlete Record Management System 
          </p>
          <p className="onboarding-description">
            Manage schedules, track equipment, and monitor student-athlete records 
            efficiently in one place.
          </p>
        </div>

        {/* Action Button */}
        <div className="button-wrapper">
          <button className="get-started-btn" onClick={handleStart}>
            GET STARTED
          </button>
        </div>
      </div>
      
      {/* Decorative Circles */}
      <div className="decor-circle circle-1"></div>
      <div className="decor-circle circle-2"></div>
    </div>
  );
};

export default OnboardingScreen;