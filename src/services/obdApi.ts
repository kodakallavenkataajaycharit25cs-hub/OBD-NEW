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

export const fetchRPM = async () => {
  // Mocking RPM data
  return { rpm: Math.floor(Math.random() * (3000 - 800 + 1)) + 800 };
};

export const fetchSpeed = async () => {
  // Mocking Speed data
  return { speed: Math.floor(Math.random() * (120 - 0 + 1)) + 0 };
};

export const fetchFuelLevel = async () => {
  // Mocking Fuel Level data
  return { fuel_level: Math.floor(Math.random() * (100 - 15 + 1)) + 15 };
};

export const fetchDiagnostics = async () => {
  // Mocking Diagnostics data
  return {
    diagnostics: {
      dtc: Math.random() > 0.8 ? ['P0300', 'P0171'] : [],
      mil_status: Math.random() > 0.8 ? 'ON' : 'OFF',
      engine_load: Math.floor(Math.random() * 100) + '%',
      coolant_temp: (Math.floor(Math.random() * 20) + 85) + '°C'
    }
  };
};
