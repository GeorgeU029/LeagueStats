import React from 'react';
import { Card, Typography, Box, Grid } from '@mui/material';
import ChampionImage from './ChampionImage';
import ItemImages from './ItemImages';
import SpellImages from './SpellImages';
import RuneImages from './RuneImages';
import TeamDetails from './TeamDetails';

function Match({ match }) {
  if (!match) return null;

  const {
    champion,
    win,
    items = [],
    kills,
    deaths,
    assists,
    gameDuration,
    summonerSpells = [],
    runes = [],
    participants = [],
    version = "14.21.1",
    gameMode = "Unknown",
  } = match;

  const matchOutcome = win ? 'Victory' : 'Defeat';
  const matchBgColor = win ? '#00004d' : '#610000';

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 1,
        backgroundColor: matchBgColor,
        color: '#f0f0f0',
        boxShadow: 4,
        borderRadius: 2,
        p: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mr={2}>
          <ChampionImage champion={champion} version={version} />
        </Box>
        <Box display="flex" flexDirection="column">
          <Typography variant="body1" fontWeight="bold" color="#f0f0f0">
            {matchOutcome}
          </Typography>
          <Typography variant="body2" color="#f0f0f0">
            {kills}/{deaths}/{assists} K/D/A
          </Typography>
          <Typography variant="caption" color="#a0aec0">
            Mode: {gameMode}
          </Typography>

          <Box display="flex" justifyContent="flex-start" alignItems="center" flexWrap="wrap" gap={0.5} mt={1}>
            <SpellImages spells={summonerSpells} version={version} />
            <RuneImages runes={runes} />
            <ItemImages items={items} version={version} />
          </Box>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" minWidth="150px" textAlign="right">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="caption" color="#f0f0f0" fontWeight="bold">
              Team 1:
            </Typography>
            <TeamDetails participants={participants} version={version} team={1} />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="caption" color="#f0f0f0" fontWeight="bold">
              Team 2:
            </Typography>
            <TeamDetails participants={participants} version={version} team={2} />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

export default Match;
