// This file contains all API calls to the Django backend
// It separates API logic from UI components (separation of concerns)
// All functions use Axios to make HTTP requests

// Why separate API calls? This follows separation of concerns:
// - Components handle UI (displaying data, forms, buttons)
// - This file handles API communication (fetching, creating, updating data)
// - If API URL changes, I only update it in one place

import axios from 'axios';

// Base URL for the Django API
// Uses environment variable in production, falls back to localhost for development
// Set REACT_APP_API_URL in Railway or .env file for production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Log callback function - set by App.js to track API requests
let logCallback = null;

// Function to set the log callback from App.js
export const setLogCallback = (callback) => {
  logCallback = callback;
};

// Helper function to log API requests with data
const logRequest = (method, url, status = null, requestData = null, responseData = null) => {
  if (logCallback) {
    const timestamp = new Date().toLocaleTimeString();
    
    // Format data for display
    let dataSummary = null;
    if (method === 'GET' && responseData) {
      // For GET requests, show what was retrieved
      if (Array.isArray(responseData)) {
        dataSummary = `Retrieved ${responseData.length} action(s)`;
      } else if (responseData.action) {
        dataSummary = `Action: "${responseData.action}" (ID: ${responseData.id})`;
      }
    } else if (method === 'POST' && requestData) {
      // For POST, show what was created
      dataSummary = `Created: "${requestData.action}" (${requestData.points} points)`;
    } else if ((method === 'PATCH' || method === 'PUT') && requestData) {
      // For PATCH/PUT, show what was updated
      const updates = Object.keys(requestData).map(key => `${key}: ${requestData[key]}`).join(', ');
      dataSummary = `Updated: ${updates}`;
    } else if (method === 'DELETE') {
      // For DELETE, extract ID from URL
      const match = url.match(/\/(\d+)\//);
      if (match) {
        dataSummary = `Deleted action ID: ${match[1]}`;
      }
    }
    
    logCallback({
      method,
      url: url.replace(API_BASE_URL, ''),
      status,
      timestamp,
      dataSummary,
      requestData: requestData ? JSON.stringify(requestData, null, 2) : null,
      responseData: responseData ? JSON.stringify(responseData, null, 2) : null,
    });
  }
};

// Create axios instance with base URL
// This saves me from typing the full URL every time
// Example: api.get('/actions/') becomes http://localhost:8000/api/actions/
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',  // Tell Django we're sending JSON
  },
});

// Store request data temporarily to use in response interceptor
const requestDataMap = new Map();

// Add request interceptor to store request data
api.interceptors.request.use(
  (config) => {
    // Store request data with a unique key (timestamp + method + url)
    const requestKey = `${Date.now()}-${config.method}-${config.url}`;
    requestDataMap.set(requestKey, config.data);
    // Store the key in config so we can retrieve it in response interceptor
    config._requestKey = requestKey;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to log responses
api.interceptors.response.use(
  (response) => {
    // Get the request data that was stored using the key from config
    const requestKey = response.config._requestKey;
    const requestData = requestKey ? requestDataMap.get(requestKey) : null;
    if (requestKey) requestDataMap.delete(requestKey);
    
    // Log response with both request and response data
    logRequest(
      response.config.method.toUpperCase(),
      response.config.url,
      response.status,
      requestData,
      response.data
    );
    
    return response;
  },
  (error) => {
    if (error.response) {
      const requestKey = error.config._requestKey;
      const requestData = requestKey ? requestDataMap.get(requestKey) : null;
      if (requestKey) requestDataMap.delete(requestKey);
      
      logRequest(
        error.config.method.toUpperCase(),
        error.config.url,
        error.response.status,
        requestData,
        error.response.data
      );
    } else if (error.config) {
      // Network error - still log the request attempt
      const requestKey = error.config._requestKey;
      const requestData = requestKey ? requestDataMap.get(requestKey) : null;
      if (requestKey) requestDataMap.delete(requestKey);
      
      logRequest(
        error.config.method.toUpperCase(),
        error.config.url,
        null,
        requestData,
        null
      );
    }
    return Promise.reject(error);
  }
);

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
