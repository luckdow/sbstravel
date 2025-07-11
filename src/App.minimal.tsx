import React from 'react';

function App() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'red', 
      color: 'white',
      minHeight: '100vh',
      fontSize: '24px'
    }}>
      <h1>MINIMAL TEST</h1>
      <p>This is a minimal React app test</p>
      <button onClick={() => alert('Click works!')}>Test Button</button>
    </div>
  );
}

export default App;