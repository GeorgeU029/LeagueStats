import React, { useState } from 'react';
import { TextField, Button, Box, CircularProgress, Typography, Card } from '@mui/material';
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
    <Card sx={{ bgcolor: '#2d3748', p: 4, borderRadius: 3, boxShadow: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
        <TextField
          label="Game Name"
          variant="outlined"
          value={gameName}
          onChange={(e) => setGameName(e.target.value)}
          required
          fullWidth
          InputLabelProps={{ style: { color: '#f0f0f0' } }}
          InputProps={{
            style: { color: '#f0f0f0', backgroundColor: '#3b4252', borderRadius: 1 },
          }}
        />
        <TextField
          label="Tag Line"
          variant="outlined"
          value={tagLine}
          onChange={(e) => setTagLine(e.target.value)}
          required
          fullWidth
          InputLabelProps={{ style: { color: '#f0f0f0' } }}
          InputProps={{
            style: { color: '#f0f0f0', backgroundColor: '#3b4252', borderRadius: 1 },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{ bgcolor: '#4a90e2', color: '#fff', minWidth: '150px' }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
        </Button>
      </Box>
      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Card>
  );
}

export default SummonerForm;
