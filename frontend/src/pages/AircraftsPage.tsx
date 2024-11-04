import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Aircraft = {
  id: number;
  model: string;
  manufacturer: string;
  manu_date: string;
  capacity: number;
  range: number;
  registration_no: string;
  cid: number;
};

const AircraftsPage: React.FC = () => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [newAircraft, setNewAircraft] = useState<Aircraft>({
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
  const [success, setSuccess] = useState<string | null>(null);

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

  const handleAddAircraft = async () => {
    // Basic validation
    if (!newAircraft.model || !newAircraft.manufacturer || !newAircraft.manu_date || !newAircraft.registration_no) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/aircrafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAircraft),
      });

      if (response.ok) {
        fetchAircrafts(); // Refresh list after adding
        setNewAircraft({
          id: 0,
          model: '',
          manufacturer: '',
          manu_date: '',
          capacity: 0,
          range: 0,
          registration_no: '',
          cid: 0,
        });
        setSuccess('Aircraft added successfully!');
        setError(null);
      } else {
        setError('Failed to add aircraft.');
      }
    } catch (error) {
      setError('Error adding aircraft.');
    }
  };

  const handleRemoveAircraft = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/aircrafts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setAircrafts(aircrafts.filter(member => member.id !== id));
        setSuccess('Aircraft removed successfully!');
      } else {
        setError('Failed to remove aircraft.');
      }
    } catch (error) {
      setError('Error removing aircraft.');
    }
  };

  return (
    <div className="container mt-4">
      <h1>Aircrafts Management</h1>
      {error && <p className="text-danger">{error}</p>}
      {success && <p className="text-success">{success}</p>}

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Model</th>
            <th>Manufacturer</th>
            <th>Manufacturing Date</th>
            <th>Capacity</th>
            <th>Range</th>
            <th>Reg No.</th>
            <th>Logs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {aircrafts.map(aircraft => (
            <tr key={aircraft.id}>
              <td>{aircraft.model}</td>
              <td>{aircraft.manufacturer}</td>
              <td>{aircraft.manu_date}</td>
              <td>{aircraft.capacity}</td>
              <td>{aircraft.range}</td>
              <td>{aircraft.registration_no}</td>
              <td>
                <Link to={`/aircrafts/${aircraft.id}/maintenance`}>Maintenance Logs</Link>
              </td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleRemoveAircraft(aircraft.id)}>Remove</button>
              </td>
            </tr>
          ))}
          <tr>
            <td><input type="text" className="form-control" value={newAircraft.model} placeholder="Model" onChange={(e) => setNewAircraft({ ...newAircraft, model: e.target.value })} /></td>
            <td><input type="text" className="form-control" value={newAircraft.manufacturer} placeholder="Manufacturer" onChange={(e) => setNewAircraft({ ...newAircraft, manufacturer: e.target.value })} /></td>
            <td><input type="date" className="form-control" value={newAircraft.manu_date} placeholder="Manufacturing Date" onChange={(e) => setNewAircraft({ ...newAircraft, manu_date: e.target.value })} /></td>
            <td><input type="number" className="form-control" value={newAircraft.capacity} placeholder="Capacity" onChange={(e) => setNewAircraft({ ...newAircraft, capacity: parseInt(e.target.value) || 0 })} /></td>
            <td><input type="number" className="form-control" value={newAircraft.range} placeholder="Range" onChange={(e) => setNewAircraft({ ...newAircraft, range: parseInt(e.target.value) || 0 })} /></td>
            <td><input type="text" className="form-control" value={newAircraft.registration_no} placeholder="Registration No." onChange={(e) => setNewAircraft({ ...newAircraft, registration_no: e.target.value })} /></td>
            <td colSpan={2}>
              <button className="btn btn-success btn-sm" onClick={handleAddAircraft}>Add Aircraft</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AircraftsPage;
