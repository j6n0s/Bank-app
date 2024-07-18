import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; 

const Register = ({ setProfileName }) => {
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('A jelszó nem egyezik!');
      return;
    }
    try {
      const payload = {
        nev: name,
        tel,
        email,
        szulido: dob,
        lakcim: address,
        admin: isAdmin,
        jelszo: password
      };
      await api.post('/autentikacio/regisztracio', payload);
      const response = await api.post('/autentikacio/bejelentkezes', { email, jelszo: password });
      localStorage.setItem('token', response.data.Kulcs);
      localStorage.setItem('profileName', response.data.nev);
      setProfileName(response.data.nev);
      navigate('/account'); 
    } catch (error) {
      console.error('A regisztráció nem sikerült:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Név:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Telefonszám:</label>
        <input type="text" value={tel} onChange={(e) => setTel(e.target.value)} required />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label>Születési idő:</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
      </div>
      <div>
        <label>Lakcím:</label>
        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div>
        <label>Admin:</label>
        <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
      </div>
      <div>
        <label>Jelszó:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <div>
        <label>Jelszó megerősítése:</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      </div>
      <button type="submit">Regisztráció</button>
    </form>
  );
};

export default Register;
