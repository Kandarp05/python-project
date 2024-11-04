import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

type CrewMember = {
  id: number;
  name: string;
  role: string;
  experience: string;
  certification: string;
  airid: number;
};

const CrewPage: React.FC = () => {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [newCrewMember, setNewCrewMember] = useState<CrewMember>({
    id: 0,
    name: '',
    role: '',
    experience: '',
    certification: '',
    airid: 0,
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
          certification: '',
          airid: 0,
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
    <div className="container">
      <h1 className="text-center my-4">Crew Management</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="row">
        {crewMembers.map((member) => (
          <div className="col-md-6 mb-4" key={member.id}>
            <div className="card shadow-sm">
              <div className="card-header text-white bg-primary">
                <h5 className="mb-0">{member.name}</h5>
              </div>
              <div className="card-body">
                <p className="text-muted">{member.role}</p>
                <p><strong>Certifications</strong></p>
                <ul className="list-unstyled">
                  {member.certification.split(', ').map((cert, index) => (
                    <li key={index}>• {cert}</li>
                  ))}
                </ul>
                <p>{member.experience}</p>
              </div>
              <div className="card-footer d-flex justify-content-end">
                <i
                  className="bi bi-trash text-danger"
                  onClick={() => handleRemoveCrewMember(member.id)}
                  style={{ cursor: 'pointer' }}
                ></i>
              </div>
            </div>
          </div>
        ))}
        {/* Add Crew Member Form */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header text-white bg-secondary">
              <h5 className="mb-0">Add New Member</h5>
            </div>
            <div className="card-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Name"
                value={newCrewMember.name}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, name: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Role"
                value={newCrewMember.role}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, role: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Experience"
                value={newCrewMember.experience}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, experience: e.target.value })}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Certification"
                value={newCrewMember.certification}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, certification: e.target.value })}
              />
            <div className="card-footer d-flex justify-content-end">
              <i
                className="bi bi-plus-circle-fill text-success"
                onClick={handleAddCrewMember}
                style={{ cursor: 'pointer' }}
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CrewPage;
