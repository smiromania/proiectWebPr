import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom'; // <--- IMPORT NOU

const PublicView = () => {
  const [data, setData] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [speciesList, setSpeciesList] = useState([]);

  // --- 1. HOOK PENTRU URL ---
  // searchParams conține valorile din URL (?search=xx&page=1)
  // setSearchParams ne permite să modificăm URL-ul
  const [searchParams, setSearchParams] = useSearchParams();

  // Citim valorile direct din URL (sau punem valori default)
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || '';
  const species = searchParams.get('species') || '';
  const sort = searchParams.get('sort') || 'default';

  // Input-ul rămâne local pentru a putea tasta fără să se reîncarce pagina la fiecare literă
  const [inputText, setInputText] = useState(search);

  // --- 2. INITIALIZARE ---
  useEffect(() => {
    // Încărcăm lista de specii
    axios.get('http://localhost:3001/api/species')
      .then(res => setSpeciesList(res.data))
      .catch(err => console.error(err));
      
    // Sincronizăm input-ul cu URL-ul la prima încărcare (în caz de refresh)
    setInputText(search);
  }, []); // Doar la mount

  // --- 3. FETCH DATE CÂND SE SCHIMBĂ URL-UL ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/characters`, {
          params: { 
            page, 
            limit, 
            search, // Trimitem ce e în URL
            status, 
            species 
          }
        });
        setData(res.data.items);
        setTotalItems(res.data.total);
      } catch (err) { console.error(err); }
    };
    
    fetchData();
  }, [searchParams]); // Se activează oricând se schimbă ceva în URL

  // --- 4. FUNCȚII CARE ACTUALIZEAZĂ URL-UL ---

  // Funcție ajutătoare pentru a păstra params vechi și a-l schimba doar pe cel nou
  const updateParams = (newParams) => {
    const current = Object.fromEntries([...searchParams]); // Copiază params actuali
    setSearchParams({ ...current, ...newParams });
  };

  const handleSearch = () => {
    // Când căutăm, resetăm pagina la 1 și punem textul în URL
    updateParams({ search: inputText, page: 1 });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const resetFilters = () => {
    setInputText('');
    setSearchParams({}); // Golim tot URL-ul (devine default)
  };

  // Input pagină manuală
  const [pageInput, setPageInput] = useState(page);
  useEffect(() => { setPageInput(page); }, [page]);

  const handlePageJump = (e) => {
    if (e.key === 'Enter') {
      const newPage = parseInt(pageInput);
      const maxPages = Math.ceil(totalItems / limit);
      if (newPage >= 1 && newPage <= maxPages) {
        updateParams({ page: newPage });
      }
    }
  };

  // Sortare Client-Side (Serverul nostru nu suportă sortare SQL încă, deci sortăm ce primim)
  const getSortedData = () => {
    const sorted = [...data];
    switch (sort) {
      case 'name-asc': return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc': return sorted.sort((a, b) => b.name.localeCompare(a.name));
      default: return sorted;
    }
  };

  const totalPages = Math.ceil(totalItems / limit);

  const getStatusColor = (s) => {
    if (s === 'Alive') return 'bg-lime-500 shadow-lime-500/50 shadow-sm';
    if (s === 'Dead') return 'bg-red-600 shadow-red-500/50 shadow-sm';
    return 'bg-gray-500';
  };

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* --- CONTROLS BAR --- */}
      <div className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-xl w-full max-w-6xl mb-8 flex flex-col gap-4 mt-6">
        
        {/* Rândul 1: Căutare */}
        <div className="flex flex-wrap gap-3 justify-between items-center border-b border-gray-700 pb-4">
          <div className="flex gap-2 w-full md:w-auto">
            <input 
              type="text" placeholder="Caută text..." 
              className="bg-gray-900 border border-gray-600 text-lime-400 rounded-lg px-4 py-2 w-full md:w-64 focus:outline-none focus:border-lime-500 placeholder-gray-500"
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              onKeyDown={handleKeyPress}
            />
            <button onClick={handleSearch} className="bg-lime-500 text-black font-bold px-4 py-2 rounded-lg hover:bg-lime-400 transition shadow-lg shadow-lime-500/30">
              🔍
            </button>
          </div>
          <button onClick={resetFilters} className="text-sm text-gray-400 hover:text-lime-400 underline transition">
            Resetează tot
          </button>
        </div>
        
        {/* Rândul 2: Filtre */}
        <div className="flex flex-wrap gap-3 items-center justify-center md:justify-start">
          
          {/* Butoane Status */}
          <div className="flex rounded-md overflow-hidden border border-gray-600">
            <button onClick={() => updateParams({ status: '', page: 1 })} className={`px-4 py-2 text-sm transition ${status === '' ? 'bg-lime-500 text-black font-bold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>All</button>
            <button onClick={() => updateParams({ status: 'Alive', page: 1 })} className={`px-4 py-2 text-sm transition ${status === 'Alive' ? 'bg-lime-500 text-black font-bold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Alive</button>
            <button onClick={() => updateParams({ status: 'Dead', page: 1 })} className={`px-4 py-2 text-sm transition ${status === 'Dead' ? 'bg-red-500 text-black font-bold' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Dead</button>
            <button onClick={() => updateParams({ status: 'unknown', page: 1 })} className={`px-4 py-2 text-sm transition ${status === 'unknown' ? 'bg-gray-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>Unknown</button>
          </div>

          {/* Dropdown Specie */}
          <select 
            value={species} 
            onChange={(e) => updateParams({ species: e.target.value, page: 1 })} 
            className="bg-gray-900 border border-gray-600 text-gray-200 rounded px-3 py-2 outline-none focus:border-lime-500"
          >
            <option value="">Toate Speciile</option>
            {speciesList.map((s, i) => <option key={i} value={s}>{s}</option>)}
          </select>

          {/* Sortare (Doar locală momentan) */}
          <select 
             value={sort}
             onChange={(e) => updateParams({ sort: e.target.value })}
             className="bg-gray-900 border border-gray-600 text-gray-200 rounded px-3 py-2 outline-none focus:border-lime-500"
          >
            <option value="default">Sortare</option>
            <option value="name-asc">Nume (A-Z)</option>
            <option value="name-desc">Nume (Z-A)</option>
          </select>

          {/* Dropdown Limită */}
          <select 
            onChange={(e) => updateParams({ limit: e.target.value, page: 1 })} 
            value={limit} 
            className="bg-gray-900 border border-lime-600 text-lime-400 rounded px-3 py-2 outline-none"
          >
            <option value="5">5 / pag</option>
            <option value="10">10 / pag</option>
            <option value="20">20 / pag</option>
            <option value="50">50 / pag</option>
          </select>
        </div>
      </div>

      {/* --- GRID CARDURI --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-24">
        {getSortedData().map(char => (
          <div key={char.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-lime-500/20 hover:border-lime-500 transition duration-300 flex flex-col group">
            <div className="relative overflow-hidden h-64">
               <img src={char.image} alt={char.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-lime-400 mb-2 truncate">{char.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <span className={`w-3 h-3 rounded-full ${getStatusColor(char.status)}`}></span>
                <span className="text-gray-300 text-sm">{char.status} - {char.species}</span>
              </div>
              <Link to={`/details/${char.id}`} className="mt-auto block text-center border border-lime-500 text-lime-400 py-2 rounded-lg hover:bg-lime-500 hover:text-black font-bold transition">
                Vezi Detalii
              </Link>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-2xl text-lime-500 font-bold">Wubba Lubba Dub Dub!</p>
          <p className="text-gray-400 mt-2">Niciun rezultat găsit pentru filtrele curente.</p>
        </div>
      )}

      {/* --- PAGINARE --- */}
      {totalPages > 1 && (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900/95 backdrop-blur-md border-t border-lime-900 p-4 flex justify-center items-center shadow-2xl z-40">
          <div className="flex items-center gap-4 bg-gray-800 px-6 py-2 rounded-full border border-gray-600 shadow-lg">
            <button disabled={page === 1} onClick={() => updateParams({ page: page - 1 })} className="text-lime-400 hover:text-lime-300 disabled:text-gray-600 font-bold text-lg px-2">
              &lt;
            </button>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-sm">Pagina</span>
              <input 
                type="number" value={pageInput} onChange={(e) => setPageInput(e.target.value)} onKeyDown={handlePageJump}
                className="w-12 text-center bg-gray-900 border border-gray-600 text-lime-400 rounded p-1 focus:border-lime-500 outline-none font-bold"
              />
              <span className="text-sm">din {totalPages}</span>
            </div>
            <button onClick={() => updateParams({ page: page + 1 })} disabled={page >= totalPages} className="text-lime-400 hover:text-lime-300 disabled:text-gray-600 font-bold text-lg px-2">
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicView;
