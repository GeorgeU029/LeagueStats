import React from 'react';
import { Card, Box, Typography, Avatar } from '@mui/material';
import WinRateChart from './WinRateChart';

// Import all rank images with relative paths from the src directory
import challengerIcon from './rankImages/Season_2023_-_Challenger.webp';
import grandMasterIcon from './rankImages/Season_2023_-_Grandmaster.webp';
import mastersIcon from './rankImages/Season_2023_-_Master.webp';
import diamondIcon from './rankImages/Season_2023_-_Diamond.webp';
import platinumIcon from './rankImages/Season_2023_-_Platinum.webp';
import emeraldIcon from './rankImages/Season_2023_-_Emerald.webp';
import goldIcon from './rankImages/Season_2023_-_Gold.webp';
import silverIcon from './rankImages/Season_2023_-_Silver.webp';
import bronzeIcon from './rankImages/Season_2023_-_Bronze.webp';
import ironIcon from './rankImages/Season_2023_-_Iron.webp';
import unrankedIcon from './rankImages/Season_2023_-_Unranked.webp';

// Define a mapping of rank tiers to their local image paths
const rankImages = {
  challenger: challengerIcon,
  grandmaster: grandMasterIcon,
  master: mastersIcon,
  diamond: diamondIcon,
  platinum: platinumIcon,
  emerald: emeraldIcon,
  gold: goldIcon,
  silver: silverIcon,
  bronze: bronzeIcon,
  iron: ironIcon,
  unranked: unrankedIcon,
};

function SummonerProfile({ summoner, wins, losses, winRate }) {
  if (!summoner) return null;

  const rankInfo = summoner.rank ? `${summoner.rank.tier} ${summoner.rank.rank}` : 'Unranked';
  const summonerIconUrl = `https://ddragon.leagueoflegends.com/cdn/14.21.1/img/profileicon/${summoner.profileIconId}.png`;
  
  // Use the local image based on the rank tier, or null if unranked
  const rankIconUrl = summoner.rank ? rankImages[summoner.rank.tier.toLowerCase()] : null;

  return (
    <Card sx={{ p: 3, bgcolor: '#2d3748', color: '#f0f0f0', display: 'flex', alignItems: 'center', gap: 3, boxShadow: 3, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" gap={3}>
        <Avatar src={summonerIconUrl} alt={`${summoner.gameName}'s Profile Icon`} sx={{ width: 80, height: 80 }} />

        <Box>
          <Typography variant="h6" component="div">
            {summoner.gameName}#{summoner.tagLine}
          </Typography>
          <Typography variant="body1">
            <strong>Level:</strong> {summoner.summonerLevel}
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            <Typography variant="body1"><strong>Rank:</strong> {rankInfo}</Typography>
            {rankIconUrl && (
              <Avatar src={rankIconUrl} alt={`${rankInfo} Icon`} sx={{ width: 40, height: 40 }} />
            )}
          </Box>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="center" ml="auto">
        <WinRateChart wins={wins} losses={losses} winRate={winRate} />
      </Box>
    </Card>
  );
}

export default SummonerProfile;
