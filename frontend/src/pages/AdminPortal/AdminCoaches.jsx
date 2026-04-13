import React, { useState } from 'react';

const Coaches = () => {
  const [coaches, setCoaches] = useState([
    { id: 1, name: 'Asta', sport: 'Volleyball', email: 'asta@gym.edu', status: 'Active' },
    { id: 2, name: 'Yuno', sport: 'Basketball', email: 'yuno@gym.edu', status: 'Active' },
  ]);

  // CREATE
  const addRecord = () => {
    const name = prompt("Enter Coach Name:");
    const sport = prompt("Enter Sport:");
    if (name && sport) {
      setCoaches([...coaches, { id: Date.now(), name, sport, email: `${name.toLowerCase()}@gym.edu`, status: 'Active' }]);
    }
  };

  // DELETE
  const deleteRecord = (id) => {
    if(window.confirm("Delete this record?")) {
      setCoaches(coaches.filter(c => c.id !== id));
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-header-flex">
        <h1>COACHES LIST</h1>
        <div className="actions">
          <button className="btn-add" onClick={addRecord}>+ Add Records</button>
        </div>
      </div>

      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Sport</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {coaches.map(coach => (
              <tr key={coach.id}>
                <td>{coach.name}</td>
                <td>{coach.sport}</td>
                <td>{coach.email}</td>
                <td><span className="badge-active">{coach.status}</span></td>
                <td>
                  <button className="btn-edit">✎</button>
                  <button className="btn-del" onClick={() => deleteRecord(coach.id)}>🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coaches;