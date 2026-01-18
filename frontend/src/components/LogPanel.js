// This component displays a log of all HTTP API requests
// Shows method, URL, status, timestamp, and data summary for debugging and monitoring
// Click on a log entry to see full request/response data

import { useState } from 'react';

function LogPanel({ logs }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '250px',
      background: '#1e1e1e',
      color: '#d4d4d4',
      borderTop: '2px solid #007acc',
      overflowY: 'auto',
      fontFamily: 'monospace',
      fontSize: '12px',
      padding: '10px',
      zIndex: 1000,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        paddingBottom: '5px',
        borderBottom: '1px solid #444',
      }}>
        <strong style={{ color: '#fff', fontSize: '14px' }}>API Request Log</strong>
        <span style={{ color: '#888', fontSize: '11px' }}>{logs.length} requests</span>
      </div>
      
      {logs.length === 0 ? (
        <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
          No API requests yet...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          {logs.slice().reverse().map((log, index) => (
            <div
              key={index}
              style={{
                background: index === expandedIndex ? '#2a2a2a' : (index === 0 ? '#252525' : 'transparent'),
                borderRadius: '3px',
                border: index === expandedIndex ? '1px solid #007acc' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onClick={() => toggleExpand(index)}
            >
              {/* Main log row */}
              <div style={{
                padding: '6px 10px',
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
              }}>
                <span style={{ color: '#888', minWidth: '75px', fontSize: '11px' }}>
                  {log.timestamp}
                </span>
                <span style={{
                  color: log.method === 'GET' ? '#4ec9b0' :
                         log.method === 'POST' ? '#4fc1ff' :
                         log.method === 'PATCH' ? '#ffa500' :
                         log.method === 'PUT' ? '#ffa500' :
                         log.method === 'DELETE' ? '#f48771' : '#d4d4d4',
                  fontWeight: 'bold',
                  minWidth: '55px',
                }}>
                  {log.method}
                </span>
                <span style={{ color: '#d4d4d4', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {log.url}
                </span>
                {log.dataSummary && (
                  <span style={{ 
                    color: '#9cdcfe', 
                    fontSize: '11px',
                    maxWidth: '300px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {log.dataSummary}
                  </span>
                )}
                <span style={{
                  color: log.status >= 200 && log.status < 300 ? '#4ec9b0' :
                         log.status >= 400 ? '#f48771' : '#d4d4d4',
                  fontWeight: 'bold',
                  minWidth: '45px',
                }}>
                  {log.status || '...'}
                </span>
                <span style={{ color: '#666', fontSize: '10px' }}>
                  {index === expandedIndex ? '▼' : '▶'}
                </span>
              </div>
              
              {/* Expanded details */}
              {index === expandedIndex && (
                <div style={{
                  padding: '10px',
                  paddingTop: '5px',
                  borderTop: '1px solid #444',
                  background: '#1a1a1a',
                }}>
                  {log.requestData && (
                    <div style={{ marginBottom: '8px' }}>
                      <div style={{ color: '#569cd6', marginBottom: '3px', fontSize: '11px' }}>
                        <strong>Request Data:</strong>
                      </div>
                      <pre style={{
                        margin: 0,
                        padding: '5px',
                        background: '#0d0d0d',
                        borderRadius: '3px',
                        overflowX: 'auto',
                        fontSize: '10px',
                        color: '#ce9178',
                        maxHeight: '80px',
                        overflowY: 'auto',
                      }}>
                        {log.requestData}
                      </pre>
                    </div>
                  )}
                  {log.responseData && (
                    <div>
                      <div style={{ color: '#4ec9b0', marginBottom: '3px', fontSize: '11px' }}>
                        <strong>Response Data:</strong>
                      </div>
                      <pre style={{
                        margin: 0,
                        padding: '5px',
                        background: '#0d0d0d',
                        borderRadius: '3px',
                        overflowX: 'auto',
                        fontSize: '10px',
                        color: '#ce9178',
                        maxHeight: '80px',
                        overflowY: 'auto',
                      }}>
                        {log.responseData}
                      </pre>
                    </div>
                  )}
                  {!log.requestData && !log.responseData && (
                    <div style={{ color: '#888', fontSize: '11px', fontStyle: 'italic' }}>
                      No data available
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default LogPanel;
