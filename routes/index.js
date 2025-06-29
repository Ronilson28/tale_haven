var express = require('express');
const session = require('express-session');
const Historia = require('../models/Historia');
var router = express.Router();

// Rota GET para a página inicial
// Exibe a história em destaque e as últimas 10 histórias de cada categoria
router.get('/', async (req, res) => {
  console.log('Autor na sessão atual:', req.session.autor || 'Usuário não autenticado');
  try {
    const total = await Historia.countDocuments();
    const random = Math.floor(Math.random() * total);
    const destaque = await Historia.findOne().skip(random).populate('id_autor');
    //const destaque = await Historia.findOne().sort({ dataCriacao: -1 }).populate('id_autor');
    const categorias = ['Ação', 'Drama', 'Fantasia', 'Ficção Científica', 'LGBT', 'Mistério', 'Romance', 'Suspense', 'Terror'];
    
    if (!destaque) {
      console.log('Nenhuma história encontrada para destaque.');
    } else {
      console.log('História em destaque:', destaque.titulo);
    }
    console.log('Categorias disponíveis:', categorias);
    
    // Busca as últimas 10 histórias de cada categoria
    const categoriasComHistorias = await Promise.all(
      categorias.map(async (cat) => {
        const historias = await Historia.find({ genero: cat }).limit(10).populate('id_autor');
        return { nome: cat, historias };
      })
    );
    
    const mensagemErro = req.session.mensagemErro || null;
    req.session.mensagemErro = null;

    res.render('index', {
      title: 'Tale Haven',
      mensagemErro: mensagemErro,
      destaque,
      categorias: categoriasComHistorias,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('index', {
      title: 'Tale Haven',
      mensagemErro: 'Erro ao carregar página inicial.'
  });
  }
});

module.exports = router;
