import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import OnboardingScreen from "./pages/SplashScreen/OnboardingScreen";
import RoleSelection from "./pages/Rolebased/RoleSelection";
import LoginPage from "./pages/LoginSignup/LoginPage";
import RegisterPage from "./pages/LoginSignup/RegisterPage";
import AdminLogin from "./pages/LoginSignup/AdminLogin";
import ScreenerLogin from "./pages/LoginSignup/ScreenerLogin";

// Student Portal Pages - Only Home Page
import StudentHomePage from "./pages/StudentPortal/StudentHome";

// Admin Portal Pages
import AdminLayout from "./pages/AdminPortal/AdminLayout";
import AdminDashboard from "./pages/AdminPortal/AdminDashboard";
import AdminCoaches from "./pages/AdminPortal/AdminCoaches";
import AdminRequirements from "./pages/AdminPortal/AdminRequirements";
import AdminStudentAthletes from "./pages/AdminPortal/AdminStudentAthletes";
import AdminSchedules from "./pages/AdminPortal/AdminSchedules";
import AdminEquipments from "./pages/AdminPortal/AdminEquipments";
import AdminBorrowing from "./pages/AdminPortal/AdminBorrowing";
import AdminSettings from "./pages/AdminPortal/AdminSettings";

// Coach Portal Pages - Only Home Page
import CoachLayout from "./pages/CoachPortal/CoachLayout";
import CoachHome from "./pages/CoachPortal/CoachHome";

// Screener Portal Pages
import ScreenerLayout from "./pages/ScreenerPortal/ScreenerPage";
import ScreenerPage from "./pages/ScreenerPortal/ScreenerPage";

function App() {
  console.log("App is rendering!");
  
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

        {/* Student Portal Routes - Only Home Page */}
        <Route path="/student/home" element={<StudentHomePage />} />

        {/* Admin Portal Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="coaches" element={<AdminCoaches />} />
          <Route path="requirements" element={<AdminRequirements />} />
          <Route path="student-athletes" element={<AdminStudentAthletes />} />
          <Route path="schedules" element={<AdminSchedules />} />
          <Route path="equipments" element={<AdminEquipments />} />
          <Route path="borrowing" element={<AdminBorrowing />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Coach Portal Routes - Only Home Page */}
        <Route path="/coach" element={<CoachLayout />}>
          <Route index element={<Navigate to="/coach/home" />} />
          <Route path="home" element={<CoachHome />} />
        </Route>

        {/* Screener Portal Routes */}
        <Route path="/screener" element={<ScreenerLayout />}>
          <Route index element={<Navigate to="/screener/dashboard" />} />
          <Route path="dashboard" element={<ScreenerPage />} />
        </Route>

        {/* Catch-all route for 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;