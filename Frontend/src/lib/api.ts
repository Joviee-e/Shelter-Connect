// API utility for authenticated requests
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Get authentication headers with JWT token
 */
export const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
    };
};

/**
 * Fetch shelters for logged-in NGO
 */
export const fetchMyShelters = async () => {
    const response = await fetch(`${API_BASE_URL}/shelters/my-shelters`, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch shelters');
    }

    const data = await response.json();
    return data.shelters;
};

/**
 * Update shelter available beds
 */
export const updateShelterBeds = async (shelterId: string, availableBeds: number) => {
    const response = await fetch(`${API_BASE_URL}/shelters/update-beds/${shelterId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ available_beds: availableBeds }),
    });

    if (!response.ok) {
        throw new Error('Failed to update beds');
    }

    return response.json();
};

/**
 * Delete a shelter
 */
export const deleteShelter = async (shelterId: string) => {
    const response = await fetch(`${API_BASE_URL}/shelters/delete/${shelterId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to delete shelter');
    }

    return response.json();
};

/**
 * Update shelter details (e.g., activate/deactivate, mark full)
 */
export const updateShelter = async (shelterId: string, updates: any) => {
    const response = await fetch(`${API_BASE_URL}/shelters/update/${shelterId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
    });

    if (!response.ok) {
        throw new Error('Failed to update shelter');
    }

    return response.json();
};

/**
 * Add a new shelter
 */
export const addShelter = async (shelterData: any) => {
    const response = await fetch(`${API_BASE_URL}/shelters/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(shelterData),
    });

    if (!response.ok) {
        throw new Error('Failed to add shelter');
    }

    return response.json();
};
