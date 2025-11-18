"use strict"; 

const sqlite = require('sqlite3'); 
const db = new sqlite.Database('Dati.db', (err) => {
    if (err) {
        console.error('Error while connecting to the database:', err.message);
        process.exit(1);  // Termina il processo se c'è un errore
    } else {
        console.log('Connected to the SQLite database.');
    }
}); 

module.exports = db; 