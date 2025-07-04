const express = require('express');
const router = express.Router();
const Autor = require('../models/Autor');
const Historia = require('../models/Historia');
const Capitulo = require('../models/Capitulo');
const Genero = require('../models/Genero');
const upload = require('../middlewares/upload');
const verificarAutenticacao = require('../middlewares/auth');
const verificarModerador = require('../middlewares/auth_moderator');

router.get('/dashboard', verificarAutenticacao, verificarModerador, async (req, res) => {
  const sugestoesPendentes = await SugestaoGenero.find({ status: 'pendente' }).populate('sugeridoPor');
  
  res.render('dashboard_moderador', {
    title: 'Painel do Moderador',
    sugestoesPendentes
  });
});
