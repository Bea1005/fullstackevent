import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ScreenerPage.css';

const ScreenerPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [screenerDepartment, setScreenerDepartment] = useState('');
  const [stats, setStats] = useState({
    pendingRequirements: 0,
    verifiedRequirements: 0,
    totalStudents: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSport, setFilterSport] = useState('All');
  const [viewingFile, setViewingFile] = useState(null);

  // Predefined sports for dropdown
  const predefinedSports = ['All', 'Basketball', 'Volleyball', 'Soccer', 'Swimming', 'Track and Field', 'Softball', 'Tennis', 'Badminton', 'Chess', 'Table Tennis'];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const assignedDepartment = localStorage.getItem("screenerDepartment");

    if (!token || role !== "screener") {
      alert("Unauthorized access. Please login.");
      navigate("/login");
      return;
    }

    if (assignedDepartment) {
      setScreenerDepartment(assignedDepartment);
    } else {
      setScreenerDepartment("CICS");
    }

    fetchDashboardData();
    fetchStudents();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/screener/dashboard", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.stats) {
          setStats(data.stats);
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/screener/students", {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        // Fallback mock data with Insurance and Profile
        setStudents([
          { 
            id: 101, 
            fullname: 'Bea Dolor Soleta', 
            department: 'CICS', 
            sport: 'Basketball', 
            requirements: { 
              cor: 'submitted', 
              med: 'submitted', 
              psa: 'pending',
              insurance: 'submitted',
              profile: 'submitted'
            }, 
            verificationStatus: 'pending' 
          },
          { 
            id: 102, 
            fullname: 'Hazel Sadiwa', 
            department: 'CICS', 
            sport: 'Volleyball', 
            requirements: { 
              cor: 'submitted', 
              med: 'pending', 
              psa: 'pending',
              insurance: 'pending',
              profile: 'submitted'
            }, 
            verificationStatus: 'pending' 
          },
          { 
            id: 103, 
            fullname: 'Vienna Villaruel', 
            department: 'Education', 
            sport: 'Basketball', 
            requirements: { 
              cor: 'submitted', 
              med: 'submitted', 
              psa: 'submitted',
              insurance: 'submitted',
              profile: 'submitted'
            }, 
            verificationStatus: 'pending' 
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/screener/verify/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setStudents(students.map(student =>
          student.id === id ? { ...student, verificationStatus: status } : student
        ));
        alert(`Student marked as ${status}`);
        fetchDashboardData();
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error verifying student:", error);
      alert("Cannot connect to server");
    }
  };

  // Updated to include INSURANCE and PROFILE
  const renderReqStatus = (status, fileType, studentName, studentId) => {
    if (status === 'submitted') {
      return (
        <button 
          className="btn-view-file" 
          onClick={() => setViewingFile({ type: fileType, name: studentName, id: studentId })}
          title={`View ${fileType.toUpperCase()}`}
        >
          📄 View
        </button>
      );
    }
    return <span className="status-pending">⏳ Pending</span>;
  };

  // Filter students by screener's department
  const departmentStudents = students.filter(student => 
    student.department === screenerDepartment
  );

  // Get unique sports from filtered students
  const sports = departmentStudents.length > 0
    ? ['All', ...new Set(departmentStudents.map(s => s.sport).filter(Boolean))]
    : predefinedSports;

  // Apply search and sport filter
  const filteredStudents = departmentStudents.filter(student => {
    const matchesSearch = student.fullname?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = filterSport === 'All' || student.sport === filterSport;
    return matchesSearch && matchesSport;
  });

  // Calculate stats based on department students only
  const departmentStats = {
    totalStudents: departmentStudents.length,
    pendingRequirements: departmentStudents.filter(s => s.verificationStatus === 'pending').length,
    verifiedRequirements: departmentStudents.filter(s => s.verificationStatus === 'verified').length
  };

  if (loading) {
    return (
      <div className="screener-container">
        <div className="loading-container">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="screener-container">
      <div className="screener-header">
        <h1>Requirement Screening Portal</h1>
        <p className="department-badge">📌 Assigned Department: <strong>{screenerDepartment}</strong></p>
        <p>Validate and verify submitted documents from student athletes.</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>{departmentStats.totalStudents}</h3>
          <p>Total Students ({screenerDepartment})</p>
        </div>
        <div className="stat-card pending">
          <h3>{departmentStats.pendingRequirements}</h3>
          <p>Pending Requirements</p>
        </div>
        <div className="stat-card verified">
          <h3>{departmentStats.verifiedRequirements}</h3>
          <p>Verified Requirements</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-panel">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search athlete name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Sport:</label>
          <select value={filterSport} onChange={(e) => setFilterSport(e.target.value)}>
            {sports.map(sport => <option key={sport} value={sport}>{sport}</option>)}
          </select>
        </div>
      </div>

      {/* Athlete List Table - Added INSURANCE and PROFILE columns */}
      <div className="table-wrapper">
        <table className="screener-table">
          <thead>
            <tr>
              <th>Athlete Name</th>
              <th>Sport</th>
              <th>COR</th>
              <th>MED</th>
              <th>PSA</th>
              <th>INSURANCE</th>
              <th>PROFILE</th>
              <th>Overall Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr key={student.id}>
                  <td className="athlete-name">{student.fullname}</td>
                  <td className="athlete-meta">
                    <span className="sport-badge">{student.sport || 'N/A'}</span>
                  </td>
                  <td className="text-center">
                    {renderReqStatus(student.requirements?.cor || 'pending', 'cor', student.fullname, student.id)}
                  </td>
                  <td className="text-center">
                    {renderReqStatus(student.requirements?.med || 'pending', 'med', student.fullname, student.id)}
                  </td>
                  <td className="text-center">
                    {renderReqStatus(student.requirements?.psa || 'pending', 'psa', student.fullname, student.id)}
                  </td>
                  {/* INSURANCE Column */}
                  <td className="text-center">
                    {renderReqStatus(student.requirements?.insurance || 'pending', 'insurance', student.fullname, student.id)}
                  </td>
                  {/* PROFILE Column */}
                  <td className="text-center">
                    {renderReqStatus(student.requirements?.profile || 'pending', 'profile', student.fullname, student.id)}
                  </td>
                  <td className="text-center">
                    <span className={`status-pill ${student.verificationStatus || 'pending'}`}>
                      {student.verificationStatus || 'pending'}
                    </span>
                  </td>
                  <td className="text-center action-cells">
                    {student.verificationStatus !== 'verified' && (
                      <button className="btn-approve" onClick={() => handleVerify(student.id, 'verified')}>
                        Approve
                      </button>
                    )}
                    {student.verificationStatus !== 'rejected' && (
                      <button className="btn-reject" onClick={() => handleVerify(student.id, 'rejected')}>
                        Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-results">
                  No athletes found in {screenerDepartment} department.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* File Viewer Modal - Updated for Insurance and Profile */}
      {viewingFile && (
        <div className="modal-overlay" onClick={() => setViewingFile(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Viewing {viewingFile.type.toUpperCase()} - {viewingFile.name}</h3>
              <button className="close-modal" onClick={() => setViewingFile(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="file-viewer-container">
                <div className="file-info">
                  <p><strong>Document Type:</strong> {viewingFile.type.toUpperCase()}</p>
                  <p><strong>Student:</strong> {viewingFile.name}</p>
                  <p><strong>Status:</strong> Submitted</p>
                </div>
                <div className="file-preview">
                  {viewingFile.type === 'insurance' && (
                    <div className="insurance-doc">
                      <p>🛡️ Insurance Document</p>
                      <button 
                        className="download-file-btn"
                        onClick={() => alert(`Downloading insurance document for ${viewingFile.name}`)}
                      >
                        📥 Download Insurance File
                      </button>
                    </div>
                  )}
                  {viewingFile.type === 'profile' && (
                    <div className="profile-doc">
                      <p>👤 Student Profile Document</p>
                      <button 
                        className="download-file-btn"
                        onClick={() => alert(`Downloading profile document for ${viewingFile.name}`)}
                      >
                        📥 Download Profile File
                      </button>
                    </div>
                  )}
                  {(viewingFile.type === 'cor' || viewingFile.type === 'med' || viewingFile.type === 'psa') && (
                    <div className="standard-doc">
                      <p>📄 {viewingFile.type.toUpperCase()} Document</p>
                      <button 
                        className="download-file-btn"
                        onClick={() => alert(`Downloading ${viewingFile.type} for ${viewingFile.name}`)}
                      >
                        📥 Download File
                      </button>
                    </div>
                  )}
                  <p className="file-note">(Integration: connect with your file storage URL here)</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-approve" onClick={() => { 
                alert(`Marked ${viewingFile.type} as valid`); 
                setViewingFile(null); 
              }}>
                Mark as Valid
              </button>
              <button className="btn-reject" onClick={() => { 
                alert(`Marked ${viewingFile.type} as invalid`); 
                setViewingFile(null); 
              }}>
                Mark as Invalid
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 

export default ScreenerPage;