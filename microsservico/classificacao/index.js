const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const palavraChave = "importante";

const funcoes = {
    ObservacaoCriada: (observacao) => {
        observacao.status = observacao.texto.includes(palavraChave) ? "importante" : "comum";
        
        axios.post("http://localhost:10000/eventos", {
            tipo: "ObservacaoClassificada",
            dados: observacao,
        }).catch(err => {
            console.error("Erro ao enviar o evento classificado:", err.message);
        });
    },
};

app.post("/eventos", (req, res) => {
    const funcao = funcoes[req.body.tipo];
    if (funcao) {
        funcao(req.body.dados);
    } else {
        console.log(`Tipo de evento não tratado: ${req.body.tipo}`);
    }
    res.status(200).send({ msg: "ok" });
});

app.listen(7000, () => {
    console.log("Classificação. Porta 7000");
});