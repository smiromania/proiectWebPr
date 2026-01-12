const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin1', 
  database: 'rick_and_morty'
});

const createAdmin = async () => {
  const username = 'admin'; // <--- USERNAME-UL TAU
  const rawPassword = 'admin'; // <--- PAROLA TA

  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  db.query('INSERT INTO users (username, password) VALUES (?, ?)', 
    [username, hashedPassword], 
    (err, result) => {
      if (err) {
        console.error('Eroare: Probabil userul exista deja.', err.message);
      } else {
        console.log('Succes! Admin creat.');
        console.log(`User: ${username}`);
        console.log(`Pass: ${rawPassword}`);
      }
      db.end();
    }
  );
};

createAdmin();