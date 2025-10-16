const sqlite3 = require("sqlite3").verbose();

// Create or open DB file
const db = new sqlite3.Database("./smartcrop.db");

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    soil TEXT,
    water TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    crop TEXT,
    
    fertilizer TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;
