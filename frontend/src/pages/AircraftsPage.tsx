import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/AircraftsPage.css'

type Aircrafts = {
  airid: number;
  model: string;
  manufacturer: string;
  manu_date: string;
  capacity: number;
  air_range: number;
  reg_no: string;
  cid: number;
};

const AircraftsPage: React.FC = () => {
  const [aircrafts, setAircrafts] = useState<Aircrafts[]>([]);
  const [newAircrafts, setNewAircrafts] = useState<Aircrafts>({
    airid: 0,
    model: '',
    manufacturer: '',
    manu_date: '',
    capacity: 0,
    air_range: 0,
    reg_no: '',
    cid: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAircrafts();
  }, []);

  const fetchAircrafts = async () => {
    try {
      const response = await fetch('http://localhost:8000/aircrafts');
      const data = await response.json();
      setAircrafts(data);
    } catch (error) {
      setError('Failed to load aircrafts.');
    }
  };

  const handleAddAircrafts = async () => {
    try {
      const response = await fetch('http://localhost:8000/aircrafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAircrafts),
      });

      if (response.ok) {
        fetchAircrafts(); // Refresh the list after adding
        setNewAircrafts({ 
          airid: 0, 
          model: '', 
          manufacturer: '', 
          manu_date: '',
          capacity: 0,
          air_range: 0,
          reg_no: '',
          cid: 0,
        });
      } else {
        setError('Failed to add aircraft.');
      }
    } catch (error) {
      setError('Error adding aircraft.');
    }
  };

  const handleRemoveAircrafts = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/aircrafts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setAircrafts(aircrafts.filter(aircraft => aircraft.airid !== id));
      } else {
        setError('Failed to remove aircraft.');
      }
    } catch (error) {
      setError('Error removing aircraft.');
    }
  };

  return (
    <div className="table-container">
      <h1>Aircrafts</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <table className='table table-bordered'>
        <thead className='table-dark'>
          <tr>
            <th scope='col'>Model</th>
            <th scope='col'>Manufacturer</th>
            <th scope='col'>Manufacturing Date</th>
            <th scope='col'>Capacity</th>
            <th scope='col'>Range (km)</th>
            <th scope='col'>Reg No.</th>
            <th scope='col'>Logs</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {aircrafts.map(aircraft => (
            <tr key={aircraft.airid}>
              <td scope='row'>{aircraft.model}</td>
              <td>{aircraft.manufacturer}</td>
              <td>{aircraft.manu_date}</td>
              <td>{aircraft.capacity}</td>
              <td>{aircraft.air_range}</td>
              <td>{aircraft.reg_no}</td>
              <td>
                <Link to={`/aircrafts/${aircraft.airid}/maintenance`}>Maintenance Logs</Link>
              </td>
              <td>
                <i className="bi bi-trash text-danger" onClick={() => handleRemoveAircrafts(aircraft.airid)} style={{ cursor: 'pointer' }}></i>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                type="text"
                value={newAircrafts.model}
                placeholder='e.g., A652'
                onChange={(e) => setNewAircrafts({ ...newAircrafts, model: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newAircrafts.manufacturer}
                placeholder='e.g., Airbus'
                onChange={(e) => setNewAircrafts({ ...newAircrafts, manufacturer: e.target.value })}
              />
            </td>
            <td>
              <input
                type="date"
                value={newAircrafts.manu_date}
                onChange={(e) => setNewAircrafts({ ...newAircrafts, manu_date: e.target.value })}
              />
            </td>
            <td>
              <input
                type="number"
                value={newAircrafts.capacity}
                placeholder='Max passengers'
                onChange={(e) => setNewAircrafts({ ...newAircrafts, capacity: parseInt(e.target.value) })}
              />
            </td>
            <td>
              <input
                type="number"
                value={newAircrafts.air_range}
                placeholder='Max range in km'
                onChange={(e) => setNewAircrafts({ ...newAircrafts, air_range: parseInt(e.target.value) })}
              />
            </td>
            <td colSpan={2}>
              <input
                type="text"
                value={newAircrafts.reg_no}
                placeholder='e.g., N12345'
                onChange={(e) => setNewAircrafts({ ...newAircrafts, reg_no: e.target.value })}
              />
            </td>
            <td>
              <i className="bi bi-plus-circle-fill text-success" onClick={handleAddAircrafts} style={{ cursor: 'pointer' }}></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AircraftsPage;
