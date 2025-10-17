const { error } = require('console');
const express = require('express');
const multer = require('multer');
const app = express();
const path = require('path');
const { queryObjects } = require('v8');
const dbConnection = require('./models/db'); 

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }
});

app.use(express.static(path.join(__dirname, 'src')));

function executePromisified(sql, values) {
    return new Promise((resolve, reject) => {
        dbConnection.query(sql, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'dashboard.html'))
})

// Rotas HTML
app.get('/dashboard', async (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'dashboard.html'))
})

app.get('/equipamentos', async (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'equipamentos.html'))
})

// POST
app.post('/equipamentos', upload.single('file-input'), async (req, res) => {
    const file = req.file;
    const { name, desc } = req.body

    if (!file) {
        return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });
    }

    try {
        const tipoMime = file.mimetype;
        const dadosBinarios = file.buffer; 

        const query = 'INSERT INTO equipamentos (nome_equipamento, descricao, tipo_mime, imagem) VALUES (?, ?, ?, ?)';
        const resultado = await executePromisified(query, [name, desc, tipoMime, dadosBinarios]);

        res.json({ 
            success: true, 
            message: 'Arquivo enviado e salvo com sucesso!', 
            id: resultado.insertId 
        });

    } catch (erro) {
        console.error('Erro ao salvar o arquivo:', erro);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
})

app.listen(8080, () => {
    
})