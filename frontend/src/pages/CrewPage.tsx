import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '../styles/CrewPage.css';

type CrewMember = {
  eid: number;
  name: string;
  role: string;
  experience: number;
  certification: string;
  airid: number;
};

const CrewPage: React.FC = () => {
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [newCrewMember, setNewCrewMember] = useState<Omit<CrewMember, 'eid'>>({
    name: '',
    role: '',
    experience: 0,
    certification: '',
    airid: 1,
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
        fetchCrewMembers();
        setNewCrewMember({
          name: '',
          role: '',
          experience: 0,
          certification: '',
          airid: 1,
        });
      } else {
        setError('Failed to add crew member.');
      }
    } catch (error) {
      setError('Error adding crew member.');
    }
  };

  const handleRemoveCrewMember = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/crew/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setCrewMembers(crewMembers.filter(member => member.eid !== id));
      } else {
        setError('Failed to remove crew member.');
      }
    } catch (error) {
      setError('Error removing crew member.');
    }
  };

  return (
    <div className="container">
      <h1 className="crew-heading">Crew Management</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="row">
        {crewMembers.map((member) => (
          <div className="col-md-6 mb-4" key={member.eid}>
            <div className="card shadow-sm">
              <div className="card-header">
                <h5 className="mb-0">{member.name}</h5>
              </div>
              <div className="card-body">
                <p className="text-muted">{member.role}</p>
                <p><strong>Certifications</strong></p>
                <ul>
                  {member.certification.split(', ').map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
                <p>Experience: {member.experience} years</p>
              </div>
              <div className="card-footer d-flex justify-content-end">
                <i className="bi bi-trash trash-icon" onClick={() => handleRemoveCrewMember(member.eid)}></i>
              </div>
            </div>
          </div>
        ))}

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header card-header-add">
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
              <select
                className="form-control mb-2"
                value={newCrewMember.role}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, role: e.target.value })}
              >
                <option value="">---Select Role---</option>
                <option value="Pilot">Pilot</option>
                <option value="Co-Pilot">Co-Pilot</option>
                <option value="Engineer">Engineer</option>
                <option value="Cabin Crew">Cabin Crew</option>
                <option value="Flight Attendant">Flight Attendant</option>
              </select>
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Experience"
                value={newCrewMember.experience}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, experience: parseInt(e.target.value) })}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Certification"
                value={newCrewMember.certification}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, certification: e.target.value })}
              />
            </div>
            <div className="card-footer d-flex justify-content-end">
              <i className="bi bi-plus-circle-fill plus-icon" onClick={handleAddCrewMember}></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrewPage;
