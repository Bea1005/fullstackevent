import React, { useState } from 'react';
import './AdminPortal.css';

const StudentAthletes = () => {
  const [athletes, setAthletes] = useState([
    { id: 1, name: 'Bea Soleta', idNum: '23B1509', sport: 'Basketball', status: 'Active' },
    { id: 2, name: 'Juan Dela Cruz', idNum: '22A0982', sport: 'Volleyball', status: 'Active' },
  ]);

  const addAthlete = () => {
    const name = prompt("Student Full Name:");
    const idNum = prompt("Student ID Number:");
    if (name && idNum) {
      setAthletes([...athletes, { id: Date.now(), name, idNum, sport: 'TBD', status: 'Active' }]);
    }
  };

  return (
    <div className="page-container">
      <div className="header-flex">
        <h1>Student-Athletes List</h1>
        <button className="btn-maroon" onClick={addAthlete}>+ Add Athlete</button>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Student ID</th>
              <th>Sport</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {athletes.map(a => (
              <tr key={a.id}>
                <td className="name-cell">
                  <div className="avatar-sm"></div> {a.name}
                </td>
                <td>{a.idNum}</td>
                <td>{a.sport}</td>
                <td><span className="badge active">{a.status}</span></td>
                <td>
                  <button className="btn-icon">✎</button>
                  <button className="btn-icon-del" onClick={() => setAthletes(athletes.filter(x => x.id !== a.id))}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAthletes;