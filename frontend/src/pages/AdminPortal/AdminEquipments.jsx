import React, { useState, useEffect } from 'react';
import './AdminPortal.css';

const AdminInventory = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: '', category: 'Balls', total: '', condition: 'Good' });
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch equipment from database
  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/equipment", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error("Failed to fetch equipment");
        setItems([]);
      }
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.total) {
      alert("Please provide item name and quantity.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/admin/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newItem.name,
          category: newItem.category,
          total: parseInt(newItem.total),
          condition: newItem.condition
        })
      });

      if (response.ok) {
        const newEquipment = await response.json();
        setItems([newEquipment, ...items]);
        setNewItem({ name: '', category: 'Balls', total: '', condition: 'Good' });
        alert("Equipment added successfully!");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to add equipment");
      }
    } catch (error) {
      console.error("Error adding equipment:", error);
      alert("Cannot connect to server");
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditingName(item.name);
  };

  const saveEdit = async (id) => {
    if (!editingName.trim()) {
      alert("Please enter a name");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/admin/equipment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name: editingName })
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setItems(items.map(item => 
          item.id === id ? { ...item, name: updatedItem.name } : item
        ));
        setEditingId(null);
        setEditingName("");
        alert("Equipment updated successfully!");
      } else {
        alert("Failed to update equipment");
      }
    } catch (error) {
      console.error("Error updating equipment:", error);
      alert("Cannot connect to server");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const deleteItem = async (id) => {
    if (window.confirm("Delete this equipment from record?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`/api/admin/equipment/${id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.ok) {
          setItems(items.filter(item => item.id !== id));
          alert("Equipment deleted successfully!");
        } else {
          alert("Failed to delete equipment");
        }
      } catch (error) {
        console.error("Error deleting equipment:", error);
        alert("Cannot connect to server");
      }
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate stats
  const totalItems = items.reduce((acc, curr) => acc + curr.total, 0);
  const inStock = items.reduce((acc, curr) => acc + curr.available, 0);
  const underRepair = items.filter(i => i.condition === 'Poor').length;

  if (loading) {
    return (
      <div className="admin-page-content">
        <div className="loading-container">Loading equipment inventory...</div>
      </div>
    );
  }

  return (
    <div className="admin-page-content">
      <div className="page-header-container">
        <div className="header-text">
          <h1 className="main-title">Equipment Inventory</h1>
          <p className="sub-title-desc">Track, update, and manage all gymnasium sports assets.</p>
        </div>
      </div>

      {/* STATS SUMMARY CARDS */}
      <div className="inventory-stats-row">
        <div className="stat-card gold-border">
          <span>Total Items</span>
          <h2>{totalItems}</h2>
        </div>
        <div className="stat-card maroon-border">
          <span>In Stock</span>
          <h2>{inStock}</h2>
        </div>
        <div className="stat-card grey-border">
          <span>Under Repair</span>
          <h2>{underRepair}</h2>
        </div>
      </div>

      <hr className="divider" />

      {/* ADD EQUIPMENT FORM */}
      <div className="create-schedule-box">
        <div className="maroon-form-container">
          <div className="form-header-maroon">
            <h3>📦 Register New Equipment</h3>
          </div>
          <form className="schedule-form-grid" onSubmit={handleAdd}>
            <div className="input-field">
              <label>Equipment Name</label>
              <input 
                type="text" 
                placeholder="e.g. Badminton Racket" 
                value={newItem.name} 
                onChange={(e) => setNewItem({...newItem, name: e.target.value})} 
                className="white-input" 
                required
              />
            </div>
            <div className="input-field">
              <label>Category</label>
              <select 
                className="white-input modern-select" 
                value={newItem.category} 
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              >
                <option value="Balls">Balls</option>
                <option value="Rackets">Rackets / Bats</option>
                <option value="Net">Nets</option>
                <option value="General">General Gear</option>
              </select>
            </div>
            <div className="input-field">
              <label>Total Quantity</label>
              <input 
                type="number" 
                placeholder="0" 
                value={newItem.total} 
                onChange={(e) => setNewItem({...newItem, total: e.target.value})} 
                className="white-input" 
                required
              />
            </div>
            <div className="input-field">
              <label>Initial Condition</label>
              <select 
                className="white-input modern-select" 
                value={newItem.condition} 
                onChange={(e) => setNewItem({...newItem, condition: e.target.value})}
              >
                <option value="Good">New / Good</option>
                <option value="Fair">Fair / Used</option>
                <option value="Poor">Needs Repair</option>
              </select>
            </div>
            <button type="submit" className="save-schedule-btn">Add to Inventory</button>
          </form>
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="schedule-list-container">
        <div className="yellow-table-wrapper">
          <div className="list-header">
            <h3 className="table-title">Equipment Master List</h3>
            <div className="table-filters">
              <input 
                type="text" 
                placeholder="Filter items..." 
                className="mini-search" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <table className="admin-schedule-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Category</th>
                <th>Total Stock</th>
                <th>On-Hand</th>
                <th>Condition</th>
                <th style={{textAlign: 'center'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">No equipment found</td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id}>
                    <td className="bold-maroon">
                      {editingId === item.id ? (
                        <div className="edit-mode">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="edit-input"
                            autoFocus
                          />
                          <button className="save-btn" onClick={() => saveEdit(item.id)}>Save</button>
                          <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                        </div>
                      ) : (
                        <span className="item-name">{item.name}</span>
                      )}
                    </td>
                    <td><span className="category-pill">{item.category}</span></td>
                    <td>{item.total}</td>
                    <td>
                      <strong style={{color: item.available < 5 ? '#e03131' : '#2ecc71'}}>
                        {item.available}
                      </strong>
                    </td>
                    <td>
                      <span className={`condition-tag ${item.condition.toLowerCase()}`}>
                        {item.condition}
                      </span>
                    </td>
                    <td style={{textAlign: 'center'}}>
                      {editingId !== item.id && (
                        <button className="btn-edit-small" onClick={() => startEdit(item)}>✎</button>
                      )}
                      <button className="btn-delete-small" onClick={() => deleteItem(item.id)}>🗑</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;