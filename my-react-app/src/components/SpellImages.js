import React from 'react';
import { Avatar, Box } from '@mui/material';

const spellNames = {
    1: 'SummonerBoost',       // Cleanse
    3: 'SummonerExhaust',     // Exhaust
    4: 'SummonerFlash',       // Flash
    6: 'SummonerHaste',       // Ghost
    7: 'SummonerHeal',        // Heal
    11: 'SummonerSmite',      // Smite
    12: 'SummonerTeleport',   // Teleport
    13: 'SummonerMana',       // Clarity
    14: 'SummonerDot',        // Ignite
    21: 'SummonerBarrier',    // Barrier
    30: 'SummonerPoroRecall', // To the King!
    31: 'SummonerPoroThrow',  // Poro Toss
    32: 'SummonerSnowball',   // Mark
    39: 'SummonerSnowURFSnowball_Mark', // Mark in URF
    54: 'Summoner_UltBookPlaceholder',  // Placeholder
    55: 'Summoner_UltBookSmitePlaceholder', // Placeholder and Attack-Smite
  };
  

  function SpellImages({ spells = [], version = '14.22.1' }) {
    return (
      <Box display="flex" gap={0.5}>
        {spells.map((spellId, index) => {
          const spellName = spellNames[spellId] || 'SummonerExhaust'; // Fallback to 'Flash' image
          const spellImageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spellName}.png`;
  
          return (
            <Avatar
              key={index}
              src={spellImageUrl}
              onError={(e) => (e.target.src = '/path/to/fallback-image.png')}
              alt={`Spell ${spellName}`}
              sx={{ width: 32, height: 32 }}
            />
          );
        })}
      </Box>
    );
  }
  
  export default SpellImages;
