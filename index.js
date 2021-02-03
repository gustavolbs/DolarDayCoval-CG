const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");

dotenv.config();

const dolCust = async (value) => {
  const response = await fetch(
    "https://api.cambiodaycoval.com.br/api/moeda/simple"
  );
  const data = await response.json();
  const moeda = data.data.filter((item) => item.moeda_slug === "USD");
  const taxaLoja = moeda[0].moeda_lojas.filter(
    (item) => item.loja_id === 3078
  )[0].loja_spread;

  var convertido =
    value *
    (moeda[0].moeda_taxa.toFixed(2) * (taxaLoja + 1)).toFixed(2) *
    1.011;

  return {
    dolars: value,
    dolarAtual: (moeda[0].moeda_taxa.toFixed(2) * (taxaLoja + 1)).toFixed(2),
    final: `U$ ${value} = ${(convertido + 0.01).toFixed(2)}`,
  };
};

app.use(cors());

app.get("/:value?", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");

  const dol = await dolCust(req.params.value || 2500);
  res.send(dol);
});

app.get("/api/:value?", async (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");

  const dol = await dolCust(req.params.value || 2500);
  res.send(dol);
});

// app.listen(process.env.PORT || 3333);

module.exports = app;
