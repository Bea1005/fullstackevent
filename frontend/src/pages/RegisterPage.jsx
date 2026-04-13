// src/pages/Register.jsx
const handleRegister = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/register', {  // use proxy to backend /api/v1
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullname,
        username,
        email,
        password,
        role  // 'student', 'coach', or 'admin'
      }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message); // Should say "Registration successful as [role]"
      // Redirect to login page
      window.location.href = '/login';
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Cannot connect to server. Please check if backend is running.');
  }
};