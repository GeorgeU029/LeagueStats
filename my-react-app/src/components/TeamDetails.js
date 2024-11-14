import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';

const truncateName = (name, maxLength = 10) => {
  return name.length > maxLength ? `${name.slice(0, maxLength)}...` : name;
};

function TeamDetails({ participants, version, team }) {
  const teamMembers = team === 1 ? participants.slice(0, 5) : participants.slice(5, 10);

  return (
    <Box>
      {teamMembers.map((participant, index) => (
        <Box key={`team-${team}-participant-${index}`} display="flex" alignItems="center" mb={0.5}>
          <Avatar
            src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${participant.championName}.png`}
            alt={participant.championName}
            sx={{ width: 20, height: 20, mr: 0.5 }}
          />
          <Typography
            variant="caption"
            color="#f0f0f0"
            sx={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100px',
            }}
          >
            {truncateName(participant.summonerName)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default TeamDetails;
