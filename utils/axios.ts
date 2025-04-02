import axios from "axios";

const BACKEN_API_URL = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
	baseURL: BACKEN_API_URL,
});

export default api;
