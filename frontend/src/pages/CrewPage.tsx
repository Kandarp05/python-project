import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

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
    <div className="container" style={{ maxWidth: '1200px', padding: '20px' }}>
      <h1 className="text-center my-4" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0056a3', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>
        Crew Management
      </h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="row">
        {crewMembers.map((member) => (
          <div className="col-md-6 mb-4" key={member.eid}>
            <div className="card shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
              <div className="card-header text-white" style={{ backgroundColor: '#0056a3', fontSize: '1.25rem', fontWeight: 'bold' }}>
                <h5 className="mb-0">{member.name}</h5>
              </div>
              <div className="card-body" style={{ fontSize: '1rem', color: '#444', lineHeight: '1.6' }}>
                <p className="text-muted">{member.role}</p>
                <p><strong>Certifications</strong></p>
                <ul className="list-unstyled">
                  {member.certification.split(', ').map((cert, index) => (
                    <li key={index} style={{ marginLeft: '15px', color: '#555' }}>• {cert}</li>
                  ))}
                </ul>
                <p>{member.experience}</p>
              </div>
              <div className="card-footer d-flex justify-content-end" style={{ background: '#f1f5f9', padding: '10px' }}>
                <i
                  className="bi bi-trash text-danger"
                  onClick={() => handleRemoveCrewMember(member.eid)}
                  style={{ cursor: 'pointer', fontSize: '1.25rem', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                ></i>
              </div>
            </div>
          </div>
        ))}

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm" style={{ borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <div className="card-header text-white" style={{ backgroundColor: '#007bb5', fontSize: '1.25rem', fontWeight: 'bold' }}>
              <h5 className="mb-0">Add New Member</h5>
            </div>
            <div className="card-body">
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Name"
                value={newCrewMember.name}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, name: e.target.value })}
                style={{ borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <select
                className="form-control mb-2"
                value={newCrewMember.role}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, role: e.target.value })}
                style={{ borderRadius: '5px', border: '1px solid #ccc', padding: '8px' }}
              >
                <option value="">---Select Role---</option>
                <option value="Pilot">Pilot</option>
                <option value="Co-Pilot">Co-Pilot</option>
                <option value="Engineer">Engineer</option>
                <option value="Cabin Crew">Cabin Crew</option>
                <option value="Flight Attendant">Flight Attendant</option>
              </select>

              <input
                type="value"
                className="form-control mb-2"
                placeholder="Experience"
                value={newCrewMember.experience}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, experience: parseInt(e.target.value) })}
                style={{ borderRadius: '5px', border: '1px solid #ccc' }}
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Certification"
                value={newCrewMember.certification}
                onChange={(e) => setNewCrewMember({ ...newCrewMember, certification: e.target.value })}
                style={{ borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
            <div className="card-footer d-flex justify-content-end">
              <i
                className="bi bi-plus-circle-fill text-success"
                onClick={handleAddCrewMember}
                style={{ cursor: 'pointer', fontSize: '1.5rem', transition: 'transform 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrewPage;
