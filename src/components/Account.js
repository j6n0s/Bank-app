import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Account.css';
import api from '../api'; 

const Account = ({ profileName, handleLogout }) => {
  const [accountInfo, setAccountInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await api.get('/ugyfelek/');
        console.log('Visszajelzés:', response.data); 

        const user = Array.isArray(response.data) ? response.data.find((u) => u.nev === profileName) : response.data;
        setAccountInfo(user);
        setIsAdmin(user.admin);

        if (user.admin) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Nem sikerült adatot lekérdezni:', error);
      }
    };

    fetchAccountInfo();
  }, [profileName]);

  const handleDeleteAccount = async () => {
    if (window.confirm('Biztos törölni szeretné a fiókját?')) {
      try {
        await api.delete(`/ugyfelek/${accountInfo.id}`);
        handleLogout(); 
        navigate('/register'); 
      } catch (error) {
        console.error('Nem sikerült törölni a fiókot:', error.response ? error.response.data : error.message);
        alert('Nem sikerült törölni a fiókot!');
      }
    }
  };

  if (!accountInfo) {
    return <div>Betöltés...</div>;
  }

  return (
    <div className="account-container">
      <h2>Ügyfél adatok</h2>
      {isAdmin ? (
        <div className="admin-view">
          {users.map((user) => (
            <div key={user.id} className="account-info">
              <p><strong>Név:</strong> {user.nev}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Telefonszám:</strong> {user.tel}</p>
              <p><strong>Lakcím:</strong> {user.lakcim}</p>
              <p><strong>Születési dátum:</strong> {user.szulido}</p>
              <p><strong>Számlaszámok:</strong></p>
              <ul>
                {user.szamlaszamok.map((account) => (
                  <li key={account.id}>{account.id} - Egyenleg: {account.egyenleg}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="account-info">
          <p><strong>Név:</strong> {accountInfo.nev}</p>
          <p><strong>Email:</strong> {accountInfo.email}</p>
          <p><strong>Telefonszám:</strong> {accountInfo.tel}</p>
          <p><strong>Lakcím:</strong> {accountInfo.lakcim}</p>
          <p><strong>Születési dátum:</strong> {accountInfo.szulido}</p>
          <p><strong>Számlaszámok:</strong></p>
          <ul>
            {accountInfo.szamlaszamok.map((account) => (
              <li key={account.id}>{account.id} - Egyenleg: {account.egyenleg}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="button-container">
        <button className="delete-button" onClick={handleDeleteAccount}>Fiók törlése</button>
        <button className="logout-button" onClick={() => {
          handleLogout();
          navigate('/login'); 
        }}>Kijelentkezés</button>
      </div>
    </div>
  );
};

export default Account;
