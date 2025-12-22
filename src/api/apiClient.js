import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000' });

export async function createUser(username) {
  const res = await API.post('/users', { username });
  return res.data;
}

export async function getLeaderboard() {
  const res = await API.get('/leaderboard');
  return res.data;
}

export async function getGames() {
  const res = await API.get('/games');
  return res.data;
}

export default API;
