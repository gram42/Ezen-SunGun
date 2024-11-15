// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 9090;

// 정적 파일 제공 (HTML, CSS, JS 파일 등)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});