import { login } from "../services/api";
const handleLogin = async () => {
  try {
    const data = await login(email, password);

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    alert("Login successful!");
    navigate("/student/home");
  } catch (error) {
    alert(error.message);
  }
};
