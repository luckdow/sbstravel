import React from 'react';

export default function SimpleTest() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'lightblue', 
      color: 'black',
      minHeight: '100vh'
    }}>
      <h1>Simple Test Component</h1>
      <p>If you can see this, React is working!</p>
    </div>
  );
}