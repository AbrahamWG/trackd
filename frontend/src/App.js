// This is my main React component
// It tests the connection to the Django backend and displays actions data

import { useState, useEffect } from 'react';
import { getActions } from './services/api';
import './App.css';

function App() {
  // useState hooks - store data that can change
  // When state changes, React automatically re-renders the component
  
  const [actions, setActions] = useState([]);  // Store list of actions from API
  const [loading, setLoading] = useState(true);  // Track if data is being fetched
  const [error, setError] = useState(null);      // Store error messages if API call fails

  // useEffect hook - runs code when component first loads
  // The empty array [] means it only runs once (when component mounts)
  // This is where I fetch data from the API
  useEffect(() => {
    // Test API connection when component loads
    const fetchActions = async () => {
      try {
        setLoading(true);  // Show loading state
        const data = await getActions();  // Call API to get actions
        setActions(data);  // Update actions state with fetched data
        setError(null);    // Clear any previous errors
      } catch (err) {
        // If API call fails, store error message
        setError('Failed to connect to backend. Make sure Django server is running on http://localhost:8000');
        console.error('Connection error:', err);
      } finally {
        setLoading(false);  // Always hide loading state when done
      }
    };

    fetchActions();
  }, []);  // Empty array = run only once when component loads

  // Render the UI based on current state
  // React automatically updates this when state changes (loading, error, actions)
  return (
    <div className="App">
      <header style={{ padding: '20px' }}>
        <h1>Trackd - Backend Connection Test</h1>
        
        {/* Show loading message while fetching data */}
        {loading && <p>Loading...</p>}
        
        {/* Show error message if API call failed */}
        {error && (
          <div style={{ color: 'red', padding: '20px', background: '#ffe6e6', borderRadius: '5px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {/* Show success message and data if everything worked */}
        {!loading && !error && (
          <div style={{ padding: '20px' }}>
            <h2 style={{ color: 'green' }}>✅ Backend Connected!</h2>
            <p>Found {actions.length} action(s)</p>
            {/* Display actions data as formatted JSON */}
            <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '5px', textAlign: 'left' }}>
              {JSON.stringify(actions, null, 2)}
            </pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
