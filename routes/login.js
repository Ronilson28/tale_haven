const express = require('express');
var router = express.Router();
const Autor = require('../models/Autor');

// Rota GET para exibir o formulário de login
router.get('/', (req, res) => {
  res.render('login', {
    title: 'Login - Tale Haven',
    mensagemErro: null
  });
});

// Rota POST para processar o login
router.post('/', async (req, res) => {
  console.log('REQ.BODY:', req.body);

  const { email, senha } = req.body;

  try {
    // Verifica se existe autor com esse e-mail
    const autor = await Autor.findOne({ email });
    if (!autor) {
      return res.render('login', {
        title: 'Login - Tale Haven',
        mensagemErro: 'E-mail não cadastrado'
      });
    }
    // Log para depuração do e-mail
    console.log('E-mail digitado:', req.body.email);
    // Log para depuração da senha
    console.log('Senha digitada:', req.body.senha);

    // Verifica se a senha está correta
    if (!senha) {
      return res.render('login', {
        title: 'Login - Tale Haven',
        mensagemErro: 'Senha não informada'
      });
    }
    
    // Verifica se a senha informada corresponde à senha armazenada
    const senhaCorreta = await autor.compararSenha(senha);
    if (!senhaCorreta) {
      return res.render('login', {
        title: 'Login - Tale Haven',
        mensagemErro: 'Senha incorreta'
      });
    }

    // Login bem-sucedido → cria sessão
    req.session.autor = {
      id: autor._id,
      nome: autor.nome,
      usuario: autor.usuario,
      fotoPerfil: autor.fotoPerfil
    }

    res.redirect('/');
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).render('login', {
      title: 'Login - Tale Haven',
      mensagemErro: 'Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.'
    });
  }
});

module.exports = router;