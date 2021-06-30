import axios from 'axios';

const client = axios.create();

// client.defaults.baseURL = 'https://127.0.0.1:8000';
// client.defaults.baseURL = '';
client.defaults.withCredentials = true;

export default client;
