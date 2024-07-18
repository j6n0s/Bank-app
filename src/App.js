import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Transactions from './components/Transactions';
import Account from './components/Account';
import CreateAccount from './components/CreateAccount';
import Muveletek from './components/Muveletek';

const App = () => {
  const [profileName, setProfileName] = useState(localStorage.getItem('profileName') || '');

  useEffect(() => {
    setProfileName(localStorage.getItem('profileName'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('profileName');
    setProfileName('');
  };

  return (
    <Router>
      <div>
        <header>
          <h1>Bank App</h1>
          {profileName && <div className="username">Üdv, {profileName}</div>}
        </header>
        <nav>
          <ul>
            {!profileName ? (
              <>
                <li>
                  <Link to="/login">Belépes</Link>
                </li>
                <li>
                  <Link to="/register">Regisztráció</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/account">{profileName}</Link>
                </li>
                <li>
                  <Link to="/transactions">Tranzakció</Link>
                </li>
                <li>
                  <Link to="/create-account">Bankszámla létrehozása</Link>
                </li>
                <li>
                  <Link to="/muveletek">Műveletek</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Kijelentkezés</button>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to={profileName ? "/account" : "/login"} />} />
            <Route path="/login" element={<Login setProfileName={setProfileName} />} />
            <Route path="/register" element={<Register setProfileName={setProfileName} />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/account" element={<Account profileName={profileName} handleLogout={handleLogout} />} />
            <Route path="/create-account" element={profileName ? <CreateAccount /> : <Navigate to="/login" />} />
            <Route path="/muveletek" element={profileName ? <Muveletek /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
