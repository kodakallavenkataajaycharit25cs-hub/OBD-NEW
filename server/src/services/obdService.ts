import axios from 'axios';

// Mocking OBD-II device base URL
const OBD_BASE_URL = process.env.OBD_BASE_URL || 'http://localhost:4000/api/v1';

export const getRPM = async () => {
  try {
    // In a real scenario, this would be: const response = await axios.get(`${OBD_BASE_URL}/data/rpm`);
    // For now, returning mock data as requested.
    return { rpm: Math.floor(Math.random() * (3000 - 800 + 1) + 800) };
  } catch (error) {
    console.error('Error fetching RPM:', error);
    throw error;
  }
};

export const getSpeed = async () => {
  try {
    // const response = await axios.get(`${OBD_BASE_URL}/data/speed`);
    return { speed: Math.floor(Math.random() * 120) };
  } catch (error) {
    console.error('Error fetching speed:', error);
    throw error;
  }
};

export const getFuelLevel = async () => {
  try {
    // const response = await axios.get(`${OBD_BASE_URL}/data/fuel_level`);
    return { fuel_level: Math.floor(Math.random() * 100) };
  } catch (error) {
    console.error('Error fetching fuel level:', error);
    throw error;
  }
};

export const getDiagnostics = async () => {
  try {
    // const response = await axios.get(`${OBD_BASE_URL}/data/diagnostics`);
    return {
      dtc: [],
      mil_status: 'OFF',
      engine_load: '25%',
      coolant_temp: '90C'
    };
  } catch (error) {
    console.error('Error fetching diagnostics:', error);
    throw error;
  }
};
