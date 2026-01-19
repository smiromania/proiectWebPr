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
    name: '', status: 'Alive', species: '', gender: '', image: ''
  });

  const authConfig = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (token) fetchItems();
    // eslint-disable-next-line
  }, [token]);

  const fetchItems = async (query = '') => {
    try {
      const url = `http://localhost:3001/api/characters?limit=100&search=${query}`;
      const res = await axios.get(url);
      setItems(res.data.items ? res.data.items : res.data);
    } catch (err) { console.error(err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/login', authData);
      setToken(res.data.accessToken);
      localStorage.setItem('token', res.data.accessToken);
    } catch (err) { setErrorMsg('Acces respins.'); }
  };

  const handleLogout = () => { setToken(''); localStorage.removeItem('token'); setItems([]); };

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
        alert('Wubba Lubba Dub Dub! (Adăugat)');
      }
      setEditingId(null);
      setFormData({ name: '', status: 'Alive', species: '', gender: '', image: '' });
      fetchItems(searchTerm);
    } catch (err) { alert('Eroare!'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Elimini acest personaj din realitate?')) {
      await axios.delete(`http://localhost:3001/api/characters/${id}`, authConfig);
      fetchItems(searchTerm);
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormData({ name: item.name, status: item.status, species: item.species, gender: item.gender, image: item.image });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <form onSubmit={handleLogin} className="bg-gray-800 border border-lime-500 p-8 rounded-xl shadow-lg shadow-lime-500/20 w-full max-w-sm flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-center text-lime-400 mb-4">Portal Login</h1>
          {errorMsg && <div className="bg-red-900/50 text-red-400 p-2 rounded text-center border border-red-700">{errorMsg}</div>}
          <input type="text" placeholder="Username" className="bg-gray-900 border border-gray-600 text-white p-3 rounded focus:border-lime-500 outline-none" value={authData.username} onChange={e => setAuthData({...authData, username: e.target.value})} required />
          <input type="password" placeholder="Password" className="bg-gray-900 border border-gray-600 text-white p-3 rounded focus:border-lime-500 outline-none" value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})} required />
          <button className="bg-lime-500 text-black font-bold py-3 rounded hover:bg-lime-400 transition shadow-lg shadow-lime-500/40">Log In</button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8 bg-gray-800 p-4 rounded-lg border border-lime-900 shadow-md">
        <h2 className="text-2xl font-bold text-lime-400">Admin Dashboard</h2>
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 font-bold">Log Out</button>
      </div>
      
      <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">{editingId ? 'Modifică' : 'Adaugă'} Personaj</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
           <input type="text" placeholder="Nume" className="bg-gray-900 border border-gray-600 text-white p-2 rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <select className="bg-gray-900 border border-gray-600 text-white p-2 rounded" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
               <option value="Alive">Alive</option> <option value="Dead">Dead</option> <option value="unknown">Unknown</option>
             </select>
             <input type="text" placeholder="Specie" className="bg-gray-900 border border-gray-600 text-white p-2 rounded" value={formData.species} onChange={e => setFormData({...formData, species: e.target.value})} />
             <input type="text" placeholder="Gen" className="bg-gray-900 border border-gray-600 text-white p-2 rounded" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} />
           </div>
           <div className="border-2 border-dashed border-gray-600 p-4 rounded text-center cursor-pointer hover:bg-gray-700/50">
             <label className="block text-gray-400 mb-2">Imagine</label>
             <input type="file" className="text-gray-400" accept="image/*" onChange={handleImageUpload} />
           </div>
           <div className="flex gap-4">
             <button type="submit" className={`flex-1 py-2 rounded text-black font-bold transition shadow-lg ${editingId ? 'bg-orange-500 hover:bg-orange-400' : 'bg-lime-500 hover:bg-lime-400 shadow-lime-500/30'}`}>{editingId ? 'Salvează' : 'Adaugă'}</button>
             {editingId && <button type="button" onClick={() => {setEditingId(null); setFormData({name:'', status:'Alive', species:'', gender:'', image:''})}} className="bg-gray-600 text-white px-6 rounded">Anulează</button>}
           </div>
        </form>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
        <div className="p-4 bg-gray-900 flex justify-between items-center border-b border-gray-700">
          <h3 className="text-gray-300">Bază de Date</h3>
          <div className="flex gap-2">
            <input type="text" placeholder="Caută..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-gray-800 border border-gray-600 text-white px-3 py-1 rounded" />
            <button onClick={(e) => { e.preventDefault(); fetchItems(searchTerm); }} className="bg-lime-500 text-black px-3 py-1 rounded font-bold hover:bg-lime-400">Go</button>
          </div>
        </div>
        <table className="w-full text-left text-gray-300">
          <thead className="bg-gray-900 text-lime-400 uppercase text-sm">
            <tr><th className="p-3">Img</th><th className="p-3">Nume</th><th className="p-3">Status</th><th className="p-3 text-right">Acțiuni</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                <td className="p-3"><img src={item.image} className="w-10 h-10 rounded-full object-cover border border-gray-600" alt="" /></td>
                <td className="p-3 font-bold text-white">{item.name}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs text-black font-bold ${item.status==='Alive'?'bg-lime-500':item.status==='Dead'?'bg-red-500':'bg-gray-400'}`}>{item.status}</span></td>
                <td className="p-3 text-right"><button onClick={() => startEdit(item)} className="text-blue-400 hover:text-blue-300 mr-3">Edit</button><button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-400">Șterge</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
