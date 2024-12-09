const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const lembretes = {};
let contador = 0;

// Rota para obter todos os lembretes
app.get('/lembretes', (req, res) => {
  res.send(lembretes);
});

app.put('/lembretes', async (req, res) => {
  contador++;
  const { texto } = req.body;
  lembretes[contador] = {
    contador,
    texto,
  };

  await axios.post('http://localhost:10000/eventos', {
    tipo: 'LembreteCriado',
    dados: {
      contador,
      texto,
    },
  });

  res.status(201).send(lembretes[contador]);
});

// Rota para receber eventos
app.post('/eventos', (req, res) => {
  console.log('Evento recebido:', req.body);
  res.status(200).send({ msg: 'ok' });
});

app.listen(4000, () => {
  console.log('Lembretes. Porta 4000');
});