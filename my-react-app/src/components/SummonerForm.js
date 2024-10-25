import React, { useState } from 'react';
import { getAccountData } from '../services/api';

function SummonerForm({ onAccountDataFetched }) {
  const [gameName, setGameName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await getAccountData(gameName, tagLine);
      if (data && !data.error) {
        onAccountDataFetched(data);
      } else {
        setError(data.error || 'Error fetching data');
      }
    } catch (err) {
      setError('Error fetching account data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Game Name"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <input
          type="text"
          placeholder="Enter Tag Line"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          required
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <button type="submit" disabled={loading} style={{ padding: '5px 10px' }}>
          {loading ? 'Loading...' : 'Get Account Data'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default SummonerForm;
