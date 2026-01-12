import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const Details = () => {
  const { id } = useParams(); // Luăm ID-ul din URL (ex: /details/5)
  const [char, setChar] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/characters/${id}`)
      .then(res => setChar(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!char) return <div>Se încarcă...</div>;

  return (
    <div className="details-container">
      <Link to="/" className="back-btn">← Înapoi</Link>
      
      <div className="details-card">
        <div className="image-section">
            <img src={char.image} alt={char.name} />
        </div>
        
        <div className="info-section">
            <h2>{char.name}</h2>
            <p><strong>Status:</strong> <span className={`status ${char.status}`}>{char.status}</span></p>
            <p><strong>Specie:</strong> {char.species}</p>
            <p><strong>Gen:</strong> {char.gender}</p>
            <p><strong>Origine:</strong> {char.origin?.name || 'Necunoscut'}</p>
            <p><strong>Locație curentă:</strong> {char.location?.name || 'Necunoscut'}</p>
        </div>
      </div>
    </div>
  );
};

export default Details;