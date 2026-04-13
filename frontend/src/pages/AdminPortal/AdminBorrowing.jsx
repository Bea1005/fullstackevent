import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPortal.css';

const Borrowing = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEquipments, setTotalEquipments] = useState(0);
  const [newTransaction, setNewTransaction] = useState({
    Name: '',
    equipment: '',
    quantity: 1
  });

  const equipments = [
    'Basketball (Spalding)',
    'Soccer Ball (Size 5)',
    'Tennis Racket (Wilson)',
    'Volleyball (Mikasa)',
    'Swimming Goggles',
    'Track Spikes'
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || role !== 'admin') {
      alert("Please login as admin");
      navigate("/admin-login");
      return;
    }
    
    fetchBorrowingRecords();
    fetchTotalEquipments(); // ✅ Added to get total equipments
  }, []);

  // ✅ NEW: Fetch total equipments from equipment inventory
  const fetchTotalEquipments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/equipment", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Calculate total equipments from the data
        if (data.data) {
          const total = data.data.reduce((sum, item) => sum + (item.total || 0), 0);
          setTotalEquipments(total);
        } else if (Array.isArray(data)) {
          const total = data.reduce((sum, item) => sum + (item.total || 0), 0);
          setTotalEquipments(total);
        }
      } else {
        // Fallback to default if API fails
        setTotalEquipments(156);
      }
    } catch (error) {
      console.error("Error fetching total equipments:", error);
      setTotalEquipments(156);
    }
  };

  const fetchBorrowingRecords = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/borrowing", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewTransaction = async (e) => {
    e.preventDefault();
    
    if (!newTransaction.Name || !newTransaction.equipment || !newTransaction.quantity) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/borrowing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          Name: newTransaction.Name,
          equipment: newTransaction.equipment,
          quantity: parseInt(newTransaction.quantity)
        })
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords([newRecord, ...records]);
        setNewTransaction({ Name: '', equipment: '', quantity: 1 });
        alert("Transaction confirmed successfully!");
        fetchTotalEquipments(); // ✅ Refresh total equipments after transaction
      } else {
        const error = await response.json();
        alert(error.message || "Transaction failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Cannot connect to server");
    }
  };

  const handleReturn = async (id) => {
    if (window.confirm("Confirm return of this item?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/admin/borrowing/${id}/return`, {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          setRecords(records.map(r => 
            r.id === id ? { ...r, status: 'Completed' } : r
          ));
          alert("Item returned successfully!");
          fetchTotalEquipments(); // ✅ Refresh total equipments after return
        } else {
          alert("Failed to return item");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Cannot connect to server");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this borrowing record? This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/admin/borrowing/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          setRecords(records.filter(record => record.id !== id));
          alert("Borrowing record deleted successfully!");
          fetchTotalEquipments(); // ✅ Refresh total equipments after delete
        } else {
          const error = await response.json();
          alert(error.message || "Failed to delete record");
        }
      } catch (error) {
        console.error("Error deleting record:", error);
        alert("Cannot connect to server");
      }
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Out Now':
        return { class: 'status-out', label: 'OUT NOW' };
      case 'Completed':
        return { class: 'status-completed', label: 'COMPLETED' };
      default:
        return { class: 'status-pending', label: status };
    }
  };

  const itemsOut = records.filter(r => r.status === 'Out Now').reduce((sum, r) => sum + r.quantity, 0);

  if (loading) {
    return <div className="admin-borrowing"><div className="loading-container">Loading records...</div></div>;
  }

  return (
    <div className="admin-borrowing">
      <h1 className="page-title">Equipment Borrowing Management</h1>
      
      <div className="borrowing-stats">
        <div className="stat-card-small">
          <p className="stat-label">TOTAL EQUIPMENTS</p>
          <p className="stat-value">{totalEquipments}</p>
        </div>
        <div className="stat-card-small">
          <p className="stat-label">ITEMS OUT</p>
          <p className="stat-value">{itemsOut}</p>
        </div>
      </div>

      <div className="transaction-form-container">
        <h2>NEW BORROWER</h2>
        <p className="form-subtitle">Fill out the borrowing details below.</p>
        
        <form onSubmit={handleNewTransaction} className="borrowing-form">
          <div className="form-group">
            <label>FULL NAME</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Prof. Juan Dela Cruz"
              value={newTransaction.Name}
              onChange={(e) => setNewTransaction({...newTransaction, Name: e.target.value})}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>EQUIPMENT</label>
              <select
                className="form-input"
                value={newTransaction.equipment}
                onChange={(e) => setNewTransaction({...newTransaction, equipment: e.target.value})}
                required
              >
                <option value="">Select Item...</option>
                {equipments.map(eq => (
                  <option key={eq} value={eq}>{eq}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>QUANTITY</label>
              <input
                type="number"
                className="form-input"
                min="1"
                value={newTransaction.quantity}
                onChange={(e) => setNewTransaction({...newTransaction, quantity: parseInt(e.target.value)})}
                required
              />
            </div>
          </div>
          
          <button type="submit" className="confirm-btn">CONFIRM LOG</button>
        </form>
      </div>

      <div className="historical-records">
        <h2>HISTORICAL RECORDS</h2>
        
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EQUIPMENT</th>
                <th>QTY</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan="6" className="no-data">No borrowing records found</td></tr>
              ) : (
                records.map(record => {
                  const status = getStatusBadge(record.status);
                  return (
                    <tr key={record.id}>
                      <td className="teacher-name">{record.Name}</td>
                      <td>{record.equipment}</td>
                      <td>{record.quantity}</td>
                      <td>{record.date}</td>
                      <td><span className={`status-badge ${status.class}`}>{status.label}</span></td>
                      <td className="action-buttons">
                        {record.status === 'Out Now' && (
                          <button className="return-btn" onClick={() => handleReturn(record.id)} title="Return Item">
                            🔄 RETURN
                          </button>
                        )}
                        <button className="delete-btn" onClick={() => handleDelete(record.id)} title="Delete Record">
                          🗑️ DELETE
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Borrowing;