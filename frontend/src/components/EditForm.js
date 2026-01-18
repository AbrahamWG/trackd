// This component provides a form to edit existing actions
// It's similar to ActionForm but pre-fills with existing data
// Uses PATCH endpoint for partial updates

import { useState, useEffect } from 'react';
import { patchAction } from '../services/api';

function EditForm({ action, onUpdate, onCancel }) {
  // useState hooks to store form input values
  // Pre-fill with existing action data when component loads
  const [actionName, setActionName] = useState(action.action || '');
  const [date, setDate] = useState(action.date || '');
  const [points, setPoints] = useState(action.points?.toString() || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update form fields when action prop changes
  useEffect(() => {
    setActionName(action.action || '');
    setDate(action.date || '');
    setPoints(action.points?.toString() || '');
  }, [action]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that all required fields are filled
    if (!actionName || !date || !points) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Prepare data to send to API (only fields that changed)
      const updatedData = {
        action: actionName,
        date: date,
        points: parseInt(points),
      };

      // Call API to update action using PATCH (partial update)
      await patchAction(action.id, updatedData);

      // Notify parent component that update was successful
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setError('Failed to update action. Please try again.');
      console.error('Error updating action:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#fff3cd', borderRadius: '8px', marginBottom: '20px', border: '2px solid #ffc107', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginTop: 0 }}>Edit Action (ID: {action.id})</h2>
      
      {error && (
        <div style={{ color: 'red', padding: '10px', background: '#ffe6e6', borderRadius: '5px', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Action Name:
          </label>
          <input
            type="text"
            value={actionName}
            onChange={(e) => setActionName(e.target.value)}
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
            min="0"
            style={{ width: '100%', padding: '8px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' }}
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: loading ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginRight: '10px',
            }}
          >
            {loading ? 'Updating...' : 'Update Action'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditForm;
