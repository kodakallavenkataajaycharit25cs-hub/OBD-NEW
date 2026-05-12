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
  const response = await fetch('/api/obd/rpm');
  if (!response.ok) throw new Error('Failed to fetch RPM');
  return response.json();
};

export const fetchSpeed = async () => {
  const response = await fetch('/api/obd/speed');
  if (!response.ok) throw new Error('Failed to fetch speed');
  return response.json();
};

export const fetchFuelLevel = async () => {
  const response = await fetch('/api/obd/fuel_level');
  if (!response.ok) throw new Error('Failed to fetch fuel level');
  return response.json();
};

export const fetchDiagnostics = async () => {
  const response = await fetch('/api/obd/diagnostics');
  if (!response.ok) throw new Error('Failed to fetch diagnostics');
  return response.json();
};
