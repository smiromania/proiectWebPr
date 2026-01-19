import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Details = () => {
  const { id } = useParams();
  const [char, setChar] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/characters/${id}`)
      .then(res => setChar(res.data))
      .catch(err => console.error(err));
  }, [id]);

  // Loading Screen stilizat
  if (!char) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-lime-400 text-2xl font-bold animate-pulse">
          Se încarcă datele din portal... 🧪
        </div>
      </div>
    );
  }

  // Funcție pentru culoarea badge-ului de status (mai intensă pentru detalii)
  const getStatusBadge = (status) => {
    if (status === 'Alive') return 'bg-lime-500 text-black shadow-[0_0_10px_rgba(132,204,22,0.6)]';
    if (status === 'Dead') return 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.6)]';
    return 'bg-gray-600 text-gray-200';
  };

  return (
    <div className="flex justify-center items-center py-10 px-4">
      
      {/* Card Principal */}
      <div className="bg-gray-800 border border-lime-500/30 rounded-2xl shadow-2xl shadow-lime-500/10 overflow-hidden max-w-5xl w-full flex flex-col md:flex-row animate-fade-in-up">
        
        {/* --- ZONA IMAGINE (Stânga) --- */}
        <div className="md:w-1/2 relative group">
          <img 
            src={char.image} 
            alt={char.name} 
            className="w-full h-full object-cover min-h-[400px] group-hover:scale-105 transition duration-700 ease-in-out" 
          />
          {/* Overlay gradient pentru a îmbina imaginea cu textul pe mobil */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-gray-800/50"></div>
        </div>
        
        {/* --- ZONA INFO (Dreapta) --- */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gray-800 relative">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-lime-400 mb-4 drop-shadow-[0_0_5px_rgba(163,230,53,0.5)] tracking-wide">
              {char.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3">
               <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${getStatusBadge(char.status)}`}>
                 {char.status}
               </span>
               <span className="text-xl text-gray-300 font-light border-l border-gray-600 pl-3">
                 {char.species}
               </span>
            </div>
          </div>

          {/* Tabel de Date */}
          <div className="space-y-4 text-gray-300 bg-gray-900/50 p-6 rounded-xl border border-gray-700 shadow-inner">
            
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-lime-500/80 font-bold uppercase text-xs tracking-widest">Gen</span>
              <span className="font-medium text-white">{char.gender}</span>
            </div>

            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-lime-500/80 font-bold uppercase text-xs tracking-widest">Origine</span>
              <span className="font-medium text-white text-right">{char.origin?.name || 'Unknown'}</span>
            </div>

            <div className="flex justify-between pt-1">
              <span className="text-lime-500/80 font-bold uppercase text-xs tracking-widest">Ultima Locație</span>
              <span className="font-medium text-white text-right">{char.location?.name || 'Unknown'}</span>
            </div>

          </div>

          {/* Buton Înapoi */}
          <div className="mt-10">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-lime-500 text-lime-400 font-bold hover:bg-lime-500 hover:text-black transition duration-300 shadow-[0_0_10px_rgba(132,204,22,0.1)] hover:shadow-[0_0_20px_rgba(132,204,22,0.6)]"
            >
              <span>⬅</span> Întoarce-te la Portal
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Details;
