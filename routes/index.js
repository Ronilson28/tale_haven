var express = require('express');
const session = require('express-session');
const Historia = require('../models/Historia');
const Genero = require('../models/Genero');
var router = express.Router();

// Rota GET para a página inicial
router.get('/', async (req, res) => {
  console.log('Autor na sessão atual:', req.session.autor || 'Usuário não autenticado');
  
  try {
    let destaque = req.session.destaque;

    if (!destaque) {
      const total = await Historia.countDocuments();
      const random = Math.floor(Math.random() * total);
      const historiaDestaque = await Historia.findOne().skip(random).populate('id_autor');

      if (historiaDestaque) {
        req.session.destaque = historiaDestaque;
        destaque = historiaDestaque;
        console.log('Novo destaque gerado:', destaque.titulo);
      } else {
        console.log('Nenhuma história encontrada para destaque.');
      }
    } else {
      console.log('Destaque mantido da sessão:', destaque.titulo);
    }

    const usados = await Historia.aggregate([
      { $unwind: "$genero" },
      { $group: { _id: "$genero" } }
    ]);
    const nomesGenerosUsados = usados.map(g => g._id);
    // Busca apenas os gêneros cadastrados que têm histórias
    const generosComHistorias = await Genero.find({ nome: { $in: nomesGenerosUsados } });
    console.log('Gêneros cadastrados:', generosComHistorias.map(g => g.nome));

    // Para cada gênero, buscar até 10 histórias
    const categoriasComHistorias = await Promise.all(
      generosComHistorias.map(async (genero) => {
        const historias = await Historia.find({ genero: genero.nome }).limit(10).populate('id_autor');
        return { nome: genero.nome, historias };
      })
    );

    const mensagemErro = req.session.mensagemErro || null;
    req.session.mensagemErro = null;

    res.render('index', {
      title: 'Tale Haven',
      mensagemErro: mensagemErro,
      destaque,
      categorias: categoriasComHistorias
    });
    req.session.mensagemErro = null;

  } catch (err) {
    console.error('Erro ao carregar página inicial:', err);
    res.status(500).render('index', {
      title: 'Tale Haven',
      mensagemErro: 'Erro ao carregar página inicial.',
      destaque: null,
      categorias: []
    });
  }
});

module.exports = router;
