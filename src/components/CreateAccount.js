import React, { useState, useEffect } from 'react';
import api from '../api';

const CreateAccount = () => {
  const [ugyfelId, setUgyfelId] = useState('');
  const [balance, setBalance] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/ugyfelek/');
        console.log('Visszaérkező adat:', response.data); 
        const currentUser = Array.isArray(response.data) ? response.data.find(user => user.nev === localStorage.getItem('profileName')) : response.data;
        setIsAdmin(currentUser.admin);
        if (!currentUser.admin) {
          setUgyfelId(currentUser.id);
        }
      } catch (error) {
        console.error('Nem sikerült adatot lekérdezni:', error.response ? error.response.data : error.message);
      }
    };

    fetchUserInfo();
  }, []);

  const handleCreateAccount = async () => {
    try {
      const payload = {
        ugyfel_id: parseInt(ugyfelId, 10),
        egyenleg: parseInt(balance, 10) || 0  
      };
      console.log('Payload:', payload); 
      await api.post('/szamlak/', payload);
      alert('Számla sikeresen létre lett hozva!');
    } catch (error) {
      console.error('Nem sikerült számlát létrehozn:', error.response ? error.response.data : error.message);
      alert('Nem sikerült számlát létrehozni!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'ugyfelId') {
      setUgyfelId(value);
    } else if (name === 'balance') {
      setBalance(value);
    }
  };

  return (
    <div>
      <h2>Számla létrehozása</h2>
      {isAdmin && (
        <>
          <div>
            <label>Ügyfél ID:</label>
            <input type="text" name="ugyfelId" value={ugyfelId} onChange={handleChange} required />
          </div>
          <div>
            <label>Összeg:</label>
            <input type="number" name="balance" value={balance} onChange={handleChange} required />
          </div>
        </>
      )}
      <button onClick={handleCreateAccount}>Számla létrehozása</button>
    </div>
  );
};

export default CreateAccount;
