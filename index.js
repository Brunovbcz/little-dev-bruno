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
        const selectQuery = 'SELECT * FROM equipamentos'
        const resultado = await executePromisified(query, [name, desc, tipoMime, dadosBinarios]);
        const equipamentos = await executePromisified(selectQuery)
        const equipamentosProntos = equipamentos.map(row => {
            const dataUrl = `data:${row.tipo_mime};base64,${row.imagem.toString('base64')}`
          
            return {
              id: row.id,
              nome: row.nome_equipamento,
              descricao: row.descricao,
              src: dataUrl
            }
          })

        res.json({ 
            success: true, 
            message: 'Arquivo enviado e salvo com sucesso!',
            resultado,
            equipamentosProntos
        });

    } catch (erro) {
        console.error('Erro ao salvar o arquivo:', erro);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
})

// DELETE
app.delete('/equipamentos', async (req, res) => {
    console.log(req)
    const { id } = req.body
    const query = 'DELETE FROM equipamentos WHERE id = ?'

    try {
        const result = await executePromisified(query, [id])
        res.json({ success: true, result })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
})

// GET
app.get('/equipamentos-data', async (req, res) => {
    try {
        const query = 'SELECT * FROM equipamentos'
        const equipamentos = await executePromisified(query);
        const equipamentosProntos = equipamentos.map(row => {
            const dataUrl = `data:${row.tipo_mime};base64,${row.imagem.toString('base64')}`
          
            return {
              id: row.id,
              nome: row.nome_equipamento,
              descricao: row.descricao,
              src: dataUrl
            }
          })
        res.json({ success: true, equipamentosProntos })
    } catch (err) {
        console.error('Erro ao carregar dados', err)
        res.status(500).json({success: false, message: 'Erro no servidor'})
    }
})

app.listen(8080, () => {
    
})