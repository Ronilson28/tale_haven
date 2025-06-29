const express = require('express');
var router = express.Router();
const Autor = require('../models/Autor');

// Rota GET para exibir o formulário de cadastro
router.get('/', (req, res) => {
  res.render('sign_up', {
    title: 'Cadastre-se - Portal de Histórias',
    mensagemErro: null
  });
});

// Rota POST para processar o cadastro de autor
router.post('/', async (req, res) => {
  const { nome, usuario, email, confirmEmail, senha, confirmSenha, dataNascimento, preferenciasGenero } = req.body;

  // Validação de campos obrigatórios
  if (!nome || !email || !confirmEmail || !senha || !confirmSenha) {
    return res.render('sign_up', {
      title: 'Cadastre-se - Portal de Histórias',
      mensagemErro: 'Todos os campos são obrigatórios'
    });
  }

  // Validação de correspondência de e-mails
  if (email !== confirmEmail) {
    return res.render('sign_up', {
      title: 'Cadastre-se - Portal de Histórias',
      mensagemErro: 'Os e-mails não coincidem'
    });
  }

  // Validação de correspondência de senhas
  if (senha !== confirmSenha) {
    return res.render('sign_up', {
      title: 'Cadastre-se - Portal de Histórias',
      mensagemErro: 'As senhas não coincidem'
    });
  }

  // Validação de formato de e-mail
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.render('sign_up', {
      title: 'Cadastre-se - Portal de Histórias',
      mensagemErro: 'Formato de e-mail inválido'
    });
  }

  // Validação de força da senha (mínimo 8 caracteres)
  if (senha.length < 8) {
    return res.render('sign_up', {
      title: 'Cadastre-se - Portal de Histórias',
      mensagemErro: 'A senha deve ter pelo menos 8 caracteres'
    });
  }
  
  // Validação de nome de usuário
  const usuarioRegex = /^(?:[a-z][a-z0-9._]*|_+[a-z][a-z0-9._]*)$/;
  if (!usuarioRegex.test(usuario)) {
    return res.render('sign_up', {
      title: 'Cadastre-se - Portal de Histórias',
      mensagemErro: 'Nome de usuário inválido! Exemplos válidos: "username123", "user.name", "user_name", "_username"'
    });
  }

  // Garante que preferenciasGenero seja um array
  let preferencias = [];
  
  // Verifica se preferenciasGenero foi fornecido e é um array ou string
  if (preferenciasGenero) {
    if (Array.isArray(preferenciasGenero)) {
      preferencias = preferenciasGenero.map(str => str.trim());//.filter(str => str !== '');
    } else {
      preferencias = [preferenciasGenero.trim()]; // caso tenha só um
    }
  }
  
  try {
    // Verifica se já existe um autor com o mesmo e-mail ou nome de usuário
    const autorExistente = await Autor.findOne({ email });
    if (autorExistente) {
      return res.render('sign_up', {
        title: 'Cadastre-se - Portal de Histórias',
        mensagemErro: 'Este e-mail já está cadastrado.' });
    }

    const nomeUsuarioExistente = await Autor.findOne({ usuario });
    if (nomeUsuarioExistente) {
      return res.render('sign_up', {
        title: 'Cadastre-se - Portal de Histórias',
        mensagemErro: 'Este nome de usuário já está em uso.' });
    }

    // Cria um novo autor
    const novoAutor = new Autor({
      nome,
      usuario,
      email,
      senha,
      dataNascimento,
      preferenciasGenero: preferencias,
    });

    await novoAutor.save();

    console.log('✅ Autor cadastrado:', novoAutor);
    res.redirect('/login');
  } catch (err) {
    console.error('❌ Erro ao cadastrar autor:', err);
    res.status(500).render('sign_up', {
      title: 'Cadastre-se - Portal de Histórias',
      mensagemErro: 'Erro interno ao processar o cadastro. Tente novamente mais tarde.'
    });
  }
});

module.exports = router;