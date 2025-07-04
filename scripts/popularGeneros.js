const mongoose = require('mongoose');
const Genero = require('../models/Genero');
require('dotenv').config();

async function popularGeneros() {
  await mongoose.connect(process.env.MONGODB_URI_LOCAL || 'mongodb://localhost:27017/tale-haven', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const generosIniciais = [
    "Ação",
    "Aventura",
    "Comédia",
    "Drama",
    "Fantasia",
    "Ficção Científica",
    "Mistério",
    "Romance",
    "Suspense",
    "Terror"
  ];

  for (const nome of generosIniciais) {
    const existente = await Genero.findOne({ nome });
    if (!existente) {
      await Genero.create({ nome, status: 'Aprovado' });
      console.log(`Gênero '${nome}' criado.`);
    } else {
      console.log(`Gênero '${nome}' já existe.`);
    }
  }

  await mongoose.disconnect();
  console.log("✔️ Gêneros populados com sucesso!");
}

popularGeneros().catch(err => {
  console.error('Erro ao popular os gêneros:', err);
  mongoose.disconnect();
});