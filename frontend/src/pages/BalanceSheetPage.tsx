import React, { useEffect, useState } from 'react';

type balanceSheet = {
  id: number;
  date: string;
  revenue: number;
  p_l: number;
};

const balancePage: React.FC = () => {
  const [balanceSheets, setbalanceSheets] = useState<balanceSheet[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchbalanceSheets();
  }, []);

  const fetchbalanceSheets = async () => {
    try {
      const response = await fetch('http://localhost:8000/balance');
      const data = await response.json();
      setbalanceSheets(data);
    } catch (error) {
      setError('Failed to load balance sheet.');
    }
  };

  const handleRemovebalanceSheet = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/balance/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setbalanceSheets(balanceSheets.filter(member => member.id !== id));
      } else {
        setError('Failed to remove balance sheet.');
      }
    } catch (error) {
      setError('Error removing balance sheet.');
    }
  };

  return (
    <div>
      <h1>Balance Sheet</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Display List of Crew Members */}
      <h2>All Crew Members</h2>
      <table className='table table-bordered'>
        <thead className='table-dark'>
          <tr>
            <th scope='col'>Date</th>
            <th scope='col'>Revenue</th>
            <th scope='col'>Profit/Loss</th>
            <th scope='col'></th>
          </tr>
        </thead>
        <tbody>
          {balanceSheets.map(member => (
            <tr key={member.id}>
              <td scope='row'>{member.date}</td>
              <td>{member.revenue}</td>
              <td>{member.p_l}</td>
              <td>
                <i className="bi bi-trash text-danger" onClick={() => handleRemovebalanceSheet(member.id)} style={{ cursor: 'pointer' }}></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default balancePage;
