import { useNavigate } from "react-router-dom";
import RoleSelection from "./RoleSelection";

export default function RoleSelectionWrapper() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    // ✅ ADD THIS: pass role to next page
    navigate("/login", { state: { role } });
  };

  return <RoleSelection onSelect={handleSelect} />;
}