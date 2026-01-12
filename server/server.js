const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
// Setări pentru imagini mari
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const SECRET_KEY = 'secretul_meu_super_secret';

// --- CONFIGURARE BAZA DE DATE ---
// VERIFICĂ PAROLA AICI! Dacă ai parolă la MySQL, pune-o între ghilimele.
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'admin1', // <--- AI PAROLĂ AICI?
  database: 'rick_and_morty'
});

// Test conexiune
db.getConnection((err, connection) => {
  if (err) {
    console.error('EROARE CONEXIUNE DB:', err.message);
  } else {
    console.log('Conectat cu succes la MySQL!');
    connection.release();
  }
});

// --- MIDDLEWARE AUTENTIFICARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ==========================================
// RUTE PUBLICE (Vizibile pentru Oricine)
// ==========================================

// 1. Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(400).json({ msg: 'User inexistent' });

    const user = results[0];
    if (await bcrypt.compare(password, user.password)) {
      const accessToken = jwt.sign({ name: user.username }, SECRET_KEY, { expiresIn: '12h' });
      res.json({ accessToken });
    } else {
      res.status(401).json({ msg: 'Parolă incorectă' });
    }
  });
});

// 2. GET ALL CHARACTERS (Public)
app.get('/api/characters', (req, res) => {
  // Parametrii din URL
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  const search = req.query.search || '';
  const status = req.query.status || '';
  const species = req.query.species || ''; // <--- PARAMETRU NOU

  console.log(`Cerere: Page=${page}, Search="${search}", Species="${species}"`);

  // --- PASUL 1: Construim condițiile de filtrare (WHERE) ---
  // Această parte este comună ambelor interogări (Numărare și Extragere date)
  let whereClause = ' WHERE 1=1';
  const filterParams = [];

  // Logica de căutare în JSON
  if (search) {
    const term = search.toLowerCase();
    // Căutăm DOAR în cheile "name" și "species"
    whereClause += ' AND (LOWER(data->>"$.name") LIKE ? OR LOWER(data->>"$.species") LIKE ?)';
    filterParams.push(`%${term}%`, `%${term}%`);
  }
  
  if (status) {
    whereClause += ' AND data->>"$.status" = ?';
    filterParams.push(status);
  }
  
  if (species) {
    whereClause += ' AND data->>"$.species" = ?';
    filterParams.push(species);
  }

  // --- PASUL 2: Interogarea de NUMĂRARE (Câte sunt în total?) ---
  const countSql = `SELECT COUNT(*) as total FROM data ${whereClause}`;

  db.query(countSql, filterParams, (err, countResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Database error', details: err.message });
    }

    const totalItems = countResults[0].total;

    // --- PASUL 3: Interogarea de DATE (Aduce elementele paginii) ---
    const dataSql = `SELECT id, data FROM data ${whereClause} LIMIT ? OFFSET ?`;
    
    // Pentru interogarea de date, avem nevoie de filtre + limită + offset
    const dataParams = [...filterParams, limit, offset];

    db.query(dataSql, dataParams, (err, dataResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error', details: err.message });
      }

      // Transformăm rezultatele (Parse JSON)
      const formatted = dataResults.map(row => {
        const charData = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        return { id: row.id, ...charData };
      });

      // --- PASUL 4: Trimitem răspunsul complex (Date + Total) ---
      res.json({
        items: formatted,  // Lista de caractere (max 10, 20 etc.)
        total: totalItems  // Numărul total din baza de date (ex: 500)
      });
    });
  });
});

// 3. GET SINGLE CHARACTER (Public)
app.get('/api/characters/:id', (req, res) => {
  db.query('SELECT id, data FROM data WHERE id = ?', [req.params.id], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ msg: 'Not found' });
    
    const row = result[0];
    const charData = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
    const char = { id: row.id, ...charData };
    
    res.json(char);
  });
});


// ==========================================
// RUTE PRIVATE (Doar Admin - Necesită Token)
// ==========================================

app.post('/api/characters', authenticateToken, (req, res) => {
  const jsonData = JSON.stringify(req.body);
  db.query('INSERT INTO data (data) VALUES (?)', [jsonData], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, msg: 'Adăugat' });
  });
});

app.put('/api/characters/:id', authenticateToken, (req, res) => {
  const jsonData = JSON.stringify(req.body);
  db.query('UPDATE data SET data = ? WHERE id = ?', [jsonData, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ msg: 'Actualizat' });
  });
});

app.delete('/api/characters/:id', authenticateToken, (req, res) => {
  db.query('DELETE FROM data WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ msg: 'Șters' });
  });
});
app.get('/api/species', (req, res) => {
  // Selectăm valorile distincte de la cheia "species"
  const sql = 'SELECT DISTINCT data->>"$.species" AS species FROM data ORDER BY species ASC';
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    
    // Rezultatul vine sub formă de obiecte: [{species: "Alien"}, {species: "Human"}]
    // Îl transformăm într-un array simplu: ["Alien", "Human", ...]
    const speciesList = results
      .map(row => row.species)
      .filter(s => s); // Eliminăm valorile null sau goale, dacă există
      
    res.json(speciesList);
  });
});
app.listen(3001, () => {
  console.log('Server running on port 3001');
});