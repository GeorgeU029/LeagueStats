import axios from 'axios';

const API_URL = 'https://league-stats-backend.onrender.com';

export const getVersion = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/version`);
    return response.data;
  } catch (error) {
    console.error('Error fetching version:', error);
  }
};

export const getAccountData = async (gameName, tagLine) => {
  try {
    const response = await axios.get(`${API_URL}/api/account/${gameName}/${tagLine}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching account data:', error.response ? error.response.data : error.message);
    return { error: 'Failed to fetch account data' };
  }
};

export const getSummonerData = async (puuid) => {
  try {
    const response = await axios.get(`${API_URL}/api/summoner/by-puuid/${puuid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching summoner data:', error);
    return { error: 'Failed to fetch summoner data' };
  }
};

export const getMatchHistory = async (puuid) => {
  try {
    const response = await axios.get(`${API_URL}/api/matches/by-puuid/${puuid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match history:', error);
    return [];
  }
};

export const getMatchData = async (matchId, puuid) => {
  try {
    const response = await axios.get(`${API_URL}/api/matches/${matchId}?puuid=${puuid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching match data:', error);
    return { error: 'Failed to fetch match data' };
  }
};

// Function to get match history with win rate
export const getMatchHistoryWithWinRate = async (puuid, limit = 10, offset = 0) => {
  try {
    const response = await axios.get(`${API_URL}/api/matches/winrate/${puuid}`, {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching match history with win rate:', error);
    return { error: 'Failed to fetch match history' };
  }
};

// Function to fetch champion performance stats by puuid
export const getChampionPerformance = async (puuid) => {
  try {
    const response = await axios.get(`${API_URL}/api/champion-performance/${puuid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching champion performance:', error);
    return { error: 'Failed to fetch champion performance data' };
  }
};

export const getChampionMastery = async (puuid) => {
  try {
    const response = await axios.get(`${API_URL}/api/champion-mastery/${puuid}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching champion mastery:', error);
    return { error: 'Failed to fetch champion mastery data' };
  }
};
