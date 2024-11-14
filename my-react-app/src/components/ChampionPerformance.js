// src/components/ChampionPerformance.js
import React, { useEffect, useState } from 'react';
import { getChampionPerformance } from '../services/api';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Avatar,
  Box,
} from '@mui/material';

function ChampionPerformance({ puuid }) {
  const [championPerformance, setChampionPerformance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      const data = await getChampionPerformance(puuid);
      if (!data.error) {
        setChampionPerformance(data.championPerformance);
      }
      setLoading(false);
    };
    fetchPerformanceData();
  }, [puuid]);

  if (loading) return <CircularProgress size={24} sx={{ display: 'block', margin: '20px auto' }} />;

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: '100%',
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: '#1f1f2e', // Darker background color
      }}
    >
      <Typography variant="subtitle2" component="div" sx={{ p: 0.5, textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#ffffff' }}>
        Champion Performance
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: '0.8rem', padding: '4px', color: '#ffffff' }}>Champion</TableCell>
            <TableCell align="center" sx={{ fontSize: '0.8rem', padding: '4px', color: '#ffffff' }}>Games</TableCell>
            <TableCell align="center" sx={{ fontSize: '0.8rem', padding: '4px', color: '#ffffff' }}>Win Rate (%)</TableCell>
            <TableCell align="center" sx={{ fontSize: '0.8rem', padding: '4px', color: '#ffffff' }}>KDA</TableCell>
            <TableCell align="center" sx={{ fontSize: '0.8rem', padding: '4px', color: '#ffffff' }}>CS/Min</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {championPerformance.map((champ) => (
            <TableRow key={champ.champion} sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: '#2c2c3a' }}>
              <TableCell sx={{ padding: '4px', color: '#ffffff' }}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={`https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/${champ.champion}.png`}
                    alt={champ.champion}
                    sx={{ width: 20, height: 20, mr: 0.5 }}
                  />
                  <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.75rem', color: '#ffffff' }}>
                    {champ.champion}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="center" sx={{ fontSize: '0.75rem', padding: '4px', color: '#ffffff' }}>{champ.games}</TableCell>
              <TableCell align="center" sx={{ fontSize: '0.75rem', padding: '4px', color: champ.win_rate >= 50 ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                {champ.win_rate}%
              </TableCell>
              <TableCell align="center" sx={{ fontSize: '0.75rem', padding: '4px', color: champ.average_kda.split(':')[0] >= 3 ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                {champ.average_kda}
              </TableCell>
              <TableCell align="center" sx={{ fontSize: '0.75rem', padding: '4px', color: '#ffffff' }}>{champ.average_cs_per_min.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ChampionPerformance;
