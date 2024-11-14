import React, { useEffect } from 'react';
import { Avatar, Box } from '@mui/material';

// Import all rune images and style icons
import aftershockRune from '../assets/runesImages/Aftershock_rune.webp';
import arcaneCometRune from '../assets/runesImages/Arcane_Comet_rune.webp';
import conquerorRune from '../assets/runesImages/Conqueror_rune.webp';
import darkHarvestRune from '../assets/runesImages/Dark_Harvest_rune.webp';
import electrocuteRune from '../assets/runesImages/Electrocute_rune.webp';
import firstStrikeRune from '../assets/runesImages/First_Strike_rune.webp';
import fleetFootworkRune from '../assets/runesImages/Fleet_Footwork_rune.webp';
import glacialAugmentRune from '../assets/runesImages/Glacial_Augment_rune.webp';
import graspOfTheUndyingRune from '../assets/runesImages/Grasp_of_the_Undying_rune.webp';
import guardianRune from '../assets/runesImages/Guardian_rune.webp';
import hailOfBladesRune from '../assets/runesImages/Hail_of_Blades_rune.webp';
import lethalTempoRune from '../assets/runesImages/Lethal_Tempo_rune.webp';
import phaseRushRune from '../assets/runesImages/Phase_Rush_rune.webp';
import pressTheAttackRune from '../assets/runesImages/Press_the_Attack_rune.webp';
import summonAeryRune from '../assets/runesImages/Summon_Aery_rune.webp';
import unsealedSpellbookRune from '../assets/runesImages/Unsealed_Spellbook_rune.webp';
import precisionIcon from '../assets/runesImages/Precision_icon.webp';
import resolveIcon from '../assets/runesImages/Resolve_icon.webp';
import sorceryIcon from '../assets/runesImages/Sorcery_icon.webp';
import dominationIcon from '../assets/runesImages/Domination_icon.webp';
import inspirationIcon from '../assets/runesImages/Inspiration_icon.webp';

// Combine all rune and style icons into one mapping
const runeImages = {
  // Style icons
  8000: precisionIcon,       // Precision
  8400: resolveIcon,         // Resolve
  8200: sorceryIcon,         // Sorcery
  8100: dominationIcon,      // Domination
  8300: inspirationIcon,     // Inspiration

  // Rune perk icons
  8437: aftershockRune,            // Aftershock
  8229: arcaneCometRune,           // Arcane Comet
  8010: conquerorRune,             // Conqueror
  8112: darkHarvestRune,           // Dark Harvest
  9923: electrocuteRune,           // Electrocute
  8369: firstStrikeRune,           // First Strike
  8021: fleetFootworkRune,         // Fleet Footwork
  8351: glacialAugmentRune,        // Glacial Augment
  8439: graspOfTheUndyingRune,     // Grasp of the Undying
  8465: guardianRune,              // Guardian
  9920: hailOfBladesRune,          // Hail of Blades
  8008: lethalTempoRune,           // Lethal Tempo
  8214: phaseRushRune,             // Phase Rush
  8005: pressTheAttackRune,        // Press the Attack
  8210: summonAeryRune,            // Summon Aery
  8358: unsealedSpellbookRune,     // Unsealed Spellbook
};

function RuneImages({ runes }) {
  useEffect(() => {
    console.log("Rune Data:", runes);
  }, [runes]);

  if (!runes || (!runes.primaryStyle && !runes.subStyle)) {
    console.warn("Rune data is missing or incorrect:", runes);
    return <Box>No rune data available</Box>;
  }

  return (
    <Box display="flex" gap={0.5}>
      <Avatar
        src={runeImages[runes.primaryStyle] || summonAeryRune}  // Default fallback to summonAeryRune
        alt="Primary Rune Style"
        sx={{ width: 32, height: 32 }}
      />
      <Avatar
        src={runeImages[runes.subStyle] || summonAeryRune}  // Default fallback to summonAeryRune
        alt="Sub Rune Style"
        sx={{ width: 32, height: 32 }}
      />
    </Box>
  );
}

export default RuneImages;
