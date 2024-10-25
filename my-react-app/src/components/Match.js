import React from 'react';

// Mapping of rune styles and perks to their respective names
const RUNE_STYLE_NAMES = {
  8100: 'Domination',
  8300: 'Inspiration',
  8000: 'Precision',
  8400: 'Resolve',
  8200: 'Sorcery',
};

const RUNE_PERK_NAMES = {
  8112: 'Electrocute',
  8124: 'Predator',
  8128: 'DarkHarvest',
  9923: 'HailOfBlades',
  8351: 'GlacialAugment',
  8360: 'UnsealedSpellbook',
  8005: 'PressTheAttack',
  8008: 'LethalTempo',
  8021: 'FleetFootwork',
  8010: 'Conqueror',
  8437: 'GraspOfTheUndying',
  8439: 'Aftershock',
  8465: 'Guardian',
  8214: 'SummonAery',
  8229: 'ArcaneComet',
  8230: 'PhaseRush',
  // Add more mappings as needed...
};

function Match({ match }) {
  if (!match) return null;

  const {
    champion,
    win,
    items,
    kills,
    deaths,
    assists,
    gameDuration,
    summonerSpells,
    runes,
    participants,
    version,
  } = match;

  const matchOutcome = win ? 'Victory' : 'Defeat';
  const outcomeColor = win ? 'var(--win-color)' : 'var(--loss-color)';
  const matchBgColor = win ? 'rgb(39,52,78)' : 'rgb(89,52,59)';

  const championImage = (
    <img
      src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champion}.png`}
      alt={`${champion}`}
      className="champion-image"
      style={{ borderRadius: '50%', marginRight: '15px', width: '60px', height: '60px' }}
    />
  );

  const itemImages = items
    .filter((itemId) => itemId > 0)
    .map((itemId, index) => (
      <img
        key={`${itemId}-${index}`}
        src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/item/${itemId}.png`}
        alt={`Item ${itemId}`}
        className="item-image"
        style={{ width: '30px', height: '30px', marginRight: '4px', borderRadius: '3px' }}
      />
    ));

  // Summoner spells (use spell images from data dragon)
  const spellImages = summonerSpells.map((spellName, index) => (
    <img
      key={`spell-${spellName}-${index}`}
      src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${spellName}.png`}
      alt={`Spell ${spellName}`}
      className="summoner-spell-image"
      style={{ width: '25px', height: '25px', marginRight: '4px' }}
    />
  ));

  // Runes (use the new URL format with names)
  const runeImages = runes.map((runeStyle, index) => {
    const styleName = RUNE_STYLE_NAMES[runeStyle.style] || 'Unknown';
    const perkName = RUNE_PERK_NAMES[runeStyle.selections[0].perk] || 'Unknown';

    return (
      <img
        key={`rune-${index}`}
        src={`https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/${styleName}/${perkName}/${perkName}.png`}
        alt={`Rune ${styleName}`}
        className="rune-image"
        style={{ width: '25px', height: '25px', marginRight: '4px' }}
      />
    );
  });

  // Split participants into two teams
  const team1 = participants.slice(0, 5);
  const team2 = participants.slice(5, 10);

  // Team 1 details
  const team1Details = team1.map((participant, index) => {
    const championImageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${participant.championName}.png`;

    return (
      <div key={`team1-participant-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
        <img
          src={championImageUrl}
          alt={participant.championName}
          className="participant-champion-image"
          style={{ width: '25px', height: '25px', marginRight: '8px', borderRadius: '50%' }}
          onError={(e) => {
            e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/placeholder.png';
          }} // Fallback image
        />
        <span>{participant.summonerName}</span>
      </div>
    );
  });

  // Team 2 details
  const team2Details = team2.map((participant, index) => {
    const championImageUrl = `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${participant.championName}.png`;

    return (
      <div key={`team2-participant-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
        <img
          src={championImageUrl}
          alt={participant.championName}
          className="participant-champion-image"
          style={{ width: '25px', height: '25px', marginRight: '8px', borderRadius: '50%' }}
          onError={(e) => {
            e.target.src = 'https://ddragon.leagueoflegends.com/cdn/14.21.1/img/champion/placeholder.png';
          }} // Fallback image
        />
        <span>{participant.summonerName}</span>
      </div>
    );
  });

  return (
    <div
      className="card match"
      style={{
        display: 'flex',
        border: `2px solid ${outcomeColor}`,
        backgroundColor: matchBgColor,
        padding: '10px', // Reduce padding to make the card less tall
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Slight shadow effect
        marginBottom: '15px', // Gap between each match card
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Left Side: Player's Match Info */}
      <div className="match-info-left" style={{ width: '60%', paddingRight: '15px', borderRight: `1px solid ${outcomeColor}` }}>
        <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '5px' }}>
          {championImage}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <h4 style={{ margin: 0, color: outcomeColor }}>{matchOutcome}</h4>
            <p style={{ margin: 0, fontSize: '1em', fontWeight: 'bold', color: 'var(--text-light)' }}>
              {kills}/{deaths}/{assists} K/D/A
            </p>
            <p style={{ margin: 0, fontSize: '0.8em', color: 'var(--text-light)' }}>
              Duration: {gameDuration}
            </p>
          </div>
        </div>
        <div className="summoner-spells" style={{ marginBottom: '8px' }}>
          <strong style={{ color: 'var(--highlight-yellow)' }}>Summoner Spells:</strong> {spellImages}
        </div>
        <div className="runes" style={{ marginBottom: '8px' }}>
          <strong style={{ color: 'var(--highlight-yellow)' }}>Runes:</strong> {runeImages}
        </div>
        <div className="item-images">
          <strong style={{ color: 'var(--highlight-yellow)' }}>Items:</strong> {itemImages}
        </div>
      </div>

      {/* Right Side: Match Participants - Split into Two Teams */}
      <div className="match-participants-right" style={{ width: '40%', paddingLeft: '15px' }}>
        <div className="team-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Team 1 */}
          <div className="team" style={{ width: '48%' }}>
            <h5 style={{ color: 'var(--highlight-yellow)', marginBottom: '8px' }}>Team 1:</h5>
            {team1Details}
          </div>
          {/* Team 2 */}
          <div className="team" style={{ width: '48%' }}>
            <h5 style={{ color: 'var(--highlight-yellow)', marginBottom: '8px' }}>Team 2:</h5>
            {team2Details}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Match;
