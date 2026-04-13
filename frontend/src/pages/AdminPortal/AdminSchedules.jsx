import React, { useState } from 'react';
import './AdminPortal.css';

const AdminSchedules = () => {
  const [reservations, setReservations] = useState([
    { id: 1, event: 'Acquaintance Party', startDate: '2026-03-25', endDate: '2026-03-25', startTime: '01:00 PM', endTime: '05:00 PM' },
    { id: 2, event: 'CICS WEEK 2026', startDate: '2026-04-10', endDate: '2026-04-10', startTime: '08:00 AM', endTime: '12:00 PM' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [formData, setFormData] = useState({
    event: '',
    startDate: '',
    endDate: '',
    startTime: '08:00 AM',
    endTime: '12:00 PM'
  });

  // Get current month dates for calendar
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const currentDate = new Date();
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const handleDateClick = (day) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setFormData({
      event: '',
      startDate: dateStr,
      endDate: dateStr,
      startTime: '08:00 AM',
      endTime: '12:00 PM'
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.event) {
      return alert("Error: Please enter an event name.");
    }
    if (!formData.startDate) {
      return alert("Error: Please select a start date.");
    }
    if (!formData.endDate) {
      return alert("Error: Please select an end date.");
    }
    
    const newEntry = {
      id: Date.now(),
      event: formData.event,
      startDate: formData.startDate,
      endDate: formData.endDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
    };

    setReservations([newEntry, ...reservations]);
    alert(`Success: "${formData.event}" has been scheduled on ${formData.startDate}!`);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      event: '',
      startDate: '',
      endDate: '',
      startTime: '08:00 AM',
      endTime: '12:00 PM'
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      setReservations(reservations.filter(res => res.id !== id));
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get events for a specific date
  const getEventsForDate = (dateStr) => {
    return reservations.filter(r => r.startDate === dateStr || r.endDate === dateStr);
  };

  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const eventsOnDate = getEventsForDate(dateStr);
    const hasEvent = eventsOnDate.length > 0;
    
    calendarDays.push(
      <div 
        key={day} 
        className={`calendar-day ${hasEvent ? 'has-event' : ''}`}
        onClick={() => handleDateClick(day)}
      >
        <span className="day-number">{day}</span>
        {hasEvent && (
          <div className="calendar-event-info">
            {eventsOnDate.slice(0, 2).map((event, idx) => (
              <div key={idx} className="mini-event">
                <span className="event-dot">●</span>
                <span className="event-name">{event.event.length > 15 ? event.event.substring(0, 12) + '...' : event.event}</span>
                <span className="event-time">{event.startTime}</span>
              </div>
            ))}
            {eventsOnDate.length > 2 && (
              <div className="more-events">+{eventsOnDate.length - 2} more</div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Sort reservations by date (upcoming first)
  const sortedReservations = [...reservations].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <div className="admin-page-content">
      <div className="page-header-container">
        <div className="header-text">
          <h1 className="main-title">Gymnasium Scheduling</h1>
          <p className="sub-title-desc">Schedule and manage all gymnasium activities and reservations in one place.</p>
        </div>
      </div>

      <hr className="divider" />

      {/* Calendar Section */}
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={handlePrevMonth} className="calendar-nav-btn">◀ Previous</button>
          <h2>{monthNames[currentMonth]} {currentYear}</h2>
          <button onClick={handleNextMonth} className="calendar-nav-btn">Next ▶</button>
        </div>
        
        <div className="calendar-weekdays">
          {dayNames.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>
        
        <div className="calendar-grid">
          {calendarDays}
        </div>
        
        <div className="calendar-legend">
          <span className="legend-dot"></span> Has Schedule
        </div>
      </div>

      {/* Schedule List */}
      <div className="schedule-list-container">
        <div className="yellow-table-wrapper">
          <div className="list-header">
            <h3 className="table-title">Upcoming Schedules</h3>
            <span className="count-badge">{reservations.length} Schedules Found</span>
          </div>
          <div className="table-responsive">
            <table className="admin-schedule-table">
              <thead>
                <tr>
                  <th>Event Title</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Time Slot</th>
                  <th style={{textAlign: 'center'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedReservations.length > 0 ? (
                  sortedReservations.map((res) => (
                    <tr key={res.id}>
                      <td className="bold-maroon">{res.event}</td>
                      <td>{res.startDate}</td>
                      <td>{res.endDate}</td>
                      <td>{res.startTime} - {res.endTime}</td>
                      <td style={{textAlign: 'center'}}>
                        <button className="btn-cancel-action" onClick={() => handleDelete(res.id)}>Cancel</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">No schedules found. Click on a date to create one.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Popup for Schedule Form */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content schedule-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📅 Create Schedule for {selectedDate}</h3>
              <button className="close-modal" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group full-width">
                <label>Event Name *</label>
                <input 
                  type="text" 
                  placeholder="e.g., Basketball Tournament" 
                  value={formData.event} 
                  onChange={(e) => setFormData({...formData, event: e.target.value})} 
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date *</label>
                  <input 
                    type="date" 
                    value={formData.startDate} 
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Start Time *</label>
                  <select 
                    value={formData.startTime} 
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    required
                  >
                    <option value="12:00 AM">12:00 AM</option>
                    <option value="01:00 AM">01:00 AM</option>
                    <option value="02:00 AM">02:00 AM</option>
                    <option value="03:00 AM">03:00 AM</option>
                    <option value="04:00 AM">04:00 AM</option>
                    <option value="05:00 AM">05:00 AM</option>
                    <option value="06:00 AM">06:00 AM</option>
                    <option value="07:00 AM">07:00 AM</option>
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                    <option value="09:00 PM">09:00 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                    <option value="11:00 PM">11:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>End Date *</label>
                  <input 
                    type="date" 
                    value={formData.endDate} 
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time *</label>
                  <select 
                    value={formData.endTime} 
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    required
                  >
                    <option value="12:00 AM">12:00 AM</option>
                    <option value="01:00 AM">01:00 AM</option>
                    <option value="02:00 AM">02:00 AM</option>
                    <option value="03:00 AM">03:00 AM</option>
                    <option value="04:00 AM">04:00 AM</option>
                    <option value="05:00 AM">05:00 AM</option>
                    <option value="06:00 AM">06:00 AM</option>
                    <option value="07:00 AM">07:00 AM</option>
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                    <option value="09:00 PM">09:00 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                    <option value="11:00 PM">11:00 PM</option>
                  </select>
                </div>
              </div>

              <div className="modal-buttons">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="confirm-btn">Confirm Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchedules;