import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PublicView from './PublicView';
import AdminPanel from './AdminPanel';
import Details from './Details';
import './App.css'; // Vom adăuga stiluri mai jos

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Bara de navigare comună */}
        <nav className="navbar">
          <h1>Rick & Morty DB</h1>
          <div className="links">
            <Link to="/">Acasă</Link>
            <Link to="/admin">Admin Panel</Link>
          </div>
        </nav>

        {/* Definirea Rutelor */}
        <div className="content">
          <Routes>
            <Route path="/" element={<PublicView />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/details/:id" element={<Details />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;