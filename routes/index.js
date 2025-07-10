var express = require('express');
const session = require('express-session');
const Historia = require('../models/Historia');
const Genero = require('../models/Genero');
const Autor = require('../models/Autor');
var router = express.Router();

// Rota GET para a página inicial
router.get('/', async (req, res) => {
  try {
    let destaque = req.session.destaque;

    if (!destaque) {
      const total = await Historia.countDocuments();
      const random = Math.floor(Math.random() * total);
      const historiaDestaque = await Historia.findOne().skip(random).populate('id_autor');
      if (historiaDestaque) {
        req.session.destaque = historiaDestaque;
        destaque = historiaDestaque;
      }
    }

    const usados = await Historia.aggregate([
      { $unwind: "$genero" },
      { $group: { _id: "$genero" } }
    ]);
    const nomesGenerosUsados = usados.map(g => g._id);
    // Busca apenas os gêneros cadastrados que têm histórias
    const generosComHistorias = await Genero.find({ nome: { $in: nomesGenerosUsados } });

    // Para cada gênero, buscar até 10 histórias
    const categoriasComHistorias = await Promise.all(
      generosComHistorias.map(async (genero) => {
        const historias = await Historia.find({ genero: genero.nome }).limit(10).populate('id_autor');
        return { nome: genero.nome, historias };
      })
    );

    res.render('index', {
      title: 'Tale Haven',
      destaque,
      categorias: categoriasComHistorias
    });

  } catch (err) {
    console.error('Erro ao carregar página inicial:', err);
    req.session.mensagemErro = 'Erro ao carregar página inicial.';
    res.status(500).redirect('/login');
  }
});

module.exports = router;
