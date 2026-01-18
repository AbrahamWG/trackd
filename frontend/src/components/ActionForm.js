// This component provides a form to create new actions
// It has fields: Action Name, Date, Points (as required by assignment)
// On submit, it calls the API to create the action and clears the form

import { useState } from 'react';
import { createAction } from '../services/api';

function ActionForm({ onActionCreated }) {
  // useState hooks to store form input values
  // Each input field has its own state
  const [action, setAction] = useState('');  // Action name input
  const [date, setDate] = useState('');      // Date input
  const [points, setPoints] = useState('');  // Points input
  const [loading, setLoading] = useState(false);  // Track if form is submitting
  const [error, setError] = useState(null);         // Store error messages

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page refresh on form submit
    
    // Validate that all required fields are filled
    if (!action || !date || !points) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Prepare data to send to API
      const actionData = {
        action: action,
        date: date,
        points: parseInt(points),  // Convert string to integer
      };

      // Call API to create action
      await createAction(actionData);

      // Clear form fields after successful creation
      setAction('');
      setDate('');
      setPoints('');

      // Notify parent component to refresh the actions list
      if (onActionCreated) {
        onActionCreated();
      }
    } catch (err) {
      setError('Failed to create action. Please try again.');
      console.error('Error creating action:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '5px', marginBottom: '20px' }}>
      <h2>Add New Action</h2>
      
      {/* Show error message if form submission failed */}
      {error && (
        <div style={{ color: 'red', padding: '10px', background: '#ffe6e6', borderRadius: '5px', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      {/* Form with three input fields */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Action Name:
          </label>
          <input
            type="text"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="e.g., Recycling"
            style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Date:
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Points:
          </label>
          <input
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="e.g., 25"
            min="0"
            style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>

        {/* Submit button - disabled while loading */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            background: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Creating...' : 'Add Action'}
        </button>
      </form>
    </div>
  );
}

export default ActionForm;
