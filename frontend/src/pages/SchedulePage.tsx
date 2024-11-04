import React, { useEffect, useState } from 'react';
import '../styles/SchedulePage.css'; // Ensure to import the custom CSS file

type FlightSchedule = {
  sid: number;
  flight_no: string;
  arr_time: string;
  arr_airport: string;
  dept_time: string;
  dept_airport: string;
  airid: number;
};

const SchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<FlightSchedule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [newSchedule, setNewSchedule] = useState<Omit<FlightSchedule, 'sid'>>({
    flight_no: '',
    arr_time: '',
    arr_airport: '',
    dept_time: '',
    dept_airport: '',
    airid: 2,
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

  const handleAddSchedule = async () => {
    try {
      const formattedSchedule = {
        flight_no: newSchedule.flight_no,
        dept_time: `${newSchedule.dept_time.split('T')[0]} , ${newSchedule.dept_time.split('T')[1]}`,
        arr_time: `${newSchedule.arr_time.split('T')[0]} , ${newSchedule.arr_time.split('T')[1]}`,
        dept_airport: newSchedule.dept_airport,
        arr_airport: newSchedule.arr_airport,
        airid: newSchedule.airid,
      };

      const response = await fetch('http://localhost:8000/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedSchedule),
      });
      if (response.ok) {
        fetchSchedules(); // Refresh the schedule list
        setNewSchedule({
          flight_no: '',
          arr_time: '',
          arr_airport: '',
          dept_time: '',
          dept_airport: '',
          airid: 2,
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
                type="text"
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
                  value={newSchedule.arr_time.split('T')[1]}
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
                  value={newSchedule.dept_time.split('T')[1]}
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
              <td>{member.arr_time}</td>
              <td>{member.arr_airport}</td>
              <td>{member.dept_time}</td>
              <td>{member.dept_airport}</td>
              <td>
                <i className="bi bi-trash text-danger" onClick={() => handleRemoveSchedule(member.sid)} style={{ cursor: 'pointer' }}></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchedulePage;
