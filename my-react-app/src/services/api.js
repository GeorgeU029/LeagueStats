import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Ensure this matches the Flask server's URL

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
