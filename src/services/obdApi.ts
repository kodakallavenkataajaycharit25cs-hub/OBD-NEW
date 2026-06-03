export interface OBDData {
  rpm?: number;
  speed?: number;
  fuel_level?: number;
  diagnostics?: {
    dtc: string[];
    mil_status: string;
    engine_load: string;
    coolant_temp: string;
  };
}

const API_BASE_URL = 'http://localhost:5000/api';

export const fetchRPM = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rpm`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching RPM:', error);
    return { rpm: 0 };
  }
};

export const fetchSpeed = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/speed`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching speed:', error);
    return { speed: 0 };
  }
};

export const fetchFuelLevel = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/fuel`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching fuel level:', error);
    return { fuel_level: 0 };
  }
};

export const fetchDiagnostics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/diagnostics`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching diagnostics:', error);
    return {
      diagnostics: {
        dtc: [],
        mil_status: 'UNKNOWN',
        engine_load: '0%',
        coolant_temp: '0°C'
      }
    };
  }
};

export const fetchOwners = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/owners`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching owners:', error);
    return [];
  }
};

export const fetchPilots = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/pilots`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching pilots:', error);
    return [];
  }
};

export const fetchDevices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/devices`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching devices:', error);
    return [];
  }
};

export const fetchAlerts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
};
