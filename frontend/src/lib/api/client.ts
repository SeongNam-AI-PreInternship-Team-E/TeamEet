import axios from 'axios';

const client = axios.create();

client.defaults.baseURL = 'https://52.79.248.172:8000/';
// client.defaults.baseURL = '';
client.defaults.withCredentials = true;

export default client;
