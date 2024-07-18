import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 

const Login = ({ setProfileName }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/autentikacio/bejelentkezes', { email, jelszo: password });
      localStorage.setItem('token', response.data.Kulcs);
      localStorage.setItem('profileName', response.data.nev);
      setProfileName(response.data.nev);
      navigate('/account'); 
    } catch (error) {
      console.error('Bejelentkezés nem sikerült:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Jelszó:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type="submit">Bejelentkezés</button>
    </form>
  );
};

export default Login;
