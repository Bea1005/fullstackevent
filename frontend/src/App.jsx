import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import OnboardingScreen from "./pages/SplashScreen/OnboardingScreen";
import RoleSelection from "./pages/Rolebased/RoleSelection";
import LoginPage from "./pages/LoginSignup/LoginPage";
import RegisterPage from "./pages/LoginSignup/RegisterPage";
import AdminLogin from "./pages/LoginSignup/AdminLogin";
import ScreenerLogin from "./pages/LoginSignup/ScreenerLogin";

// Student Portal
import StudentHomePage from "./pages/StudentPortal/StudentHome";

// Admin Portal
import AdminLayout from "./pages/AdminPortal/AdminLayout";
import AdminDashboard from "./pages/AdminPortal/AdminDashboard";
import AdminCoaches from "./pages/AdminPortal/AdminCoaches";
import AdminRequirements from "./pages/AdminPortal/AdminRequirements";
import AdminStudentAthletes from "./pages/AdminPortal/AdminStudentAthletes";
import AdminSchedules from "./pages/AdminPortal/AdminSchedules";
import AdminEquipments from "./pages/AdminPortal/AdminEquipments";
import AdminBorrowing from "./pages/AdminPortal/AdminBorrowing";
import AdminSettings from "./pages/AdminPortal/AdminSettings";

// Coach Portal
import CoachLayout from "./pages/CoachPortal/CoachLayout";
import CoachHome from "./pages/CoachPortal/CoachHome";

// Screener Portal
import ScreenerPage from "./pages/ScreenerPortal/ScreenerPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<SplashScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/roles" element={<RoleSelection />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/screener-login" element={<ScreenerLogin />} />

        {/* Student Portal */}
        <Route path="/student/home" element={<StudentHomePage />} />

        {/* Admin Portal */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="coaches" element={<AdminCoaches />} />
          <Route path="requirements" element={<AdminRequirements />} />
          <Route path="student-athletes" element={<AdminStudentAthletes />} />
          <Route path="schedules" element={<AdminSchedules />} />
          <Route path="equipments" element={<AdminEquipments />} />
          <Route path="borrowing" element={<AdminBorrowing />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Coach Portal */}
        <Route path="/coach" element={<CoachLayout />}>
          <Route index element={<Navigate to="/coach/home" replace />} />
          <Route path="home" element={<CoachHome />} />
        </Route>

        {/* Screener Portal */}
        <Route path="/screener" element={<ScreenerPage />}>
          <Route index element={<Navigate to="/screener/dashboard" replace />} />
          <Route path="dashboard" element={<ScreenerPage />} />
        </Route>

        {/* 404 fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
