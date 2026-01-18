// This component displays actions in a table format
// It receives actions data as props from the parent component (App.js)
// Shows columns: ID, Action, Date, Points (as required by assignment)
// Includes Edit and Delete buttons for each action

function ActionTable({ actions, onEdit, onDelete }) {
  // If no actions, show empty message
  if (!actions || actions.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>No actions found. Add your first action!</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Actions List</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Action</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Points</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Map through actions array and create a table row for each action */}
          {actions.map((action) => (
            <tr key={action.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '12px' }}>{action.id}</td>
              <td style={{ padding: '12px' }}>{action.action}</td>
              <td style={{ padding: '12px' }}>{action.date}</td>
              <td style={{ padding: '12px' }}>{action.points}</td>
              <td style={{ padding: '12px' }}>
                {/* Edit button - calls onEdit function with action data */}
                <button
                  onClick={() => onEdit && onEdit(action)}
                  style={{
                    padding: '5px 10px',
                    marginRight: '5px',
                    background: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Edit
                </button>
                {/* Delete button - calls onDelete function with action ID */}
                <button
                  onClick={() => onDelete && onDelete(action.id)}
                  style={{
                    padding: '5px 10px',
                    background: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default ActionTable;
