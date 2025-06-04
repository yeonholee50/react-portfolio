import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PasswordProtection = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '101001') {
      navigate('/aman-project');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  return (
    <section className="section">
      <h2 className="section__title">Password Required</h2>
      <div className="container" style={{ textAlign: 'center' }}>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              padding: '10px',
              marginRight: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              backgroundColor: '#4a4a4a',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Submit
          </button>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default PasswordProtection; 