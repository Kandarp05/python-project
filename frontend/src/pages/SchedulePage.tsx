import React, { useEffect, useState } from 'react';
import '../styles/SchedulePage.css'; // Ensure to import the custom CSS file

type FlightSchedule = {
  sid: number;
  flight_no: string;
  arr_time: string; // This will be formatted to "MM/DD/YY, HH:MM"
  arr_airport: string;
  dept_time: string; // This will be formatted to "MM/DD/YY, HH:MM"
  dept_airport: string;
};

const SchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<FlightSchedule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [newSchedule, setNewSchedule] = useState<FlightSchedule>({
    sid: 0,
    flight_no: '',
    arr_time: '',
    arr_airport: '',
    dept_time: '',
    dept_airport: '',
  });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('http://localhost:8000/schedule');
      const data = await response.json();
      setSchedules(data);
    } catch (error) {
      setError('Failed to load flight schedules.');
    }
  };

  const handleRemoveSchedule = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/schedule/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setSchedules(schedules.filter(schedule => schedule.sid !== id));
      } else {
        setError('Failed to remove schedule.');
      }
    } catch (error) {
      setError('Error removing schedule.');
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`);
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = String(dateObj.getFullYear()).slice(-2); // Get last 2 digits of year
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}`; // Adjusted formatting
  };

  const handleAddSchedule = async () => {
    const formattedDeptTime = formatDateTime(newSchedule.dept_time.split('T')[0], newSchedule.dept_time.split('T')[1]);
    const formattedArrTime = formatDateTime(newSchedule.arr_time.split('T')[0], newSchedule.arr_time.split('T')[1]);

    const scheduleToAdd = {
      flight_no: newSchedule.flight_no,
      dept_time: formattedDeptTime,
      arr_time: formattedArrTime,
      dept_airport: newSchedule.dept_airport,
      arr_airport: newSchedule.arr_airport,
      airid: 2, // Hardcoded airid
    };

    try {
      const response = await fetch('http://localhost:8000/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleToAdd),
      });
      if (response.ok) {
        fetchSchedules(); // Refresh the schedule list
        setNewSchedule({
          sid: 0,
          flight_no: '',
          arr_time: '',
          arr_airport: '',
          dept_time: '',
          dept_airport: '',
        }); // Reset the form
        setIsFormOpen(false); // Close the form
      } else {
        setError('Failed to add schedule.');
      }
    } catch (error) {
      setError('Error adding schedule.');
    }
  };

  return (
    <div className="table-container">
      <h1>Flight Schedule</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="add-schedule-container">
        <div className="add-schedule-div" onClick={() => setIsFormOpen(!isFormOpen)}>
          <span>Add Flight Schedule</span>
          <i className={`bi ${isFormOpen ? 'bi-arrow-up' : 'bi-arrow-down'}`}></i>
        </div>
        {isFormOpen && (
          <div className="add-schedule-form">
            <h2 className="form-title">New Flight Schedule</h2>
            <div className="form-group">
              <label className="form-label">Flight No.</label>
              <input
                type="text" // Change type to "text" for flight number
                className="form-control"
                value={newSchedule.flight_no}
                onChange={(e) => setNewSchedule({ ...newSchedule, flight_no: e.target.value })}
                placeholder="Enter Flight Number"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Arrival Time</label>
              <div className="time-inputs">
                <input
                  type="date"
                  className="form-control date-input"
                  value={newSchedule.arr_time.split('T')[0]}
                  onChange={(e) => setNewSchedule({ ...newSchedule, arr_time: e.target.value + 'T' + newSchedule.arr_time.split('T')[1] })}
                />
                <input
                  type="time"
                  className="form-control time-input"
                  value={newSchedule.arr_time.split('T')[1] || '00:00'} // Default time if not set
                  onChange={(e) => setNewSchedule({ ...newSchedule, arr_time: newSchedule.arr_time.split('T')[0] + 'T' + e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Arrival Airport</label>
              <input
                type="text"
                className="form-control"
                value={newSchedule.arr_airport}
                onChange={(e) => setNewSchedule({ ...newSchedule, arr_airport: e.target.value })}
                placeholder="Enter Arrival Airport"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Departure Time</label>
              <div className="time-inputs">
                <input
                  type="date"
                  className="form-control date-input"
                  value={newSchedule.dept_time.split('T')[0]}
                  onChange={(e) => setNewSchedule({ ...newSchedule, dept_time: e.target.value + 'T' + newSchedule.dept_time.split('T')[1] })}
                />
                <input
                  type="time"
                  className="form-control time-input"
                  value={newSchedule.dept_time.split('T')[1] || '00:00'} // Default time if not set
                  onChange={(e) => setNewSchedule({ ...newSchedule, dept_time: newSchedule.dept_time.split('T')[0] + 'T' + e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Departure Airport</label>
              <input
                type="text"
                className="form-control"
                value={newSchedule.dept_airport}
                onChange={(e) => setNewSchedule({ ...newSchedule, dept_airport: e.target.value })}
                placeholder="Enter Departure Airport"
              />
            </div>
            <button className="btn add-schedule-btn" onClick={handleAddSchedule}>Add Schedule</button>
          </div>
        )}
      </div>

      <table className='table table-bordered'>
        <thead className='table-dark'>
          <tr>
            <th scope='col'>Flight No.</th>
            <th scope='col'>Arr. Time</th>
            <th scope='col'>Arr. Airport</th>
            <th scope='col'>Dept. Time</th>
            <th scope='col'>Dept. Airport</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(member => (
            <tr key={member.sid}>
              <td scope='row'>{member.flight_no}</td>
              <td>{formatDateTime(member.arr_time.split('T')[0], member.arr_time.split('T')[1] || '00:00')}</td>
              <td>{member.arr_airport}</td>
              <td>{formatDateTime(member.dept_time.split('T')[0], member.dept_time.split('T')[1] || '00:00')}</td>
              <td>{member.dept_airport}</td>
              <td>
                <button className='btn btn-danger' onClick={() => handleRemoveSchedule(member.sid)}>Remove</button>
              </td>
            </tr>
          ))}
          {schedules.length === 0 && (
            <tr>
              <td colSpan={6} className='text-center'>No flight schedules available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SchedulePage;
