import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Aircrafts = {
  id: number;
  model: string;
  manufacturer: string;
  manu_date: string;
  capacity: number;
  range: number,
  registration_no: string;
  cid: number;
};

const AircraftsPage: React.FC = () => {
  const [Aircrafts, setAircrafts] = useState<Aircrafts[]>([]);
  const [newAircrafts, setNewAircrafts] = useState<Aircrafts>({
    id: 0,
    model: '',
    manufacturer: '',
    manu_date: '',
    capacity: 0,
    range: 0,
    registration_no: '',
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
      setError('Failed to load aircafts.');
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
          id: 0, 
          model: '', 
          manufacturer: '', 
          manu_date: '',
          capacity: 0,
          range: 0,
          registration_no: '',
          cid : 0,
        });
      } else {
        setError('Failed to add crew member.');
      }
    } catch (error) {
      setError('Error adding crew member.');
    }
  };

  const handleRemoveAircrafts = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/aircrafts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setAircrafts(Aircrafts.filter(member => member.id !== id));
      } else {
        setError('Failed to remove crew member.');
      }
    } catch (error) {
      setError('Error removing crew member.');
    }
  };

  return (
    <div>
      <h1>Aircrafts</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <table className='table table-bordered'>
        <thead className='table-dark'>
          <tr>
            <th scope='col'>Model</th>
            <th scope='col'>Manufacturer</th>
            <th scope='col'>Manufacturing Date</th>
            <th scope='col'>Capacity</th>
            <th scope='col'>Range</th>
            <th scope='col'>Reg No.</th>
            <th scope='col'>Logs</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {Aircrafts.map(member => (
            <tr key={member.id}>
              <td scope='row'>{member.model}</td>
              <td>{member.manufacturer}</td>
              <td>{member.manu_date}</td>
              <td>{member.capacity}</td>
              <td>{member.range}</td>
              <td>{member.registration_no}</td>
              <td>
                <Link to={`/aircrafts/${member.id}/maintenance`}>Maintenance Logs</Link>
              </td>
              <td>
                <i className="bi bi-trash text-danger" onClick={() => handleRemoveAircrafts(member.id)} style={{ cursor: 'pointer' }}></i>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                type="text"
                value={newAircrafts.model}
                placeholder='Model'
                onChange={(e) => setNewAircrafts({ ...newAircrafts, model: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newAircrafts.manufacturer}
                placeholder='Manufacturer'
                onChange={(e) => setNewAircrafts({ ...newAircrafts, manufacturer: (e.target.value) })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newAircrafts.manu_date}
                placeholder='Manufacturing Date'
                onChange={(e) => setNewAircrafts({ ...newAircrafts, manu_date: (e.target.value) })}
              />
            </td>
            <td>
              <input
                type="value"
                value={newAircrafts.capacity}
                placeholder='Capacity'
                onChange={(e) => setNewAircrafts({ ...newAircrafts, capacity: parseInt(e.target.value) })}
              />
            </td>
            <td>
              <input
                type="value"
                value={newAircrafts.range}
                placeholder='Range'
                onChange={(e) => setNewAircrafts({ ...newAircrafts, range: parseInt(e.target.value) })}
              />
            </td>
            <td colSpan={2}>
              <input
                type="text"
                value={newAircrafts.registration_no}
                onChange={(e) => setNewAircrafts({ ...newAircrafts, registration_no: e.target.value })}
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
