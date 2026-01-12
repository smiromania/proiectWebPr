const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// ATENȚIE: Completează parola ta de la MySQL la "password" dacă ai una!
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin1', 
  database: 'rick_and_morty'
});

const resetAdmin = async () => {
  const username = 'admin';
  const plainPassword = 'admin'; // <--- Aici setăm parola simplă "admin"

  try {
    // 1. Ștergem userul admin dacă există deja (ca să nu dea eroare de duplicat)
    await db.promise().query('DELETE FROM users WHERE username = ?', [username]);
    console.log('Userul vechi a fost șters (dacă exista).');

    // 2. Criptăm noua parolă
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // 3. Introducem noul user
    await db.promise().query('INSERT INTO users (username, password) VALUES (?, ?)', 
      [username, hashedPassword]
    );

    console.log('------------------------------------------------');
    console.log('SUCCES! Cont resetat.');
    console.log(`User: ${username}`);
    console.log(`Parola: ${plainPassword}`);
    console.log('------------------------------------------------');
    process.exit();

  } catch (err) {
    console.error('Eroare:', err);
    process.exit(1);
  }
};

resetAdmin();