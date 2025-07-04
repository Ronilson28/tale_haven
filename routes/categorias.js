const express = require('express');
const router = express.Router();
const Historia = require('../models/Historia');
const Genero = require('../models/Genero');

router.get('/', async (req, res) => {
  try {
    const generos = await Genero.find().sort({ nome: 1 });

    const mensagemErro = req.session.mensagemErro || null;
    req.session.mensagemErro = null;

    res.render('categorias',
    {
      title: 'Categorias - Tale Haven',
      generos,
      mensagemErro: mensagemErro
    });

  } catch (err) {
    console.error(err);
    res.status(500).render('/',
    {
      title: 'Tale Haven',
      mensagemErro: 'Erro ao carregar categorias'
    });
  }
});

router.get('/:nome', async (req, res) => {
  try {
    const generoNome = req.params.nome.replace(/-/g, ' ');

    // Confere se o gênero existe
    const genero = await Genero.findOne({ nome: { $regex: new RegExp('^' + generoNome + '$', 'i') }});
    if (!genero) {
      req.session.mensagemErro = 'Gênero não encontrado'
      return res.status(404).redirect('/categorias');
    }

    // Busca histórias com esse gênero
    const historias = await Historia.find({ genero: { $regex: new RegExp('^' + genero.nome + '$', 'i')} }).populate('id_autor');
    
    res.render('categorias_genero', {
      title: `${genero.nome} - Tale Haven`,
      genero: genero.nome,
      historias,
      mensagemErro: null
    });

  } catch (err) {
    console.error(err);
    res.status(500).render('500', { mensagem: 'Erro ao carregar histórias do gênero' });
  }
});

module.exports = router;
