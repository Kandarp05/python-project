import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useParams } from 'react-router-dom';

type FucntionalMaintenanceLog = {
    id: number;
    date: string;
    type: string;
    technicianName: string;
    issuesFound: string;
    repairsMade: string;
};
  
type TurnaroundMaintenanceLog = {
    id: number;
    date: string;
    technicianName: string;
    issuesFound: string;
    repairsMade: string;
}

const MaintenancePage: React.FC = () => {
  const { air_id } = useParams<{ air_id: string }>();
  const [turnaroundLogs, setTurnaroundLogs] = useState<TurnaroundMaintenanceLog[]>([]);
  const [functionalLogs, setFunctionalLogs] = useState<FucntionalMaintenanceLog[]>([]);
  const [newTurnaroundMaintenanceLog, setNewTurnaroundMaintenanceLog] = useState<TurnaroundMaintenanceLog>({
    id: 0,
    date: '',
    technicianName: '',
    issuesFound: '',
    repairsMade: ''
  });

  const [newFunctionalMaintenanceLog, setNewFunctionalMaintenanceLog] = useState<FucntionalMaintenanceLog>({
    id: 0,
    date: '',
    type: '',
    technicianName: '',
    issuesFound: '',
    repairsMade: '',
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const turnaroundResponse = await fetch(`http://localhost:8000/aircrafts/${air_id}/turnaround-maintenance`);
      const functionalResponse = await fetch(`http://localhost:8000/aircrafts/${air_id}/functional-maintenance`);
      const turnaroundData = await turnaroundResponse.json();
      const functionalData = await functionalResponse.json();
      setFunctionalLogs(functionalData);
      setTurnaroundLogs(turnaroundData)
    } catch (error) {
      setError('Failed to load logs.');
    }
  };

  const handleAddTurnaroundLogs = async () => {
    try {
      const response = await fetch(`http://localhost:8000/${air_id}/turnaround-maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTurnaroundMaintenanceLog),
      });

      if (response.ok) {
        fetchLogs(); // Refresh the list after adding
        setNewTurnaroundMaintenanceLog({ 
            id: 0, 
            technicianName: '', 
            repairsMade: '', 
            issuesFound: '', 
            date: ''
        });
      } else {
        setError('Failed to add turnaround maintenance.');
      }
    } catch (error) {
      setError('Error adding turnaround maintenance.');
    }
  };

  const handleRemoveTurnaroundLogs = async (id: number) => {
    console.log(id)
    try {
      const response = await fetch(`http://localhost:8000/${air_id}/turnaround-maintenance/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTurnaroundLogs(turnaroundLogs.filter(member => member.id !== id));
      } else {
        setError('Failed to remove turnaround.');
      }
    } catch (error) {
      setError('Error removing turnaround.');
    }
  };

  const handleAddFunctionalLogs = async () => {
    try {
      const response = await fetch(`http://localhost:8000/${air_id}/functional-maintenance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFunctionalMaintenanceLog),
      });

      if (response.ok) {
        fetchLogs(); // Refresh the list after adding
        setNewFunctionalMaintenanceLog({ 
            id: 0,
            type: '',
            technicianName: '', 
            repairsMade: '', 
            issuesFound: '', 
            date: ''
        });
      } else {
        setError('Failed to add functional maintenance.');
      }
    } catch (error) {
      setError('Error adding functional maintenance.');
    }
  };

  const handleRemoveFucntionalLogs = async (id: number) => {
    console.log(id)
    try {
      const response = await fetch(`http://localhost:8000/${air_id}/functional-maintenance/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setFunctionalLogs(functionalLogs.filter(member => member.id !== id));
      } else {
        setError('Failed to remove functional.');
      }
    } catch (error) {
      setError('Error removing functional.');
    }
  };

  return (
    <div>
      <h1>Turnaround Maintenance</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <table className='table table-bordered'>
        <thead className='table-dark'>
          <tr>
            <th scope='col'>Date</th>
            <th scope='col'>Technician</th>
            <th scope='col'>Issues</th>
            <th scope='col'>Repairs</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {turnaroundLogs.map(member => (
            <tr key={member.id}>
              <td scope='row'>{member.date}</td>
              <td>{member.technicianName}</td>
              <td>{member.issuesFound}</td>
              <td>{member.repairsMade}</td>
              <td>
                <i className="bi bi-trash text-danger" onClick={() => handleRemoveTurnaroundLogs(member.id)} style={{ cursor: 'pointer' }}></i>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                type="text"
                value={newTurnaroundMaintenanceLog.date}
                onChange={(e) => setNewTurnaroundMaintenanceLog({ ...newTurnaroundMaintenanceLog, date: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newTurnaroundMaintenanceLog.technicianName}
                onChange={(e) => setNewTurnaroundMaintenanceLog({ ...newTurnaroundMaintenanceLog, technicianName: (e.target.value) })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newTurnaroundMaintenanceLog.issuesFound}
                onChange={(e) => setNewTurnaroundMaintenanceLog({ ...newTurnaroundMaintenanceLog, issuesFound: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newTurnaroundMaintenanceLog.repairsMade}
                onChange={(e) => setNewTurnaroundMaintenanceLog({ ...newTurnaroundMaintenanceLog, repairsMade: e.target.value })}
              />
            </td>
            <td>
              <i className="bi bi-plus-circle-fill text-success" onClick={handleAddTurnaroundLogs} style={{ cursor: 'pointer' }}></i>
            </td>
          </tr>
        </tbody>
      </table>

      <h1>Functional Maintenance</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <table className='table table-bordered'>
        <thead className='table-dark'>
          <tr>
            <th scope='col'>Date</th>
            <th scope='col'>Type</th>
            <th scope='col'>Technician</th>
            <th scope='col'>Issues</th>
            <th scope='col'>Repairs</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {functionalLogs.map(member => (
            <tr key={member.id}>
              <td scope='row'>{member.date}</td>
              <td>{member.type}</td>
              <td>{member.technicianName}</td>
              <td>{member.issuesFound}</td>
              <td>{member.repairsMade}</td>
              <td>
                <i className="bi bi-trash text-danger" onClick={() => handleRemoveFucntionalLogs(member.id)} style={{ cursor: 'pointer' }}></i>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                type="text"
                value={newFunctionalMaintenanceLog.date}
                onChange={(e) => setNewFunctionalMaintenanceLog({ ...newFunctionalMaintenanceLog, date: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newFunctionalMaintenanceLog.type}
                onChange={(e) => setNewFunctionalMaintenanceLog({ ...newFunctionalMaintenanceLog, type: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newFunctionalMaintenanceLog.technicianName}
                onChange={(e) => setNewFunctionalMaintenanceLog({ ...newFunctionalMaintenanceLog, technicianName: (e.target.value) })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newFunctionalMaintenanceLog.issuesFound}
                onChange={(e) => setNewFunctionalMaintenanceLog({ ...newFunctionalMaintenanceLog, issuesFound: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newFunctionalMaintenanceLog.repairsMade}
                onChange={(e) => setNewFunctionalMaintenanceLog({ ...newFunctionalMaintenanceLog, repairsMade: e.target.value })}
              />
            </td>
            <td>
              <i className="bi bi-plus-circle-fill text-success" onClick={handleAddFunctionalLogs} style={{ cursor: 'pointer' }}></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MaintenancePage;
