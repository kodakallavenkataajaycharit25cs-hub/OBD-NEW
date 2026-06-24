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

import { supabase } from './supabaseClient';

const authenticatedFetch = async (url: string | URL, options: RequestInit = {}) => {
  const headers = new Headers(options.headers || {});
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    }
  } catch (e) {
    console.error('Failed to get session for auth headers:', e);
  }
  return window.fetch(url, { ...options, headers });
};

const fetch = authenticatedFetch;

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

export interface ClassifiedExpense {
  id: string;
  fileName: string;
  category: 'fuel' | 'maintenance' | 'tolls' | 'parking' | 'other';
  amount: number;
  date: string;
  vendor: string;
  address?: string;
  invoiceNumber?: string;
  confidence: number;
  status: 'processing' | 'classified' | 'verified';
  ocrText?: string;
  imageUrl?: string;
  owner_id?: string;
}

export const fetchExpenses = async (): Promise<ClassifiedExpense[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses`);
    if (!response.ok) throw new Error('Failed to fetch expenses');
    const data = await response.json();
    return data.map((row: any) => ({
      id: row.id,
      fileName: row.file_name,
      category: row.category,
      amount: Number(row.amount),
      date: row.date,
      vendor: row.vendor,
      address: row.address,
      invoiceNumber: row.invoice_number,
      confidence: Number(row.confidence),
      status: row.status,
      ocrText: row.ocr_text,
      imageUrl: row.image_url,
      owner_id: row.owner_id
    }));
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
};

export const createExpense = async (expenseData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: expenseData.id,
        file_name: expenseData.fileName,
        category: expenseData.category,
        amount: expenseData.amount,
        date: expenseData.date,
        vendor: expenseData.vendor,
        address: expenseData.address,
        invoice_number: expenseData.invoiceNumber,
        confidence: expenseData.confidence,
        status: expenseData.status,
        ocr_text: expenseData.ocrText,
        image_url: expenseData.imageUrl,
        owner_id: expenseData.owner_id
      })
    });
    return response.json();
  } catch (error) {
    console.error('Error creating expense:', error);
    return { success: false };
  }
};

export const verifyExpense = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses/${id}/verify`, {
      method: 'PUT'
    });
    return response.json();
  } catch (error) {
    console.error('Error verifying expense:', error);
    return { success: false };
  }
};

export interface PricingModel {
  id: string;
  name: string;
  people_count: number;
  total_amount: number;
  custom_option?: string;
  owner_id?: string;
  created_at?: string;
}

export const fetchPricingModels = async (): Promise<PricingModel[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pricing-models`);
    if (!response.ok) throw new Error('Failed to fetch pricing models');
    return response.json();
  } catch (error) {
    console.error('Error fetching pricing models:', error);
    return [];
  }
};

export const createPricingModel = async (data: PricingModel) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pricing-models`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  } catch (error) {
    console.error('Error creating pricing model:', error);
    return { success: false };
  }
};

export const updatePricingModel = async (id: string, data: Partial<PricingModel>) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pricing-models/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  } catch (error) {
    console.error('Error updating pricing model:', error);
    return { success: false };
  }
};

export const deletePricingModel = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pricing-models/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  } catch (error) {
    console.error('Error deleting pricing model:', error);
    return { success: false };
  }
};

export interface PilotDocument {
  id: string;
  pilot_email: string;
  name: string;
  file_name: string;
  file_url: string;
  expiry: string;
  status?: string;
  created_at?: string;
}

export const fetchPilotDocuments = async (email: string): Promise<PilotDocument[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pilot-documents?email=${encodeURIComponent(email)}`);
    if (!response.ok) throw new Error('Failed to fetch pilot documents');
    return response.json();
  } catch (error) {
    console.error('Error fetching pilot documents:', error);
    return [];
  }
};

export const createPilotDocument = async (data: PilotDocument) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pilot-documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  } catch (error) {
    console.error('Error creating pilot document:', error);
    return { success: false };
  }
};

export const deletePilotDocument = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/pilot-documents/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  } catch (error) {
    console.error('Error deleting pilot document:', error);
    return { success: false };
  }
};

