import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { convertToBase64 } from './utils/fileHelpers';

const AdminPanel = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    status: 'Alive',
    species: '',
    gender: '',
    image: '' // Aici vom stoca string-ul Base64
  });

  // Funcție simplă de login (Mock)
  const handleLogin = (e) => {
    e.preventDefault();
    // În realitate verifici user/pass
    setIsLoggedIn(true); 
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setFormData({ ...formData, image: base64 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:3001/api/characters', formData);
    alert('Înregistrare adăugată!');
  };

  if (!isLoggedIn) {
    return (
      <form onSubmit={handleLogin}>
        <h1>Admin Login</h1>
        <input type="text" placeholder="User" required />
        <input type="password" placeholder="Pass" required />
        <button>Log In</button>
      </form>
    );
  }

  return (
    <div>
      <h2>Panou Administrare</h2>
      {/* Formular Adăugare/Editare */}
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Nume" 
          onChange={e => setFormData({...formData, name: e.target.value})} 
        />
        <select onChange={e => setFormData({...formData, status: e.target.value})}>
           <option value="Alive">Alive</option>
           <option value="Dead">Dead</option>
           <option value="unknown">Unknown</option>
        </select>
        
        {/* Upload Imagine cu conversie automată */}
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        
        {formData.image && <img src={formData.image} alt="Preview" style={{height: 50}}/>}
        
        <button type="submit">Salvează</button>
      </form>

      {/* Listă simplă pentru ștergere/editare */}
      {/* Aici poți refolosi o listă similară cu PublicView dar cu butoane de Edit/Delete */}
    </div>
  );
};
export default AdminPanel;