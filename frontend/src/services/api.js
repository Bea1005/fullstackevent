// src/services/api.js
// Use environment override when available, otherwise fall back to the backend base URI.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Server error');
    }
    
    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Auth Endpoints
export const login = async (email, password) => {
  return apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
};

// ✅ UPDATED: Register with student fields
export const register = async (userData) => {
  return apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify({
      fullname: userData.fullname,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      // ✅ ADDED: Student-only fields (will be ignored for coaches)
      department: userData.department || "",
      sport: userData.sport || "",
      studentId: userData.studentId || ""
    }),
  });
};

// Equipment Endpoints
export const getEquipment = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  return apiRequest(`/admin/equipment?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

// ✅ ADDED: Get current user profile
export const getProfile = async () => {
  return apiRequest('/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

// ✅ ADDED: Update user profile
export const updateProfile = async (userData) => {
  return apiRequest('/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(userData),
  });
};

// ✅ ADDED: Get all students (for screener/admin)
export const getStudents = async () => {
  return apiRequest('/screener/students', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

// ✅ ADDED: Verify student requirement (for screener)
export const verifyStudent = async (studentId, status, requirementType, remarks = "") => {
  return apiRequest(`/screener/verify/${studentId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ status, requirementType, remarks }),
  });
};

// Export all
export default { 
  login, 
  register, 
  getEquipment,
  getProfile,
  updateProfile,
  getStudents,
  verifyStudent
};