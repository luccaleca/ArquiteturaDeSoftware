const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

const observacoesPorLembreteId = {};

// Rota para adicionar observações a um lembrete específico
app.put('/lembretes/:id/observacoes', async (req, res) => {
    const idObs = uuidv4();
    const { texto } = req.body;

    // Acessa as observações do lembrete específico ou inicializa uma lista vazia
    const observacoesDoLembrete = observacoesPorLembreteId[req.params.id] || [];

    // Adiciona a nova observação com status 'aguardando'
    observacoesDoLembrete.push({ id: idObs, texto, status: 'aguardando' });
    
    // Atualiza o conjunto de observações para o lembrete
    observacoesPorLembreteId[req.params.id] = observacoesDoLembrete;

    // Emite um evento para um barramento de eventos
    await axios.post('http://localhost:10000/eventos', {
        tipo: "ObservacaoCriada",
        dados: {
            id: idObs,
            texto,
            lembreteId: req.params.id,
            status: 'aguardando'
        }
    });

    res.status(201).send(observacoesDoLembrete);
});

// Rota para receber eventos
app.post('/eventos', (req, res) => {
    console.log('Evento recebido:', req.body);
    res.status(200).send({ msg: 'ok' });
});

// Rota para obter observações de um lembrete específico
app.get('/lembretes/:id/observacoes', (req, res) => {
    res.send(observacoesPorLembreteId[req.params.id] || []);
});

app.listen(5000, () => {
    console.log('Observacoes. Porta 5000');
});