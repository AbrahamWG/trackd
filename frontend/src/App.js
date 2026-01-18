// This is my main React component
// It fetches actions from the Django backend and displays them in a table

import { useState, useEffect } from 'react';
import { getActions, patchAction, deleteAction } from './services/api';
import ActionTable from './components/ActionTable';
import ActionForm from './components/ActionForm';
import EditForm from './components/EditForm';
import './App.css';

function App() {
  // useState hooks - store data that can change
  // When state changes, React automatically re-renders the component
  
  const [actions, setActions] = useState([]);  // Store list of actions from API
  const [loading, setLoading] = useState(true);  // Track if data is being fetched
  const [error, setError] = useState(null);      // Store error messages if API call fails
  const [editingAction, setEditingAction] = useState(null);  // Store action being edited (null = not editing)

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

  // Function to refresh actions list after creating/updating/deleting action
  // This is passed to components so they can refresh the list after operations
  const refreshActions = async () => {
    try {
      const data = await getActions();
      setActions(data);
    } catch (err) {
      console.error('Error refreshing actions:', err);
    }
  };

  // Handle edit button click - set the action to edit
  const handleEdit = (action) => {
    setEditingAction(action);  // Store action data to edit
  };

  // Handle edit form submission - update action using PATCH
  const handleUpdateAction = () => {
    setEditingAction(null);  // Clear editing state
    refreshActions();  // Refresh the list
  };

  // Handle delete button click - delete action
  const handleDelete = async (actionId) => {
    // Confirm before deleting
    if (window.confirm('Are you sure you want to delete this action?')) {
      try {
        await deleteAction(actionId);  // Call API to delete
        refreshActions();  // Refresh the list
      } catch (err) {
        console.error('Error deleting action:', err);
        alert('Failed to delete action. Please try again.');
      }
    }
  };

  // Render the UI based on current state
  // React automatically updates this when state changes (loading, error, actions)
  return (
    <div className="App">
      <header style={{ padding: '20px' }}>
        <h1>Trackd - Sustainability Actions</h1>
        
        {/* Show loading message while fetching data */}
        {loading && <p>Loading actions...</p>}
        
        {/* Show error message if API call failed */}
        {error && (
          <div style={{ color: 'red', padding: '20px', background: '#ffe6e6', borderRadius: '5px', margin: '20px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {/* Show form and table if data loaded successfully */}
        {!loading && !error && (
          <>
            {/* Show edit form if editing, otherwise show add form */}
            {editingAction ? (
              <EditForm 
                action={editingAction} 
                onUpdate={handleUpdateAction}
                onCancel={() => setEditingAction(null)}
              />
            ) : (
              <ActionForm onActionCreated={refreshActions} />
            )}
            <ActionTable 
              actions={actions} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </header>
    </div>
  );
}

export default App;
