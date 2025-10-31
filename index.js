const { error } = require('console');
const express = require('express');
const multer = require('multer');
const app = express();
const path = require('path');
const { queryObjects } = require('v8');
const dbConnection = require('./models/db'); 
const { exec } = require('child_process');

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 100 * 1024 * 1024 }
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
    res.sendFile(path.join(__dirname, 'src/html', 'dashboard.html'))
})

app.get('/equipamentos', async (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html', 'equipamentos.html'))
})

app.get('/reservas', async (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html', 'reservas.html'))
})

app.get('/devolucoes', async (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html', 'devolucoes.html'))
})

app.get('/relatorios', async (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html', 'relatorios.html'))
})

app.get('/configuracoes', async (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html', 'configuracoes.html'))
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

app.post('/reservas', async (req, res) => {
    const { name, id, initialDatetime, finalDatetime, obs } = req.body

    try {
        const query = 'INSERT INTO reservas (id_equipamento, nome_solicitante, datahora_reserva, datahora_devolucao, observacao) VALUES (?, ?, ?, ?, ?)'
        await executePromisified(query, [id, name, initialDatetime, finalDatetime, obs])

        const reservas = await executePromisified('SELECT * FROM reservas')

        res.json({
            success: true,
            reservas
        })
        
    } catch (err) {
        console.error(err)
        res.status(500).json({ succes: false, message: 'Deu ruim no Servidor'})
    }
})

app.post('/devolucoes', async (req, res) => {
    const { id, name, dataDelo, condicao } = req.body

    try {
        const query = 'INSERT INTO devolucoes (id_reserva, nome_devolutor, data_devolucao, condicao) VALUES (?, ?, ?, ?)'
        await executePromisified(query, [id, name, dataDelo, condicao])

    } catch (err) {
        console.error(err)
        res.status(500).json({ succes: false, message: 'Deu ruim no Servidor'})
    }
})

// UPDATE
app.put('/equipamentos/:id', async (req, res) => {
    const { id } = req.params;
    const { name, desc } = req.body;

    try {
        const results = await executePromisified('UPDATE equipamentos SET nome_equipamento = ?, descricao = ? WHERE id = ?', [name, desc, id]);
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Registro não encontrado' });
        }
        res.json({ message: 'Dados atualizados com sucesso' });
    } catch (err) {
        console.error('Erro no MySQL:', err);
        res.status(500).json({ error: err.message });
    }
})

// DELETE
app.delete('/equipamentos', async (req, res) => {
    const { id } = req.body
    const query = 'DELETE FROM equipamentos WHERE id = ?'

    try {
        const result = await executePromisified(query, [id])
        res.json({ success: true, result })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message})
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

app.get('/reservas-data', async (req, res) => {
    try {
        const query = 'SELECT * FROM reservas'
        const reservas = await executePromisified(query)

        res.json({ success: true, reservas })
    } catch (err) {
        console.error('Erro ao carregar dados', err)
        res.status(500).json({success: false, message: 'Erro no servidor'})
    }
})

app.get('/devolucoes-data', async (req, res) => {
    try {
        const query = 'SELECT * FROM devolucoes'
        const devolucoes = await executePromisified(query)

        res.json({ success: true, devolucoes })
    } catch(err) {
        console.error('Erro ao carregar dados', err)
        res.status(500).json({success: false, message: 'Erro no servidor'})
    }
})

app.listen(8080, () => {
    
})