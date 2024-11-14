import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Card } from '@mui/material';
import { getSummonerData, getMatchHistoryWithWinRate, getVersion } from './services/api';
import SummonerForm from './components/SummonerForm';
import SummonerProfile from './components/SummonerProfile';
import MatchList from './components/MatchList';
import LoadMoreMatches from './components/LoadMoreMatches';
import ChampionPerformance from './components/ChampionPerformance';
import ChampionMastery from './components/ChampionMastery';
import axios from 'axios';

function App() {
  const [summoner, setSummoner] = useState(null);
  const [matches, setMatches] = useState([]);
  const [version, setVersion] = useState('');
  const [championMapping, setChampionMapping] = useState({});
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [winRate, setWinRate] = useState(0);
  const [offset, setOffset] = useState(10);

  const limit = 10;

  useEffect(() => {
    const fetchVersion = async () => {
      const versionData = await getVersion();
      if (versionData) {
        setVersion(versionData.version);
      }
    };
    fetchVersion();
  }, []);

  useEffect(() => {
    const fetchChampionMapping = async () => {
      if (version) {
        try {
          const response = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`);
          const champions = response.data.data;
          const mapping = {};
          Object.values(champions).forEach(champ => {
            mapping[champ.key] = champ.id;
          });
          setChampionMapping(mapping);
        } catch (error) {
          console.error("Error fetching champion mapping:", error);
        }
      }
    };
    fetchChampionMapping();
  }, [version]);

  const handleAccountDataFetched = async (data) => {
    const { puuid } = data;
    const summonerData = await getSummonerData(puuid);
    setSummoner({ ...data, ...summonerData });

    const matchHistoryData = await getMatchHistoryWithWinRate(puuid, limit, 0);
    if (!matchHistoryData.error) {
      setMatches(matchHistoryData.matchDetails);
      setWins(matchHistoryData.wins);
      setLosses(matchHistoryData.losses);
      setWinRate(matchHistoryData.winRate);
      setOffset(limit);
    }
  };

  return (
    <Box sx={{ bgcolor: '#1a1c23', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container
        maxWidth="md"
        sx={{
          color: '#f0f0f0',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 1,
          gap: 1,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 'bold',
              color: '#f0f0f0',
              bgcolor: '#1f2937',
              p: 1,
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            My League Stats
          </Typography>
        </Box>

        <Box sx={{ width: '100%', mb: 2 }}>
          <Card sx={{ p: 2, bgcolor: '#2d3748', color: '#f0f0f0', boxShadow: 3, borderRadius: 3 }}>
            <SummonerForm onAccountDataFetched={handleAccountDataFetched} />
          </Card>
        </Box>

        {summoner && (
          <Box sx={{ width: '100%', mb: 2 }}>
            <SummonerProfile summoner={summoner} wins={wins} losses={losses} winRate={winRate} />
          </Box>
        )}

        {summoner && (
          <Box sx={{ display: 'flex', gap: 1, width: '100%', alignItems: 'flex-start' }}>
            <Box sx={{ flex: '1 1 30%', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <ChampionMastery puuid={summoner.puuid} version={version} championMapping={championMapping} />
              <ChampionPerformance puuid={summoner.puuid} />
            </Box>
            <Box sx={{ flex: '1 1 70%', minWidth: 0 }}>
              <Card sx={{ p: 0.5, bgcolor: '#1f2937', color: '#f0f0f0', boxShadow: 3, borderRadius: 3 }}>
                <MatchList matches={matches} />
                <LoadMoreMatches
                  puuid={summoner.puuid}
                  limit={limit}
                  offset={offset}
                  setOffset={setOffset}
                  matches={matches}
                  setMatches={setMatches}
                  setWins={setWins}
                  setLosses={setLosses}
                  setWinRate={setWinRate}
                />
              </Card>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default App;
