// server.js
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const db = require('./database'); 
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Frontend ki HTML/CSS files serve karne ke liye sabse sahi tarika
app.use(express.static(path.join(__dirname)));

// API route jo HTML form se data lega
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Sabhi fields bharein.' });
    }

    const sqlQuery = "INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)";
    
    const [result] = await db.query(sqlQuery, [name, email, message]);

    console.log('Message database mein save ho gaya:', result.insertId);
    res.status(201).json({ success: true, message: 'Aapka message mil gaya hai!' });

  } catch (error) {
    console.error('Message save karne mein error:', error.message);
    res.status(500).json({ error: 'Server par koi samasya hai.' });
  }
});

// 2. Agar koi browser mein '/' open kare toh directly index.html send ho jaye
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server http://localhost:${port} par chal raha hai`);
});
