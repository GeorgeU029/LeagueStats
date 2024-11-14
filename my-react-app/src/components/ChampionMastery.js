// src/components/ChampionMastery.js
import React, { useEffect, useState } from 'react';
import { getChampionMastery } from '../services/api';
import { Box, Avatar, Typography, CircularProgress } from '@mui/material';

function ChampionMastery({ puuid, version, championMapping }) {
  const [masteryData, setMasteryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMasteryData = async () => {
      const data = await getChampionMastery(puuid);
      if (!data.error) {
        setMasteryData(data.topMastery);
      }
      setLoading(false);
    };
    fetchMasteryData();
  }, [puuid]);

  if (loading) return <CircularProgress size={24} sx={{ display: 'block', margin: '20px auto' }} />;

  return (
    <Box sx={{ bgcolor: '#1f1f2e', p: 2, borderRadius: 2, boxShadow: 3, color: '#ffffff', textAlign: 'center' }}>
      <Typography variant="subtitle2" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
        Mastery
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
        {masteryData.map((champion) => {
          const championName = championMapping[champion.championId.toString()];
          return (
            <Box key={champion.championId} sx={{ textAlign: 'center' }}>
              <Avatar
                src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`}
                alt={championName}
                sx={{ width: 56, height: 56, mb: 1 }}
              />
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                {championName}
              </Typography>
              <Typography variant="caption">{champion.championPoints} Points</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default ChampionMastery;
