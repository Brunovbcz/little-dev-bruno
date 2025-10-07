const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'))
})

// Rotas HTML
app.get('/dashboard', async (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'dashboard.html'))
})

app.get('/equipamentos', async (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'equipamentos.html'))
})

app.listen(8080, () => {
    
})