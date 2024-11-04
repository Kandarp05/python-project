import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

type CrewMember = {
  id: number;
  name: string;
  role: string;
  experience: string;
  certification: string;
};

const CrewPage: React.FC = () => {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [newCrewMember, setNewCrewMember] = useState<CrewMember>({
    id: 0,
    name: '',
    role: '',
    experience: '',
    certification: '',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCrewMembers();
  }, []);

  const fetchCrewMembers = async () => {
    try {
      const response = await fetch('http://localhost:8000/crew');
      const data = await response.json();
      setCrewMembers(data);
    } catch (error) {
      setError('Failed to load crew members.');
    }
  };

  const handleAddCrewMember = async () => {
    try {
      const response = await fetch('http://localhost:8000/crew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCrewMember),
      });

      if (response.ok) {
        fetchCrewMembers(); // Refresh the list after adding
        setNewCrewMember({ 
          id: 0, 
          name: '', 
          role: '', 
          experience: '', 
          certification: ''
        });
      } else {
        setError('Failed to add crew member.');
      }
    } catch (error) {
      setError('Error adding crew member.');
    }
  };

  const handleRemoveCrewMember = async (id: number) => {
    console.log(id)
    try {
      const response = await fetch(`http://localhost:8000/crew/${id}`, { method: 'DELETE' });
      console.log(response)
      if (response.ok) {
        setCrewMembers(crewMembers.filter(member => member.id !== id));
      } else {
        setError('Failed to remove crew member.');
      }
    } catch (error) {
      setError('Error removing crew member.');
    }
  };

  return (
    <div>
      <h1>Crew Management</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Display List of Crew Members */}
      <h2>All Crew Members</h2>
      <table className='table table-bordered'>
        <thead className='table-dark'>
          <tr>
            <th scope='col'>Name</th>
            <th scope='col'>Role</th>
            <th scope='col'>Experience</th>
            <th scope='col'>Certification</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {crewMembers.map(member => (
            <tr key={member.id}>
              <td scope='row'>{member.name}</td>
              <td>{member.role}</td>
              <td>{member.experience}</td>
              <td>{member.certification}</td>
              <td>
                <i className="bi bi-trash text-danger" onClick={() => handleRemoveCrewMember(member.id)} style={{ cursor: 'pointer' }}></i>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                type="text"
                value={newCrewMember.name}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, name: e.target.value })}
              />
            </td>
            <td>
              <input
                type="number"
                value={newCrewMember.role}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, role: (e.target.value) })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newCrewMember.experience}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, experience: e.target.value })}
              />
            </td>
            <td>
              <input
                type="text"
                value={newCrewMember.certification}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, certification: e.target.value })}
              />
            </td>
            <td>
              <i className="bi bi-plus-circle-fill text-success" onClick={handleAddCrewMember} style={{ cursor: 'pointer' }}></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CrewPage;
