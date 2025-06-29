const express = require('express');
const router = express.Router();
const Autor = require('../models/Autor');
const Historia = require('../models/Historia');
const upload = require('../middlewares/upload');
const verificarAutenticacao = require('../middlewares/auth');

// Rota GET para exibir o perfil do autor
router.get('/', verificarAutenticacao, async (req, res) => {
  try {
    const autor = await Autor.findById(req.session.autor.id).populate('historias').populate('seguidores').populate('seguindo');
    if (!autor) {
      return res.status(404).render('index', {
        title: 'Tale Haven',
        mensagemErro: "Autor não encontrado."
      });
    }
    res.render('profile', {
      title: autor.nome + ' - Tale Haven',
      autor,
      mensagemErro: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('index',{
      title: 'Tale Haven',
      mensagemErro: 'Erro ao carregar o perfil.'
    });
  }
});

// Rota GET - Formulário de edição de perfil
router.get('/editar', verificarAutenticacao, async (req, res) => {
  try {
    const autor = await Autor.findById(req.session.autor.id);
    if (!autor) {
      return res.status(404).redirect('/profile');
    }
    res.render('edit_profile', { 
      title: 'Editar Perfil - ' + autor.nome, 
      autor, 
      mensagemErro: null 
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('profile',{
      title: req.session.autor.nome + 'Tale Haven',
      mensagemErro: 'Erro ao carregar o formulário de edição.'
    });
  }
});

// Rota POST - Processa edição de perfil
router.post('/editar', verificarAutenticacao, upload.single('fotoPerfil'), async (req, res) => {
  try {
    const { nome, usuario, biografia, twitter, instagram, facebook, sitePessoal } = req.body;

    const autor = await Autor.findById(req.session.autor.id);
    if (!autor) {
      return res.status(404).redirect('/profile');
    }
    
    if (req.file) {
      // Se uma nova foto foi enviada, atualiza o caminho da fotoPerfil
      autor.fotoPerfil = '/uploads/perfil/' + req.file.filename;
    }

    // Atualiza os campos do autor
    autor.nome = nome || autor.nome;
    autor.usuario = usuario || autor.usuario;
    autor.biografia = biografia || autor.biografia;

    // Atualiza as redes sociais
    autor.redesSociais = {
      twitter,
      instagram,
      facebook,
      sitePessoal
    };

    await autor.save();

    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    res.status(500).render('edit_profile', {
      title: 'Editar Perfil' + req.session.autor.nome,
      mensagemErro: 'Erro ao atualizar perfil. Tente novamente.'
    });
  }
});

module.exports = router;