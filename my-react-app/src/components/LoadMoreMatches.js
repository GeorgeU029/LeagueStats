import React, { useState } from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import { getMatchHistoryWithWinRate } from '../services/api';

function LoadMoreMatches({ puuid, limit, offset, setOffset, matches, setMatches, setWins, setLosses, setWinRate }) {
  const [loading, setLoading] = useState(false);
  const [allMatchesLoaded, setAllMatchesLoaded] = useState(false);

  const loadMoreMatches = async () => {
    if (loading || allMatchesLoaded) return;
    setLoading(true);

    const matchHistoryData = await getMatchHistoryWithWinRate(puuid, limit, offset);
    if (!matchHistoryData.error) {
      setMatches((prevMatches) => [...prevMatches, ...matchHistoryData.matchDetails]);
      setOffset(offset + limit); // Update offset for the next load
      setAllMatchesLoaded(matchHistoryData.matchDetails.length < limit);
      setWins(matchHistoryData.wins);
      setLosses(matchHistoryData.losses);
      setWinRate(matchHistoryData.winRate);
    }
    setLoading(false);
  };

  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Button variant="contained" color="primary" onClick={loadMoreMatches} disabled={loading || allMatchesLoaded}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Load More Matches'}
      </Button>
    </Box>
  );
}

export default LoadMoreMatches;
