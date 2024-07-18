import React, { useEffect, useState } from 'react';
import api from '../api';

const Transactions = () => {
  const [befizetesek, setBefizetesek] = useState([]);
  const [penzfelvetel, setPenzfelvetel] = useState([]);
  const [utalasok, setUtalasok] = useState([]);

  useEffect(() => {
    const fetchBefizetesek = async () => {
      try {
        const response = await api.get('/befizetesek/');
        setBefizetesek(response.data);
        console.log(response.data)
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("Nincs befizetes");
        } else {
          alert('Nem sikerült információt elérni!');
        }
      }
    };

    const fetchPenzfelvetel = async () => {
      try {
        const response = await api.get('/penzfelvetel/');
        setPenzfelvetel(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("Nincs penzfelvetel");
        } else {
          alert('Nem sikerült információt elérni!');
        }
      }
    };

    const fetchUtalasok = async () => {
      try {
        const response = await api.get('/utalasok/');
        setUtalasok(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert("Nincs utalas");
        } else {
          alert('Nem sikerült információt elérni!');
        }
      }
    };

    fetchBefizetesek();
    fetchPenzfelvetel();
    fetchUtalasok();
  }, []);

  return (
    <div>
      <h2>Befizetések</h2>
      <ul>
        {befizetesek.map((befizetes) => (
          <li key={befizetes.id}>
            <strong>Számla:</strong> {befizetes.szamla}<br />
            <strong>Összeg:</strong> {befizetes.osszeg}<br />
            <strong>Idő:</strong> {befizetes.ido}
          </li>
        ))}
      </ul>
      <h2>Pénzfelvétel</h2>
      <ul>
        {penzfelvetel.map((penzfelvetel) => (
          <li key={penzfelvetel.id}>
            <strong>Számla:</strong> {penzfelvetel.szamla}<br />
            <strong>Összeg:</strong> {penzfelvetel.osszeg}<br />
            <strong>Idő:</strong> {penzfelvetel.ido}
          </li>
        ))}
      </ul>
      <h2>Utalások</h2>
      <ul>
        {utalasok.map((utalas) => (
          <li key={utalas.id}>
            <strong>Utaló számla:</strong> {utalas.utalo_szamla}<br />
            <strong>Fogadó számla:</strong> {utalas.fogado_szamla}<br />
            <strong>Összeg:</strong> {utalas.osszeg}<br />
            <strong>Idő:</strong> {utalas.ido}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;