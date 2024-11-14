import React from 'react';
import { Avatar } from '@mui/material';

function ChampionImage({ champion, version }) {
  return (
    <Avatar
      src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion}.png`}
      alt={champion}
      sx={{ width: 48, height: 48, borderRadius: '8px' }}
    />
  );
}

export default ChampionImage;
