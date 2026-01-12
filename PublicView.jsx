import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PublicView = () => {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0); // <--- State nou pentru total
  
  const [speciesList, setSpeciesList] = useState([]);

  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState('default');

  // Input-ul pentru "Sari la pagina..."
  const [pageInput, setPageInput] = useState(1);

  // 1. Specii
  useEffect(() => {
    axios.get('http://localhost:3001/api/species')
      .then(res => setSpeciesList(res.data))
      .catch(err => console.error(err));
  }, []);

  // 2. Date
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [page, limit, searchQuery, statusFilter, speciesFilter]);

  // Când se schimbă pagina reală, actualizăm și input-ul de jos
  useEffect(() => {
    setPageInput(page);
  }, [page]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/api/characters`, {
        params: { page, limit, search: searchQuery, status: statusFilter, species: speciesFilter }
      });
      
      // ACUM RĂSPUNSUL ARE STRUCTURA { items: [], total: 123 }
      setData(res.data.items);
      setTotalItems(res.data.total);
      
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setSearchQuery(inputText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const resetFilters = () => {
    setInputText('');
    setSearchQuery('');
    setStatusFilter('');
    setSpeciesFilter('');
    setPage(1);
    setLimit(10);
    setSortOrder('default');
  };

  // Navigare directă la pagină (Input)
  const handlePageInput = (e) => {
    if (e.key === 'Enter') {
      const newPage = parseInt(pageInput);
      const maxPages = Math.ceil(totalItems / limit);
      if (newPage >= 1 && newPage <= maxPages) {
        setPage(newPage);
      } else {
        alert(`Te rog introdu o pagină între 1 și ${maxPages}`);
      }
    }
  };

  const getSortedData = () => {
    const sorted = [...data];
    switch (sortOrder) {
      case 'name-asc': return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc': return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'status-asc': return sorted.sort((a, b) => a.status.localeCompare(b.status));
      case 'status-desc': return sorted.sort((a, b) => b.status.localeCompare(a.status));
      default: return sorted;
    }
  };

  // Calculăm numărul total de pagini
  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="container" style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      
      <div className="controls">
        {/* Căutare */}
        <div style={{display: 'flex', gap: '5px'}}>
          <input 
            type="text" 
            placeholder="Caută text..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)} 
            onKeyDown={handleKeyPress}
          />
          <button onClick={handleSearch} style={{background: '#00b5cc', color: 'white'}}>🔍</button>
        </div>
        
        {/* Filtre Status */}
        <div className="filters">
          <button onClick={() => { setStatusFilter(''); setPage(1); }} style={{background: statusFilter === '' ? '#202329' : '' , color: statusFilter === '' ? 'white' : ''}}>All</button>
          <button onClick={() => { setStatusFilter('Alive'); setPage(1); }} style={{background: statusFilter === 'Alive' ? '#55cc44' : '', color: statusFilter === 'Alive' ? 'white' : ''}}>Alive</button>
          <button onClick={() => { setStatusFilter('Dead'); setPage(1); }} style={{background: statusFilter === 'Dead' ? '#d63d2e' : '', color: statusFilter === 'Dead' ? 'white' : ''}}>Dead</button>
          <button onClick={() => { setStatusFilter('unknown'); setPage(1); }} style={{background: statusFilter === 'unknown' ? '#9e9e9e' : '', color: statusFilter === 'unknown' ? 'white' : ''}}>Unknown</button>
        </div>

        {/* Specii */}
        <select 
          value={speciesFilter} 
          onChange={(e) => { setSpeciesFilter(e.target.value); setPage(1); }}
          style={{fontWeight: 'bold', color: '#333', minWidth: '150px'}}
        >
          <option value="">Toate Speciile</option>
          {speciesList.map((specie, index) => (
            <option key={index} value={specie}>{specie}</option>
          ))}
        </select>

        {/* Sortare */}
        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="default">Sortare: Implicită</option>
          <optgroup label="Nume">
            <option value="name-asc">Nume (A - Z)</option>
            <option value="name-desc">Nume (Z - A)</option>
          </optgroup>
          <optgroup label="Status">
            <option value="status-asc">Status (A - Z)</option>
            <option value="status-desc">Status (Z - A)</option>
          </optgroup>
        </select>

        {/* Limită */}
        <select 
            onChange={(e) => { setLimit(e.target.value); setPage(1); }} 
            value={limit}
            style={{background: '#e3f2fd', borderColor: '#2196f3'}}
        >
          <option value="5">5 pe pagină</option>
          <option value="10">10 pe pagină</option>
          <option value="20">20 pe pagină</option>
          <option value="50">50 pe pagină</option>
        </select>
        
        <button onClick={resetFilters} style={{background: '#666', fontSize: '0.8rem'}}>Reset</button>
      </div>

      {/* Grid */}
      <div className="grid">
        {getSortedData().map(char => (
          <div key={char.id} className="card">
            <img src={char.image} alt={char.name} />
            <h3>{char.name}</h3>
            <p><span className={`status ${char.status}`}>{char.status}</span> • {char.species}</p>
            <Link to={`/details/${char.id}`}>Vezi Detalii</Link>
          </div>
        ))}
      </div>

      {data.length === 0 && <p style={{marginTop: 20}}>Niciun rezultat găsit.</p>}

      {/* --- PAGINARE AVANSATĂ --- */}
      {totalPages > 1 && (
        <div className="pagination">
          {/* Buton Anterior */}
          <button 
            disabled={page === 1} 
            onClick={() => setPage(page - 1)}
          >
            &lt;
          </button>

          {/* Input Pagină Directă */}
          <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
            <span>Pagina</span>
            <input 
              type="number" 
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onKeyDown={handlePageInput} // La Enter sare la pagină
              style={{width: '50px', textAlign: 'center', padding: '5px', borderRadius: '5px', border: '1px solid #ccc'}}
            />
            <span>din {totalPages}</span>
          </div>

          {/* Buton Următor */}
          <button 
            onClick={() => setPage(page + 1)} 
            disabled={page >= totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default PublicView;
