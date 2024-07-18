import React, { useState, useEffect } from 'react';
import api from '../api';

const Muveletek = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [depositForm, setDepositForm] = useState({ account: '', amount: '' });
  const [withdrawalForm, setWithdrawalForm] = useState({ account: '', amount: '' });
  const [transferForm, setTransferForm] = useState({ fromAccount: '', toAccount: '', amount: '' });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/ugyfelek/');
        console.log('Visszajelzett adat:', response.data);

        const currentUser = Array.isArray(response.data) ? response.data.find((user) => user.nev === localStorage.getItem('profileName')) : response.data;
        setUserDetails(currentUser);

        if (currentUser && currentUser.admin) {
          const accountsResponse = await api.get('/szamlak/');
          setAccounts(accountsResponse.data);
        } else {
          const userAccounts = currentUser ? currentUser.szamlaszamok : [];
          setAccounts(userAccounts);
        }
      } catch (error) {
        console.error('Nem sikerült adatot lekérdezni:', error.response ? error.response.data : error.message);
      }
    };

    fetchUserDetails();
  }, []);

  const handleDepositChange = (e) => {
    const { name, value } = e.target;
    setDepositForm({
      ...depositForm,
      [name]: value,
    });
  };

  const handleWithdrawalChange = (e) => {
    const { name, value } = e.target;
    setWithdrawalForm({
      ...withdrawalForm,
      [name]: value,
    });
  };

  const handleTransferChange = (e) => {
    const { name, value } = e.target;
    setTransferForm({
      ...transferForm,
      [name]: value,
    });
  };

  const handleDeposit = async () => {
    try {
      const payload = {
        osszeg: parseInt(depositForm.amount, 10),
        szamla: parseInt(depositForm.account, 10)
      };
      await api.post('/befizetesek/', payload);
      alert('Befizetés sikeres volt!');
    } catch (error) {
      console.error('Befizetés nem sikerült:', error.response ? error.response.data : error.message);
      alert('Befizetés nem sikerült!');
    }
  };

  const handleWithdrawal = async () => {
    try {
      const payload = {
        osszeg: parseInt(withdrawalForm.amount, 10),
        szamla: parseInt(withdrawalForm.account, 10)
      };
      await api.post('/penzfelvetel/', payload);
      alert('Pénzfelvétel sikeres volt!');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 405) {
          alert('Nincs elég pénz a számlan!');
        } else {
          console.error('Pénzfelvétel nem sikerült:', error.response.data);
          alert('Pénzfelvétel nem sikerült!');
        }
      } else {
        console.error('Pénzfelvétel nem sikerült:', error.message);
        alert('Pénzfelvétel nem sikerült!');
      }
    }
  };

  const handleTransfer = async () => {
    try {
      const payload = {
        osszeg: parseInt(transferForm.amount, 10),
        utalo_szamla: parseInt(transferForm.fromAccount, 10),
        fogado_szamla: parseInt(transferForm.toAccount, 10)
      };
      await api.post('/utalasok/', payload);
      alert('Utalás sikeres volt!');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          alert('Hibás formátum!');
        } else if (error.response.status === 405) {
          alert('Nincs elég pénz a számlán!');
        } else if (error.response.status === 404) {
          alert('Nincs ilyen számla!');
        } else {
          console.error('Sikertelen utalás:', error.response.data);
          alert('Sikertelen utalás!');
        }
      } else {
        console.error('Sikertelen utalás:', error.message);
        alert('Sikertelen utalás!');
      }
    }
  };

  if (!userDetails) {
    return <div>Betöltés...</div>;
  }

  const accountOptions = (accounts || []).map(account => (
    <option key={account.id} value={account.id}>{account.id}</option>
  ));

  return (
    <div>
      <h2>Műveletek</h2>

      <h3>Befizetés</h3>
      <select name="account" onChange={handleDepositChange} value={depositForm.account}>
        <option value="">Számla kiválasztása</option>
        {accountOptions}
      </select>
      <input type="number" name="amount" placeholder="Összeg" onChange={handleDepositChange} value={depositForm.amount} />
      <button onClick={handleDeposit}>Befizetés</button>

      <h3>Pénzfelvétel</h3>
      <select name="account" onChange={handleWithdrawalChange} value={withdrawalForm.account}>
        <option value="">Számla kiválasztása</option>
        {accountOptions}
      </select>
      <input type="number" name="amount" placeholder="Összeg" onChange={handleWithdrawalChange} value={withdrawalForm.amount} />
      <button onClick={handleWithdrawal}>Pénzfelvétel</button>

      <h3>Utalás</h3>
      <select name="fromAccount" onChange={handleTransferChange} value={transferForm.fromAccount}>
        <option value="">Számla kiválasztása</option>
        {accountOptions}
      </select>
      <input type="text" name="toAccount" placeholder="Számlára" onChange={handleTransferChange} value={transferForm.toAccount} />
      <input type="number" name="amount" placeholder="Összeg" onChange={handleTransferChange} value={transferForm.amount} />
      <button onClick={handleTransfer}>Utalás</button>
    </div>
  );
};

export default Muveletek;
