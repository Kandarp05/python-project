import React, { useState } from 'react';

const CrewPage = () => {
  const [crewMembers, setCrewMembers] = useState([
    { id: 1, name: 'John Doe', role: 'Pilot', experience: '10 years', certification: 'Certified' },
    { id: 2, name: 'Jane Smith', role: 'Flight Attendant', experience: '5 years', certification: 'Certified' },
    // Add more dummy data if needed
  ]);
  const [newCrewMember, setNewCrewMember] = useState({ name: '', role: '', experience: '', certification: '' });
  const [error, setError] = useState('');

  const handleAddCrewMember = () => {
    if (!newCrewMember.name || !newCrewMember.role) {
      setError('Please fill in all fields');
      return;
    }
    setCrewMembers([...crewMembers, { ...newCrewMember, id: crewMembers.length + 1 }]);
    setNewCrewMember({ name: '', role: '', experience: '', certification: '' });
    setError('');
  };

  const handleRemoveCrewMember = (id : number) => {
    setCrewMembers(crewMembers.filter((member) => member.id !== id));
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
