import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PublicView = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    fetchData();
  }, [page, limit, search, statusFilter]);

  const fetchData = async () => {
    try {
      // API call cu parametrii
      const res = await axios.get(`http://localhost:3001/api/characters`, {
        params: { page, limit, search, status: statusFilter }
      });
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      {/* Zona de Control */}
      <div className="controls">
        <input 
          type="text" 
          placeholder="Caută după nume..." 
          onChange={(e) => setSearch(e.target.value)} 
        />
        
        <div className="filters">
          <button onClick={() => setStatusFilter('')}>Toți</button>
          <button onClick={() => setStatusFilter('Alive')}>Alive</button>
          <button onClick={() => setStatusFilter('Dead')}>Dead</button>
          <button onClick={() => setStatusFilter('unknown')}>Unknown</button>
        </div>

        <select onChange={(e) => setLimit(e.target.value)} value={limit}>
          <option value="5">5 pe pagină</option>
          <option value="10">10 pe pagină</option>
          <option value="20">20 pe pagină</option>
        </select>
      </div>

      {/* Grid Afișare */}
      <div className="grid">
        {data.map(char => (
          <div key={char.id} className="card">
            <img src={char.image} alt={char.name} style={{width: '100px'}} />
            <h3>{char.name}</h3>
            <p>Status: {char.status}</p>
            <Link to={`/details/${char.id}`}>Vezi Detalii</Link>
          </div>
        ))}
      </div>

      {/* Paginare Simplă */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</button>
        <span>Pagina {page}</span>
        <button onClick={() => setPage(page + 1)}>Următor</button>
      </div>
    </div>
  );
};
export default PublicView;