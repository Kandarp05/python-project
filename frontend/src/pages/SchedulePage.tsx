import React, { useEffect, useState } from 'react';

type FlightSchedule = {
  id: number;
  flight_no: number;
  arrivalTime: string;
  arrivalAirport: string;
  departureTime: string;
  departureAirport: string;
  airid: number;
};

const SchedulePage: React.FC = () => {
  const [schedules, setSchedules] = useState<FlightSchedule[]>([]);
  const [error, setError] = useState<string | null>(null);

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
        setSchedules(schedules.filter(schedule => schedule.id !== id));
      } else {
        setError('Failed to remove schedule.');
      }
    } catch (error) {
      setError('Error removing schedule.');
    }
  };

  return (
    <div>
      <h1>Schedule</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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
            <tr key={member.id}>
              <td scope='row'>{member.flight_no}</td>
              <td>{member.arrivalTime}</td>
              <td>{member.arrivalAirport}</td>
              <td>{member.departureTime}</td>
              <td>{member.departureAirport}</td>
              <td>
                <i className="bi bi-trash text-danger" onClick={() => handleRemoveSchedule(member.id)} style={{ cursor: 'pointer' }}></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SchedulePage;
