// This file contains all API calls to the Django backend
// It separates API logic from UI components (separation of concerns)
// All functions use Axios to make HTTP requests

// Why separate API calls? This follows separation of concerns:
// - Components handle UI (displaying data, forms, buttons)
// - This file handles API communication (fetching, creating, updating data)
// - If API URL changes, I only update it in one place

import axios from 'axios';

// Base URL for the Django API
// Change this if my Django server runs on a different port
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with base URL
// This saves me from typing the full URL every time
// Example: api.get('/actions/') becomes http://localhost:8000/api/actions/
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',  // Tell Django we're sending JSON
  },
});

// GET all actions
// Returns: Array of all actions
// Used by: ActionTable component to display all actions
export const getActions = async () => {
  try {
    const response = await api.get('/actions/');
    return response.data;  // Return just the data (not the full response object)
  } catch (error) {
    console.error('Error fetching actions:', error);
    throw error;  // Let the component handle the error
  }
};

// GET single action by ID
// Args: id - The ID of the action to fetch
// Returns: Single action object
// Used by: Edit form to load existing action data
export const getAction = async (id) => {
  try {
    const response = await api.get(`/actions/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching action ${id}:`, error);
    throw error;
  }
};

// POST create new action
// Args: actionData - Object with action fields (action, date, points)
// Returns: Created action with auto-generated ID
// Used by: Add form to create new actions
export const createAction = async (actionData) => {
  try {
    const response = await api.post('/actions/', actionData);
    return response.data;
  } catch (error) {
    console.error('Error creating action:', error);
    throw error;
  }
};

// PUT update action (full update)
// Args: id - Action ID, actionData - Complete action object (all fields)
// Returns: Updated action
// Used by: Edit form for full updates (must send all fields)
export const updateAction = async (id, actionData) => {
  try {
    const response = await api.put(`/actions/${id}/`, actionData);
    return response.data;
  } catch (error) {
    console.error(`Error updating action ${id}:`, error);
    throw error;
  }
};

// PATCH update action (partial update)
// Args: id - Action ID, actionData - Only fields to update
// Returns: Updated action
// Used by: Edit form for partial updates (only send changed fields)
export const patchAction = async (id, actionData) => {
  try {
    const response = await api.patch(`/actions/${id}/`, actionData);
    return response.data;
  } catch (error) {
    console.error(`Error patching action ${id}:`, error);
    throw error;
  }
};

// DELETE action
// Args: id - Action ID to delete
// Returns: true if successful
// Used by: Delete button to remove actions
export const deleteAction = async (id) => {
  try {
    await api.delete(`/actions/${id}/`);
    return true;  // Success - action deleted
  } catch (error) {
    console.error(`Error deleting action ${id}:`, error);
    throw error;
  }
};
