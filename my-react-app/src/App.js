import React, { useState, useEffect } from 'react';
import { getAccountData, getSummonerData, getMatchHistory, getMatchData, getVersion } from './services/api';
import SummonerForm from './components/SummonerForm';
import SummonerProfile from './components/SummonerProfile';
import MatchList from './components/MatchList';

function App() {
  const [summoner, setSummoner] = useState(null);
  const [matches, setMatches] = useState([]);
  const [version, setVersion] = useState('');

  useEffect(() => {
    const fetchVersion = async () => {
      const versionData = await getVersion();
      if (versionData) {
        setVersion(versionData.version);
      }
    };
    fetchVersion();
  }, []);

  const handleAccountDataFetched = async (data) => {
    const { puuid, gameName, tagLine } = data;

    const summonerData = await getSummonerData(puuid);
    setSummoner({ ...data, ...summonerData });

    const matchIds = await getMatchHistory(puuid);
    if (matchIds.length === 0) {
      setMatches([]);
      return;
    }

    const limitedMatchIds = matchIds.slice(0, 20);
    const matchDataArray = await Promise.all(
      limitedMatchIds.map(async (matchId) => {
        const matchData = await getMatchData(matchId, puuid);
        return { ...matchData, version };
      })
    );

    setMatches(matchDataArray);
  };

  return (
    <div className="App" style={{ textAlign: 'center', fontFamily: 'Poppins, sans-serif', color: '#f0f0f0', backgroundColor: 'rgb(26, 26, 46)', minHeight: '100vh' }}>
      <header style={{ backgroundColor: 'rgb(26, 26, 46)', padding: '20px', color: 'white' }}>
        <h1>Riot Games Data Viewer</h1>
      </header>
      <main style={{ marginTop: '20px' }}>
        <SummonerForm onAccountDataFetched={handleAccountDataFetched} />
        <SummonerProfile summoner={summoner} />
        <MatchList matches={matches} />
      </main>
      <footer style={{ marginTop: '50px', padding: '20px', backgroundColor: '#0f3460', color: '#ffffff' }}>
        <p>&copy; 2024 George Ulloa's Riot API App</p>
      </footer>
    </div>
  );
}

export default App;
