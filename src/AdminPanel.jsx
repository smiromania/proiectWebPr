import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { convertToBase64 } from './utils/fileHelpers';

const AdminPanel = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [authData, setAuthData] = useState({ username: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    status: 'Alive',
    species: '',
    gender: '',
    image: ''
  });

  const authConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    if (token) {
      fetchItems();
    }
    // eslint-disable-next-line
  }, [token]);

  // --- MODIFICARE AICI: Adaptare la noul Backend ---
  const fetchItems = async (query = '') => {
    try {
      const url = `http://localhost:3001/api/characters?limit=100&search=${query}`;
      const res = await axios.get(url);
      
      // Verificăm dacă răspunsul e format nou {items, total} sau vechi [array]
      if (res.data.items) {
        setItems(res.data.items);
      } else {
        setItems(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(searchTerm);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const res = await axios.post('http://localhost:3001/api/login', authData);
      const newToken = res.data.accessToken;
      setToken(newToken);
      localStorage.setItem('token', newToken);
    } catch (err) {
      setErrorMsg('Username sau parolă incorectă.');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setItems([]);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setFormData({ ...formData, image: base64 });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3001/api/characters/${editingId}`, formData, authConfig);
        alert('Actualizat!');
      } else {
        await axios.post('http://localhost:3001/api/characters', formData, authConfig);
        alert('Adăugat!');
      }
      resetForm();
      fetchItems(searchTerm);
    } catch (err) {
      alert('Eroare: Sesiune expirată.');
      if (err.response?.status === 403) handleLogout();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Sigur ștergi?')) {
      try {
        await axios.delete(`http://localhost:3001/api/characters/${id}`, authConfig);
        fetchItems(searchTerm);
      } catch (err) {
        alert('Eroare la ștergere');
      }
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      status: item.status,
      species: item.species,
      gender: item.gender,
      image: item.image
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', status: 'Alive', species: '', gender: '', image: '' });
  };

  if (!token) {
    return (
      <div className="login-container" style={{textAlign: 'center', marginTop: '100px'}}>
        <form onSubmit={handleLogin} className="controls" style={{flexDirection: 'column', width: '350px', margin: '0 auto', gap: '15px', padding: '40px'}}>
          <h1>Admin Login</h1>
          {errorMsg && <div style={{color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '5px', width: '100%'}}>{errorMsg}</div>}
          <input type="text" placeholder="Username" value={authData.username} onChange={e => setAuthData({...authData, username: e.target.value})} required style={{width: '100%'}} />
          <input type="password" placeholder="Password" value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})} required style={{width: '100%'}} />
          <button style={{width: '100%', marginTop: '10px', background: '#00b5cc'}}>Log In</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container" style={{width: '100%', maxWidth: '1000px'}}>
      
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <h2>Dashboard Administrare</h2>
        <button onClick={handleLogout} style={{background: '#d63d2e'}}>Log Out</button>
      </div>
      
      <div className="form-section controls" style={{flexDirection: 'column', alignItems: 'stretch'}}>
        <h3 style={{marginTop: 0}}>{editingId ? 'Modifică Personaj' : 'Adaugă Personaj Nou'}</h3>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
           <input type="text" placeholder="Nume" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
           
           <div style={{display: 'flex', gap: '10px'}}>
             <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{flex: 1}}>
               <option value="Alive">Alive</option>
               <option value="Dead">Dead</option>
               <option value="unknown">Unknown</option>
             </select>
             <input type="text" placeholder="Specie" value={formData.species} onChange={e => setFormData({...formData, species: e.target.value})} style={{flex: 1}} />
             <input type="text" placeholder="Gen" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} style={{flex: 1}} />
           </div>

           <div style={{border: '1px dashed #ccc', padding: '10px', borderRadius: '8px', background: '#f9f9f9'}}>
             <label style={{display: 'block', marginBottom: '5px', fontSize: '0.9rem', color: '#666'}}>Imagine:</label>
             <input type="file" accept="image/*" onChange={handleImageUpload} />
             {formData.image && <img src={formData.image} alt="Preview" style={{height: 60, marginTop: 10, borderRadius: 5}} />}
           </div>
           
           <div style={{display: 'flex', gap: '10px'}}>
             <button type="submit" style={{flex: 1, background: editingId ? '#ff9800' : '#202329'}}>{editingId ? 'Salvează Modificările' : 'Adaugă în Bază'}</button>
             {editingId && <button type="button" onClick={resetForm} style={{background: '#ccc', color: 'black'}}>Anulează</button>}
           </div>
        </form>
      </div>

      <hr style={{margin: '40px 0', borderTop: '1px solid #ddd'}}/>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
        <h3>Listă Elemente</h3>
        <form onSubmit={handleSearch} style={{display: 'flex', gap: '5px'}}>
          <input 
            type="text" 
            placeholder="Caută în bază..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{padding: '8px', width: '250px'}}
          />
          <button type="submit" style={{background: '#00b5cc', padding: '8px 15px'}}>Caută</button>
          {searchTerm && <button type="button" onClick={() => { setSearchTerm(''); fetchItems(''); }} style={{background: '#666', padding: '8px 15px'}}>Reset</button>}
        </form>
      </div>

      <div className="table-responsive">
        <table style={{width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)'}}>
          <thead style={{background: '#202329', color: 'white'}}>
            <tr>
              <th style={{padding: '12px', textAlign: 'left'}}>Img</th>
              <th style={{padding: '12px', textAlign: 'left'}}>Nume</th>
              <th style={{padding: '12px', textAlign: 'left'}}>Status</th>
              <th style={{padding: '12px', textAlign: 'right'}}>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map(item => (
                <tr key={item.id} style={{borderBottom: '1px solid #eee'}}>
                  <td style={{padding: '10px'}}><img src={item.image} style={{width: 40, height: 40, borderRadius: '50%', objectFit: 'cover'}} alt="" /></td>
                  <td style={{padding: '10px', fontWeight: 'bold'}}>{item.name}</td>
                  <td style={{padding: '10px'}}>
                      <span className={`status ${item.status}`} style={{fontSize: '0.9rem'}}>{item.status}</span>
                  </td>
                  <td style={{padding: '10px', textAlign: 'right'}}>
                    <button onClick={() => startEdit(item)} style={{marginRight: 5, background: '#00b5cc', padding: '5px 10px', fontSize: '0.8rem'}}>Edit</button>
                    <button onClick={() => handleDelete(item.id)} style={{background: '#d63d2e', padding: '5px 10px', fontSize: '0.8rem'}}>Șterge</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{padding: '20px', textAlign: 'center', color: '#888'}}>
                  Nu s-au găsit rezultate.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div style={{height: '50px'}}></div>
    </div>
  );
};

export default AdminPanel;
