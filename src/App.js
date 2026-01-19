import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PublicView from './PublicView';
import AdminPanel from './AdminPanel';
import Details from './Details';
import logo from './logo.png'; // Asigură-te că logo.png este în src/

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100 font-sans">
        
        {/* --- NAVBAR --- */}
        {/* Am adăugat un backdrop-blur pentru un efect mai modern */}
        <nav className="bg-gray-800/95 backdrop-blur-sm border-b border-lime-500 shadow-lg shadow-lime-500/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              
              {/* --- ZONA LOGO (MAI MARE) --- */}
              <div className="flex-shrink-0 flex items-center">
                <Link to="/" className="flex items-center">
                  {/* MODIFICARE AICI: h-12 -> h-14 pentru a fi mai mare */}
                  <img 
                    src={logo} 
                    alt="Rick and Morty Logo" 
                    className="h-14 w-auto object-contain hover:scale-105 transition duration-300 drop-shadow-[0_0_8px_rgba(132,204,22,0.8)]" 
                  />
                </Link>
              </div>

              {/* --- LINK-URI MENIU STILIZATE --- */}
              <div className="flex items-center space-x-4">
                
                {/* Buton Acasă - Stil "Ghost" cu Glow la Hover */}
                <Link to="/" className="px-4 py-2 rounded-md text-sm font-bold text-gray-300 border border-transparent hover:text-lime-400 hover:border-lime-400 hover:shadow-[0_0_15px_rgba(163,230,53,0.4)] transition duration-300 ease-in-out tracking-wider">
                  ACASĂ
                </Link>
                
                {/* Buton Admin - Stil "Solid Neon" */}
                <Link to="/admin" className="px-4 py-2 rounded-md text-sm font-bold bg-lime-500 text-gray-900 hover:bg-lime-400 shadow-lg shadow-lime-500/40 hover:shadow-lime-500/80 hover:scale-105 active:scale-95 transition duration-300 ease-in-out tracking-wider">
                  ADMIN PANEL
                </Link>

              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow container mx-auto p-4 relative">
          {/* Putem adăuga un background subtil cu portal dacă vrei în viitor */}
          <Routes>
            <Route path="/" element={<PublicView />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/details/:id" element={<Details />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-gray-500 text-center py-4 border-t border-gray-700 text-sm z-10 relative">
          &copy; 2024 Rick & Morty Portal System
        </footer>

      </div>
    </Router>
  );
};

export default App;
