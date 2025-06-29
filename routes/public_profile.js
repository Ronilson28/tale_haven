const express = require('express');
const router = express.Router();
const Autor = require('../models/Autor');
const Historia = require('../models/Historia');
const Capitulos = require('../models/Capitulo');
const verificarAutenticacao = require('../middlewares/auth');

// Rota pública para ver o perfil de outro autor
router.get('/:usuario', async (req, res) => {
  try {
    const autor = await Autor.findOne({usuario:req.params.usuario}).populate('historias').populate('seguidores').populate('seguindo');
    if (!autor) {
        req.session.mensagemErro = 'Autor não encontrado';
        return res.status(404).redirect('/');
    }
    
    let autorLogado = null;
    let autorSeguidores = [];

    if (req.session?.autor?.id) {
      autorLogado = await Autor.findById(req.session.autor.id);
      if (autorLogado.usuario === autor.usuario) {
        return res.redirect('/profile');
      }
      autorSeguidores = autor.seguidores.map(seg => seg._id.toString());
    }

    res.render('public_profile', {
      title: autor.nome +  ' - Tale Haven',
      autor,
      autorLogado,
      autorSeguidores,
      mensagemErro: req.session.mensagemErro || null
    });

    // Limpa as mensagens de erro após exibir
    req.session.mensagemErro = null;

  } catch (err) {
    console.error(err);
    req.session.mensagemErro = 'Erro ao carregar o perfil';
    res.status(500).redirect('/');
  }
});

// Rota para seguir um autor
router.post('/:id/seguir', verificarAutenticacao, async (req, res) => {
  try {
    const autorAlvoId = req.params.id;
    const autorAtualId = req.session.autor.id;

    if (autorAlvoId === autorAtualId) {
      req.session.mensagemErro = 'Você não pode seguir a si mesmo';
      return res.status(400).redirect(`/${req.session.autor.usuario}`);
    }

    const autorAlvo = await Autor.findById(autorAlvoId);
    const autorAtual = await Autor.findById(autorAtualId);

    if (!autorAlvo || !autorAtual) {
      req.session.mensagemErro = 'Autor não encontrado';
      return res.status(404).redirect('/');
    }

    const autorJaSeguindo = autorAtual.seguindo.includes(autorAlvo._id);

    if (autorJaSeguindo) {
      // Se já está seguindo, remove da lista
      autorAtual.seguindo.pull(autorAlvo._id);
      autorAlvo.seguidores.pull(autorAtual._id);
    } else {
      // Se não está seguindo, adiciona à lista
      autorAtual.seguindo.push(autorAlvo._id);
      autorAlvo.seguidores.push(autorAtual._id);
    }

    await autorAtual.save();
    await autorAlvo.save();

    res.redirect(`/${autorAlvo.usuario}`);
  } catch (err) {
    console.error(err);
    req.session.mensagemErro = 'Erro ao seguir/remover o autor';
    res.status(500).redirect('/');
  }
});

module.exports = router;