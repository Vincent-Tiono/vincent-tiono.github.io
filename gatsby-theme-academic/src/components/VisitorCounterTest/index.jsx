import React, { useState, useEffect } from 'react';

const VisitorCounterTest = () => {
  const [debugInfo, setDebugInfo] = useState({});
  
  useEffect(() => {
    const VISITOR_COUNT_STORAGE_KEY = 'gatsby-academic-visitor-count';
    
    // Get current values
    const storedCount = localStorage.getItem(VISITOR_COUNT_STORAGE_KEY);
    let count = storedCount ? parseInt(storedCount, 10) : 0;
    
    const sessionKey = 'gatsby-academic-session';
    const currentSession = sessionStorage.getItem(sessionKey);
    
    let isNewSession = false;
    if (!currentSession) {
      count += 1;
      localStorage.setItem(VISITOR_COUNT_STORAGE_KEY, count.toString());
      sessionStorage.setItem(sessionKey, 'active');
      isNewSession = true;
    }
    
    setDebugInfo({
      storedCount,
      finalCount: count,
      sessionExists: !!currentSession,
      isNewSession,
      message: count > 0 ? `${count.toLocaleString()} visits • Welcome!` : 'Welcome! 👋'
    });
  }, []);
  
  const clearData = () => {
    localStorage.removeItem('gatsby-academic-visitor-count');
    sessionStorage.removeItem('gatsby-academic-session');
    window.location.reload();
  };
  
  const clearSessionOnly = () => {
    sessionStorage.removeItem('gatsby-academic-session');
    window.location.reload();
  };
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      padding: '20px', 
      border: '2px solid #ccc',
      borderRadius: '8px',
      zIndex: 9999,
      fontSize: '14px',
      maxWidth: '300px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    }}>
      <h3>🧪 Visitor Counter Test</h3>
      <div style={{ marginBottom: '10px' }}>
        <strong>Message:</strong> {debugInfo.message}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Stored Count:</strong> {debugInfo.storedCount || 'null'}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Final Count:</strong> {debugInfo.finalCount}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Session Exists:</strong> {debugInfo.sessionExists ? 'Yes' : 'No'}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Is New Session:</strong> {debugInfo.isNewSession ? 'Yes' : 'No'}
      </div>
      <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
        <button onClick={() => window.location.reload()} style={{ padding: '5px', fontSize: '12px' }}>
          🔄 Refresh (Same Session)
        </button>
        <button onClick={clearSessionOnly} style={{ padding: '5px', fontSize: '12px' }}>
          🆕 New Session
        </button>
        <button onClick={clearData} style={{ padding: '5px', fontSize: '12px' }}>
          🗑️ Clear All Data
        </button>
      </div>
    </div>
  );
};

export default VisitorCounterTest;