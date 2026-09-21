require('dotenv').config();

const mysql = require('mysql2');

const database = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

database.connect((error) => {
  if (error) {
    console.log('Database connection failed');
    console.log(error);
    return;
  }

  console.log('Connected to Hostess database');
});

module.exports = database;