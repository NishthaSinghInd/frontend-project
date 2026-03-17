import axios from 'axios';

// Get backend URL from environment or default to local dev server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("API URL:", API_BASE_URL);

const client = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getHealth = async () => {
    const response = await client.get('/health');
    return response.data;
};

// Example specific API call:
export const getRiskModelsStats = async () => {
    // const response = await client.get('/api/risk-models/stats');
    // return response.data;

    // For now returning mock data to reflect what the frontend expects
    return {
        activeModels: 5,
        avgAccuracy: 92.4,
        weeklyScans: 12840,
        globalRisk: "Minimal"
    };
};

export default client;
