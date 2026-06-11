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

// SOS / Alerts
export const createAlert = async (alertData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/alerts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertData)
    });
    return response.json();
  } catch (error) {
    console.error('Error creating alert:', error);
    return { success: false };
  }
};

// Trips
export const fetchTrips = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/trips`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
};

export const createTrip = async (tripData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    });
    return response.json();
  } catch (error) {
    console.error('Error creating trip:', error);
    return { success: false };
  }
};

export const fetchEngineTemp = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/engine_temp`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching engine temp:', error);
    return { temp: 0 };
  }
};

export const fetchO2Level = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/o2_level`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching O2 level:', error);
    return { o2_voltage: "0.00" };
  }
};

// CRUD for Owners
export const createOwner = async (ownerData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/owners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ownerData)
    });
    return response.json();
  } catch (error) {
    console.error('Error creating owner:', error);
    return { success: false };
  }
};

export const updateOwner = async (id: string, ownerData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/owners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ownerData)
    });
    return response.json();
  } catch (error) {
    console.error('Error updating owner:', error);
    return { success: false };
  }
};

export const deleteOwner = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/owners/${id}`, { method: 'DELETE' });
    return response.json();
  } catch (error) {
    console.error('Error deleting owner:', error);
    return { success: false };
  }
};

// CRUD for Pilots
export const createPilot = async (pilotData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pilots`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pilotData)
    });
    return response.json();
  } catch (error) {
    console.error('Error creating pilot:', error);
    return { success: false };
  }
};

export const updatePilot = async (id: string, pilotData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pilots/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pilotData)
    });
    return response.json();
  } catch (error) {
    console.error('Error updating pilot:', error);
    return { success: false };
  }
};

export const deletePilot = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pilots/${id}`, { method: 'DELETE' });
    return response.json();
  } catch (error) {
    console.error('Error deleting pilot:', error);
    return { success: false };
  }
};

export const recordTransaction = async (amount: number, type: 'credit' | 'debit', userEmail: string, role: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, type, userEmail, role })
    });
    return response.json();
  } catch (error) {
    console.error('Error recording transaction:', error);
    return { success: false };
  }
};

export const createBooking = async (bookingData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.error || 'Network error' };
    }
    return data;
  } catch (error) {
    console.error('Error creating booking:', error);
    return { success: false, error: 'Network error occurred' };
  }
};

export const fetchBookings = async (email: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${email}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

export const dismissBooking = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  } catch (error) {
    console.error('Error dismissing booking:', error);
    return { success: false };
  }
};

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

export const fetchAdmins = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admins`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  } catch (error) {
    console.error('Error fetching admins:', error);
    return [];
  }
};

export const createAdmin = async (data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  } catch (error) {
    console.error('Error creating admin:', error);
    return { success: false };
  }
};

export const updateAdmin = async (id: string, data: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admins/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  } catch (error) {
    console.error('Error updating admin:', error);
    return { success: false };
  }
};

export const deleteAdmin = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/admins/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  } catch (error) {
    console.error('Error deleting admin:', error);
    return { success: false };
  }
};

