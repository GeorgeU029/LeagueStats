import React from 'react';

function SummonerProfile({ summoner }) {
  if (!summoner) return null;

  const rankInfo = summoner.rank ? `${summoner.rank.tier} ${summoner.rank.rank}` : 'Unranked';
  const summonerIconUrl = `https://ddragon.leagueoflegends.com/cdn/14.21.1/img/profileicon/${summoner.profileIconId}.png`;
  const rankIconUrl = summoner.rank ? `https://opgg-static.akamaized.net/images/medals/${summoner.rank.tier.toLowerCase()}.png` : null;

  return (
    <div
      id="summoner-info"
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        margin:'10px',
        gap: '20px',
        flexDirection: 'row',
        backgroundColor: '#33335c',
        color: '#f0f0f0',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
      }}
    >
      {/* Summoner Profile Icon */}
      <img
        src={summonerIconUrl}
        alt={`${summoner.gameName}'s Profile Icon`}
        style={{ width: '80px', height: '80px', borderRadius: '50%' }}
      />

      {/* Summoner Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div>
          <strong>Name:</strong> {summoner.gameName}#{summoner.tagLine}
        </div>
        <div>
          <strong>Level:</strong> {summoner.summonerLevel}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <strong>Rank:</strong> {rankInfo}
          {/* Rank Icon */}
          {rankIconUrl && (
            <img
              src={rankIconUrl}
              alt={`${rankInfo} Icon`}
              style={{ width: '40px', height: '40px' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default SummonerProfile;
